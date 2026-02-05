import {
  createBrowserRouter,
  createRoutesFromElements,
  Route,
  RouterProvider
} from 'react-router-dom';
import { Fragment } from 'react';
import AuthGuard from './components/AuthGuard';
import GuestGuard from './components/GuestGuard';
import DashboardLayout from './layouts/DashboardLayout';
import Home from './pages/Home';
import Login from './pages/Login';
import RecursosPages from './pages/Recursos';
import PlanosPage from './pages/Planos';
import FundicionPage from './pages/Fundicion';
import InventoryPage from './pages/Inventory';
import AdminInventory from './pages/AdminInventory';
import Register from './pages/Register';
import { Toaster } from 'sonner';

const router = createBrowserRouter(
  createRoutesFromElements(
    <Fragment>
      <Route element={<GuestGuard />}>
        <Route path="/login" element={<Login />} />
      </Route>
      <Route element={<GuestGuard />}>
        <Route path="/register" element={<Register />} />
      </Route>
      <Route element={<AuthGuard />}>
        <Route element={<DashboardLayout />}>
          <Route path="/recursos" element={<RecursosPages />} />
          <Route path="/planos" element={<PlanosPage />} />
          <Route path="/fundicion" element={<FundicionPage />} />
          <Route path="/inventario" element={<InventoryPage />} />
          <Route path="/admin-inventario" element={<AdminInventory />} />
        </Route>
      </Route>
      <Route element={<AuthGuard />}>
        <Route element={<DashboardLayout />}>
          <Route path="/" element={<Home />} />
        </Route>
      </Route>
    </Fragment>
  )
);

function App() {
  return (
    <Fragment>
      <Toaster richColors theme="dark" />
      <RouterProvider router={router} />
    </Fragment>
  );
}

export default App;
