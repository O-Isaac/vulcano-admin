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

const router = createBrowserRouter(
  createRoutesFromElements(
    <Fragment>
      <Route element={<GuestGuard />}>
        <Route path="/login" element={<Login />} />
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
