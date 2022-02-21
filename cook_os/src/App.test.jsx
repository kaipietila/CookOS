import { App } from "./App.tsx";
import { fireEvent, render, screen, within  } from '@testing-library/react'
import axios from 'axios';

const mockOrder = {
    id: '123456',
    created: 'yesterday',
    customer_name: 'Kai',
    delivery_is_asap: true,
    pickup_time: 'today',
    items: [
        {
            name: 'Fancy burger',
            product_type: 1,
            quantity: 1,
            sub_items: [],
            status: 1
        }
    ],
    include_cutlery: false,
    status: '1',
    status_history: []
}

jest.mock('axios');

  describe('App', () => {
    it('renders App with order values in table', async () => {
        axios.get.mockResolvedValue({data: [mockOrder]});
        render(<App />)
        const customerNameColumnValue = await screen.findByText(/Kai/i);
        expect(customerNameColumnValue).toBeInTheDocument;
        const orderIdColumn = await screen.findByText(/123456/i);
        expect(orderIdColumn).toBeInTheDocument;
        const itemDescriptionColumn = await screen.findByText(/Fancy burger/i);
        expect(itemDescriptionColumn).toBeInTheDocument;
        const pickUpTimeColumn = await screen.findByText(/today/i);
        expect(pickUpTimeColumn).toBeInTheDocument;
        const createdTimeColumn = await screen.findByText(/yesterday/i);
        expect(createdTimeColumn).toBeInTheDocument;
        const statusColumn = await screen.findByText(/received/i);
        expect(statusColumn).toBeInTheDocument;
    })
    it('expands rows on click and see order details', async () => {
        axios.get.mockResolvedValue({data: [mockOrder]});
        render(<App />)
        const tableRowElement = await screen.findByTestId('order-row-123456')
        expect(tableRowElement).toBeInTheDocument;
        fireEvent.click(tableRowElement);
        const orderDetailsHeadingElement = screen.getByText('Order items')
        expect(orderDetailsHeadingElement).toBeInTheDocument;

        // click again to hide order details
        fireEvent.click(tableRowElement);
        expect(orderDetailsHeadingElement).not.toBeInTheDocument;
    })
    it('has rows for each order', async () => {
        axios.get.mockResolvedValue({data: [mockOrder, mockOrder]});
        render(<App />)
        const tableRowElements = await screen.findAllByTestId(/order-row/i)
        expect(tableRowElements.length).toBe(2);
    })
    it('change order status sends request', async () => {
        const spy = jest.spyOn(axios, 'put');
        axios.get.mockResolvedValue({data: [mockOrder]});
        render(<App />)
        const orderStatusElement = await screen.findByRole('button')
        expect(orderStatusElement).toBeInTheDocument;
        fireEvent.mouseDown(orderStatusElement);
        const listbox = within(screen.getByRole('listbox'));
        fireEvent.click(listbox.getByText(/In Progress/i));

        expect(spy).toHaveBeenCalled();
        spy.mockRestore();
    })
    it('change order item status sends request', async () => {
        const spy = jest.spyOn(axios, 'put');
        axios.get.mockResolvedValue({data: [mockOrder]});
        render(<App />)
        const tableRowElement = await screen.findByTestId('order-row-123456')
        expect(tableRowElement).toBeInTheDocument;
        fireEvent.click(tableRowElement);

        const statusButtonElements = screen.getAllByRole('button', {name:'Received'})
        const itemSelectElement = statusButtonElements.filter(element => element.id === 'item-select')[0]

        fireEvent.mouseDown(itemSelectElement);
        const listbox = within(screen.getByRole('listbox'));
        fireEvent.click(listbox.getByText(/In Progress/i));

        expect(spy).toHaveBeenCalled();
        spy.mockRestore();
    })
});
