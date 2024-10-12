from sqlalchemy import Column, Integer, String, ForeignKey
from sqlalchemy.orm import relationship

from db import Base



class Computer(Base):
    __tablename__ = "computers"

    id = Column(Integer, primary_key=True, index=True)
    unique_id = Column(String, unique=True)
    user_cookies= Column(String, ForeignKey("users.cookies"))


    compdef = relationship("CompDef", back_populates="comp")
    owner = relationship("User", back_populates="user_computer")
