from sqlalchemy import Column, Integer, String
from sqlalchemy.orm import relationship

from db import Base



class Defect(Base):
    __tablename__ = "defects"

    id = Column(Integer, primary_key=True, index=True)
    name = Column(String, unique=True)

    compdef = relationship("CompDef", back_populates="defects")

