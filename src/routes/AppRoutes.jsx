import { Route, Routes } from "react-router-dom";
import AboutUs from "../pages/AboutUs.jsx"
import Categories from "../pages/Categories.jsx"
import ContactUs from "../pages/ContactUs.jsx"
import Home from "../pages/Home.jsx"
import Invoice from "../pages/Invoice.jsx"
import Login from "../pages/Login.jsx"
import Products from "../pages/Products.jsx"
import Purchases from "../pages/Purchases.jsx"
import Sales from "../pages/Sales.jsx"
import Services from "../pages/Services.jsx"
import Stocks from "../pages/Stocks.jsx"
import Wholesalers from "../pages/Wholesalers.jsx"

function AppRoutes(){
    return <>
        <Routes>
            <Route path="/" element={<Home/>}/>

            <Route path="/aboutus" element={<AboutUs/>}/>
            <Route path="/contactus" element={<ContactUs/>}/>
            <Route path="/services" element={<Services/>}/>
            
            <Route path="/login" element={<Login/>}/>
            
            <Route path="/invoice" element={<Invoice/>}/>
            <Route path="/categories" element={<Categories/>}/>
            <Route path="/products" element={<Products/>}/>
            <Route path="/wholesalers" element={<Wholesalers/>}/>
            <Route path="/stocks" element={<Stocks/>}/>
            <Route path="/sales" element={<Sales/>}/>
            <Route path="/purchases" element={<Purchases/>}/>
        </Routes>
    </>
}

export default AppRoutes;