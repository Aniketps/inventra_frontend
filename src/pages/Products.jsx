import DashboardLayout from "../layouts/DashboardLayout.jsx";
import { Forbidden, TitledIndicator, Button, SimpleInput, SimpleStatusContainer, MainForm, UAForm, SimpleDropDown } from "../components/mainComponent.jsx";
import VerifyEntry from "../services/validateUserEntry.jsx"
import { useEffect, useState } from "react";
import { AllProducts, AddProduct, DeleteProduct, UpdateProduct } from "../services/productService.jsx";
import { AllCategories } from "../services/categoryService.jsx";

function Products() {
    const [authStatus, setAuthStatus] = useState(null);
    const [products, setProducts] = useState([]);
    const [loading, setLoading] = useState(true);
    const [page, setPage] = useState('1');
    const [statusData, setStatusData] = useState({});
    const [confirmation, setConfimation] = useState(false);
    const [newForm, setNewForm] = useState(false);
    const [updateForm, setUpdateForm] = useState(false);
    const [newProductName, setNewProductName] = useState('');
    const [newProductCategory, setNewProductCategory] = useState('');
    const [updateProductData, setUpdateProductData] = useState({});
    const [searchDate, setSearchDate] = useState("-");
    const [searchName, setSearchName] = useState("-");
    const [searchCategory, setSearchCategory] = useState("-");
    const [categories, setCategories] = useState([]);

    const columns = ["Sr. No", "Product", "Category", "Date", "Update", "Delete"];

    useEffect(() => {
        let timed;
        (
            async () => {
                const result = await VerifyEntry();
                setAuthStatus(result);
                if (result) {
                    const timed = setTimeout(() => {
                        fetchProducts();
                    }, 1000);
                }
            }
        )();
        if (timed) return () => clearTimeout(timed);
    }, [confirmation, searchDate, searchName]);

    const update = async () => {
        setLoading(true);
        try {
            const response = await UpdateProduct(updateProductData.productID, updateProductData.productName, updateProductData.categoryID);
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

    const updateProduct = async (...data) => {
        await setUpdateProductData(data[0]);
        setUpdateForm(true);
    }

    const deleteProduct = (id) => {
        const del = async () => {
            setLoading(true);
            try {
                const response = await DeleteProduct(id);
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

    async function addNewProduct(name, cat) {
        setConfimation(false);
        const response = await AddProduct(name, cat);
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

    const isConfirmNewCat = () => {
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
                    OnClick: async () => await addNewProduct(newProductName, newProductCategory)
                },
            ]
        });
        setConfimation(true);
    }

    const fetchProducts = async () => {
        setLoading(true);
        try {
            const response = await AllProducts(searchName, searchDate, searchCategory);
            if (response.status === 200) {
                const productData = response.data.data;
                if(Object.keys(productData).length == 0){
                    setProducts({1:[]});
                }else{
                    setProducts(productData);
                }
            }
            const response1 = await AllCategories('-', '-');
            if (response1.status === 200) {
                let categoryData = [];
                const keys = Object.keys(response1.data.data);
                for (let i = 0; i < keys.length; i++) {
                    const page = keys[i];
                    const pageData = response1.data.data[page].map(data => ({
                        ...data,
                        key: data.categoryName,
                        value: data.categoryID
                    }));
                    categoryData = [...categoryData, ...pageData];
                }
                setCategories(categoryData);
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
            if (parseInt(page) + 1 <= Object.keys(products).length) {
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
                            ? <TitledIndicator Process="Loading Products..." />
                            : Object.keys(products).length == 0
                                ? <>
                                    <div
                                        className="d-flex flex-column justify-content-center align-items-center"
                                        style={{ height: "90vh", width: "100%", color: "white" }}
                                    >
                                        <h2>No Products Found</h2>
                                        <Button Title="New Product" Color="#0069d9" BGColor="transferant" BRColor="#0069d9" OnClick={() => setNewForm(true)} />
                                    </div>
                                </>
                                : <MainForm Title="Products" SearchHint="Search Product Name" ButtonTitle="Add Product" Filters={[
                                    <SimpleInput Text="Select Date" BGColor="#0f0f0f" BSColor="#77777750" BRR="10" H="40" BRColor="#77777750" Color="white" Type="date" Value={searchDate == '-' ? "" : searchDate} CallBack={setSearchDate} Disabled={false} />,
                                ]} Columns={['productID', columns]} DataFields={["productName", "categoryName", "productCreatedDate"]} Data={[products[page]]} Page={Paging} Update={updateProduct} Delete={deleteProduct} Add={() => setNewForm(true)} Search={searchName} SetSearch={setSearchName} />
                    }
                </div>
                : <Forbidden />
        }
        {
            confirmation ? <SimpleStatusContainer Message={statusData.Message} Desc={statusData.Desc} Buttons={statusData.Buttons} /> : <></>
        }
        {
            newForm ? <UAForm Title={"New Product"} Inputs={[
                <SimpleInput Text="Product Name" BGColor="#0f0f0f" BSColor="#77777750" BRR="10" H="50" BRColor="#77777750" Color="white" Type="text" Value={newProductName} CallBack={setNewProductName} Disabled={false} />,
                <SimpleDropDown Title="Select Category" Options={categories} BGColor="#0f0f0f" BSColor="#77777750" BRR="10" H="50" BRColor="#77777750" Flex="1" Color="white" CallBack={setNewProductCategory}/>
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
                    OnClick: () => isConfirmNewCat()
                },
            ]} /> : <></>
        }

        {
            updateForm ? <UAForm Title={"Update Product"} Inputs={[
                <SimpleInput Text="Product Name" BGColor="#0f0f0f" BSColor="#77777750" BRR="10" H="50" BRColor="#77777750" Color="white" Type="text" Value={updateProductData.productName} CallBack={(val) => setUpdateProductData((prev => ({ ...prev, productName: val })))} Disabled={false} />,
                <SimpleDropDown Title="Select Category" Options={categories} BGColor="#0f0f0f" BSColor="#77777750" BRR="10" H="50" BRColor="#77777750" Flex="1" Color="white" CallBack={(val)=>setUpdateProductData(prev=> ({...prev, categoryID : val}))} id={updateProductData.categoryID}/>
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

export default Products;