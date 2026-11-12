import { BrowserRouter, Routes, Route } from "react-router-dom";
import Header from "./compo/header";
import Footer from "./compo/footer";
import Page404 from "./pages/page404";
import Store from "./pages/store";
import Home from "./pages/home";
import ProductDetails from "./pages/ProductDetails";
import CustomizationEngine from "./pages/CustomizationEngine";
import PrePaymentPreview from "./pages/PrePaymentPreview";
import Checkout from "./pages/Checkout";
import OrderSuccess from "./pages/OrderSuccess";
import RecipientExperience from "./pages/RecipientExperience";
import Categories from "./pages/Categories";


import SearchResults from "./pages/SearchResults";
import Login from "./pages/Login";
import Register from "./pages/Register";
import ContactUs from "./pages/ContactUs";



function App() {
  return (
    <BrowserRouter>
      <Header />
      <Routes>
        {<Route path="/" element={<Home />} />}
        <Route path="/store" element={<Store />} />
        <Route path="/product/:id" element={<ProductDetails />} />
        <Route path="/customize/:id" element={<CustomizationEngine />} />
        <Route path="/preview" element={<PrePaymentPreview />} />
        <Route path="/checkout" element={<Checkout />} />
<Route path="/order-success" element={<OrderSuccess />} />
<Route path="/recipientExperience" element={<RecipientExperience />} />
<Route path="/categories" element={<Categories />} />


<Route path="/searchResults" element={<SearchResults />} />
<Route path="/login" element={<Login />} />
<Route path="/register" element={<Register />} />
<Route path="/contactus" element={<ContactUs />} />

    
        {/* 404 */}
        <Route path="*" element={<Page404 />} />
      </Routes>
      <Footer />
    </BrowserRouter>
  );
}

export default App;
