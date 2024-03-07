from flask.views import MethodView
from flask_smorest import Blueprint, abort
from flask_jwt_extended import jwt_required, get_jwt, get_jwt_identity
from sqlalchemy.exc import SQLAlchemyError

from db import db
from datetime import datetime
from models import OrderModel, UserModel, ItemModel
from schemas import OrderSchema, ItemUpdateSchema

blp = Blueprint("Orders", "orders", description="Buy some items")

@blp.route("/buy")
class Orders(MethodView):
    
    @blp.response(200, OrderSchema)
    @jwt_required()
    def get(self):
        user = get_jwt_identity()
        last_order = OrderModel.query.filter_by(
            user_id=user).order_by(
                OrderModel.id.desc()).first()
        # help(jwt.get)
        # if not jwt.get("is_admin"):
        #     abort(401, message="Admin privilege required.")
        # print(OrderModel.query.filter_by(id=1).first().date)
        return last_order
    
    @jwt_required(fresh=True)
    @blp.arguments(OrderSchema)
    @blp.response(201, OrderSchema)
    def post(self, order_data):
        user = get_jwt_identity()
        last_order = OrderModel.query.filter_by(
            user_id=user).order_by(
                OrderModel.id.desc()).first()     
        try:
            last_order.completed=order_data["completed"]
            db.session.add(last_order)
            db.session.commit()
        except SQLAlchemyError as e:
            abort(500, message="An error occurred while completing the order.")
            print(e)
        return last_order
        
        
    

@blp.route("/buy/<string:item_id>")
class Order(MethodView):
    
    # @blp.response(200, OrderSchema(many=True))
    # @jwt_required()
    # def get(self, item_id):
    #     # TODO: Dar admin al usuario 1 de forma que esto lo verifique como tal
    #     # Mejor aún si detecta admin según el campo en la base de datos.
    #     # jwt = get_jwt()
    #     # help(jwt.get)
    #     # if not jwt.get("is_admin"):
    #     #     abort(401, message="Admin privilege required.")
    #     # print(OrderModel.query.filter_by(id=1).first().date)
    #     return OrderModel.query.all(OrderModel.query.filter_by(
    #         user_id=order_data["user"]).order_by(
    #             OrderModel.id.desc()).first())
    
    @jwt_required(fresh=True)
    @blp.arguments(OrderSchema)
    @blp.response(201, OrderSchema)
    def post(self, order_data, item_id):
        # additems=[]
        # for i in order_data["items"]:
        #     item=ItemModel.query.filter_by(id=i).first()
        #     additems.append(item)
            # order.items.append(item)
        user = get_jwt_identity()
        last_order = OrderModel.query.filter_by(
            user_id=user).order_by(
                OrderModel.id.desc()).first()
        # items = []
        item_query = ItemModel.query.filter_by(id=int(item_id)).first()
        # item_query = ItemModel.query.get(int(item_id))
        if not last_order or last_order.completed:
            order = OrderModel(
                user_id=user,
                user=UserModel.query.filter_by(id=user).first(),
            )
            order.items.append(item_query)
            total_bef = order.total
            if order.total is None:
                order.total=0
            order.total+=item_query.price
            #items.append({"id":item_query.id})
        else:
            last_order.items.append(item_query)
            last_order.total+=item_query.price
            order = last_order
            # print("BFOR")
            for item in order.items:
                print(item)
                #items.append({"id":item.id})
        # if order_data["completed"]:
        #     print("Done")
        #     order.completed=order_data["completed"]

        try:
            db.session.add(order)
            print("added")
            db.session.commit()
        except SQLAlchemyError as e:
            abort(500, message="An error occurred while inserting the item.")
            print(e)
        # print(items)
        return order

    # @jwt_required(fresh=True)
    # def post(self, order_id):
    #     order = OrderModel.query.get(order_id)
    #     if order:
    #         order.completed = True
    #     return order

    @jwt_required(fresh=True)
    def delete(self, order_id):
        jwt = get_jwt()
        # if not jwt.get("is_admin"):
        #     abort(401, message="Admin privilege required.")

        order = OrderModel.query.get_or_404(order_id)
        db.session.delete(order)
        db.session.commit()
        return {"message": "Order deleted."}

    @blp.arguments(ItemUpdateSchema)
    @blp.response(200, OrderSchema)
    def put(self, item_data, order_id):
        order = OrderModel.query.get(order_id)

        if order:
            # order.date = datetime.utcnow
            order.items = item_data["id"]
            order.completed = item_data["completed"]
        else:
            order = OrderModel(id=order_id, **item_data)

        db.session.add(order)
        db.session.commit()

        return order
