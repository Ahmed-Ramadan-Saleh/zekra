import { BrowserRouter, Routes, Route } from "react-router-dom";

// Layout User
import MainLayout from "./pages/User/layouts/MainLayout";

// User
import Store from "./pages/User/store";
import Home from "./pages/User/home";
import ProductDetails from "./pages/User/ProductDetails";
import CustomizationEngine from "./pages/User/CustomizationEngine";
import PrePaymentPreview from "./pages/User/PrePaymentPreview";
import Checkout from "./pages/User/Checkout";
import OrderSuccess from "./pages/User/OrderSuccess";
import RecipientExperience from "./pages/User/RecipientExperience";
import Categories from "./pages/User/Categories";
import SearchResults from "./pages/User/SearchResults";
import ContactUs from "./pages/User/ContactUs";
// Authentication USER
import Register from "./pages/User/Authentication/Register";
import Login from "./pages/User/Authentication/Login";
// Authorization USER
import UserProfile from "./pages/User/Authorization/UserProfile";
import UserOrders from "./pages/User/Authorization/UserOrders";
import UserOrderDetails from "./pages/User/Authorization/UserOrderDetails";
import UserHome from "./pages/User/Authorization/UserHome";
import UserFavorites from "./pages/User/Authorization/UserFavorites";

// Admin
import AdminLogin from "./pages/Admin/adminLogin";
import AdminLayout from "./pages/Admin/layout/adminLayout";


import AdminCategories from "./pages/Admin/AdminCategories";
import AdminCMS from "./pages/Admin/AdminCMS";
import AdminCoupons from "./pages/Admin/AdminCoupons";
import AdminCustomers from "./pages/Admin/AdminCustomers";
import AdminFieldsBuilder from "./pages/Admin/AdminFieldsBuilder";
import AdminGifts from "./pages/Admin/AdminGifts";
import AdminHome from "./pages/Admin/AdminHome";
import AdminOrders from "./pages/Admin/AdminOrders";
import AdminProductForm from "./pages/Admin/AdminProductForm";
import AdminProducts from "./pages/Admin/AdminProducts";
import AdminSettings from "./pages/Admin/AdminSettings";
// page 404
import Page404 from "./pages/User/page404";
function App() {
  return (
    <BrowserRouter>
      <Routes>
        {/* User Routes */}
        <Route element={<MainLayout />}>
          {<Route path="/" element={<Home />} />}
          <Route path="/store" element={<Store />} />
          <Route path="/product/:id" element={<ProductDetails />} />
          <Route path="/customize/:id" element={<CustomizationEngine />} />
          <Route path="/preview" element={<PrePaymentPreview />} />
          <Route path="/checkout" element={<Checkout />} />
          <Route path="/order-success" element={<OrderSuccess />} />
          <Route
            path="/recipientExperience"
            element={<RecipientExperience />}
          />
          <Route path="/categories" element={<Categories />} />
          <Route path="/searchResults" element={<SearchResults />} />
          <Route path="/contactus" element={<ContactUs />} />
          {/* AUTH USER*/}
          <Route path="/register" element={<Register />} />
          <Route path="/login" element={<Login />} />

          {/* Authorization USER /:id */}
          <Route path="/userProfile" element={<UserProfile />} />
          <Route path="/userOrders" element={<UserOrders />} />
          <Route path="/userOrderDetails" element={<UserOrderDetails />} />
          <Route path="/userHome" element={<UserHome />} />
          <Route path="/userFavorites" element={<UserFavorites />} />
        </Route>

        {/* Admin Routes */}
        <Route path="/admin/login" element={<AdminLogin />} />

        <Route element={<AdminLayout />}>
          {/* all pages */}

          
          <Route path="/admin/settings" element={<AdminSettings />} />
          <Route path="/admin/products" element={<AdminProducts />} />
          <Route path="/admin/productForm" element={<AdminProductForm />} />
          <Route path="/admin/orders" element={<AdminOrders />} />
          <Route path="/admin" element={<AdminHome />} />
          <Route path="/admin/gifts" element={<AdminGifts />} />
          <Route path="/admin/fields" element={<AdminFieldsBuilder />} />
          <Route path="/admin/customers" element={<AdminCustomers />} />
          <Route path="/admin/coupons" element={<AdminCoupons />} />
          <Route path="/admin/cms" element={<AdminCMS />} />
          <Route path="/admin/categories" element={<AdminCategories />} />
        </Route>

        {/* 404 */}
        <Route path="*" element={<Page404 />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
