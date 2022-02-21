from pydantic import BaseModel
from datetime import datetime
from typing import List

from backend.backend.enums import OrderStateEnum

class StatusHistory(BaseModel):
    response: str
    source: int
    status: int
    timeStamp: str

class OrderUpdate(BaseModel):
    new_order_state: OrderStateEnum

class OrderItemStateUpdate(BaseModel):
    new_state: OrderStateEnum
    item_name: str

class OrderItem(BaseModel):
    name: str
    product_type: int
    quantity: int
    sub_items: List[str] = []
    status: int

class Order(BaseModel):
    id: str
    created: datetime
    customer_name: str
    delivery_is_asap: bool
    pickup_time: datetime
    items: List[OrderItem] = []
    include_cutlery: bool
    status: OrderStateEnum
    status_history: List[StatusHistory]

class RawOrderItem(BaseModel):
    isInternal: bool
    name: str
    plu: str
    price: int
    productType: int
    quantity: int
    sortOrder: int
    subItems: List[str] = []
