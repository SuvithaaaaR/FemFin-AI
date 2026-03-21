import os
from pathlib import Path

import cv2

FACES_DIR = Path(__file__).resolve().parent / "faces"
FACES_DIR.mkdir(parents=True, exist_ok=True)

CASCADE = cv2.CascadeClassifier(cv2.data.haarcascades + "haarcascade_frontalface_default.xml")


def _largest_face(frame):
    gray = cv2.cvtColor(frame, cv2.COLOR_BGR2GRAY)
    faces = CASCADE.detectMultiScale(gray, scaleFactor=1.1, minNeighbors=5)
    if len(faces) == 0:
        return None
    return max(faces, key=lambda x: x[2] * x[3])


def capture_and_save_face(user_id: str, camera_index: int = 0, timeout_sec: int = 20) -> dict:
    if not user_id or not user_id.strip():
        return {"success": False, "message": "user_id is required"}

    file_path = FACES_DIR / f"{user_id.strip().lower()}.jpg"
    cap = cv2.VideoCapture(camera_index)

    if not cap.isOpened():
        return {"success": False, "message": "Could not open camera"}

    start_tick = cv2.getTickCount()
    freq = cv2.getTickFrequency()

    saved = False
    while True:
        ok, frame = cap.read()
        if not ok:
            break

        face = _largest_face(frame)
        preview = frame.copy()

        if face is not None:
            x, y, w, h = face
            cv2.rectangle(preview, (x, y), (x + w, y + h), (0, 255, 0), 2)
            cv2.putText(
                preview,
                "Press S to save face",
                (10, 30),
                cv2.FONT_HERSHEY_SIMPLEX,
                0.8,
                (0, 255, 0),
                2,
            )
        else:
            cv2.putText(
                preview,
                "No face detected",
                (10, 30),
                cv2.FONT_HERSHEY_SIMPLEX,
                0.8,
                (0, 0, 255),
                2,
            )

        cv2.putText(
            preview,
            "Press Q to cancel",
            (10, 60),
            cv2.FONT_HERSHEY_SIMPLEX,
            0.7,
            (255, 255, 255),
            2,
        )

        cv2.imshow("Face Registration", preview)
        key = cv2.waitKey(1) & 0xFF

        if key == ord("q"):
            break

        if key == ord("s") and face is not None:
            x, y, w, h = face
            face_crop = frame[max(y, 0) : y + h, max(x, 0) : x + w]
            cv2.imwrite(str(file_path), face_crop)
            saved = True
            break

        elapsed = (cv2.getTickCount() - start_tick) / freq
        if elapsed > timeout_sec:
            break

    cap.release()
    cv2.destroyAllWindows()

    if not saved:
        return {"success": False, "message": "Face registration cancelled or timed out"}

    return {
        "success": True,
        "message": "Face registered successfully",
        "user_id": user_id.strip().lower(),
        "image_path": str(file_path),
    }


if __name__ == "__main__":
    uid = input("Enter user_id for registration: ").strip()
    print(capture_and_save_face(uid))
