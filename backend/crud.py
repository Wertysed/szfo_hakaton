from sqlalchemy import select
from sqlalchemy.orm import Session
from models.user import User
from models.computer import Computer
from shemas import DataIn
from models.defect import Defect
from models.comp_def import CompDef
from sqlalchemy import func

def create_user(db: Session, cookies: str):
    db_user = User(cookies=cookies)
    db.add(db_user)

    db.commit()
    db.refresh(db_user)
    return db_user

def get_user(db: Session, cookies: str):
    return db.query(User).filter(User.cookies == cookies).first()

def create_defect(db: Session, name: str):
    db_defect = Defect(name=name)
    db.add(db_defect)
    db.commit()
    db.refresh(db_defect)
    return db_defect

def get_defect(db: Session, name: str) -> CompDef:
    return db.query(Defect).filter(Defect.name==name).first()


def create_comp_def(db: Session, unique_id: str, defect_name: str):
    defect_id = get_defect(db, defect_name).id
    db_comp_def = CompDef(comp_unique_id=unique_id, defect_id=defect_id)
    db.add(db_comp_def)
    db.commit()
    db.refresh(db_comp_def)
    return db_comp_def

def get_comp_def(db: Session, unique_id: str):
    return db.query(CompDef).filter(CompDef.comp_unique_id==unique_id).all()

def get_stats(db: Session, unique_id: str):
    data = get_comp_def(db, unique_id)
    stmt = (select(Defect.name, func.count(CompDef.comp_unique_id))
                  .select_from(CompDef)
                  .join(Defect)
                  .where(CompDef.comp_unique_id==unique_id)
                  .group_by(Defect.name))

    return db.execute(stmt) 




def get_computer(db: Session, unique_id: str):
    return db.query(Computer).filter(Computer.unique_id==unique_id).first()


def create_computer(db: Session, dataIn: DataIn):
    db_computer = Computer(unique_id=dataIn.unique_id, user_cookies=dataIn.cookies)
    db.add(db_computer)
    db.commit()
    db.refresh(db_computer)
    return db_computer
