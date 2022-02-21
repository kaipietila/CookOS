import { 
  Box, 
  Collapse, 
  FormControl, 
  InputLabel, 
  MenuItem, 
  Paper, 
  Select, 
  Table, 
  TableBody, 
  TableCell,
  TableContainer, 
  TableHead, 
  TableRow, 
  Typography } from '@mui/material';
import * as React from 'react';
import { Order, OrderItem } from "../types"
import axios, { AxiosResponse } from 'axios';

interface OrderListProps {
    data: Order[],
    setStateUpdate: Function,
    open: boolean,
    openOrder: string,
    setOpen: Function,
    setOpenOrder: Function
}

interface RowProps {
    order: Order,
    setStateUpdate: Function,
    open: boolean,
    openOrder: string,
    setOpen: Function,
    setOpenOrder: Function
}

const getOrderItemDescription = (items: OrderItem[]) => {
    const item_names: string[] = items.map((item) => `${item.quantity} ${item.name} `)
    return item_names
}

export const OrderList = (props: OrderListProps) => {
    const columns: {field: string, headerName: string}[] = [
        { field: 'id', headerName: 'Id'},
        {
          field: 'created',
          headerName: 'Created',
        },
        {
          field: 'pickup_time',
          headerName: 'Pickup Time',
        },
        {
          field: 'items',
          headerName: 'Order Items',
        },
        {
          field: 'customer_name',
          headerName: 'Customer',
        },
        {
        field: 'status',
        headerName: 'Status',
        },
      ];
      
    const orders: Order[] = props.data

    const Row = (props: RowProps) => {
        const order: Order = props.order

        const updateOrder = async (url: string, payload: {new_state?: number, item_name?: string, new_order_state?: number}) => {
          const fullUrl: string = 'http://localhost:8000' + url
          try {
            const response: AxiosResponse = await axios.put(fullUrl, payload);
            if (response.status === 200) {
              props.setStateUpdate(Date.now())
            }
          } catch (error) {
            console.log(error)
          }
        }

        const handleOrderItemStateChange = (state: string | number, name: string) => {
          let value: number;
          if (typeof state === "string") {
            value = parseInt(state)
          } else {
            value = state
          }
          const payload: {new_state: number, item_name: string } = {
              new_state: value,
              item_name: name
          }
          const url: string = '/order/' + order.id + "/items"
          updateOrder(url, payload)
        }
        const handleOrderStateChange = (event: { target: { value: string; }; }) => {
          const new_state: number = parseInt(event.target.value)
          const payload: { new_order_state: number } = {
              new_order_state: new_state
          }
          const url: string = '/order/' + order.id + "/status"
          updateOrder(url, payload)
        }

        return (
          <React.Fragment>
            <TableRow 
            sx={{ '& > *': { borderBottom: 'unset' } }}
            onClick={() => {
                props.setOpen(!props.open) 
                props.setOpenOrder(order.id)
            }}
            data-testid={`order-row-${order.id}`}
            >
              <TableCell >{order.id}</TableCell>
              <TableCell >{order.created}</TableCell>
              <TableCell >{order.pickup_time}</TableCell>
              <TableCell >{getOrderItemDescription(order.items)}</TableCell>
              <TableCell >{order.customer_name}</TableCell>
              <TableCell >
                <FormControl fullWidth>
                <InputLabel id="order-state-select">Order Status</InputLabel>
                    <Select
                        labelId="order-select-label"
                        id="order-select"
                        data-testid='order-select'
                        value={order.status}
                        label="Order status"
                        onChange={handleOrderStateChange}
                    >
                        <MenuItem value={1}>Received</MenuItem>
                        <MenuItem value={2}>In progress</MenuItem>
                        <MenuItem value={3}>Ready for delivery</MenuItem>
                    </Select>
                </FormControl>
              </TableCell>
            </TableRow>
            <TableRow>
              <TableCell style={{ paddingBottom: 0, paddingTop: 0 }} colSpan={6}>
                <Collapse in={props.open && props.openOrder === order.id} timeout="auto" unmountOnExit>
                  <Box sx={{ margin: 1 }}>
                    <Typography variant="h6" gutterBottom component="div">
                      Order items
                    </Typography>
                    <Table size="small" aria-label="order-items">
                      <TableHead>
                        <TableRow>
                          <TableCell>Item</TableCell>
                          <TableCell>Quantity</TableCell>
                          <TableCell>Product Type</TableCell>
                          <TableCell>Subitems</TableCell>
                          <TableCell>Status</TableCell>
                        </TableRow>
                      </TableHead>
                      <TableBody>
                          {order.items.map((item: OrderItem, index:number) => (
                              <TableRow 
                              key={item.name}
                              data-testid={`item-row-${index}`}
                              >
                                <TableCell>{item.name}</TableCell>
                                <TableCell>{item.quantity}</TableCell>
                                <TableCell>{item.product_type}</TableCell>
                                <TableCell>{item.sub_items.length ? item.sub_items : 'No subitems included'}</TableCell>
                                <TableCell>
                                    <FormControl fullWidth>
                                    <InputLabel id="item-state-select">Item Status</InputLabel>
                                        <Select
                                            labelId="item-select-label"
                                            id="item-select"
                                            value={item.status}
                                            label="Item status"
                                            onChange={(e) => handleOrderItemStateChange(e.target.value, item.name)}
                                        >
                                            <MenuItem value={1}>Received</MenuItem>
                                            <MenuItem value={2} data-testid={'in-progress-option'}>In progress</MenuItem>
                                            <MenuItem value={3}>Ready for delivery</MenuItem>
                                        </Select>
                                    </FormControl>
                                </TableCell>
                              </TableRow>
                          ))}
                      </TableBody>
                    </Table>
                  </Box>
                </Collapse>
              </TableCell>
            </TableRow>
          </React.Fragment>
        );
    }

    return (
        <div style={{ display: 'flex', justifyContent: 'center'}}>
            <TableContainer sx={{ width: '1280px', boxShadow: '10px'}} component={Paper}>
                <Table aria-label="order-table">
                    <TableHead>
                        <TableRow sx={{ height: '50px'}}>
                        {columns.map((column) => (
                            <TableCell key={column.field} variant='head' sx={{ fontWeight: 'bold' }}>
                                {column.headerName}
                            </TableCell>
                        ))}
                        </TableRow>
                    </TableHead>
                    <TableBody>
                    {orders.map((order, index) => (
                        <Row 
                        key={order.id}
                        order={order} 
                        setStateUpdate={props.setStateUpdate}
                        open={props.open}
                        openOrder={props.openOrder}
                        setOpen={props.setOpen}
                        setOpenOrder={props.setOpenOrder} />
                    ))}
                    </TableBody>
                </Table>
            </TableContainer>
        </div>
    );
}
