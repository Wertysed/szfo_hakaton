from fastapi import FastAPI, Body, UploadFile
from fastapi.responses import FileResponse
from typing import Annotated


app = FastAPI()


@app.post("/upload_file", response_class=FileResponse)
async def upload_file(files: list[UploadFile]):
    
    for file in files:

        data = await file.read()
        with open(f"images/{file.filename}1.png", "wb") as file_new:
            file_new.write(data)

    return f"images/{files[0].filename}1.png"


