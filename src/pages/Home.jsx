import MainLayout from "../layouts/MainLayout.jsx";
import { useEffect, useRef } from "react";
import "https://cdnjs.cloudflare.com/ajax/libs/three.js/r121/three.min.js";
import "https://cdn.jsdelivr.net/npm/vanta@latest/dist/vanta.net.min.js";
import { Button } from "../components/mainComponent.jsx";
import "@fontsource/averia-serif-libre";
import { useNavigate } from "react-router-dom";
import { ButtonWithIcon, ServiceCard } from "../components/mainComponent.jsx";

function Home() {

    const globeRef = useRef(null);

    let navigate = useNavigate();

    useEffect(() => {
        const effect = VANTA.NET({
            el: globeRef.current,
            mouseControls: true,
            touchControls: true,
            gyroControls: false,
            minHeight: 200.00,
            minWidth: 200.00,
            scale: 1.00,
            scaleMobile: 1.00,
            color: 0xbbd600,
            backgroundColor: 0x101010,
            points: 14.00,
            maxDistance: 15.00,
            spacing: 20.00
        });

        return () => {
            if (effect) effect.destroy();
        };
    }, []);

    const Services = [
        {
            name: "Inventory Tracking",
            desc: "Real-time tracking of stock levels, Location-based inventory tracking",
            url: "images/Inventory Tracking.png"
        },
        {
            name: "Stock Control",
            desc: "Supplier integration for easy reordering, Purchase order generation",
            url: "images/Stock Control.png"
        },
        {
            name: "Reporting & Analytics",
            desc: "Stock movement reports, Inventory valuation reports",
            url: "images/Reporting & Analytics.png"
        },
        {
            name: "Sales & Order Management",
            desc: "Supplier integration for easy reordering, Purchase order generation",
            url: "images/Sales & Order Management.png"
        },
        {
            name: "Supplier Management",
            desc: "Supplier contact and location management, Supplier lead time tracking",
            url: "images/Supplier Management.png"
        }
    ];

    const openCall =() => {
        window.location.href = "tel:+9022270236";
    };
    
    const openWhatsapp =() => {
        window.open("https://wa.me/9022270236", "_blank");
    };

    let isMobile = window.innerWidth <= 450;

    return <>
        <MainLayout>
            <div style={{ width: "100%", height: "600px" }}>
                <div ref={globeRef} className="earth w-100 h-100 d-flex flex-column align-items-center justify-content-center">
                    <div className={`gap-3 w-${isMobile ? 100 : 50} d-flex flex-column align-items-center justify-content-between`} style={{ color: "white" }}>
                        <h1 style={{ fontFamily: "'Italiana'", fontSize: "80px" }}>Inventra</h1>
                        <h3 style={{ textAlign: "center" }}>Manage Your Stuff in Easiest Way, Full Control Over your business...</h3>
                        <Button Title="View Products" Color="#FFFFFF" BGColor="#000000" BRColor="#777777" OnClick={null} />
                    </div>
                </div>
            </div>
            <div className="p-4 d-flex flex-column align-items-center justify-content-center" style={{ width: "100%", height: "auto", margin: "auto" }}>
                <h1 style={{ fontFamily: "'Italiana'", color: "white", letterSpacing: "5px" }}>Services We Offer</h1>
                <div className="services py-3 d-flex flex-row align-items-center justify-content-center gap-5" style={{ flexWrap: "wrap", width: "80%" }}>
                    {Services.map((row) => <ServiceCard Title={row.name} Description={row.desc} URL={row.url} />)}
                </div>
            </div>
            <div className="d-flex flex-column align-items-center justify-content-center" style={{ width: "100%", height: "auto", color: "white", margin: "auto", padding: "120px 20px" }}>
                <h1 style={{ fontFamily: "'Italiana'", color: "white", letterSpacing: "5px" }}>About Us</h1>
                <p>Started In : 2025</p>
                <p style={{ textAlign: "center", width: `${isMobile ? "100%" : "75%"}`, fontFamily: "'Ruluko'", fontSize: `${isMobile ? "16px" : "26px"}` }}>We provide a smart and reliable Inventory Management System designed to help businesses streamline their stock operations, reduce waste, and maximize efficiency. Our platform offers real-time tracking, automated stock control, and insightful analytics to support better decision-making. Whether you're managing a small warehouse or a large supply chain, our system adapts to your needs—ensuring you never lose track of your inventory.</p>
            </div>
            {
                !isMobile
                    ? <>
                    <div style={{ width: "100%", height : "450px"}}>
                        <div style={{ width: "100%", height : "450px", position : "absolute"}}>
                            <div className={`d-flex flex-row align-items-start justify-content-center`} style={{ width: "100%", backgroundColor: "#e7e7e7" }}>
                                <div style={{ width: "60%", padding: "10px 0 0 200px" }}>
                                    <h1 style={{ fontFamily: "'Italiana', serif" }}>Inventra</h1>
                                    <p style={{ fontFamily: "'Averia Serif Libre', serif", fontSize: "26px" }}>We're here to help 24/7</p>
                                    <p style={{ fontFamily: "'Averia Serif Libre', serif", fontSize: "22px" }}>Our support team is trained and enthusiastic to assist you—whether it's a simple stock adjustment or implementing a full-scale inventory management solution.</p>
                                </div>
                                <div style={{ width: "40%" }}>
                                    <img src="images/man.png" alt="man" style={{ width: "406px" }} />
                                </div>
                            </div>
                            <div className="p-3 d-flex gap-2 flex-row" style={{ width : "700px", flexWrap : "nowrap", height : "220px", backgroundColor : "white", position : "absolute", left : "250px", bottom : "0" }}>
                                <div className="h-100 d-flex flex-column justify-content-between" style={{ flex : "1"}}>
                                    <h3 className="p-0 m-0" style={{ fontFamily: "'Averia Serif Libre', serif", fontSize: "26px" }}>CALL US</h3>
                                    <p className="p-0 m-0" style={{ fontFamily: "'Averia Serif Libre', serif", fontSize: "20px" }}>Contact our support team</p>
                                    <p className="p-0 m-0" style={{ fontFamily: "'Averia Serif Libre', serif", fontSize: "20px" }}>+91 9022270236</p>
                                    <p className="p-0 m-0" style={{ fontFamily: "'Averia Serif Libre', serif", fontSize: "20px" }}>Everyday 9:00 am - 7:00 pm.</p>
                                    <div className="d-flex flex-row gap-2">
                                        <ButtonWithIcon Title="Contact Us" Color="white" BGColor="black" BRColor="black" OnClick={()=>openCall} Icon="/images/contact.png" Width="50" />
                                        <ButtonWithIcon Title="WhatsApp" Color="black" BGColor="white" BRColor="black" OnClick={()=>openWhatsapp} Icon="/images/whatsapp.png" Width="50" />
                                    </div>
                                </div>
                                <div className="h-100 rounded" style={{ flex : "1", border : "1px solid black" }}>
                                    <iframe src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d1548.4616299090649!2d73.80215253031153!3d18.481220308985655!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x3bc2bfeb853d4691%3A0x56f1a2e46627167!2sGiri&#39;s%20TECH%20HUB%20Pvt%20Ltd!5e0!3m2!1sen!2sin!4v1754823878154!5m2!1sen!2sin" style={{ border:'0' }} className="w-100 h-100 rounded" allowFullScreen="" loading="lazy" referrerPolicy="no-referrer-when-downgrade"></iframe>
                                </div>
                            </div>
                        </div>
                    </div>
                    </>
                    : <>
                    <div style={{ width: "100%", height : "520px"}}>
                        <div className={`d-flex flex-column align-items-center justify-content-center`} style={{ width: "100%", height : "450px"}}>
                            <div className={`d-flex flex-row align-items-start justify-content-center`} style={{ width: "100%", backgroundColor: "#e7e7e7" }}>
                                <div style={{ width: "100%", padding: "10px 0 0 20px" }}>
                                    <h1 style={{ fontFamily: "'Italiana', serif" }}>Inventra</h1>
                                    <p style={{ fontFamily: "'Averia Serif Libre', serif", fontSize: "22px" }}>We're here to help 24/7</p>
                                    <p style={{ fontFamily: "'Averia Serif Libre', serif", fontSize: "16px" }}>Our support team is trained and enthusiastic to assist you—whether it's a simple stock adjustment or implementing a full-scale inventory management solution.</p>
                                </div>
                            </div>
                            <div className="p-3 d-flex gap-2 flex-column" style={{ width : "100%", flexWrap : "nowrap", height : "420px", backgroundColor : "white", left : "250px", bottom : "0" }}>
                                <div className="h-100 d-flex flex-column justify-content-between" style={{ flex : "1"}}>
                                    <h3 className="p-0 m-0" style={{ fontFamily: "'Averia Serif Libre', serif", fontSize: "24px" }}>CALL US</h3>
                                    <p className="p-0 m-0" style={{ fontFamily: "'Averia Serif Libre', serif", fontSize: "16px" }}>Contact our support team</p>
                                    <p className="p-0 m-0" style={{ fontFamily: "'Averia Serif Libre', serif", fontSize: "16px" }}>+91 9022270236</p>
                                    <p className="p-0 m-0" style={{ fontFamily: "'Averia Serif Libre', serif", fontSize: "16px" }}>Everyday 9:00 am - 7:00 pm.</p>
                                    <div className="d-flex flex-column gap-2">
                                        <ButtonWithIcon Title="Contact Us" Color="white" BGColor="black" BRColor="black" OnClick={()=>openCall} Icon="/images/contact.png" Width="100" />
                                        <ButtonWithIcon Title="WhatsApp" Color="black" BGColor="white" BRColor="black" OnClick={()=>openWhatsapp} Icon="/images/whatsapp.png" Width="100" />
                                    </div>
                                </div>
                                <div className="w-100 h-100 rounded" style={{ flex : "1", border : "1px solid black" }}>
                                    <iframe src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d1548.4616299090649!2d73.80215253031153!3d18.481220308985655!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x3bc2bfeb853d4691%3A0x56f1a2e46627167!2sGiri&#39;s%20TECH%20HUB%20Pvt%20Ltd!5e0!3m2!1sen!2sin!4v1754823878154!5m2!1sen!2sin" style={{ border:'0' }} className="w-100 h-100 rounded" allowFullScreen loading="lazy" referrerPolicy="no-referrer-when-downgrade"></iframe>
                                </div>
                            </div>
                        </div>
                    </div>
                    </>
            }
        </MainLayout>
    </>
}

export default Home;