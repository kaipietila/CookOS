from enum import Enum

class OrderStateEnum(int, Enum):
    received_by_restaurant = 1
    in_progress = 2
    ready_for_delivery = 3
