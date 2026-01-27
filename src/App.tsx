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
import Register from './pages/Register';

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
  return <RouterProvider router={router} />;
}

export default App;
