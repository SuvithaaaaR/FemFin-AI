const crypto = require("crypto");
const jwt = require("jsonwebtoken");
const { getSupabase } = require("../config/supabase");
const faceAuthService = require("../services/faceAuthService");
const { asyncHandler, ErrorResponse } = require("../middleware/errorHandler");

const JWT_SECRET =
  process.env.JWT_SECRET ||
  "FemFin_AI_JWT_2026_Production_Ready_Key_At_Least_32_Chars";

const signToken = (id) =>
  jwt.sign({ id }, JWT_SECRET, {
    expiresIn: process.env.JWT_EXPIRE || "30d",
  });

const normalizeUser = (row) => ({
  id: row.id,
  name: row.name,
  email: row.email,
  role: row.role,
  creditScore: row.credit_score,
  phoneNumber: row.phone_number,
  profile: row.profile,
});

const isMissingFaceTableError = (error) => {
  if (!error) {
    return false;
  }

  const code = String(error.code || "").toUpperCase();
  const message = String(error.message || "").toLowerCase();

  if (code === "PGRST205") {
    return true;
  }

  const mentionsTable = message.includes("user_face_embeddings");
  return (
    mentionsTable &&
    (message.includes("does not exist") || message.includes("schema cache"))
  );
};

const getEncryptionKey = () => {
  const sourceSecret =
    process.env.FACE_EMBEDDING_ENCRYPTION_KEY || process.env.JWT_SECRET || JWT_SECRET;

  return crypto.createHash("sha256").update(sourceSecret).digest();
};

const encryptEmbedding = (embedding) => {
  const iv = crypto.randomBytes(12);
  const cipher = crypto.createCipheriv("aes-256-gcm", getEncryptionKey(), iv);
  const encrypted = Buffer.concat([
    cipher.update(JSON.stringify(embedding), "utf8"),
    cipher.final(),
  ]);
  const authTag = cipher.getAuthTag();

  return {
    encrypted: encrypted.toString("base64"),
    iv: iv.toString("base64"),
    authTag: authTag.toString("base64"),
  };
};

const decryptEmbedding = (record) => {
  const decipher = crypto.createDecipheriv(
    "aes-256-gcm",
    getEncryptionKey(),
    Buffer.from(record.embedding_iv, "base64"),
  );
  decipher.setAuthTag(Buffer.from(record.embedding_auth_tag, "base64"));

  const decrypted = Buffer.concat([
    decipher.update(Buffer.from(record.embedding_encrypted, "base64")),
    decipher.final(),
  ]).toString("utf8");

  return JSON.parse(decrypted);
};

/**
 * @desc    Enroll or update user face embedding
 * @route   POST /api/auth/face/enroll
 * @access  Private
 */
exports.enrollFace = asyncHandler(async (req, res, next) => {
  const { faceImage } = req.body;
  if (!faceImage) {
    return next(new ErrorResponse("Face image is required", 400));
  }

  const supabase = getSupabase();

  let embeddingResult;
  try {
    embeddingResult = await faceAuthService.createEmbedding(faceImage);
  } catch (error) {
    return next(new ErrorResponse(error.message, 503));
  }

  const encrypted = encryptEmbedding(embeddingResult.embedding);

  const { error } = await supabase.from("user_face_embeddings").upsert(
    {
      user_id: req.user.id,
      model: embeddingResult.model || "Facenet512",
      embedding_encrypted: encrypted.encrypted,
      embedding_iv: encrypted.iv,
      embedding_auth_tag: encrypted.authTag,
    },
    {
      onConflict: "user_id",
    },
  );

  if (error && !isMissingFaceTableError(error)) {
    throw new ErrorResponse(error.message, 500);
  }

  if (isMissingFaceTableError(error)) {
    const { data: currentUser, error: currentUserError } = await supabase
      .from("users")
      .select("profile")
      .eq("id", req.user.id)
      .maybeSingle();

    if (currentUserError) {
      throw new ErrorResponse(currentUserError.message, 500);
    }

    const profile = currentUser?.profile || {};
    const nextProfile = {
      ...profile,
      faceAuth: {
        model: embeddingResult.model || "Facenet512",
        embedding_encrypted: encrypted.encrypted,
        embedding_iv: encrypted.iv,
        embedding_auth_tag: encrypted.authTag,
        updatedAt: new Date().toISOString(),
      },
    };

    const { error: fallbackError } = await supabase
      .from("users")
      .update({ profile: nextProfile })
      .eq("id", req.user.id);

    if (fallbackError) {
      throw new ErrorResponse(fallbackError.message, 500);
    }
  }

  res.status(200).json({
    success: true,
    message: "Face enrolled successfully",
  });
});

/**
 * @desc    Login with face verification
 * @route   POST /api/auth/face/login
 * @access  Public
 */
exports.loginWithFace = asyncHandler(async (req, res, next) => {
  const { email, faceImage } = req.body;
  if (!email || !faceImage) {
    return next(new ErrorResponse("Email and face image are required", 400));
  }

  const supabase = getSupabase();

  const { data: user, error: userError } = await supabase
    .from("users")
    .select("id, name, email, role, phone_number, profile, credit_score")
    .eq("email", email)
    .maybeSingle();

  if (userError) {
    throw new ErrorResponse(userError.message, 500);
  }

  if (!user) {
    return next(new ErrorResponse("Invalid face login credentials", 401));
  }

  const { data: faceRecord, error: faceError } = await supabase
    .from("user_face_embeddings")
    .select("embedding_encrypted, embedding_iv, embedding_auth_tag, model")
    .eq("user_id", user.id)
    .maybeSingle();

  if (faceError && !isMissingFaceTableError(faceError)) {
    throw new ErrorResponse(faceError.message, 500);
  }

  let resolvedFaceRecord = faceRecord;

  if (isMissingFaceTableError(faceError) || !resolvedFaceRecord) {
    const { data: profileUser, error: profileError } = await supabase
      .from("users")
      .select("profile")
      .eq("id", user.id)
      .maybeSingle();

    if (profileError) {
      throw new ErrorResponse(profileError.message, 500);
    }

    const fallbackFace = profileUser?.profile?.faceAuth;
    if (fallbackFace?.embedding_encrypted) {
      resolvedFaceRecord = {
        embedding_encrypted: fallbackFace.embedding_encrypted,
        embedding_iv: fallbackFace.embedding_iv,
        embedding_auth_tag: fallbackFace.embedding_auth_tag,
        model: fallbackFace.model || "Facenet512",
      };
    }
  }

  if (!resolvedFaceRecord) {
    return next(new ErrorResponse("Face is not enrolled for this account", 404));
  }

  let storedEmbedding;
  try {
    storedEmbedding = decryptEmbedding(resolvedFaceRecord);
  } catch (error) {
    return next(new ErrorResponse("Stored biometric data is unreadable", 500));
  }

  let verification;
  try {
    verification = await faceAuthService.verifyFace(faceImage, storedEmbedding);
  } catch (error) {
    return next(new ErrorResponse(error.message, 503));
  }

  if (!verification.is_match) {
    return next(new ErrorResponse("Face verification failed", 401));
  }

  const token = signToken(user.id);

  res.status(200).json({
    success: true,
    message: "Face login successful",
    token,
    user: normalizeUser(user),
    meta: {
      model: verification.model || resolvedFaceRecord.model,
      distance: verification.distance,
      threshold: verification.threshold,
    },
  });
});
