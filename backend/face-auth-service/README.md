# Face Auth System

Simple structure:

```text
face-auth-system/
|
|- app.py
|- register.py
|- verify.py
`- faces/
```

## Install

```bash
pip install deepface opencv-python flask
```

Or:

```bash
pip install -r requirements.txt
```

## Files

- `register.py`: captures and saves registered face image to `faces/<user_id>.jpg`
- `verify.py`: runs liveness detection + FaceNet512 verification against saved image
- `app.py`: Flask API wrapper for register/verify endpoints

## Liveness Detection Included

- Blink detection (eyes visible -> eyes missing -> eyes visible)
- Head movement detection (left-right shift)
- Depth check (face area changes from moving closer/farther)

## Run

```bash
python app.py
```

API:

- `GET /health`
- `POST /register` with body `{ "user_id": "alice" }`
- `POST /verify` with body `{ "user_id": "alice" }`

`verify.py` uses `Facenet512` model.
