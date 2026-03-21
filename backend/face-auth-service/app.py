import os

from flask import Flask, jsonify, request
from register import capture_and_save_face
from verify import verify_face

app = Flask(__name__)

MODEL_NAME = os.getenv("FACE_MODEL_NAME", "Facenet512")


@app.get("/health")
def health() -> tuple:
    return (
        jsonify(
            {
                "status": "ok",
                "model": MODEL_NAME,
                "flow": "register.py + verify.py + faces/",
            }
        ),
        200,
    )


@app.post("/register")
def register_face() -> tuple:
    body = request.get_json(silent=True) or {}
    user_id = body.get("user_id")
    camera_index = int(body.get("camera_index", 0))

    result = capture_and_save_face(user_id=user_id, camera_index=camera_index)
    return jsonify(result), (200 if result.get("success") else 400)


@app.post("/verify")
def verify() -> tuple:
    body = request.get_json(silent=True) or {}
    user_id = body.get("user_id")
    result = verify_face(user_id=user_id, model_name=MODEL_NAME)
    return jsonify(result), (200 if result.get("success") else 401)


if __name__ == "__main__":
    app.run(host="0.0.0.0", port=int(os.getenv("PORT", "8000")), debug=False)
