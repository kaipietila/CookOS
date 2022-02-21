from fastapi.testclient import TestClient
import asynctest
import os
import json

from backend.backend.main import app
from backend.backend.classes_main import Order

client = TestClient(app)

class TestRoutes(asynctest.TestCase):
    def setUp(self) -> None:
        self.order = Order(
            id = 'order_id',
            created = "2021-07-22T20:08:02.000000Z",
            customer_name = 'dude',
            delivery_is_asap = True,
            pickup_time = "2021-07-22T20:08:02.000000Z",
            include_cutlery = False,
            items = [],
            status = 2,
            status_history = [],
        )
        with open(os.path.join(os.path.dirname(os.path.dirname(__file__)), 'orders.json')) as f:
            self.order_dict = json.loads(f.read())[0]
        return super().setUp()

    async def test_get_order(self):
        response = client.get("/orders")
        assert response.status_code == 200
    
    @asynctest.mock.patch('backend.backend.integration_utils.get_orders')
    async def test_get_order_fails(self, get_mock):
        get_mock.side_effect = Exception
        response = client.get("/orders")
        assert response.status_code == 500
    
    @asynctest.mock.patch('backend.backend.integration_utils.get_order_by_id')
    @asynctest.mock.patch('backend.backend.integration_utils.update_order_status')
    async def test_update_state(self, update_mock, get_mock):
        get_mock.return_value = self.order
        order_id = '5a422a851b54a676234d17f7'
        payload = {
            'new_order_state': 2,
        }
        response = client.put(f"/order/{order_id}/status", json=payload)
        assert response.status_code == 200
    
    @asynctest.mock.patch('backend.backend.integration_utils.get_order_by_id')
    async def test_update_state_fails_no_order(self, get_by_id_mock):
        get_by_id_mock.return_value = []
        order_id = '5a422a851b54a676234d17f7'
        payload = {
            'id': '5a422a851b54a676234d17f7',
            'new_order_state': 2,
        }
        response = client.put(f"/order/{order_id}/status", json=payload)
        assert response.status_code == 404

    @asynctest.mock.patch('backend.backend.integration_utils.update_order_status')
    async def test_update_state_fails_other_exception(self, update_mock):
        update_mock.side_effect = Exception
        order_id = '5a422a851b54a676234d17f7'
        payload = {
            'id': '5a422a851b54a676234d17f7',
            'new_order_state': 2,
        }
        response = client.put(f"/order/{order_id}/status", json=payload)
        assert response.status_code == 500

    @asynctest.mock.patch('backend.backend.integration_utils.create_order')
    async def test_create_order(self, create_mock):
        response = client.post("/order/create", json=self.order_dict)
        assert response.status_code == 201
        create_mock.assert_called_once()

    async def test_create_order_fails_data_invalid(self):
        test_order = self.order_dict.copy()
        test_order['items'] = 'some items'
        response = client.post("/order/create", json=test_order)
        assert response.status_code == 422
