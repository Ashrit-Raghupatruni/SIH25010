from database import engine,Base,get_db
from models.user import User
db=next(get_db())
user1=User(email="mohanchandra_marisetti@srmap.edu.in",full_name="Mohan Chandra Marisetti",hashed_password="",provider="google")
db.add(user1)
db.commit()
db.close()