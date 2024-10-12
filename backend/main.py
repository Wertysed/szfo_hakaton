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





@app.post("/upload_file")
async def upload_file(data: DataIn = Depends(), images: list[UploadFile] = File(...), db: Session = Depends(get_db)):
    if any([ image.content_type != "image/png" for image in images]):
        raise HTTPException(400, detail="Invalid document type")

    result = []

    if not crud.get_user(db, data.cookies): 
        user = crud.create_user(db, data.cookies)
    if not crud.get_computer(db, data.unique_id):
       computer = crud.create_computer(db, data)


    for image in images:
        image_data = await image.read()
        code_image ="data:image/png;base64,"+ base64.b64encode(image_data).decode('utf-8') 
        defect = Defect(lock=[1], scrathes=[2,3], chips=[4,5])
        
        cur_img_res = ImageInfo(code=code_image, defect=defect)

        result.append(cur_img_res)


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


