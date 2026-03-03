#----------------------------------------------IMPORTS------------------------------------------------#
from fastapi import FastAPI, UploadFile, File, HTTPException
from fastapi.middleware.cors import CORSMiddleware
import tensorflow as tf
from tensorflow.keras.models import load_model
from app.routers.scheduler import router as scheduler_router #contains API routes related to irrigation
from app.routers.dashboard import router as dashboard_router #contains API routes related to dashboard
from app.database import create_db_and_tables
#PIL(Python Imaging Library) is used for image processing
from PIL import Image
#Numpy is used for numerical operations(images are represented as arrays)
import numpy as np
#io helps us read image bytes from uploaded files
import io
# REGISTER THE CROP HEALTH ROUTER
from app.routers.crop_health import router as crop_health_router


#---------------------------------------------------------------------------------------------#


#
# --- Load model ---
MODEL_PATH = "../ml_model/saved_model/krishi_mitra_inference_model.keras"
#load_model is a function from TensorFlow Keras that loads a pre-trained model from the specified path into memory.
model = load_model(MODEL_PATH)

# --- Class names ---
#These are the class labels your model was trained to recognize.
#The model outputs a number(index) and we map it to these names to get human-readable results.
#Eg: If the model predicts index 0, it corresponds to 'Apple___Apple_scab'.
CLASS_NAMES = [
    'Apple___Apple_scab', 'Apple___Black_rot', 'Apple___Cedar_apple_rust', 'Apple___healthy',
    'Blueberry___healthy', 'Cherry___healthy', 'Cherry___Powdery_mildew',
    'Corn___Cercospot_leaf_spot Gray_leaf_spot', 'Corn___Common_rust', 'Corn___healthy',
    'Corn___Northern_Leaf_Blight', 'Grape___Black_rot', 'Grape___Esca_(Black_Measles)',
    'Grape___healthy', 'Grape___Leaf_blight_(Isariopsis_Leaf_Spot)',
    'Orange___Haunglongbing_(Citrus_greening)', 'Peach___Bacterial_spot', 'Peach___healthy',
    'Pepper,_bell___Bacterial_spot', 'Pepper,_bell___healthy', 'Potato___Early_blight',
    'Potato___healthy', 'Potato___Late_blight', 'Raspberry___healthy', 'Soybean___healthy',
    'Squash___Powdery_mildew', 'Strawberry___healthy', 'Strawberry___Leaf_scorch',
    'Tomato___Bacterial_spot', 'Tomato___Early_blight', 'Tomato___healthy', 'Tomato___Late_blight',
    'Tomato___Leaf_Mold', 'Tomato___Septoria_leaf_spot',
    'Tomato___Spider_mites Two-spotted_spider_mite', 'Tomato___Target_Spot',
    'Tomato___Tomato_mosaic_virus', 'Tomato___Tomato_Yellow_Leaf_Curl_Virus'
]

# --- FastAPI app ---
#Create an instance of the FastAPI application
app = FastAPI()


@app.on_event("startup")
def on_startup():
    try:
        create_db_and_tables()
    except Exception as exc:
        # Keep API responsive even if Neon is temporarily unreachable.
        print(f"[startup] DB init skipped: {exc}")

# REGISTER THE CROP HEALTH ROUTER
#include_router is a method that allows you to modularize your API by separating different functionalities into different routers.
# Here, we are including the crop_health_router which contains routes related to crop health functionalities.
app.include_router(crop_health_router)


# REGISTER THE DASHBOARD ROUTER
#This line includes the dashboard_router into the main FastAPI application.
app.include_router(dashboard_router)

# --- CORS ---
# This allows your React app (running on localhost:5173)
# to call the backend APIs without browser blocking it
# CORS (Cross-Origin Resource Sharing) is a security feature implemented by web browsers to restrict web pages from making requests to a different domain than the one that served the web page.
app.add_middleware(
    CORSMiddleware,
    allow_origins=[
        "http://localhost:5173",
        "http://127.0.0.1:5173",
        "http://127.0.0.1:8001",
        
    ],
    allow_origin_regex=r"https?://(localhost|127\.0\.0\.1)(:\d+)?",
    allow_credentials=False,
    allow_methods=["*"], # Allow all HTTP methods (GET, POST, etc.)
    allow_headers=["*"], # Allow all headers
)

# ✅ REGISTER THE SCHEDULER ROUTER
app.include_router(scheduler_router)

def preprocess_image(image_bytes: bytes):

    #Open the image using PIL and resize it to 224x224 pixels
    #io.BytesIO allows us to treat the byte data as a file-like object 
    image = Image.open(io.BytesIO(image_bytes)).convert("RGB").resize((224, 224))

    #Convert the image to a numpy array and normalize pixel values to [0, 1] 
    #The model expects input data to be in the range [0, 1]
    image_array = np.array(image) / 255.0

    #Add a batch dimension to the array
    #Models typically expect input data to have a shape that includes the batch size as the first dimension.
    # tf.expand_dims adds this extra dimension, making the shape (1, 224, 224, 3)
    return tf.expand_dims(image_array, 0)

@app.get("/")
def root():
    return {"message": "Krishi Mitra API Running"}

#Import the function to save crop scan results
from app.services.crop_health_service import save_crop_scan_result

@app.post("/predict")
async def predict(file: UploadFile = File(...)):
    try:
        image_bytes = await file.read()
        if not image_bytes:
            raise HTTPException(status_code=400, detail="Uploaded file is empty.")

        image_tensor = preprocess_image(image_bytes)
        prediction = model.predict(image_tensor, verbose=0)

        predicted_index = int(np.argmax(prediction))
        if predicted_index >= len(CLASS_NAMES):
            raise HTTPException(status_code=500, detail="Model returned invalid class index.")

        predicted_class = CLASS_NAMES[predicted_index]
        confidence = float(np.max(prediction))

        save_crop_scan_result(predicted_class)

        return {
            "prediction": predicted_class,
            "confidence": confidence
        }
    except HTTPException:
        raise
    except Exception as exc:
        raise HTTPException(status_code=500, detail=f"Prediction failed: {exc}") from exc
