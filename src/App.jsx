import {createBrowserRouter, RouterProvider} from "react-router-dom"
import AppLayout from "./components/layouts/AppLayout"
import { store } from "./store/store"
import { Provider } from "react-redux"
import Dashboard from "./pages/Dashboard"
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
