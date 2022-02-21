from typing import Dict, List
from pydantic import BaseModel

from backend.backend.classes_main import RawOrderItem, StatusHistory


class OrderSchema(BaseModel):
    _id: str
    _created: str
    _updated: str
    account: str
    by: str
    capacityUsages: List
    channel: int
    channelLink: str
    channelOrderDisplayId: str
    channelOrderId: str
    channelOrderRawId: str
    courier: Dict
    customer: Dict
    decimalDigits: int
    deliveryAddress: Dict
    deliveryCost: int
    deliveryIsAsap: bool
    deliveryTime: str
    discountTotal: int
    historyDriverUpdates: List
    items: List[RawOrderItem]
    location: str
    note: str
    numberOfCustomers: int
    orderIsAlreadyPaid: bool
    orderType: int
    packaging: Dict
    payment: Dict
    pickupTime: str
    pos: int
    posId: str
    posLocationId: str
    posReceiptId: str
    rating: List
    recent: bool
    resolvedBy: str
    serviceCharge: int
    status: int
    statusHistory: List[StatusHistory]
    taxes: List
    tip: int
