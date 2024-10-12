from sqlalchemy import Column, Integer, String, ForeignKey
from db import Base
from sqlalchemy.orm import relationship



class CompDef(Base):
    __tablename__ = "com_def"

    id = Column(Integer, primary_key=True, index=True)
    comp_unique_id = Column(String, ForeignKey("computers.unique_id"))
    defect_id = Column(Integer, ForeignKey("defects.id"))

    comp = relationship("Computer", back_populates="compdef")
    defects = relationship("Defect", back_populates="compdef")




