import DashboardLayout from "../layouts/DashboardLayout.jsx";
import { Forbidden, TitledIndicator, Button, SimpleInput, SimpleStatusContainer, MainForm, UAForm, SimpleDropDown } from "../components/mainComponent.jsx";
import VerifyEntry from "../services/validateUserEntry.jsx"
import { useEffect, useState } from "react";
import { AllCustomers } from "../services/customerService.jsx";
import { AllCategories, SearchCategories } from "../services/categoryService.jsx";
import { AllProducts } from "../services/productService.jsx";
import { UpdateSale, DeleteSale, AllSales } from "../services/salesService.jsx";
import { AllStocks } from "../services/stockService.jsx";
import { useNavigate } from "react-router-dom";

function Sales({openCallBack}) {
    const [authStatus, setAuthStatus] = useState(null);
    const [loading, setLoading] = useState(true);
    const [page, setPage] = useState('1');
    const [statusData, setStatusData] = useState({});
    const [confirmation, setConfimation] = useState(false);
    const [newForm, setNewForm] = useState(false);
    const [updateForm, setUpdateForm] = useState(false);
    
    const [updateSaleData, setUpdateSaleData] = useState({});
    
    const [searchCustomer, setSearchCustomer] = useState("-");
    const [searchCategory, setSearchCategory] = useState("-");
    const [searchProduct, setSearchProduct] = useState("-");
    const [searchDate, setSearchDate] = useState("-");
    
    const [customers, setCustomers] = useState([]);
    const [stocks, setStocks] = useState([]);
    const [products, setProducts] = useState([]);
    const [categories, setCategroies] = useState([]);
    const [sales, setSales] = useState([]);

    const columns = ["Sr. No", "Customer", "Contact", "Product", "Category", "Wholesaler", "Quantity", "Discount", "Tax", "Total Bill", "Date", "Update", "Delete"];

    const natigate = useNavigate();

    useEffect(() => {
        let timed;
        (
            async () => {
                const result = await VerifyEntry();
                setAuthStatus(result);
                if (result) {
                    const timed = setTimeout(() => {
                        fetchSales();
                    }, 1000);
                }
            }
        )();
        if (timed) return () => clearTimeout(timed);
    }, [confirmation, searchCustomer, searchCategory, searchProduct, searchDate]);

    const update = async () => {
        setLoading(true);
        try {
            const response = await UpdateSale(updateSaleData.saleID, updateSaleData.stockID, updateSaleData.quantity, updateSaleData.discount, updateSaleData.tax, updateSaleData.totalBill, updateSaleData.customerID);
            if (response.status === 200) {
                setStatusData({
                    "Message": "Updated Successfully",
                    "Desc": "Record Has been Updated Successfully...",
                    "Buttons": [
                        {
                            Title: "Close",
                            Color: "white",
                            BGColor: "#0069d9",
                            BRColor: "#0069d9",
                            OnClick: () => setConfimation(false)
                        }
                    ]
                });
                setConfimation(true);
            } else {
                setStatusData({
                    "Message": "Failed To Updated",
                    "Desc": response.response.data.message,
                    "Buttons": [
                        {
                            Title: "Close",
                            Color: "white",
                            BGColor: "#0069d9",
                            BRColor: "#0069d9",
                            OnClick: () => setConfimation(false)
                        }
                    ]
                });
                setConfimation(true);
            }
        } catch (error) {
            setStatusData({
                "Message": "Failed To Updated",
                "Desc": response.response.data.message,
                "Buttons": [
                    {
                        Title: "Close",
                        Color: "white",
                        BGColor: "#0069d9",
                        BRColor: "#0069d9",
                        OnClick: () => setConfimation(false)
                    }
                ]
            });
            setConfimation(true);
        } finally {
            setLoading(false);
        }
    }

    const updateConfirmation = () => {
        setUpdateForm(false);
        setStatusData({
            "Message": "Are You Sure?",
            "Desc": "Sure you want to Update the record?",
            "Buttons": [
                {
                    Title: "Cancel",
                    Color: "white",
                    BGColor: "#11b112",
                    BRColor: "#11b112",
                    OnClick: () => setConfimation(false)
                },
                {
                    Title: "Update",
                    Color: "white",
                    BGColor: "#ff0000",
                    BRColor: "#ff0000",
                    OnClick: update
                },
            ]
        });
        setConfimation(true);
    };

    const updateSale = async (...data) => {
        await setUpdateSaleData(data[0]);
        setUpdateForm(true);
    }

    const deleteSale = (id) => {
        const del = async () => {
            setLoading(true);
            try {
                const response = await DeleteSale(id);
                if (response.status === 200) {
                    setStatusData({
                        "Message": "Deleted Successfully",
                        "Desc": "Record Has been Deleted Successfully... ",
                        "Buttons": [
                            {
                                Title: "Close",
                                Color: "white",
                                BGColor: "#0069d9",
                                BRColor: "#0069d9",
                                OnClick: () => setConfimation(false)
                            }
                        ]
                    });
                    setConfimation(true);
                }
            } catch (error) {
                setStatusData({
                    "Message": "Failed To Delete",
                    "Desc": error,
                    "Buttons": [
                        {
                            Title: "Close",
                            Color: "white",
                            BGColor: "#0069d9",
                            BRColor: "#0069d9",
                            OnClick: () => setConfimation(false)
                        }
                    ]
                });
                setConfimation(true);
            } finally {
                setLoading(false);
            }
        };

        setStatusData({
            "Message": "Are You Sure?",
            "Desc": "Sure you want to delete the record?",
            "Buttons": [
                {
                    Title: "Cancel",
                    Color: "white",
                    BGColor: "#11b112",
                    BRColor: "#11b112",
                    OnClick: () => setConfimation(false)
                },
                {
                    Title: "Delete",
                    Color: "white",
                    BGColor: "#ff0000",
                    BRColor: "#ff0000",
                    OnClick: del
                },
            ]
        });

        setConfimation(true);
    }

    const fetchSales = async () => {
        setLoading(true);
        try {
            const response3 = await AllSales(searchCustomer, searchDate, searchCategory, '-', searchProduct);
            if (response3.status === 200) {
                if(Object.keys(response3.data.data).length === 0){
                    setSales({1:[]});
                }else{
                    setSales(response3.data.data);
                }
            }
            const response1 = await AllProducts('-', '-', '-');
            if (response1.status === 200) {
                let productData = [];
                const keys = Object.keys(response1.data.data);
                for (let i = 0; i < keys.length; i++) {
                    const page = keys[i];
                    const pageData = response1.data.data[page].map(data => ({
                        ...data,
                        key: data.productName,
                        value: data.productName
                    }));
                    productData = [...productData, ...pageData];
                }
                setProducts(productData);
            }else{
                console.log("Failed to get Products");
            }
            const response2 = await AllCategories('-', '-');
            if (response2.status === 200) {
                let categoriesData = [];
                const keys = Object.keys(response2.data.data);
                for (let i = 0; i < keys.length; i++) {
                    const page = keys[i];
                    const pageData = response2.data.data[page].map(data => ({
                        ...data,
                        key: data.categoryName,
                        value: data.categoryName
                    }));
                    categoriesData = [...categoriesData, ...pageData];
                }
                setCategroies(categoriesData);
            }else{
                console.log("Failed to get Categories");
            }
            const response4 = await AllCustomers('-', '-','-', '-','-');
            if (response4.status === 200) {
                let customersData = [];
                const keys = Object.keys(response4.data.data);
                for (let i = 0; i < keys.length; i++) {
                    const page = keys[i];
                    const pageData = response4.data.data[page].map(data => ({
                        ...data,
                        key: data.customerName,
                        value: data.customerID
                    }));
                    customersData = [...customersData, ...pageData];
                }
                setCustomers(customersData);
            }else{
                console.log("Failed to get Customers");
            }
            const response5 = await AllStocks('-', '-');
            if (response5.status === 200) {
                let stockData = [];
                const keys = Object.keys(response5.data.data);
                for (let i = 0; i < keys.length; i++) {
                    const page = keys[i];
                    const pageData = response5.data.data[page].map(data => ({
                        ...data,
                        key: data.productName,
                        value: data.stockID
                    }));
                    stockData = [...stockData, ...pageData];
                }
                setStocks(stockData);
            }else{
                console.log("Failed to get Stocks");
            }
        } catch (error) {
        } finally {
            setLoading(false);
        }
    };

    if (authStatus === null) {
        return <TitledIndicator Process="Loading..." />
    }

    const Paging = (pageNo) => {
        if (pageNo === 1) {
            if (parseInt(page) + 1 <= Object.keys(sales).length) {
                setPage(prev => `${parseInt(prev) + pageNo}`)
            }
        } else {
            if (page !== '1') {
                setPage(prev => `${parseInt(prev) + pageNo}`)
            }
        }
    }

    return <>
        {
            authStatus
                ? <div>
                    {
                        loading
                            ? <TitledIndicator Process="Loading Sales..." />
                            : Object.keys(sales).length == 0
                                ? <>
                                    <div
                                        className="d-flex flex-column justify-content-center align-items-center"
                                        style={{ height: "90vh", width: "100%", color: "white" }}
                                    >
                                        <h2>No Sales Found</h2>
                                        <Button Title="New Sale" Color="#0069d9" BGColor="transferant" BRColor="#0069d9" OnClick={() => openCallBack("Invoice")} />
                                    </div>
                                </>
                                : <MainForm Title="Sales" SearchHint="Search Customer Name" ButtonTitle="Add Sale" Filters={[
                                    <SimpleInput Text="Date" BGColor="#0f0f0f" BSColor="#77777750" BRR="10" H="40" BRColor="#77777750" Color="white" Type="date" Value={searchDate == '-'? "" : searchDate} CallBack={setSearchDate} Disabled={false} />,
                                    <SimpleDropDown Title="Select Category" Options={categories} BGColor="#0f0f0f" BSColor="#77777750" BRR="10" H="50" BRColor="#77777750" Flex="1" Color="white" CallBack={setSearchCategory} />,
                                    <SimpleDropDown Title="Select Product" Options={products} BGColor="#0f0f0f" BSColor="#77777750" BRR="10" H="50" BRColor="#77777750" Flex="1" Color="white" CallBack={setSearchProduct} />,
                                ]} Columns={['saleID', columns]} DataFields={["customerName", "phone", "productName", "categoryName", "wholesalerName", "quantity", "discount", "tax", "totalBill", "purchaseDate"]} Data={[sales[page]]} Page={Paging} Update={updateSale} Delete={deleteSale} Add={() => openCallBack("Invoice")} Search={searchCustomer} SetSearch={setSearchCustomer} />
                    }
                </div>
                : <Forbidden />
        }
        {
            confirmation ? <SimpleStatusContainer Message={statusData.Message} Desc={statusData.Desc} Buttons={statusData.Buttons} /> : <></>
        }

        {
            updateForm ? <UAForm Title={"Update Sale"} Inputs={[
                <SimpleDropDown Title="Select Stock" Options={stocks} BGColor="#0f0f0f" BSColor="#77777750" BRR="10" H="50" BRColor="#77777750" Flex="1" Color="white" CallBack={(val)=>setUpdateSaleData((prev)=> ({...prev, stockID : val}))} id={updateSaleData.stockID}/>,
                <SimpleInput Text="Qunatity" BGColor="#0f0f0f" BSColor="#77777750" BRR="10" H="50" BRColor="#77777750" Color="white" Type="number" Value={updateSaleData.quantity} CallBack={(val) => setUpdateSaleData((prev => ({ ...prev, quantity: val })))} Disabled={false} />,
                <SimpleInput Text="Discount" BGColor="#0f0f0f" BSColor="#77777750" BRR="10" H="50" BRColor="#77777750" Color="white" Type="number" Value={updateSaleData.discount} CallBack={(val) => setUpdateSaleData((prev => ({ ...prev, stock: val })))} Disabled={false} />,
                <SimpleInput Text="Tax" BGColor="#0f0f0f" BSColor="#77777750" BRR="10" H="50" BRColor="#77777750" Color="white" Type="number" Value={updateSaleData.tax} CallBack={(val) => setUpdateSaleData((prev => ({ ...prev, tax: val })))} Disabled={false} />,
                <SimpleInput Text="Total Bill" BGColor="#0f0f0f" BSColor="#77777750" BRR="10" H="50" BRColor="#77777750" Color="white" Type="number" Value={updateSaleData.totalBill} CallBack={(val) => setUpdateSaleData((prev => ({ ...prev, totalBill: val })))} Disabled={false} />,
                <SimpleDropDown Title="Select Customer" Options={customers} BGColor="#0f0f0f" BSColor="#77777750" BRR="10" H="50" BRColor="#77777750" Flex="1" Color="white" CallBack={(val)=>setUpdateSaleData((prev)=> ({...prev, customerID : val}))} id={updateSaleData.customerID}/>
            ]} Buttons={[
                {
                    Title: "Cancel",
                    Color: "#11b112",
                    BGColor: "transferant",
                    BRColor: "#11b112",
                    OnClick: () => setUpdateForm(false)
                },
                {
                    Title: "Confirm",
                    Color: "#ff0000",
                    BGColor: "transferant",
                    BRColor: "#ff0000",
                    OnClick: () => updateConfirmation()
                },
            ]} /> : <></>
        }
    </>
}

export default Sales;