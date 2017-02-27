from api import db 

class Link(db.Document):
    
    source = db.IntField()
    target = db.IntField()
    weight = db.AnythingField()

    