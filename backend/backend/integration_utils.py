from datetime import datetime

from backend.backend.classes_main import Order, OrderItemStateUpdate, OrderUpdate, StatusHistory
from backend.backend.exceptions import NoOrderFoundException
from backend.backend.repository import get_order_by_id, update_items, update_order_status, get_orders, create_order
from backend.backend.delivery_integration import update_delivery_provider
from backend.backend.schemas import OrderSchema

async def fetch_orders():
    orders = await get_orders()
    return orders

async def create_new_order(order_dict: OrderSchema):
    id = await create_order(order_dict)
    return id

async def create_new_status_history(new_state: str):
    status_history = StatusHistory(
        response = '',
        source = 1,  # 1 is restaurant
        status = new_state,
        timeStamp = str(datetime.now()),
    )
    return status_history

async def update_order_state(update_data: OrderUpdate, existing_order: Order):
    existing_order.status = update_data.new_order_state
    status_history = await create_new_status_history(update_data.new_order_state)
    existing_order.status_history.append(status_history)
    await update_order_status(existing_order)

async def update_state(order_id: str, update_data: OrderUpdate):
    existing_order = await get_order_by_id(order_id) 
    if not existing_order:
        raise NoOrderFoundException(f'Order by id {order_id} not found')
    await update_order_state(update_data, existing_order)
    
    # When order status is updated we update the delivery provider
    update_delivery_provider()

async def update_item_state(order_id: str, update_data: OrderItemStateUpdate):
    existing_order = await get_order_by_id(order_id) 
    if not existing_order:
        raise NoOrderFoundException(f'Order by id {order_id} not found')
    await update_item_list(update_data, existing_order)

async def update_item_list(update_data: OrderItemStateUpdate, existing_order: Order):
    for item in existing_order.items:
        if item.name == update_data.item_name:
            item.status = update_data.new_state
    await update_items(existing_order)
