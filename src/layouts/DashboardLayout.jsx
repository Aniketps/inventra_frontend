import MainLayout from "./MainLayout";
import { SectionBar, MainHeader, TitledIndicator } from "../components/mainComponent";
import { useState, useEffect } from "react";
import { useLocation, useNavigate, useNavigation } from "react-router-dom";
import Cookies from "js-cookie";
import VerifyEntry from "../services/validateUserEntry.jsx";
import { Categories, Invoice, Wholesalers, Products, Purchases, Sales, Stocks, Customers, Analysis } from "../pages/Pages.jsx";

function DashboardLayout() {

    const location = useLocation();
    const natigator = useNavigate();
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        setLoading(true);
        (
            async () => {
                const token = Cookies.get("token");
                console.log(token);
                if (!token) natigator("/login");
                const isValid = await VerifyEntry();
                if (!isValid) {
                    Cookies.remove("token");
                    natigator("/login");
                };
            }
        )();
        setLoading(false);
    });

    const [section, setSection] = useState({
        Analysis: true,
        Invoice: false,
        Categories: false,
        Stocks: false,
        Products: false,
        Wholesalers: false,
        Sales: false,
        Purchases: false,
        Customers: false,
    });

    const openSection = (sectionName) => {
        setSection(prev => ({ prev: false }));
        setSection(prev => ({ [sectionName]: true }));
    }

    return <>
        <style>{`
        .hide-scrollbar {
          -ms-overflow-style: none;  /* IE and Edge */
          scrollbar-width: none;     /* Firefox */
        }
        .hide-scrollbar::-webkit-scrollbar {
          display: none;             /* Chrome, Safari, Edge Chromium */
        }
      `}</style>
        <MainHeader />
        {
            loading
                ? <TitledIndicator Process="Authenticating..." />
                : <>
                    <div style={{ height: "90px" }} />
                    <div className="d-flex flex-row m-2 gap-2">
                        <div
                            className="d-flex flex-column p-3 gap-3 hide-scrollbar"
                            style={
                                {
                                    height: "85vh",
                                    minWidth: "350px",
                                    border: "1px solid #77777750",
                                    backgroundColor: "#1C1C1C",
                                    borderRadius: "10px",
                                    color: "white",
                                    flex: "22",
                                    overflowY: "auto",
                                    overflowX: "hidden",
                                    boxShadow: "1px 1px 2px #00009b8f",
                                    overflowX: "scroll",
                                    scrollBehavior: "smooth",
                                }
                            }>
                            <h1>Inventra</h1>
                            <SectionBar Title={"Analysis"} Image={"images/analysis.png"} ToggleIcon={section.Analysis ? "images/minus.png" : "images/plus.png"} openCallBack={openSection} />
                            <SectionBar Title={"Invoice"} Image={"images/invoice.png"} ToggleIcon={section.Invoice ? "images/minus.png" : "images/plus.png"} openCallBack={openSection} />
                            <SectionBar Title={"Categories"} Image={"images/categories.png"} ToggleIcon={section.Categories ? "images/minus.png" : "images/plus.png"} openCallBack={openSection} />
                            <SectionBar Title={"Stocks"} Image={"images/stocks.png"} ToggleIcon={section.Stocks ? "images/minus.png" : "images/plus.png"} openCallBack={openSection} />
                            <SectionBar Title={"Products"} Image={"images/products.png"} ToggleIcon={section.Products ? "images/minus.png" : "images/plus.png"} openCallBack={openSection} />
                            <SectionBar Title={"Wholesalers"} Image={"images/wholesalers.png"} ToggleIcon={section.Wholesalers ? "images/minus.png" : "images/plus.png"} openCallBack={openSection} />
                            <SectionBar Title={"Sales"} Image={"images/sales.png"} ToggleIcon={section.Sales ? "images/minus.png" : "images/plus.png"} openCallBack={openSection} />
                            <SectionBar Title={"Purchases"} Image={"images/purchases.png"} ToggleIcon={section.Purchases ? "images/minus.png" : "images/plus.png"} openCallBack={openSection} />
                            <SectionBar Title={"Customers"} Image={"images/customers.png"} ToggleIcon={section.Customers ? "images/minus.png" : "images/plus.png"} openCallBack={openSection} />
                        </div>
                        <div style={{ flex: "80" }}>
                            {
                                section.Analysis && <Analysis />
                            }
                            {
                                section.Invoice && <Invoice />
                            }
                            {
                                section.Categories && <Categories />
                            }
                            {
                                section.Stocks && <Stocks openCallBack={openSection} />
                            }
                            {
                                section.Products && <Products />
                            }
                            {
                                section.Wholesalers && <Wholesalers />
                            }
                            {
                                section.Sales && <Sales openCallBack={openSection} />
                            }
                            {
                                section.Purchases && <Purchases />
                            }
                            {
                                section.Customers && <Customers />
                            }
                        </div>
                    </div>
                </>
        }
    </ >
}

export default DashboardLayout;