import MainLayout from "../layouts/MainLayout.jsx";
import { ServiceCard } from "../components/mainComponent.jsx";

function Services(){
        const services = [
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
    return <>
    <MainLayout>
        <div className="p-4 d-flex flex-column align-items-center justify-content-center" style={{ width: "100%", height: "auto", margin: "auto" }}>
                <h1 style={{ fontFamily: "'Italiana'", color: "white", letterSpacing: "5px" }}>Services We Offer</h1>
                <div className="services py-3 d-flex flex-row align-items-center justify-content-center gap-5" style={{ flexWrap: "wrap", width: "80%" }}>
                    {services.map((row) => <ServiceCard Title={row.name} Description={row.desc} URL={row.url} />)}
                </div>
            </div>
    </MainLayout>
    </>
}

export default Services;