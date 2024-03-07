from marshmallow import Schema, fields


class PlainItemSchema(Schema):
    id = fields.Int(dump_only=True)
    name = fields.Str(required=True)
    image = fields.Str(required=True)
    description = fields.Str(required=True)
    price = fields.Float(required=True)


class PlainBuySchema(Schema):
    id = fields.Int(dump_only=True)
    # name = fields.Str(required=True)


class PlainTagSchema(Schema):
    id = fields.Int(dump_only=True)
    name = fields.Str()


class ItemSchema(PlainItemSchema):
    # store_id = fields.Int(required=True, load_only=True)
    # store = fields.Nested(PlainStoreSchema(), dump_only=True)
    tags = fields.List(fields.Nested(PlainTagSchema()), dump_only=True)


class ItemUpdateSchema(Schema):
    name = fields.Str()
    price = fields.Float()


# class StoreSchema(PlainStoreSchema):
#     items = fields.List(fields.Nested(PlainItemSchema()), dump_only=True)
#     tags = fields.List(fields.Nested(PlainTagSchema()), dump_only=True)


class TagSchema(PlainTagSchema):
    # store_id = fields.Int(load_only=True)
    items = fields.List(fields.Nested(PlainItemSchema()), dump_only=True)
    # store = fields.Nested(PlainStoreSchema(), dump_only=True)


class TagAndItemSchema(Schema):
    message = fields.Str()
    item = fields.Nested(ItemSchema)
    tag = fields.Nested(TagSchema)
    
class RefItemSchema(Schema):
    id = fields.Int()

class OrderSchema(Schema):
    id = fields.Int(dump_only=True)
    completed = fields.Boolean()
    total = fields.Int(dump_only=True)
    date = fields.DateTime(dump_only=True)
    user_id = fields.Int(dump_only=True)
    # user = fields.Int(dump_only=True)
    # items = fields.Int(required=True, load_only=True)
    items = fields.List(fields.Nested(RefItemSchema))


class UserSchema(Schema):
    id = fields.Int(dump_only=True)
    firstname = fields.Str(required=True)
    lastname = fields.Str(required=True)
    password = fields.Str(required=True, load_only=True)
    phone = fields.Str(required=True)
    email = fields.Str(required=True)
    admin = fields.Boolean()

class LoginSchema(Schema):
    id = fields.Int(dump_only=True)
    email = fields.Str(required=True)
    password = fields.Str(required=True, load_only=True)
