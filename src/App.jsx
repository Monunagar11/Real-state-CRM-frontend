import {createBrowserRouter, RouterProvider} from "react-router-dom"
import AppLayout from "./components/layouts/AppLayout"
import { store } from "./store/store"
import { Provider } from "react-redux"
import Dashboard from "./pages/Dashboard"
import RealEstateDashboard from "./pages/RealEstateDashboard"
import Profile from "./pages/Profile"
import AddProperty from "./pages/AddProperty"
import Clients from "./pages/Clients"
import Leads from "./pages/Leads"
import Login from "./pages/Login"
import Signup from "./pages/Signup"
import 'bootstrap/dist/css/bootstrap.min.css';
import 'bootstrap-icons/font/bootstrap-icons.css';
import AdminLayout from "./components/layouts/AdminLayout"


function App() {
const router = createBrowserRouter([
  {
    path : "/",
    element: <AppLayout />,
    children : [
      {
        index: true,
        element: <Login />
      },
      {
        path : "/register",
        element: <Signup />
      }
    ]
  },
  {
    path : "/admin",
    element: <AdminLayout />,
    children : [
      {
        index: true,
        element: <Dashboard />
      },
      {
        path: "real-estate",
        element: <RealEstateDashboard />
      },
      {
        path: "profile",
        element: <Profile />
      },
      {
        path: "add-property",
        element: <AddProperty />
      },
      {
        path: "clients",
        element: <Clients />
      },
      {
        path: "leads",
        element: <Leads />
      }
    ]
  }

])
  return (
    <>
    <Provider store={store}>
      <RouterProvider router={router} >

      </RouterProvider>
    </Provider>

    </>
  )
}

export default App
