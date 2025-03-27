import torch
import cv2
import firebase_admin
import asyncio
import base64
import logging
import numpy as np
import uvicorn
from datetime import datetime
from fastapi import FastAPI, WebSocket
from firebase_admin import credentials, firestore
from ultralytics import YOLO

app = FastAPI()
device = "cuda" if torch.cuda.is_available() else "cpu"
model = YOLO("varunm2004/yolov8x.pt").to(device)

cred = credentials.Certificate("C://Users//adity//PycharmProjects//PythonProject2//serviceAccountKey.json")
firebase_admin.initialize_app(cred)
db = firestore.client()

video_path = "C://Users//adity//PycharmProjects//Traffic_Optimization//videos//road_1.mp4"

logging.basicConfig(level=logging.INFO)
collection_ref = db.collection("traffic_data")
if not collection_ref.get():
    db.collection("traffic_data").document("init").set({"message": "Traffic data initialized"})
processing_active = False

async def detect_vehicles():
    global processing_active
    cap = cv2.VideoCapture(video_path)
    logging.info("🚦 Vehicle detection started")

    while processing_active:
        success, frame = cap.read()
        if not success:
            break
        results = model(frame, conf=0.5)
        vehicle_counts = {"car": 0, "truck": 0, "bus": 0, "motorcycle": 0}
        for result in results:
            for box in result.boxes:
                cls = int(box.cls[0])
                class_name = model.names[cls]
                if class_name in vehicle_counts:
                    vehicle_counts[class_name] += 1

                # Draw Bounding Box & Label
                x1, y1, x2, y2 = map(int, box.xyxy[0])
                label = f"{class_name}: {box.conf[0]:.2f}"
                cv2.rectangle(frame, (x1, y1), (x2, y2), (0, 255, 0), 2)
                cv2.putText(frame, label, (x1, y1 - 10), cv2.FONT_HERSHEY_SIMPLEX, 0.5, (0, 255, 0), 2)
        timestamp = datetime.utcnow().isoformat()
        vehicle_data = {
            "timestamp": timestamp,
            "date": datetime.utcnow().strftime("%Y-%m-%d"),
            "time": datetime.utcnow().strftime("%H:%M:%S"),
            "car_count": vehicle_counts["car"],
            "truck_count": vehicle_counts["truck"],
            "bus_count": vehicle_counts["bus"],
            "motorcycle_count": vehicle_counts["motorcycle"],
            "total_vehicles": sum(vehicle_counts.values())
        }
        try:
            logging.info(f"sent to website {vehicle_data}")
            db.collection("traffic_data").document(timestamp).set(vehicle_data)
            logging.info("working")
        except Exception as e:
            logging.error(f"data write failed: {e}")

        await asyncio.sleep(1)
    cap.release()
    logging.info("Vehicle detection stopped")


@app.get("/start")
async def start_detection():
    global processing_active
    if processing_active:
        return {"message": " Detection is already running!"}
    processing_active = True
    asyncio.create_task(detect_vehicles())
    return {"message": "Vehicle detection started!"}

@app.get("/stop")
async def stop_detection():
    global processing_active
    processing_active = False
    return {"message": "Vehicle detection stopped!"}

@app.get("/congestion")
async def get_congestion():
    docs = db.collection("traffic_data").order_by("timestamp", direction=firestore.Query.DESCENDING).limit(1).stream()
    latest_data = next(docs, None)
    if latest_data:
        data = latest_data.to_dict()
        total_vehicles = data.get("total_vehicles", 0)
        if total_vehicles > 50:
            congestion_level = "High"
        elif total_vehicles > 20:
            congestion_level = "Medium"
        else:
            congestion_level = "Low"
        return {
            "timestamp": data.get("timestamp", ""),
            "date": data.get("date", ""),
            "time": data.get("time", ""),
            "total_vehicles": total_vehicles,
            "car_count": data.get("car_count", 0),
            "truck_count": data.get("truck_count", 0),
            "bus_count": data.get("bus_count", 0),
            "motorcycle_count": data.get("motorcycle_count", 0),
            "congestion_level": congestion_level
        }
    return {"message": "No data available"}

if __name__ == "__main__":
    uvicorn.run(app, host="0.0.0.0", port=8000)
