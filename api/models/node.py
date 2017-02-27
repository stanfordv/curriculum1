from api import db 

class Node(db.Document):
    
    name = db.StringField()

    