import DashboardLayout from "../layouts/DashboardLayout.jsx";
import { Forbidden, TitledIndicator, Button, SimpleDropDown, SimpleInput, SimpleStatusContainer } from "../components/mainComponent.jsx";
import VerifyEntry from "../services/validateUserEntry.jsx"
import { useEffect, useState } from "react";
import { AllProducts } from "../services/productService.jsx";
import { AllCustomers } from "../services/customerService.jsx";

function Invoice() {
    const [statusIndicator, setStatusIndicator] = useState({
        message: "",
        desc: "",
        buttons: [
            {
                "BGColor": "",
                "BRColor": "",
                "Color": "",
                "OnClick": null,
                "Title": ""
            }
        ]
    });
    const [statusIndicatorStatus, setStatusIndicatorStatus] = useState(false);

    const [authStatus, setAuthStatus] = useState(null);
    const [products, setProduct] = useState([]);

    const [allProducts, setAllProducts] = useState(null);
    const [allCustomers, setAllCustomers] = useState(null);


    useEffect(() => {
        (async () => {
            const result = await VerifyEntry();
            setAuthStatus(result);

            const allProductResponse = await AllProducts();
            if (allProductResponse.status === 401) {
                setStatusIndicator({
                    message: "Unauthorized",
                    desc: "You are not authorized to view products. Please log in again.",
                    buttons: [
                        {
                            BGColor: "#ff4d4f",
                            BRColor: "#ff7875",
                            Color: "white",
                            OnClick: () => window.location.reload(),
                            Title: "Reload"
                        }
                    ]
                });
                setStatusIndicatorStatus(true);
                return;
            } else {
                const mappedProducts = allProductResponse.data.data[1].map(c => ({
                    ...c,
                    key: c.productName,
                    value: c.stockID
                }));
                setAllProducts(mappedProducts);
            }

            const allCustomerResponse = await AllCustomers();
            if (allCustomerResponse.status === 401) {
                setStatusIndicator({
                    message: "Unauthorized",
                    desc: "You are not authorized to view customers. Please log in again.",
                    buttons: [
                        {
                            BGColor: "#ff4d4f",
                            BRColor: "#ff7875",
                            Color: "white",
                            OnClick: () => window.location.reload(),
                            Title: "Reload"
                        }
                    ]
                });
                setStatusIndicatorStatus(true);
            } else {
                const mappedCustomers = allCustomerResponse.data.data[1].map(c => ({
                    key: c.customerName,
                    value: c.customerID
                }));
                setAllCustomers(mappedCustomers);
            }
        })();
    }, []);


    if (authStatus === null || allCustomers === null || allProducts === null) {
        return <TitledIndicator Process="Loading..." />
    }

    const currentDate = new Date();

    const addProduct = (productId) => {
        const productDetails = allProducts.find(p => String(p.value) === String(productId));
        if (productDetails) {
            setProduct(prev => [
                ...prev,
                {
                    id: productDetails.value,
                    name: productDetails.key,
                    quantity: 1,
                    cost: 0,
                    discount: 0,
                    tax: 0
                }
            ]);
        }
    };
    const removeProduct = (id) => {
        setProduct(prev => prev.filter(p => p.id !== id));
    };
    const updateProductField = (id, field, value) => {
        setProduct(prev =>
            prev.map(p =>
                p.id === id ? { ...p, [field]: value } : p
            )
        );
    };

    return <>
        {
            authStatus
                ? <DashboardLayout>
                    <div className="w-100 h-100 p-3" style={
                        {
                            backgroundColor: "#1C1C1C",
                            border: "1px solid #77777750",
                            borderRadius: "10px",
                            boxShadow: "1px 1px 2px #00009b8f",
                            color: "white"
                        }}>
                        <h3>Invoice Generator</h3>
                        <p>Todays Date : {currentDate.getDate() + "-" + currentDate.getMonth() + "-" + currentDate.getFullYear()}</p>
                        <div className="w-100 d-flex flex-column">
                            <h4>Customer Details</h4>
                            <div className="w-100 d-flex flex-row align-items-center justify-contentbetween gap-3">
                                <div style={{ flex: "3" }}>
                                    <SimpleDropDown Title="Select Customer" Options={allCustomers} BGColor="#010101" BSColor="#77777750" BRR="10px" H="45px" BRColor="#77777750" Flex="1" Color="white"/>
                                </div>
                                <div cl style={{ flex: "1" }}>
                                    <Button BGColor="#010101" BRColor="#77777750" Color="white" OnClick={null} Title="Add Customer" style={{ flex: "4" }} />
                                </div>
                            </div>
                        </div>
                        <div className="w-100 d-flex flex-column gap-2">
                            <h4>Products</h4>
                            <div className="w-100 d-flex flex-row justify-content-between align-items-center gap-2" >
                                <div style={{ flex: "3" }}>
                                    <SimpleDropDown Title="Select Product" Options={allProducts} BGColor="#010101" BSColor="#77777750" BRR="10px" H="50px" BRColor="#77777750" Flex="4" Color="white" CallBack={addProduct}/>
                                </div>
                                <div style={{ flex: "1" }}>
                                    <Button BGColor="#010101" BRColor="#77777750" Color="white" CallBack={(value) => addProduct(value)} Title="+" />
                                </div>
                                <h5 style={{ flex: "1" }}>Quantity</h5>
                                <h5 style={{ flex: "1" }}>Cost(₹)</h5>
                                <h5 style={{ flex: "1" }}>Discount</h5>
                                <h5 style={{ flex: "1" }}>Tax</h5>
                            </div>
                            {
                                products.map(product=><>
                                    <div className="w-100 d-flex flex-row justify-content-between align-items-center gap-2" >
                                    <div style={{ flex: "3" }}>
                                        <SimpleInput Title={product.name} BGColor="#010101" BSColor="#77777750" BRR="10" H="50" BRColor="#77777750" Color="white" Disabled={true} Value={product.name} CallBack={null} />
                                    </div>
                                        <div style={{ flex: "1", minWidth: 0 }}>
                                            <Button BGColor="#010101" BRColor="#77777750" Color="white" OnClick={() => removeProduct(product.id)} Title="-" />
                                        </div>
                                        <div style={{ flex: "1", minWidth: 0 }}>
                                            <SimpleInput Title="ex. 5" BGColor="#010101" BSColor="#77777750" BRR="10" H="50" BRColor="#77777750" Color="white" Disabled={false} Value={product.quantity} CallBack={(val) => updateProductField(product.id, "quantity", val)} />
                                        </div>
                                        <div style={{ flex: "1", minWidth: 0 }}>
                                            <SimpleInput Title="Price" BGColor="#010101" BSColor="#77777750" BRR="10" H="50" BRColor="#77777750" Color="white" Disabled={false} Value={ product.cost } CallBack={(val) => updateProductField(product.id, "cost", val)} />
                                        </div>
                                        <div style={{ flex: "1", minWidth: 0 }}>
                                            <SimpleInput Title="ex. 5%" BGColor="#010101" BSColor="#77777750" BRR="10" H="50" BRColor="#77777750" Color="white" Disabled={false} Value={product.discount} CallBack={(val) => updateProductField(product.id, "discount", val)} />
                                        </div>
                                        <div style={{ flex: "1", minWidth: 0 }}>
                                            <SimpleInput Title="ex. 5%" BGColor="#010101" BSColor="#77777750" BRR="10" H="50" BRColor="#77777750" Color="white" Disabled={false} Value={product.tax} CallBack={(val) => updateProductField(product.id, "tax", val)} />
                                        </div>
                                    </div>
                                </>)
                            }

                        </div>
                        <div>

                        </div>
                    </div>
                    {statusIndicatorStatus ? <SimpleStatusContainer
                        Message={statusIndicator.message}
                        Desc={statusIndicator.desc}
                        Buttons={statusIndicator.buttons}
                    />
                        : <></>}
                </DashboardLayout>
                : <Forbidden />
        }
    </>
}

export default Invoice;