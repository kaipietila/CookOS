from typing import List
from tinydb import Query, TinyDB

from backend.backend.classes_main import Order, OrderItem, RawOrderItem
from backend.backend.exceptions import OrderItemsSchemaInvalid, OrderSchemaInvalidException
from backend.backend.schemas import OrderSchema

db = TinyDB('db.json')

async def get_order_items(items: List[RawOrderItem]):
    order_items = []
    try:
        for item in items:
            item = OrderItem(
                name = item['name'],
                product_type = item['productType'],
                quantity = item['quantity'],
                sub_items = item['subItems'],
                status = item.get('status', 1)  # default to status 1 "received"
            )
            order_items.append(item)
    except KeyError as exc:
        raise OrderItemsSchemaInvalid(f'Order items schema invalid: {exc}')
    return order_items

async def record_to_order(order_dict: OrderSchema):
    order_items = await get_order_items(order_dict['items'])
    try:
        order_id = order_dict.get('_id', 'No _id available')
        order = Order(
            id = order_id,
            created = order_dict['_created'],
            customer_name = order_dict['customer']['name'],
            delivery_is_asap = order_dict['deliveryIsAsap'],
            pickup_time = order_dict['pickupTime'],
            include_cutlery = order_dict['packaging'].get('includeCutlery', False),
            items = order_items,
            status = order_dict['status'],
            status_history = order_dict['statusHistory'],
        )
    except KeyError as exc:
        raise OrderSchemaInvalidException(f'Order Schema invalid for order {order_id}: {exc}')
    return order

async def get_orders():
    records = db.all()
    orders = []
    for record in records:
        order = await record_to_order(record)
        orders.append(order)
    return orders

async def get_order_dict_by_id(order_id: str):
    order_dict = Query()
    records = db.search(order_dict._id == order_id)
    return records[0]

async def get_order_by_id(order_id: str):
    order_dict = Query()
    records = db.search(order_dict._id == order_id)
    if not records:
        raise ValueError(f'No records found with id: {order_id}')
    if len(records) > 1:
        raise ValueError('Document ids have to be unique')
    order = await record_to_order(records[0])
    return order

async def update_order_status(order: Order):
    status_history = [history.dict() for history in order.status_history]
    order_query = Query()
    db.update({
        'status': order.status,
        'statusHistory': status_history
    }, order_query._id == order.id)

async def create_order(order_dict):
    id = db.insert(order_dict)
    return id

async def update_items(order: Order):
    existing_order_dict = await get_order_dict_by_id(order.id)
    for existing_item in existing_order_dict['items']:
        for new_item in order.items:
            if new_item.name == existing_item['name']:
                existing_item['status'] = new_item.status
    order_query = Query()
    db.update({
        'items': existing_order_dict['items']
    }, order_query._id == order.id)
