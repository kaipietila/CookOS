
"""
Mock integration to the delivery provider
"""
def update_delivery_provider():
    print('Updating order state in delivery provider system!')


def get_new_orders():
    """
    Could be ran as a cronjob or have some other trigger e.g. webhook
    And then add to the db.
    """
    pass