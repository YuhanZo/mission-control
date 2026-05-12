import { BrowserRouter, Routes, Route } from 'react-router-dom'
import './styles/global.css'

import { Dashboard }       from './pages/Dashboard'
import { Customers }       from './pages/Customers'
import { CustomerDetail }  from './pages/CustomerDetail'
import { Jobs }            from './pages/Jobs'
import { JobDetail }       from './pages/JobDetail'
import { Quotes }          from './pages/Quotes'
import { Orders }          from './pages/Orders'
import { Installations }   from './pages/Installations'
import { Inventory }       from './pages/Inventory'
import { Tasks }           from './pages/Tasks'
import { Settings }        from './pages/Settings'

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/"                     element={<Dashboard />} />
        <Route path="/customers"            element={<Customers />} />
        <Route path="/customers/:id"        element={<CustomerDetail />} />
        <Route path="/jobs"                 element={<Jobs />} />
        <Route path="/jobs/:id"             element={<JobDetail />} />
        <Route path="/quotes"               element={<Quotes />} />
        <Route path="/orders"               element={<Orders />} />
        <Route path="/installations"        element={<Installations />} />
        <Route path="/inventory"            element={<Inventory />} />
        <Route path="/tasks"               element={<Tasks />} />
        <Route path="/settings"             element={<Settings />} />
      </Routes>
    </BrowserRouter>
  )
}
