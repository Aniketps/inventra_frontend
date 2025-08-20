import DashboardLayout from "../layouts/DashboardLayout.jsx";
import { Forbidden, TitledIndicator, Button, SimpleInput, SimpleStatusContainer, MainForm, UAForm, SimpleDropDown } from "../components/mainComponent.jsx";
import VerifyEntry from "../services/validateUserEntry.jsx"
import { useEffect, useState } from "react";
import { AllWholesalerProductEntries, AddWholesalerProductEntry, DeleteWholesalerProductEntry, UpdateWholesalerProductEntry } from "../services/wholesalerProductEntryService.jsx";
import { AllProducts } from "../services/productService.jsx"
import { AllWholesalers } from "../services/wholesalerService.jsx"

function Purchases() {
    const [authStatus, setAuthStatus] = useState(null);
    const [loading, setLoading] = useState(true);
    const [page, setPage] = useState('1');
    const [statusData, setStatusData] = useState({});
    const [confirmation, setConfimation] = useState(false);
    const [newForm, setNewForm] = useState(false);
    const [updateForm, setUpdateForm] = useState(false);

    const [newProductID, setNewProductID] = useState('');
    const [newWholesalerID, setNewWholesalerID] = useState('');
    const [newCostPrice, setNewCostPrice] = useState('');
    const [newQuantity, setNewQuantity] = useState('');

    const [updatePurchaseData, setUpdatePurchaseData] = useState({});

    const [searchProductName, setSearchProductName] = useState("-");
    const [searchDate, setSearchDate] = useState("-");
    const [searchWholesalerName, setSearchWholesalerName] = useState("-");

    const [purchases, setPurchases] = useState([]);
    const [filterProducts, setFilterProducts] = useState([]);
    const [filterWholesalers, setFilterWholesalers] = useState([]);
    const [products, setProducts] = useState([]);
    const [wholesalers, setWholesalers] = useState([]);

    const columns = ["Sr. No", "Product", "Wholesaler", "Date", "Stock", "Cost Price", "Total Cost", "Update", "Delete"];

    useEffect(() => {
        let timed;
        (
            async () => {
                const result = await VerifyEntry();
                setAuthStatus(result);
                if (result) {
                    const timed = setTimeout(() => {
                        fetchPurchases();
                    }, 1000);
                }
            }
        )();
        if (timed) return () => clearTimeout(timed);
    }, [confirmation, searchProductName, searchDate, searchWholesalerName]);

    const update = async () => {
        setLoading(true);
        try {
            const response = await UpdateWholesalerProductEntry(updatePurchaseData.wholesalerProductID, updatePurchaseData.productID, updatePurchaseData.wholesalerID, updatePurchaseData.costPrice, updatePurchaseData.stock);
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

    const updatePurchase = async (...data) => {
        await setUpdatePurchaseData(data[0]);
        setUpdateForm(true);
    }

    const deletePurchase = (id) => {
        const del = async () => {
            setLoading(true);
            try {
                const response = await DeleteWholesalerProductEntry(id);
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

    const fetchPurchases = async () => {
        setLoading(true);
        try {
            const response = await AllWholesalerProductEntries(searchWholesalerName, searchProductName, searchDate);
            if (response.status === 200) {
                const purchaseData = response.data.data;
                setPurchases(purchaseData);
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
            } else {
                console.log("Failed to get Products");
            }
            const response2 = await AllProducts('-', '-', '-');
            if (response2.status === 200) {
                let productData = [];
                const keys = Object.keys(response2.data.data);
                for (let i = 0; i < keys.length; i++) {
                    const page = keys[i];
                    const pageData = response2.data.data[page].map(data => ({
                        ...data,
                        key: data.productName,
                        value: data.productName
                    }));
                    productData = [...productData, ...pageData];
                }
                setFilterProducts(productData);
            } else {
                console.log("Failed to get Products");
            }
            const response3 = await AllWholesalers('-', '-', '-', '-', '-');
            if (response3.status === 200) {
                let wholesalersData = [];
                const keys = Object.keys(response3.data.data);
                for (let i = 0; i < keys.length; i++) {
                    const page = keys[i];
                    const pageData = response3.data.data[page].map(data => ({
                        ...data,
                        key: data.wholesalerName,
                        value: data.wholesalerID
                    }));
                    wholesalersData = [...wholesalersData, ...pageData];
                }
                setWholesalers(wholesalersData);
            } else {
                console.log("Failed to get Wholesalers");
            }
            const response4 = await AllWholesalers('-', '-', '-', '-', '-');
            if (response4.status === 200) {
                let wholesalersData = [];
                const keys = Object.keys(response4.data.data);
                for (let i = 0; i < keys.length; i++) {
                    const page = keys[i];
                    const pageData = response4.data.data[page].map(data => ({
                        ...data,
                        key: data.wholesalerName,
                        value: data.wholesalerName
                    }));
                    wholesalersData = [...wholesalersData, ...pageData];
                }
                setFilterWholesalers(wholesalersData);
            } else {
                console.log("Failed to get Wholesalers");
            }
        } catch (error) {
        } finally {
            setLoading(false);
        }
    };

    async function addNewPurchase(productID, wholesalerID, cost, quantity) {
        setConfimation(false);
        const response = await AddWholesalerProductEntry(productID, wholesalerID, cost, quantity);
        if (response.status === 201) {
            setStatusData({
                "Message": "Added Successfully",
                "Desc": "Record Has been Added Successfully... ",
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
                "Message": "Failed To Add",
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
    }

    const isConfirmNewPurchase = () => {
        setNewForm(false);
        setStatusData({
            "Message": "Are You Sure?",
            "Desc": "Sure you want to add new record?",
            "Buttons": [
                {
                    Title: "Cancel",
                    Color: "white",
                    BGColor: "#11b112",
                    BRColor: "#11b112",
                    OnClick: () => setConfimation(false)
                },
                {
                    Title: "Confirm",
                    Color: "white",
                    BGColor: "#ff0000",
                    BRColor: "#ff0000",
                    OnClick: async () => await addNewPurchase(newProductID, newWholesalerID, newCostPrice, newQuantity)
                },
            ]
        });
        setConfimation(true);
    }

    if (authStatus === null) {
        return <TitledIndicator Process="Loading..." />
    }

    const Paging = (pageNo) => {
        if (pageNo === 1) {
            if (parseInt(page) + 1 <= Object.keys(purchases).length) {
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
                            : Object.keys(purchases).length == 0
                                ? <>
                                    <div
                                        className="d-flex flex-column justify-content-center align-items-center"
                                        style={{ height: "90vh", width: "100%", color: "white" }}
                                    >
                                        <h2>No Wholesalers Found</h2>
                                        <Button Title="New Purchase" Color="#0069d9" BGColor="transferant" BRColor="#0069d9" OnClick={() => setNewForm(true)} />
                                    </div>
                                </>
                                : <MainForm Title="Puchases" SearchHint="Search Product Name" ButtonTitle="Add Purchase" Filters={[
                                    <SimpleInput Text="Select Date" BGColor="#0f0f0f" BSColor="#77777750" BRR="10" H="40" BRColor="#77777750" Color="white" Type="date" Value={searchDate == '-' ? "" : searchDate} CallBack={setSearchDate} Disabled={false} />,
                                    <SimpleDropDown Title="Select Product" Options={filterProducts} BGColor="#0f0f0f" BSColor="#77777750" BRR="10" H="50" BRColor="#77777750" Flex="1" Color="white" CallBack={setSearchProductName} />,
                                    <SimpleDropDown Title="Select Wholesaler" Options={filterWholesalers} BGColor="#0f0f0f" BSColor="#77777750" BRR="10" H="50" BRColor="#77777750" Flex="1" Color="white" CallBack={setSearchWholesalerName} />,
                                ]} Columns={['wholesalerProductID', columns]} DataFields={["productName", "wholesalerName", "entryDate", "stock", "costPrice", "totalCost"]} Data={[purchases[page]]} Page={Paging} Update={updatePurchase} Delete={deletePurchase} Add={() => setNewForm(true)} Search={searchProductName} SetSearch={setSearchProductName} />
                    }
                </DashboardLayout>
                : <Forbidden />
        }
        {
            confirmation ? <SimpleStatusContainer Message={statusData.Message} Desc={statusData.Desc} Buttons={statusData.Buttons} /> : <></>
        }
        {
            newForm ? <UAForm Title={"New Purchse"} Inputs={[
                <SimpleDropDown Title="Select Product" Options={products} BGColor="#0f0f0f" BSColor="#77777750" BRR="10" H="50" BRColor="#77777750" Flex="1" Color="white" CallBack={setNewProductID} />,
                <SimpleDropDown Title="Select Wholesaler" Options={wholesalers} BGColor="#0f0f0f" BSColor="#77777750" BRR="10" H="50" BRColor="#77777750" Flex="1" Color="white" CallBack={setNewWholesalerID} />,
                <SimpleInput Text="Cost Price" BGColor="#0f0f0f" BSColor="#77777750" BRR="10" H="50" BRColor="#77777750" Color="white" Type="text" Value={newCostPrice} CallBack={setNewCostPrice} Disabled={false} />,
                <SimpleInput Text="Quantity" BGColor="#0f0f0f" BSColor="#77777750" BRR="10" H="50" BRColor="#77777750" Color="white" Type="text" Value={newQuantity} CallBack={setNewQuantity} Disabled={false} />,
            ]} Buttons={[
                {
                    Title: "Cancel",
                    Color: "#11b112",
                    BGColor: "transferant",
                    BRColor: "#11b112",
                    OnClick: () => setNewForm(false)
                },
                {
                    Title: "Confirm",
                    Color: "#ff0000",
                    BGColor: "transferant",
                    BRColor: "#ff0000",
                    OnClick: () => isConfirmNewPurchase()
                },
            ]} /> : <></>
        }

        {
            updateForm ? <UAForm Title={"Update Purchase"} Inputs={[
                <SimpleDropDown Title="Select Product" Options={products} BGColor="#0f0f0f" BSColor="#77777750" BRR="10" H="50" BRColor="#77777750" Flex="1" Color="white" CallBack={(val)=>setUpdatePurchaseData(prev => ({...prev, productID : val}))} />,
                <SimpleDropDown Title="Select Wholesaler" Options={wholesalers} BGColor="#0f0f0f" BSColor="#77777750" BRR="10" H="50" BRColor="#77777750" Flex="1" Color="white" CallBack={(val)=>setUpdatePurchaseData(prev => ({...prev, wholesalerID : val}))} />,
                <SimpleInput Text="Cost Price" BGColor="#0f0f0f" BSColor="#77777750" BRR="10" H="50" BRColor="#77777750" Color="white" Type="text" Value={updatePurchaseData.costPrice} CallBack={(val)=>setUpdatePurchaseData(prev => ({...prev, costPrice : val}))} Disabled={false} />,
                <SimpleInput Text="Quantity" BGColor="#0f0f0f" BSColor="#77777750" BRR="10" H="50" BRColor="#77777750" Color="white" Type="text" Value={updatePurchaseData.stock} CallBack={(val)=>setUpdatePurchaseData(prev => ({...prev, stock : val}))} Disabled={false} />,
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

export default Purchases;