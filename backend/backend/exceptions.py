
class ObjectNotFound(Exception):
    pass

class NoOrderFoundException(ObjectNotFound):
    pass

class OrderItemsSchemaInvalid(ObjectNotFound):
    pass

class OrderSchemaInvalidException(ObjectNotFound):
    pass