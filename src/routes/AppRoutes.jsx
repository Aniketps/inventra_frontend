import { Route, Routes } from "react-router-dom";
import AboutUs from "../pages/AboutUs.jsx"
import ContactUs from "../pages/ContactUs.jsx"
import Home from "../pages/Home.jsx"
import Login from "../pages/Login.jsx"
import Purchases from "../pages/Purchases.jsx"
import Services from "../pages/Services.jsx"
import DashboardLayout from "../layouts/DashboardLayout.jsx";

function AppRoutes(){
    return <>
        <Routes>
            <Route path="/" element={<Home/>}/>

            <Route path="/aboutus" element={<AboutUs/>}/>
            <Route path="/contactus" element={<ContactUs/>}/>
            <Route path="/services" element={<Services/>}/>
            
            <Route path="/login" element={<Login/>}/>
            
            <Route path="/dashboard" element={<DashboardLayout/>}/>
        </Routes>
    </>
}

export default AppRoutes;