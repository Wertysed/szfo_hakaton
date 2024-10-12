from pydantic import BaseModel
from typing import Union


class Defect(BaseModel):
    lock: bool = False
    scrathes: bool = False
    broken_pixels: bool = False
    no_screws: bool = False
    problems_keys: bool = False
    chips: bool = False


class DataIn(BaseModel):
    cookies: str 
    unique_id: str 


class ImageInfo(BaseModel):
    code: str
    defect: Defect 


