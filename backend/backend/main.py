from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from fastapi import HTTPException, Response

from backend.backend.integration_utils import fetch_orders, update_item_state, update_state, create_new_order
from backend.backend.classes_main import OrderItemStateUpdate, OrderUpdate
from backend.backend.schemas import OrderSchema
from backend.backend.exceptions import ObjectNotFound

app = FastAPI()

origins = [
    "http://localhost:3000",
]

app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

@app.get("/orders")
async def get_orders():
    """
    Get new orders from integrations and send them to the frontend.

    If there is an exception in the backend we catch it using Exception which is not
    best practice since its very broad, but in this case better to catch and report 
    than to do nothing. 
    """
    try:
        orders = await fetch_orders()
    except Exception as exc: 
        raise HTTPException(status_code=500, detail=f"Error while getting orders: {exc}")
    return orders

@app.put("/order/{order_id}/status")
async def update_order_state(order_id: str, order_update: OrderUpdate):
    """
    Update status of an existing order
    """
    try:
        await update_state(order_id, order_update)
    except ObjectNotFound as exc:
        raise HTTPException(status_code=404, detail=f"Object not found: {exc}")
    except Exception as exc:
        raise HTTPException(status_code=500, detail=f"Error while updating order: {exc}")
    return Response(status_code=200)

@app.put("/order/{order_id}/items")
async def update_order_item_state(order_id: str, state_update: OrderItemStateUpdate):
    """
    Update status of an existing order item
    """
    try:
        await update_item_state(order_id, state_update)
    except ObjectNotFound as exc:
        raise HTTPException(status_code=404, detail=f"Object not found: {exc}")
    except Exception as exc:
        raise HTTPException(status_code=500, detail=f"Error while updating order: {exc}")
    return Response(status_code=200)


@app.post("/order/create", status_code=201)
async def create_new_state(raw_order: OrderSchema):
    """
    Create new order
    """
    try:
        id: str = await create_new_order(raw_order)
    except Exception as exc:
        raise HTTPException(status_code=500, detail=f"Error while creating order: {exc}")
    return id