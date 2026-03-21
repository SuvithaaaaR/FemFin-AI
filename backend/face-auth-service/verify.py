from pathlib import Path

import cv2
from deepface import DeepFace

from register import FACES_DIR

FACE_CASCADE = cv2.CascadeClassifier(cv2.data.haarcascades + "haarcascade_frontalface_default.xml")
EYE_CASCADE = cv2.CascadeClassifier(cv2.data.haarcascades + "haarcascade_eye.xml")


def _detect_face(gray):
    faces = FACE_CASCADE.detectMultiScale(gray, scaleFactor=1.1, minNeighbors=5)
    if len(faces) == 0:
        return None
    return max(faces, key=lambda x: x[2] * x[3])


def run_liveness_check(camera_index: int = 0, timeout_sec: int = 12) -> tuple:
    cap = cv2.VideoCapture(camera_index)
    if not cap.isOpened():
        return False, None, "Could not open camera"

    eye_seen = False
    eye_missing_after_seen = False
    eye_returned = False
    base_center_x = None
    max_shift = 0.0
    min_area = None
    max_area = None
    best_frame = None

    start_tick = cv2.getTickCount()
    freq = cv2.getTickFrequency()

    while True:
        ok, frame = cap.read()
        if not ok:
            break

        gray = cv2.cvtColor(frame, cv2.COLOR_BGR2GRAY)
        face = _detect_face(gray)
        preview = frame.copy()

        if face is not None:
            x, y, w, h = face
            cv2.rectangle(preview, (x, y), (x + w, y + h), (0, 255, 0), 2)
            best_frame = frame

            center_x = x + (w / 2.0)
            if base_center_x is None:
                base_center_x = center_x
            max_shift = max(max_shift, abs(center_x - base_center_x))

            area = float(w * h)
            min_area = area if min_area is None else min(min_area, area)
            max_area = area if max_area is None else max(max_area, area)

            face_gray = gray[y : y + h, x : x + w]
            eyes = EYE_CASCADE.detectMultiScale(face_gray, scaleFactor=1.1, minNeighbors=5)

            if len(eyes) > 0 and not eye_seen:
                eye_seen = True
            elif len(eyes) == 0 and eye_seen:
                eye_missing_after_seen = True
            elif len(eyes) > 0 and eye_missing_after_seen:
                eye_returned = True

        blink_ok = eye_seen and eye_missing_after_seen and eye_returned
        head_ok = max_shift >= 25.0

        depth_ok = False
        if min_area and max_area and max_area > 0:
            depth_ratio = (max_area - min_area) / max_area
            depth_ok = depth_ratio >= 0.12

        cv2.putText(
            preview,
            f"Blink:{blink_ok} Head:{head_ok} Depth:{depth_ok}",
            (10, 30),
            cv2.FONT_HERSHEY_SIMPLEX,
            0.7,
            (255, 255, 255),
            2,
        )
        cv2.putText(
            preview,
            "Blink, move head left-right, move closer-farther",
            (10, 60),
            cv2.FONT_HERSHEY_SIMPLEX,
            0.6,
            (0, 255, 255),
            2,
        )
        cv2.putText(
            preview,
            "Press Q to cancel",
            (10, 90),
            cv2.FONT_HERSHEY_SIMPLEX,
            0.6,
            (0, 0, 255),
            2,
        )

        cv2.imshow("Liveness Check", preview)
        key = cv2.waitKey(1) & 0xFF

        if key == ord("q"):
            cap.release()
            cv2.destroyAllWindows()
            return False, None, "Verification cancelled"

        if blink_ok and head_ok and depth_ok:
            cap.release()
            cv2.destroyAllWindows()
            return True, best_frame, "Liveness check passed"

        elapsed = (cv2.getTickCount() - start_tick) / freq
        if elapsed > timeout_sec:
            break

    cap.release()
    cv2.destroyAllWindows()
    return False, None, "Liveness check failed"


def verify_face(user_id: str, model_name: str = "Facenet512") -> dict:
    user_file = FACES_DIR / f"{user_id.strip().lower()}.jpg"
    if not user_file.exists():
        return {"success": False, "message": "User face not registered"}

    live_ok, live_frame, live_message = run_liveness_check()
    if not live_ok:
        return {"success": False, "message": live_message}

    try:
        result = DeepFace.verify(
            img1_path=live_frame,
            img2_path=str(user_file),
            model_name=model_name,
            detector_backend="opencv",
            enforce_detection=True,
        )
    except Exception as exc:
        return {"success": False, "message": f"Face verification failed: {exc}"}

    if not result.get("verified", False):
        return {
            "success": False,
            "message": "Face does not match registered user",
            "distance": result.get("distance"),
        }

    return {
        "success": True,
        "message": "Face verified successfully",
        "distance": result.get("distance"),
        "threshold": result.get("threshold"),
        "model": model_name,
    }


if __name__ == "__main__":
    uid = input("Enter user_id to verify: ").strip()
    print(verify_face(uid))
