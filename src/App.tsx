
import { Routes, Route } from 'react-router-dom'
import { Slide, ToastContainer } from 'react-toastify'
import AppBar from './appbar/appbar'
import ProductInfo from './pages/Product'
import Home from './pages/home'
import LoginUser from './pages/login'
import 'react-toastify/dist/ReactToastify.css'
import RegisterUser from './pages/register'

function App() {
  return (
    <>
      <div className="flex flex-col min-h-screen bg-gray-400">
        <AppBar />
        <ToastContainer 
          position='top-right'
          autoClose={2000}
          limit={0}
          hideProgressBar={false}
          newestOnTop
          closeOnClick
          closeButton={false}
          rtl={false}
          draggable
          pauseOnFocusLoss={false}
          pauseOnHover
          theme="light"
          transition={Slide}
        />
        <div className="flex-grow mt-16">
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/details/:id" element={<ProductInfo />} />
            <Route path="/buy/:id" element={<LoginUser />} />
            <Route path="/login" element={<LoginUser />} />
            <Route path="/register/:id" element={<RegisterUser />} />
            <Route path="/register" element={<RegisterUser />} />
          </Routes>
        </div>
      </div>
    </>
  )
}

export default App
