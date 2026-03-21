# Face Authentication Service

Python Flask microservice for face embedding and verification.

## Stack

- Flask
- OpenCV
- DeepFace (FaceNet512, optional when environment supports it)

## Endpoints

- `GET /health`
- `POST /embed` with `{ "image": "<base64-or-data-url>" }`
- `POST /verify` with `{ "image": "<base64-or-data-url>", "stored_embedding": [ ... ] }`

## Run locally

```bash
cd backend/face-auth-service
python -m venv .venv
# Windows PowerShell
.\.venv\Scripts\Activate.ps1
pip install -r requirements.txt
python app.py
```

Default URL: `http://127.0.0.1:8000`

## Environment variables

- `PORT` (default `8000`)
- `FACE_MODEL_NAME` (default `Facenet512`)
- `FACE_DETECTOR_BACKEND` (default `opencv`)
- `FACE_MATCH_THRESHOLD` (default `0.35`)

## Runtime modes

- `deepface` mode: enabled automatically when `deepface` is installed and importable.
- `opencv-fallback` mode: used otherwise (compatible with Python 3.13 without TensorFlow).

Health endpoint includes `engine` so you can verify active mode.
