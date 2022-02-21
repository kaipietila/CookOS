import json
import os
from tinydb import TinyDB


def populate_db_with_test_data():
    db = TinyDB('db.json')
    with open(os.path.join(os.path.dirname(__file__),'orders.json')) as f:
        orders = json.loads(f.read())
    for order in orders:
        db.insert(order)
        
if __name__ == '__main__':
    print('populating db with test data!')
    populate_db_with_test_data()