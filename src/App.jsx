import {createBrowserRouter, RouterProvider} from "react-router-dom"
import AppLayout from "./components/layouts/AppLayout"
import { store } from "./store/store"
import { Provider } from "react-redux"
import Dashboard from "./pages/Dashboard"

function App() {
const router = createBrowserRouter([
  {
    index: true,
    element: <AppLayout />,
    children : [
      {
        path: "/",
        element: <Dashboard />
      }
    ]
  },
  
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
