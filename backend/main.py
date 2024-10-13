from fastapi import FastAPI, Body, UploadFile, Query, File, Depends, HTTPException
from fastapi.responses import FileResponse
from typing import Annotated, Optional, Union
from pydantic import BaseModel
from shemas import DataIn, Defect, ImageInfo
import json
import base64
from PIL import Image
from io import BytesIO
from db import Base, engine, get_db
import crud
from fastapi.middleware.cors import CORSMiddleware
from sqlalchemy.orm import Session
import os

from ultralytics import YOLO
import cv2




model = YOLO('best.pt')



app = FastAPI()

Base.metadata.create_all(bind=engine)

origins = ["*"]

app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)



def detect(image_path):


    classes = {
        "lock": [],
        "scratches": [],
        "broken_pixels": [],
        "no_screws": [],
        "problems_keys": [],
        "chips": []
    }

    results = model.predict(source=image_path, conf=0.1)

    image = cv2.imread(image_path)
    classes = dict()

    for result in results:
        boxes = result.boxes
        for i in range(len(boxes)):
            x1, y1, x2, y2 = map(int, boxes[i].xyxy[0])
            class_id = int(boxes[i].cls[0])
            class_name = model.names[class_id] if hasattr(model, 'names') else str(class_id)
            confidence = boxes[i].conf[0]
            if class_name in classes:
                classes[class_name].append(i+1)

            classes.update({(i+1): class_name})
            cv2.rectangle(image, (x1, y1), (x2, y2), (0, 255, 0), 2)
            label = f"{(i+1)} {class_name} {confidence:.2f}"
            cv2.putText(image, label, (x1, y1 - 10), cv2.FONT_HERSHEY_SIMPLEX, 
                        0.5, (0, 255, 0), 2)

    # Сохранение результата
    cv2.imwrite(image_path, image)
    return  classes
    


@app.post("/upload_file")
async def upload_file(data: DataIn = Depends(), images: list[UploadFile] = File(...), db: Session = Depends(get_db)):
#    if any([ image.content_type != "image/png" for image in images]):
#        raise HTTPException(400, detail="Invalid document type")

    result = []

    if not crud.get_user(db, data.cookies): 
        user = crud.create_user(db, data.cookies)
    if not crud.get_computer(db, data.unique_id):
       computer = crud.create_computer(db, data)


    for image in images:
        if not image.filename:
            continue
        image_data = await image.read()
        path = image.filename
        with open(f"{image.filename}", "wb") as image:
            image.write(image_data)
            image.close()
        
        detc = detect(path) 


        

        with open(f"{path}", "rb") as image:
            image_data = image.read()
            image.close()

        code_image ="data:image/jpg;base64,"+ base64.b64encode(image_data).decode('utf-8') 
        defect = Defect(**detc)
        
        cur_img_res = ImageInfo(code=code_image, defect=defect)
        result.append(cur_img_res)
        os.remove(path)


    return result 

@app.post("/confirm")
async def confirm(cookies: str, unique_id: str, imagesInfo: list[ImageInfo], db: Session = Depends(get_db)):
    if not crud.get_computer(db, unique_id):
        raise HTTPException(400, "Invalid unique_id")
    for image in imagesInfo:
        for key, value in image.defect:
            for i in value: 
                if i:
                    crud.create_comp_def(db, unique_id, key)
    
    out = {}
    out.update({"unique_id": unique_id})
    res = crud.get_stats(db, unique_id).all()
    if not res:
        out.update({"status": "quality control passed"}) 
    else:
        out.update({"status": "quality control failed"})
        for key, value in res:
            out.update({key: value})
    return  out


@app.get("/rofl")
async def rofl():
    
    return True


