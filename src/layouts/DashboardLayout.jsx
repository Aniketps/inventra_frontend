import MainLayout from "./MainLayout";
import { SectionBar } from "../components/mainComponent";
import { useState, useEffect } from "react";
import { NavLink, useLocation } from "react-router-dom";

function DashboardLayout({ children }) {

    const location = useLocation();

    const [Invoice, setInvoice] = useState({
        "Title": "Invoice",
        "Image": "images/invoice.png",
        "ToggleIcon": true,
        "Path": "/invoice"
    });

    const [Categories, setCategories] = useState({
        "Title": "Categories",
        "Image": "images/categories.png",
        "ToggleIcon": false,
        "Path": "/categories"
    })
    const [Stocks, setStocks] = useState({
        "Title": "Stocks",
        "Image": "images/stocks.png",
        "ToggleIcon": false,
        "Path": "/stocks"
    })
    const [Products, setProducts] = useState({
        "Title": "Products",
        "Image": "images/products.png",
        "ToggleIcon": false,
        "Path": "/products"
    })
    const [Wholesalers, setWholesalers] = useState({
        "Title": "Wholesalers",
        "Image": "images/wholesalers.png",
        "ToggleIcon": false,
        "Path": "/wholesalers"
    })
    const [Sales, setSales] = useState({
        "Title": "Sales",
        "Image": "images/sales.png",
        "ToggleIcon": false,
        "Path": "/sales"
    })
    const [Purchases, setPurchases] = useState({
        "Title": "Purchases",
        "Image": "images/purchases.png",
        "ToggleIcon": false,
        "Path": "/purchases"
    })

    useEffect(() => {
        setInvoice(prev => ({ ...prev, ToggleIcon: false }));
        setCategories(prev => ({ ...prev, ToggleIcon: false }));
        setStocks(prev => ({ ...prev, ToggleIcon: false }));
        setProducts(prev => ({ ...prev, ToggleIcon: false }));
        setWholesalers(prev => ({ ...prev, ToggleIcon: false }));
        setSales(prev => ({ ...prev, ToggleIcon: false }));
        setPurchases(prev => ({ ...prev, ToggleIcon: false }));

        switch (location.pathname) {
            case Invoice.Path:
                setInvoice(prev => ({ ...prev, ToggleIcon: true }));
                break;
            case Categories.Path:
                setCategories(prev => ({ ...prev, ToggleIcon: true }));
                break;
            case Stocks.Path:
                setStocks(prev => ({ ...prev, ToggleIcon: true }));
                break;
            case Products.Path:
                setProducts(prev => ({ ...prev, ToggleIcon: true }));
                break;
            case Wholesalers.Path:
                setWholesalers(prev => ({ ...prev, ToggleIcon: true }));
                break;
            case Sales.Path:
                setSales(prev => ({ ...prev, ToggleIcon: true }));
                break;
            case Purchases.Path:
                setPurchases(prev => ({ ...prev, ToggleIcon: true }));
                break;
            default:
        }
    }, [location.pathname]);

    return <MainLayout>
        <div className="d-flex flex-row m-2 gap-2">
            <div
                className="d-flex flex-column p-3 gap-3"
                style={
                    {
                        height: "auto",
                        width: "350px",
                        border: "1px solid #77777750",
                        backgroundColor: "#1C1C1C",
                        borderRadius: "10px",
                        color: "white",
                        flex : "22",
                        boxShadow : "1px 1px 2px #00009b8f"
                    }
                }>
                <h1>Inventra</h1>
                <NavLink onClick={() => ToggleSection(setInvoice)} style={{ textDecoration: "none", color: "white" }} to={Invoice.Path}>
                    <SectionBar Title={Invoice.Title} Image={Invoice.Image} ToggleIcon={Invoice.ToggleIcon ? "images/minus.png" : "images/plus.png"} />
                </NavLink>
                <NavLink onClick={() => ToggleSection(setCategories)} style={{ textDecoration: "none", color: "white" }} to={Categories.Path}>
                    <SectionBar Title={Categories.Title} Image={Categories.Image} ToggleIcon={Categories.ToggleIcon ? "images/minus.png" : "images/plus.png"} />
                </NavLink>
                <NavLink onClick={() => ToggleSection(setStocks)} style={{ textDecoration: "none", color: "white" }} to={Stocks.Path}>
                    <SectionBar Title={Stocks.Title} Image={Stocks.Image} ToggleIcon={Stocks.ToggleIcon ? "images/minus.png" : "images/plus.png"} />
                </NavLink>
                <NavLink onClick={() => ToggleSection(setProducts)} style={{ textDecoration: "none", color: "white" }} to={Products.Path}>
                    <SectionBar Title={Products.Title} Image={Products.Image} ToggleIcon={Products.ToggleIcon ? "images/minus.png" : "images/plus.png"} />
                </NavLink>
                <NavLink onClick={() => ToggleSection(setWholesalers)} style={{ textDecoration: "none", color: "white" }} to={Wholesalers.Path}>
                    <SectionBar Title={Wholesalers.Title} Image={Wholesalers.Image} ToggleIcon={Wholesalers.ToggleIcon ? "images/minus.png" : "images/plus.png"} />
                </NavLink>
                <NavLink onClick={() => ToggleSection(setSales)} style={{ textDecoration: "none", color: "white" }} to={Sales.Path}>
                    <SectionBar Title={Sales.Title} Image={Sales.Image} ToggleIcon={Sales.ToggleIcon ? "images/minus.png" : "images/plus.png"} />
                </NavLink>
                <NavLink onClick={() => ToggleSection(setPurchases)} style={{ textDecoration: "none", color: "white" }} to={Purchases.Path}>
                    <SectionBar Title={Purchases.Title} Image={Purchases.Image} ToggleIcon={Purchases.ToggleIcon ? "images/minus.png" : "images/plus.png"} />
                </NavLink>
            </div>
            <div style={{ flex : "80" }}>
                {children}
            </div>
        </div>
    </MainLayout >
}

export default DashboardLayout;