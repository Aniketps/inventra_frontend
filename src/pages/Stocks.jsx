import DashboardLayout from "../layouts/DashboardLayout.jsx";
import { Forbidden, TitledIndicator, Button, SimpleInput, SimpleStatusContainer, MainForm, UAForm, SimpleDropDown } from "../components/mainComponent.jsx";
import VerifyEntry from "../services/validateUserEntry.jsx"
import { useEffect, useState } from "react";
import { AllProducts } from "../services/productService.jsx";
import { AllWholesalers } from "../services/wholesalerService.jsx";
import { useNavigate } from "react-router-dom";
import { UpdateStock, DeleteStock, AllStocks } from "../services/stockService.jsx";

function Stocks() {
    const [authStatus, setAuthStatus] = useState(null);
    const [stocks, setStocks] = useState([]);
    const [loading, setLoading] = useState(true);
    const [page, setPage] = useState('1');
    const [statusData, setStatusData] = useState({});
    const [confirmation, setConfimation] = useState(false);
    const [newForm, setNewForm] = useState(false);
    const [updateForm, setUpdateForm] = useState(false);

    const [updateStockProductData, setUpdateStockProductData] = useState({});

    const [searchProduct, setSearchProduct] = useState("-");
    const [searchWholesalerName, setSearchWholesalerName] = useState("-");

    const [wholesalers, setWholesalers] = useState([]);
    const [filterWholesalers, setFilterWholesalers] = useState([]);
    const [products, setProducts] = useState([]);

    const columns = ["Sr. No", "Product", "Wholesaler", "Stock", "Selling Price", "Total", "Update", "Delete"];

    const natigate = useNavigate();

    useEffect(() => {
        let timed;
        const Verify = async () => {
            const result = await VerifyEntry();
            setAuthStatus(result);
            if (result) {
                timed = setTimeout(() => {
                    fetchStocks();
                }, 1000);
            }
        };
        Verify();
        return ()=>{
            if (timed) clearTimeout(timed);
        };
    }, [confirmation, searchProduct, searchWholesalerName]);

    const update = async () => {
        setLoading(true);
        try {
            const response = await UpdateStock(updateStockProductData.stockID, updateStockProductData.productID, updateStockProductData.stock, updateStockProductData.sellingPrice, updateStockProductData.wholesalerID);
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

    const updateStock = async (...data) => {
        await setUpdateStockProductData(data[0]);
        setUpdateForm(true);
    }

    const deleteStock = (id) => {
        const del = async () => {
            setLoading(true);
            try {
                const response = await DeleteStock(id);
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

    const fetchStocks = async () => {
        setLoading(true);
        try {

            const response3 = await AllStocks(searchProduct, searchWholesalerName);
            if (response3.status === 200) {
                setStocks(response3.data.data);
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
                        value: data.productID
                    }));
                    productData = [...productData, ...pageData];
                }
                setProducts(productData);
            }
            const response2 = await AllWholesalers('-', '-', '-', '-', '-');
            if (response2.status === 200) {
                let wholesalerData = [];
                const keys = Object.keys(response2.data.data);
                for (let i = 0; i < keys.length; i++) {
                    const page = keys[i];
                    const pageData = response2.data.data[page].map(data => ({
                        ...data,
                        key: data.wholesalerName,
                        value: data.wholesalerName
                    }));
                    wholesalerData = [...wholesalerData, ...pageData];
                }
                setFilterWholesalers(wholesalerData);
            }
            const response4 = await AllWholesalers('-', '-', '-', '-', '-');
            if (response4.status === 200) {
                let wholesalerData = [];
                const keys = Object.keys(response4.data.data);
                for (let i = 0; i < keys.length; i++) {
                    const page = keys[i];
                    const pageData = response4.data.data[page].map(data => ({
                        ...data,
                        key: data.wholesalerName,
                        value: data.wholesalerID
                    }));
                    wholesalerData = [...wholesalerData, ...pageData];
                }
                setWholesalers(wholesalerData);
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
            if (parseInt(page) + 1 <= Object.keys(stocks).length) {
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
                ? <DashboardLayout>
                    {
                        loading
                            ? <TitledIndicator Process="Loading Data..." />
                            : Object.keys(stocks).length == 0
                                ? <>
                                    <div
                                        className="d-flex flex-column justify-content-center align-items-center"
                                        style={{ height: "90vh", width: "100%", color: "white" }}
                                    >
                                        <h2>No Stocks Found</h2>
                                        <Button Title="New Stock" Color="#0069d9" BGColor="transferant" BRColor="#0069d9" OnClick={() => natigate('/purchases')} />
                                    </div>
                                </>
                                : <MainForm Title="Stocks" SearchHint="Search Product Name" ButtonTitle="Add Stock" Filters={[
                                    <SimpleDropDown Title="Select Wholesaler" Options={filterWholesalers} BGColor="#0f0f0f" BSColor="#77777750" BRR="10" H="50" BRColor="#77777750" Flex="1" Color="white" CallBack={setSearchWholesalerName} />
                                ]} Columns={['stockID', columns]} DataFields={["productName", "wholesalerName", "stock", "sellingPrice", "totalCost"]} Data={[stocks[page]]} Page={Paging} Update={updateStock} Delete={deleteStock} Add={() => natigate('/purchases')} Search={searchProduct} SetSearch={setSearchProduct} />
                    }
                </DashboardLayout>
                : <Forbidden />
        }
        {
            confirmation ? <SimpleStatusContainer Message={statusData.Message} Desc={statusData.Desc} Buttons={statusData.Buttons} /> : <></>
        }

        {
            updateForm ? <UAForm Title={"Update Stock"} Inputs={[
                <SimpleDropDown Title="Select Product" Options={products} BGColor="#0f0f0f" BSColor="#77777750" BRR="10" H="50" BRColor="#77777750" Flex="1" Color="white" CallBack={(val) => setUpdateStockProductData((prev) => ({ ...prev, productID: val }))} />,
                <SimpleInput Text="Qunatity" BGColor="#0f0f0f" BSColor="#77777750" BRR="10" H="50" BRColor="#77777750" Color="white" Type="number" Value={updateStockProductData.stock} CallBack={(val) => setUpdateStockProductData((prev => ({ ...prev, stock: val })))} Disabled={false} />,
                <SimpleInput Text="Product Name" BGColor="#0f0f0f" BSColor="#77777750" BRR="10" H="50" BRColor="#77777750" Color="white" Type="number" Value={updateStockProductData.sellingPrice} CallBack={(val) => setUpdateStockProductData((prev => ({ ...prev, sellingPrice: val })))} Disabled={false} />,
                <SimpleDropDown Title="Select Wholesaler" Options={wholesalers} BGColor="#0f0f0f" BSColor="#77777750" BRR="10" H="50" BRColor="#77777750" Flex="1" Color="white" CallBack={(val) => setUpdateStockProductData((prev) => ({ ...prev, wholesalerID: val }))} />
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

export default Stocks;