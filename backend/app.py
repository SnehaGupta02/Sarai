from flask import Flask, Response, jsonify, request
from flask_cors import CORS
import cv2
from ultralytics import YOLO
from math import ceil

app = Flask(__name__)
CORS(app)

model = YOLO("yolov8n.pt")

people_count = 0


def generate_frames(source):
    global people_count

    # dynamic source (webcam or drone)
    if source == "0":
        cap = cv2.VideoCapture(0, cv2.CAP_DSHOW)
    else:
        cap = cv2.VideoCapture(source)

    while True:
        success, frame = cap.read()
        if not success:
            break

        frame = cv2.resize(frame, (640, 480))
        results = model(frame)

        count = 0

        for r in results:
            for box in r.boxes:
                cls = int(box.cls[0])

                if cls == 0:
                    count += 1
                    x1, y1, x2, y2 = map(int, box.xyxy[0])
                    cv2.rectangle(frame, (x1, y1), (x2, y2), (0, 255, 0), 2)

        people_count = count

        cv2.putText(frame, f"People: {people_count}",
                    (20, 40),
                    cv2.FONT_HERSHEY_SIMPLEX,
                    1,
                    (0, 255, 0),
                    2)

        _, buffer = cv2.imencode('.jpg', frame)
        frame = buffer.tobytes()

        yield (b'--frame\r\n'
               b'Content-Type: image/jpeg\r\n\r\n' + frame + b'\r\n')


@app.route('/video')
def video():
    source = request.args.get("source", "0")
    return Response(generate_frames(source),
                    mimetype='multipart/x-mixed-replace; boundary=frame')


@app.route('/count')
def count():
    # 🔥 RESOURCE LOGIC
    ambulances = ceil(people_count / 5) if people_count else 0
    medical_kits = ceil(people_count / 2) if people_count else 0
    rescue_vans = ceil(people_count / 20) if people_count else 0

    return jsonify({
        "people": people_count,
        "ambulances": ambulances,
        "medical_kits": medical_kits,
        "rescue_vans": rescue_vans
    })


if __name__ == "__main__":
    app.run(debug=True, threaded=True)