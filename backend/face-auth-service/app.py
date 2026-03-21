import base64
import os

import cv2
import numpy as np
from flask import Flask, jsonify, request

try:
    from deepface import DeepFace

    HAS_DEEPFACE = True
except Exception:
    DeepFace = None
    HAS_DEEPFACE = False

app = Flask(__name__)

MODEL_NAME = os.getenv("FACE_MODEL_NAME", "Facenet512")
DETECTOR_BACKEND = os.getenv("FACE_DETECTOR_BACKEND", "opencv")
# Lower is stricter for cosine distance.
MATCH_THRESHOLD = float(os.getenv("FACE_MATCH_THRESHOLD", "0.35"))

_cascade = cv2.CascadeClassifier(
    cv2.data.haarcascades + "haarcascade_frontalface_default.xml"
)


def _decode_image(image_payload: str) -> np.ndarray:
    if not image_payload:
        raise ValueError("Image payload is required")

    payload = image_payload
    if "," in image_payload and image_payload.lower().startswith("data:image"):
        payload = image_payload.split(",", 1)[1]

    try:
        image_bytes = base64.b64decode(payload, validate=True)
    except Exception as exc:
        raise ValueError("Invalid base64 image payload") from exc

    image_np = np.frombuffer(image_bytes, dtype=np.uint8)
    image = cv2.imdecode(image_np, cv2.IMREAD_COLOR)

    if image is None:
        raise ValueError("Could not decode image")

    return image


def _extract_embedding(image_payload: str) -> list:
    image = _decode_image(image_payload)

    # Preferred mode: DeepFace FaceNet embedding.
    if HAS_DEEPFACE:
        result = DeepFace.represent(
            img_path=image,
            model_name=MODEL_NAME,
            detector_backend=DETECTOR_BACKEND,
            enforce_detection=True,
        )

        if not result:
            raise ValueError("No face detected")

        embedding = result[0].get("embedding")
        if not embedding:
            raise ValueError("Could not generate face embedding")

        return embedding

    # Fallback mode for environments where DeepFace/TensorFlow is unavailable.
    gray = cv2.cvtColor(image, cv2.COLOR_BGR2GRAY)
    faces = _cascade.detectMultiScale(gray, scaleFactor=1.1, minNeighbors=5)

    if len(faces) == 0:
        raise ValueError("No face detected")

    x, y, w, h = max(faces, key=lambda f: f[2] * f[3])
    face_roi = gray[y : y + h, x : x + w]
    resized = cv2.resize(face_roi, (32, 16), interpolation=cv2.INTER_AREA)
    embedding = resized.astype(np.float32).flatten()
    norm = np.linalg.norm(embedding)
    if norm == 0:
        raise ValueError("Invalid face embedding")

    return (embedding / norm).tolist()


def _cosine_distance(vec_a: np.ndarray, vec_b: np.ndarray) -> float:
    norm_a = np.linalg.norm(vec_a)
    norm_b = np.linalg.norm(vec_b)
    if norm_a == 0 or norm_b == 0:
        raise ValueError("Invalid embedding norm")

    similarity = float(np.dot(vec_a, vec_b) / (norm_a * norm_b))
    return 1.0 - similarity


@app.get("/health")
def health() -> tuple:
    return (
        jsonify(
            {
                "status": "ok",
                "model": MODEL_NAME,
                "detector": DETECTOR_BACKEND,
                "engine": "deepface" if HAS_DEEPFACE else "opencv-fallback",
                "threshold": MATCH_THRESHOLD,
            }
        ),
        200,
    )


@app.post("/embed")
def embed() -> tuple:
    body = request.get_json(silent=True) or {}
    image_payload = body.get("image")

    try:
        embedding = _extract_embedding(image_payload)
    except ValueError as exc:
        return jsonify({"success": False, "message": str(exc)}), 400
    except Exception as exc:
        return (
            jsonify(
                {
                    "success": False,
                    "message": "Face embedding failed",
                    "error": str(exc),
                }
            ),
            500,
        )

    return (
        jsonify(
            {
                "success": True,
                "model": MODEL_NAME,
                "embedding": embedding,
            }
        ),
        200,
    )


@app.post("/verify")
def verify() -> tuple:
    body = request.get_json(silent=True) or {}
    image_payload = body.get("image")
    stored_embedding = body.get("stored_embedding")

    if not isinstance(stored_embedding, list) or not stored_embedding:
        return (
            jsonify(
                {
                    "success": False,
                    "message": "stored_embedding must be a non-empty array",
                }
            ),
            400,
        )

    try:
        candidate_embedding = _extract_embedding(image_payload)
        candidate = np.array(candidate_embedding, dtype=np.float32)
        stored = np.array(stored_embedding, dtype=np.float32)

        if candidate.shape != stored.shape:
            return (
                jsonify(
                    {
                        "success": False,
                        "message": "Embedding size mismatch",
                    }
                ),
                400,
            )

        distance = _cosine_distance(candidate, stored)
        is_match = distance <= MATCH_THRESHOLD
    except ValueError as exc:
        return jsonify({"success": False, "message": str(exc)}), 400
    except Exception as exc:
        return (
            jsonify(
                {
                    "success": False,
                    "message": "Face verification failed",
                    "error": str(exc),
                }
            ),
            500,
        )

    return (
        jsonify(
            {
                "success": True,
                "model": MODEL_NAME,
                "distance": round(float(distance), 6),
                "threshold": MATCH_THRESHOLD,
                "is_match": is_match,
            }
        ),
        200,
    )


if __name__ == "__main__":
    app.run(host="0.0.0.0", port=int(os.getenv("PORT", "8000")), debug=False)
