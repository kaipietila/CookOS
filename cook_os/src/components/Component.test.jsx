import { render, screen } from '@testing-library/react'
import { Header } from './header';
import { OrderList } from './orderList';

describe('header', () => {
    it('renders Header with proper text', async () => {
        render(<Header />)
        const header = screen.getByText(/CookOs/i);
        expect(header).toBeInTheDocument;
    })
});

const mockFn = jest.fn()

describe('orderList', () => {
    it('renders OrderList with id column', async () => {
        render(<OrderList
            data={[]} 
            setStateUpdate={mockFn}
            open={true}
            openOrder={''}
            setOpen={mockFn}
            setOpenOrder={mockFn}/>)
        const IdColumn = screen.getByText(/Id/i);
        expect(IdColumn).toBeInTheDocument;
    })
    it('renders OrderList with correct column values', async () => {
        const order = {
            id: '1234455',
            created: 'then',
            customer_name: 'someone',
            delivery_is_asap: true,
            pickup_time: 'now',
            items: [],
            include_cutlery: false,
            status: '1',
            status_history: []
        }
        render(<OrderList
            data={[order]} 
            setStateUpdate={mockFn}
            open={true}
            openOrder={''}
            setOpen={mockFn}
            setOpenOrder={mockFn}/>)
       
        const value = screen.getByText(order.id);
        expect(value).toBeInTheDocument;
        const customer = screen.getByText(order.customer_name);
        expect(customer).toBeInTheDocument;
        const created = screen.getByText(order.created);
        expect(created).toBeInTheDocument;
        const pickup_time = screen.getByText(order.pickup_time);
        expect(pickup_time).toBeInTheDocument;
    })
    it('contains state change select', async () => {
        const order = {
            id: '1234455',
            created: 'then',
            customer_name: 'someone',
            delivery_is_asap: true,
            pickup_time: 'now',
            items: [],
            include_cutlery: false,
            status: '1',
            status_history: []
        }
        render(<OrderList
            data={[order]} 
            setStateUpdate={mockFn}
            open={true}
            openOrder={''}
            setOpen={mockFn}
            setOpenOrder={mockFn}/>)
        const stateChangeSelect = screen.getByRole('button');
        expect(stateChangeSelect).toBeInTheDocument;
        // state 1 is received
        expect(stateChangeSelect.textContent).toBe('Received')
    })
})