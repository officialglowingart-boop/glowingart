// import React from 'react';
// import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
// import { CartProvider } from './context/CartContext';
// import { AdminProvider } from './context/AdminContext';
// import Header from './components/Header';
// import Footer from './components/Footer';
// import Home from './pages/Home';
// import PrivacyPolicy from './pages/PrivacyPolicy';
// import OrderTracking from './pages/OrderTracking';
// import CommonQuestions from './pages/CommonQuestions';
// import Contact from './pages/Contact';
// import Category from './pages/Category';
// import ProductDetail from './pages/ProductDetail';
// import Payment from './pages/Payment';
// import PaymentDetails from './pages/PaymentDetails';
// import Checkout from './pages/Checkout';

// // Admin Components
// import AdminDashboard from './pages/admin/AdminDashboard';
// import AdminLogin from './pages/admin/AdminLogin';
// import ProductManagement from './components/admin/ProductManagement';
// import OrderManagement from './components/admin/OrderManagement';
// import CategoryManagement from './components/admin/CategoryManagement';
// import PaymentVerification from './components/admin/PaymentVerification';
// import ReviewManagement from './components/admin/ReviewManagement';

// function App() {
//   return (
//     <AdminProvider>
//       <CartProvider>
//         <Router>
//           <div className="App">
//             <Routes>
//               {/* Admin Routes - No Header/Footer */}
//               <Route path="/admin/login" element={<AdminLogin />} />
//               <Route path="/admin" element={<AdminDashboard />} />
//               <Route path="/admin/dashboard" element={<AdminDashboard />} />
//               <Route path="/admin/products" element={<ProductManagement />} />
//               <Route path="/admin/orders" element={<OrderManagement />} />
//               <Route path="/admin/categories" element={<CategoryManagement />} />
//               <Route path="/admin/payments" element={<PaymentVerification />} />
//               <Route path="/admin/reviews" element={<ReviewManagement />} />

//               {/* Public Routes - With Header/Footer */}
//               <Route path="/*" element={
//                 <>
//                   <Header />
//                   <main>
//                     <Routes>
//                       <Route path="/" element={<Home />} />
//                       <Route path="/privacy-policy" element={<PrivacyPolicy />} />
//                       <Route path="/track-order" element={<OrderTracking />} />
//                       <Route path="/track-order/:orderNumber" element={<OrderTracking />} />
//                       <Route path="/common-questions" element={<CommonQuestions />} />
//                       <Route path="/contact" element={<Contact />} />
//                       <Route path="/category/:categoryName" element={<Category />} />
//                       <Route path="/product/:id" element={<ProductDetail />} />
//                       <Route path="/checkout" element={<Checkout />} />
//                       <Route path="/payment" element={<Payment />} />
//                       <Route path="/payment/:orderNumber" element={<PaymentDetails />} />

//                       {/* 404 Route */}
//                       <Route path="*" element={
//                         <div className="min-h-screen flex items-center justify-center" style={{ backgroundColor: "#dfdfd8" }}>
//                           <div className="text-center">
//                             <h1 className="text-4xl font-bold text-gray-800 mb-4">404</h1>
//                             <p className="text-gray-600 mb-4">Page not found</p>
//                             <a href="/" className="text-blue-600 hover:underline">Go back to home</a>
//                           </div>
//                         </div>
//                       } />
//                     </Routes>
//                   </main>
//                   <Footer />
//                 </>
//               } />
//             </Routes>
//           </div>
//         </Router>
//       </CartProvider>
//     </AdminProvider>
//   );
// }

// export default App;














import { BrowserRouter as Router, Routes, Route } from "react-router-dom"
import { CartProvider } from "./context/CartContext"
import { AdminProvider } from "./context/AdminContext"
import Header from "./components/Header"
import Footer from "./components/Footer"
import Home from "./pages/Home"
import PrivacyPolicy from "./pages/PrivacyPolicy"
import OrderTracking from "./pages/OrderTracking"
import CommonQuestions from "./pages/CommonQuestions"
import Contact from "./pages/Contact"
import Category from "./pages/Category"
import ProductDetail from "./pages/ProductDetail"
import Products from "./pages/Products"
import Payment from "./pages/Payment"
import PaymentDetails from "./pages/PaymentDetails"
import Checkout from "./pages/Checkout"

// Admin Components
import AdminDashboard from "./pages/admin/AdminDashboard"
import AdminLogin from "./pages/admin/AdminLogin"
import ProductManagement from "./components/admin/ProductManagement"
import OrderManagement from "./components/admin/OrderManagement"
import CategoryManagement from "./components/admin/CategoryManagement"
import PaymentVerification from "./components/admin/PaymentVerification"
import ReviewManagement from "./components/admin/ReviewManagement"

function App() {
  return (
    <AdminProvider>
      <CartProvider>
        <Router>
          <div className="App">
            <Routes>
              {/* Admin Routes - No Header/Footer */}
              <Route path="/admin/login" element={<AdminLogin />} />
              <Route path="/admin" element={<AdminDashboard />} />
              <Route path="/admin/dashboard" element={<AdminDashboard />} />
              <Route path="/admin/products" element={<ProductManagement />} />
              <Route path="/admin/orders" element={<OrderManagement />} />
              <Route path="/admin/categories" element={<CategoryManagement />} />
              <Route path="/admin/payments" element={<PaymentVerification />} />
              <Route path="/admin/reviews" element={<ReviewManagement />} />

              {/* Payment Routes - No Header/Footer */}
              <Route path="/payment" element={<Payment />} />
              <Route path="/payment/:orderNumber" element={<PaymentDetails />} />

              {/* Public Routes - With Header/Footer */}
              <Route
                path="/*"
                element={
                  <>
                    <Header />
                    <main>
                      <Routes>
                        <Route path="/" element={<Home />} />
                        <Route path="/privacy-policy" element={<PrivacyPolicy />} />
                        <Route path="/products" element={<Products />} />
                        <Route path="/track-order" element={<OrderTracking />} />
                        <Route path="/track-order/:orderNumber" element={<OrderTracking />} />
                        <Route path="/order-tracking" element={<OrderTracking />} />
                        <Route path="/order-tracking/:orderNumber" element={<OrderTracking />} />
                        <Route path="/common-questions" element={<CommonQuestions />} />
                        <Route path="/contact" element={<Contact />} />
                        <Route path="/category/:categoryName" element={<Category />} />
                        <Route path="/product/:id" element={<ProductDetail />} />
                        <Route path="/checkout" element={<Checkout />} />
                        {/* Payment routes moved out to hide Header/Footer */}

                        {/* 404 Route */}
                        <Route
                          path="*"
                          element={
                            <div
                              className="min-h-screen flex items-center justify-center"
                              style={{ backgroundColor: "#dfdfd8" }}
                            >
                              <div className="text-center">
                                <h1 className="text-4xl font-bold text-gray-800 mb-4">404</h1>
                                <p className="text-gray-600 mb-4">Page not found</p>
                                <a href="/" className="text-blue-600 hover:underline">
                                  Go back to home
                                </a>
                              </div>
                            </div>
                          }
                        />
                      </Routes>
                    </main>
                    <Footer />
                  </>
                }
              />
            </Routes>
          </div>
        </Router>
      </CartProvider>
    </AdminProvider>
  )
}

export default App
