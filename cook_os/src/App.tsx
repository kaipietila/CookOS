import { useState, useEffect } from 'react';
import axios from 'axios';
import { OrderList } from './components/orderList';
import { Header } from './components/header';

export const baseURL: string ='http://localhost:8000';

export const App = () => {
  const [hasErrors, setHasErrors] = useState(false)
  const [data, setData] = useState([])
  const [stateUpdate, setStateUpdate] = useState(0)
  const [open, setOpen] = useState(false);
  const [openOrder, setOpenOrder] = useState('')

  const getData = async () => {
    try {
      const {data} = await axios.get(baseURL+ '/orders')
      setData(data)
    } catch (error) {
      setHasErrors(true)
    }
  }
  useEffect(() => {
    getData()
  }, [stateUpdate]);

  return (
    <div style={{
      height: '100vh',
      display: 'flex', 
      flexDirection: 'column',
      justifyContent: 'flex-start',
      }}
    >
      <Header />
      <div> 
        {hasErrors ? <p>Error while loading data</p> :
        <OrderList 
        data={data} 
        setStateUpdate={setStateUpdate}
        open={open}
        openOrder={openOrder}
        setOpen={setOpen}
        setOpenOrder={setOpenOrder}
        />
        }
      </div>
    </div>
    );
}

export default App;
