from db import db
from datetime import datetime

class OrderModel(db.Model):
    __tablename__ = "orders"

    id = db.Column(db.Integer, primary_key=True)
    completed = db.Column(db.Boolean, default=False)
    date = db.Column(db.DateTime, default=datetime.utcnow)
    total = db.Column(db.Float(precision=2), default=0.00)
    user_id = db.Column(db.Integer, db.ForeignKey("users.id"))
    user = db.relationship("UserModel")
    items = db.relationship("ItemModel", secondary="orders_items")

