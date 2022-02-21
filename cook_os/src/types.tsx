

export type OrderItem = {
    name: string
    product_type: number
    quantity: number
    sub_items: string[]
    status: number
}

type StatusHistory = {
    response: string
    source: number
    status: number
    timeStamp: string
}
export type Order = {
    id: string
    created: string
    customer_name: string
    delivery_is_asap: boolean
    pickup_time: string
    items: OrderItem[]
    include_cutlery: boolean
    status: string
    status_history: StatusHistory[]
}
