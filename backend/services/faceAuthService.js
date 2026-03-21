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
    throw new Error(mapServiceError(error, "Could not verify face"));
  }
};

module.exports = {
  createEmbedding,
  verifyFace,
};
