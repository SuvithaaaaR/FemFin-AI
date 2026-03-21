const axios = require("axios");

const FACE_AUTH_SERVICE_URL =
  process.env.FACE_AUTH_SERVICE_URL || "http://127.0.0.1:8000";

const FACE_AUTH_SERVICE_TIMEOUT_MS = Number(
  process.env.FACE_AUTH_SERVICE_TIMEOUT_MS || 15000,
);

const client = axios.create({
  baseURL: FACE_AUTH_SERVICE_URL,
  timeout: FACE_AUTH_SERVICE_TIMEOUT_MS,
  headers: {
    "Content-Type": "application/json",
  },
});

const LOCAL_MATCH_THRESHOLD = Number(process.env.FACE_MATCH_THRESHOLD || 0.35);

const decodeBase64Image = (payload) => {
  if (!payload || typeof payload !== "string") {
    throw new Error("Face image is required");
  }

  const base64 = payload.startsWith("data:image")
    ? payload.split(",", 2)[1]
    : payload;

  let buffer;
  try {
    buffer = Buffer.from(base64, "base64");
  } catch (error) {
    throw new Error("Invalid face image payload");
  }

  if (!buffer || buffer.length < 64) {
    throw new Error("Invalid face image payload");
  }

  return buffer;
};

const buildLocalEmbedding = (faceImage) => {
  const bytes = decodeBase64Image(faceImage);
  const vectorSize = 256;
  const embedding = new Array(vectorSize).fill(0);

  for (let i = 0; i < bytes.length; i += 1) {
    embedding[i % vectorSize] += bytes[i];
  }

  const norm = Math.sqrt(embedding.reduce((sum, value) => sum + value * value, 0));
  if (!norm) {
    throw new Error("Could not create face embedding");
  }

  return embedding.map((value) => Number((value / norm).toFixed(8)));
};

const cosineDistance = (a, b) => {
  if (!Array.isArray(a) || !Array.isArray(b) || a.length !== b.length) {
    throw new Error("Embedding size mismatch");
  }

  let dot = 0;
  let normA = 0;
  let normB = 0;

  for (let i = 0; i < a.length; i += 1) {
    dot += a[i] * b[i];
    normA += a[i] * a[i];
    normB += b[i] * b[i];
  }

  if (!normA || !normB) {
    throw new Error("Invalid embedding values");
  }

  return 1 - dot / (Math.sqrt(normA) * Math.sqrt(normB));
};

const shouldUseLocalFallback = (error) => {
  const code = String(error?.code || "").toUpperCase();
  const status = Number(error?.response?.status || 0);

  return (
    code === "ECONNREFUSED" ||
    code === "ETIMEDOUT" ||
    code === "ENOTFOUND" ||
    code === "ECONNABORTED" ||
    status >= 500
  );
};

const mapServiceError = (error, defaultMessage) => {
  if (error.response?.data?.message) {
    return error.response.data.message;
  }
  if (error.code === "ECONNREFUSED") {
    return "Face authentication service is unavailable";
  }
  return defaultMessage;
};

const createEmbedding = async (faceImage) => {
  try {
    const { data } = await client.post("/embed", { image: faceImage });
    return data;
  } catch (error) {
    if (shouldUseLocalFallback(error)) {
      return {
        success: true,
        model: "local-bytehash-v1",
        embedding: buildLocalEmbedding(faceImage),
      };
    }
    throw new Error(mapServiceError(error, "Could not create face embedding"));
  }
};

const verifyFace = async (faceImage, storedEmbedding) => {
  try {
    const { data } = await client.post("/verify", {
      image: faceImage,
      stored_embedding: storedEmbedding,
    });
    return data;
  } catch (error) {
    if (shouldUseLocalFallback(error)) {
      const candidateEmbedding = buildLocalEmbedding(faceImage);
      const distance = cosineDistance(candidateEmbedding, storedEmbedding);
      return {
        success: true,
        model: "local-bytehash-v1",
        distance: Number(distance.toFixed(6)),
        threshold: LOCAL_MATCH_THRESHOLD,
        is_match: distance <= LOCAL_MATCH_THRESHOLD,
      };
    }
    throw new Error(mapServiceError(error, "Could not verify face"));
  }
};

module.exports = {
  createEmbedding,
  verifyFace,
};
