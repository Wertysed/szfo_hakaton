from pydantic import BaseModel
from typing import Union


class Defect(BaseModel):
    lock: list[int] = [0] 
    scrathes: list[int] = [0] 
    broken_pixels: list[int] = [0]
    no_screws: list[int] = [0]
    problems_keys: list[int] = [0]
    chips: list[int] = [0]

class DataIn(BaseModel):
    cookies: str 
    unique_id: str 


class ImageInfo(BaseModel):
    code: str
    defect: Defect 


