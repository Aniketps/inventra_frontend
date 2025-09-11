import DashboardLayout from "../layouts/DashboardLayout.jsx";
import { Forbidden, TitledIndicator, Button, SimpleDropDown, SimpleInput, SimpleStatusContainer, MainForm, UAForm } from "../components/mainComponent.jsx";
import VerifyEntry from "../services/validateUserEntry.jsx"
import { useEffect, useState } from "react";
import { AllStocks } from "../services/stockService.jsx";
import { AllCustomers, addCustomer } from "../services/customerService.jsx";
import jsPDF from 'jspdf';
import autoTable from "jspdf-autotable";
import RetailStoreInfo from "../services/retainStoreService.jsx"
import { AddSale } from "../services/salesService.jsx";

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
    const [selectedCustomer, setSelectedCustomer] = useState(null);
    const [showAddCustomerModal, setShowAddCustomerModal] = useState(false);
    const [retailInfo, setRetailInfo] = useState({});

    const [newCustomer, setNewCustomer] = useState({
        id: "",
        name: '',
        email: '',
        phone: '',
        address: ''
    });
    const [selectedProduct, setSelectedProduct] = useState({
        name: "",
        stockID: "",
        quantity: 0,
        cost: 0,
        discount: 0,
        tax: 0,
        customerID: ""
    });

    const [allProducts, setAllProducts] = useState([]);
    const [allCustomers, setAllCustomers] = useState([]);

    useEffect(() => {
        (async () => {
            const result = await VerifyEntry();
            setAuthStatus(result);
            if (!result) return;

            try {
                const allProductResponse = await AllStocks('-', '-');
                if (allProductResponse.status === 200) {
                    const productsData = allProductResponse.data?.data?.[1] || [];
                    const mappedProducts = productsData.map(p => ({
                        ...p,
                        key: `${p.productName} | ₹${p.sellingPrice} | ${p.stock} | ${p.wholesalerName}`,
                        value: p.stockID
                    }));
                    setAllProducts(mappedProducts);
                }

                const retailStore = await RetailStoreInfo();
                if (retailStore.status === 200) {
                    const retailData = retailStore.data.data;
                    setRetailInfo(retailData);
                }
            } catch (error) {
                setStatusIndicator({
                    message: "Error",
                    desc: "Failed to load products",
                    buttons: [{
                        BGColor: "#ff4d4f",
                        Title: "Try Again",
                        OnClick: () => window.location.reload()
                    }]
                });
                setStatusIndicatorStatus(true);
            }

            try {
                const allCustomerResponse = await AllCustomers('-', '-', '-', '-', '-');
                if (allCustomerResponse.status === 200) {
                    const customersData = allCustomerResponse.data?.data?.[1] || [];
                    const mappedCustomers = customersData.map(c => ({
                        ...c,
                        key: c.customerName + " | " + c.phone + " | " + c.address,
                        value: c.customerID
                    }));
                    setAllCustomers(mappedCustomers);
                }
            } catch (error) {
                setStatusIndicator({
                    message: "Error",
                    desc: "Failed to load customers",
                    buttons: [{
                        BGColor: "#ff4d4f",
                        Title: "Try Again",
                        OnClick: () => window.location.reload()
                    }]
                });
                setStatusIndicatorStatus(true);
            }
        })();
    }, []);

    const listProduct = (id) => {
        const product = allProducts.filter(prev => prev.stockID == id).map(prod => prod);
        setSelectedProduct(prev => ({
            ...prev,
            name: product[0].productName,
            stockID: product[0].stockID,
            quantity: 1,
            discount: 0,
            tax: 0,
            cost: product[0].sellingPrice,
        }));
    }

    const currentDate = new Date();

    const calculateTotals = () => {
        let subtotal = 0;
        let totalDiscount = 0;
        let totalTax = 0;

        const itemTotal = selectedProduct.cost * selectedProduct.quantity;
        const itemDiscount = (selectedProduct.discount / 100) * itemTotal;
        const itemTax = (selectedProduct.tax / 100) * (itemTotal - itemDiscount);
        subtotal += itemTotal;
        totalDiscount += itemDiscount;
        totalTax += itemTax;

        return {
            subtotal: subtotal.toFixed(2),
            totalDiscount: totalDiscount.toFixed(2),
            totalTax: totalTax.toFixed(2),
            grandTotal: (subtotal - totalDiscount + totalTax).toFixed(2)
        };
    };

    const generatePDF = async () => {
        if (!selectedCustomer) {
            setStatusIndicator({
                message: "Order Failed",
                desc: "Please select a customer first...",
                buttons: [
                    {
                        "BGColor": "transperant",
                        "BRColor": "#0069d9",
                        "Color": "#0069d9",
                        "OnClick": () => setStatusIndicatorStatus(false),
                        "Title": "Try Again"
                    }
                ]
            });
            setStatusIndicatorStatus(true);
            return;
        }

        const doc = new jsPDF();
        const totals = calculateTotals();
        const dateStr = currentDate.toLocaleDateString();

        doc.setFontSize(22);
        doc.setTextColor(40);
        doc.text("INVOICE", 105, 20, { align: "center" });

        doc.setFontSize(12);
        doc.setTextColor(60);

        doc.text("Retailer Details", 15, 35);
        doc.setFontSize(10);
        doc.text(`Store: ${retailInfo.storeName}`, 15, 42);
        doc.text(`Owner: ${retailInfo.owner}`, 15, 48);
        doc.text(`Phone: ${retailInfo.phoneNum}`, 15, 54);
        doc.text(`GST No: ${retailInfo.gstNum}`, 15, 60);
        doc.text(`Location: ${retailInfo.location}`, 15, 66);
        doc.text(`Hours: ${retailInfo.storeHour}`, 15, 72);
        doc.text(`Website: ${retailInfo.webURL}`, 15, 78);

        doc.setFontSize(12);
        doc.setTextColor(60);
        doc.text("Customer Details", 120, 35);
        doc.setFontSize(10);
        doc.text(`Name: ${selectedCustomer.customerName}`, 120, 42);
        doc.text(`Email: ${selectedCustomer.email}`, 120, 48);
        doc.text(`Phone: ${selectedCustomer.phone}`, 120, 54);
        doc.text(`Address: ${selectedCustomer.address}`, 120, 60);

        doc.setFontSize(10);
        doc.text(`Date: ${dateStr}`, 120, 72);

        const itemRows = [];
        const basePrice = selectedProduct.cost * selectedProduct.quantity;
        const discountAmount = (basePrice * selectedProduct.discount) / 100;
        const priceAfterDiscount = basePrice - discountAmount;
        const taxAmount = (priceAfterDiscount * selectedProduct.tax) / 100;
        const itemTotal = (priceAfterDiscount + taxAmount).toFixed(2);

        itemRows.push([
            selectedProduct.name,
            selectedProduct.quantity,
            parseFloat(selectedProduct.cost).toFixed(2),
            `${selectedProduct.discount}%`,
            `${selectedProduct.tax}%`,
            itemTotal
        ]);

        autoTable(doc, {
            startY: 90,
            head: [["Item", "Qty", "Price (Rupees)", "Discount", "Tax", "Total (Rupees)"]],
            body: itemRows,
            theme: "grid",
            headStyles: {
                fillColor: [41, 128, 185],
                textColor: 255,
                halign: "center",
            },
            bodyStyles: { halign: "center" },
            alternateRowStyles: { fillColor: [245, 245, 245] },
            styles: { fontSize: 10 }
        });

        let finalY = doc.lastAutoTable.finalY + 10;
        doc.setFontSize(12);
        doc.setTextColor(40);
        doc.text("Summary", 15, finalY);

        autoTable(doc, {
            startY: finalY + 5,
            body: [
                ["Subtotal (Rupees)", totals.subtotal],
                ["Discount (Rupees)", totals.totalDiscount],
                ["Tax (Rupees)", totals.totalTax],
                ["Grand Total (Rupees)", totals.grandTotal],
            ],
            theme: "grid",
            styles: { halign: "right", fontSize: 11 },
            columnStyles: {
                0: { halign: "left", fontStyle: "bold" },
                1: { halign: "right" }
            },
            head: [],
            bodyStyles: {
                fillColor: [255, 255, 255],
            },
            didDrawCell: (data) => {
                if (data.row.index === 3) {
                    data.cell.styles.fillColor = [39, 174, 96];
                    data.cell.styles.textColor = 255;
                    data.cell.styles.fontStyle = "bold";
                }
            }
        });

        const orderedProduction = {
            "stockID": selectedProduct.stockID,
            "quantity": selectedProduct.quantity,
            "discount": totals.totalDiscount,
            "tax": totals.totalTax,
            "customerID": selectedProduct.customerID
        }

        try {
            const response = await AddSale(orderedProduction);
            if (response.status == 201) {
                doc.save(`invoice_${selectedCustomer.key}_${currentDate.toISOString().split("T")[0]}.pdf`);
                setStatusIndicator({
                    message: "Order Successfully",
                    desc: "Record Has been Added Successfully...",
                    buttons: [
                        {
                            "BGColor": "transperant",
                            "BRColor": "#0069d9",
                            "Color": "#0069d9",
                            "OnClick": () => setStatusIndicatorStatus(false),
                            "Title": "Close"
                        }
                    ]
                });
                setStatusIndicatorStatus(true);
            }else{
                setStatusIndicator({
                    message: "Order Failed",
                    desc: response.response.data.message,
                    buttons: [
                        {
                            "BGColor": "transperant",
                            "BRColor": "#0069d9",
                            "Color": "#0069d9",
                            "OnClick": () => setStatusIndicatorStatus(false),
                            "Title": "Close"
                        }
                    ]
                });
                setStatusIndicatorStatus(true);
            }
        } catch (e) {
            console.log(e);
        }
    };


    const handleAddCustomer = async () => {
        if (!newCustomer.name || !newCustomer.email || !newCustomer.phone || !newCustomer.address) {
            setStatusIndicator({
                message: "Error",
                desc: "Please fill all fields",
                buttons: [{
                    BGColor: "#ff4d4f",
                    BRColor: "#ff4d4f",
                    Color: "white",
                    Title: "Close",
                    OnClick: () => setStatusIndicatorStatus(false)
                }]
            });
            setStatusIndicatorStatus(true);
            return;
        }
        try {
            const response = await addCustomer(newCustomer.name, newCustomer.email, newCustomer.phone, newCustomer.address);
            if (response.status === 201) {
                const allCustomerResponse = await AllCustomers();
                if (allCustomerResponse.status === 200) {
                    const customersData = allCustomerResponse.data?.data?.[1] || [];
                    const mappedCustomers = customersData.map(c => ({
                        key: c.customerName,
                        value: c.customerID
                    }));
                    setAllCustomers(mappedCustomers);
                    setStatusIndicator({
                        message: "Success",
                        desc: "Customer added successfully",
                        buttons: [{
                            BGColor: "#4CAF50",
                            BRColor: "#45a049",
                            Color: "white",
                            Title: "Close",
                            OnClick: () => setStatusIndicatorStatus(false)
                        }]
                    });
                    setStatusIndicatorStatus(true);
                }
                setShowAddCustomerModal(false);
                setNewCustomer({ name: '', email: '', phone: '', address: '' });
            }
        } catch (error) {
            setStatusIndicator({
                message: "Error",
                desc: "Failed to add customer: " + (error.response?.data?.message || error.message),
                buttons: [{
                    BGColor: "#ff4d4f",
                    BRColor: "#ff4d4f",
                    Color: "white",
                    Title: "Close",
                    OnClick: () => setStatusIndicatorStatus(false)
                }]
            });
            setStatusIndicatorStatus(true);
        }
    };

    if (authStatus === null) {
        return <TitledIndicator Process="Loading..." />;
    }

    if (!authStatus) {
        return <Forbidden />;
    }

    return (
        <div>
            <div className="w-100 h-100 p-3" style={{
                backgroundColor: "#1C1C1C",
                border: "1px solid #77777750",
                borderRadius: "10px",
                boxShadow: "1px 1px 2px #00009b8f",
                color: "white"
            }}>
                <h3>Invoice Generator</h3>
                <p>Today's Date: {currentDate.toLocaleDateString()}</p>

                <div className="w-100 d-flex flex-column mb-4">
                    <h4>Customer Details</h4>
                    <div className="w-100 d-flex flex-row align-items-center justify-content-between gap-3">
                        <div style={{ flex: "3" }}>
                            <SimpleDropDown Title="Select Customer" Options={allCustomers} BGColor="#010101" BSColor="#77777750" BRR="10" H="45" BRColor="#77777750" Color="white" CallBack={(value) => {
                                const customer = allCustomers.find(c => String(c.value) === String(value));
                                setSelectedCustomer(customer);
                                setSelectedProduct(prev => ({ ...prev, customerID: customer.customerID }))
                            }} />
                        </div>
                        <div style={{ flex: "1" }}>
                            <Button BGColor="#010101" BRColor="#77777750" Color="white" Title="Add Customer" OnClick={() => setShowAddCustomerModal(true)} />
                        </div>
                    </div>
                    {selectedCustomer && (
                        <div className="mt-2">
                            <p>Selected: {selectedCustomer.key}</p>
                        </div>
                    )}
                </div>

                <div className="w-100 d-flex flex-column gap-2 mb-4">
                    <h4>Product</h4>
                    <div className="w-100 d-flex flex-row justify-content-between align-items-center gap-2">
                        <div style={{ flex: "3" }}>
                            <SimpleDropDown Title="Select Product" Options={allProducts} BGColor="#010101" BSColor="#77777750" BRR="10px" H="50px" BRColor="#77777750" Color="white" CallBack={(id) => listProduct(id)} />
                        </div>
                        <h5 style={{ flex: "1" }}>Quantity</h5>
                        <h5 style={{ flex: "1" }}>Cost(₹)</h5>
                        <h5 style={{ flex: "1" }}>Discount(%)</h5>
                        <h5 style={{ flex: "1" }}>Tax(%)</h5>
                    </div>

                    {
                        selectedProduct.name == ""
                            ? <></>
                            : <div key={selectedProduct.stockID} className="w-100 d-flex flex-row justify-content-between align-items-center gap-2">
                                <div style={{ flex: "3", minWidth: 0 }}>
                                    <SimpleInput Title={selectedProduct.name} BGColor="#010101" BSColor="#77777750" BRR="0" H="40" BRColor="#77777750" Color="white" Disabled={true} Value={selectedProduct.name}
                                    />
                                </div>
                                <div style={{ flex: "1", minWidth: 0 }}>
                                    <SimpleInput Title="Qty" BGColor="#010101" BSColor="#77777750" BRR="0" H="40" BRColor="#77777750" Color="white" Value={selectedProduct.quantity} CallBack={(val) => setSelectedProduct(prev => ({ ...prev, quantity: val }))}
                                    />
                                </div>
                                <div style={{ flex: "1", minWidth: 0 }}>
                                    <SimpleInput Title="Price" BGColor="#010101" BSColor="#77777750" BRR="0" H="40" BRColor="#77777750" Color="white" Value={selectedProduct.cost} CallBack={(val) => setSelectedProduct(prev => ({ ...prev, cost: val }))}
                                    />
                                </div>
                                <div style={{ flex: "1", minWidth: 0 }}>
                                    <SimpleInput Title="Disc%" BGColor="#010101" BSColor="#77777750" BRR="0" H="40" BRColor="#77777750" Color="white" Value={selectedProduct.discount} CallBack={(val) => setSelectedProduct(prev => ({ ...prev, discount: val }))}
                                    />
                                </div>
                                <div style={{ flex: "1", minWidth: 0 }}>
                                    <SimpleInput Title="Tax%" BGColor="#010101" BSColor="#77777750" BRR="0" H="40" BRColor="#77777750" Color="white" Value={selectedProduct.tax} CallBack={(val) => setSelectedProduct(prev => ({ ...prev, tax: val }))}
                                    />
                                </div>
                            </div>
                    }
                </div>

                {
                    selectedProduct.name == ""
                        ? <></>
                        : <>
                            <div className="mt-4 p-3" style={{ backgroundColor: "#2A2A2A", borderRadius: "10px" }}>
                                <h4>Invoice Summary</h4>
                                <div className="d-flex flex-column gap-2">
                                    <div className="d-flex justify-content-between">
                                        <span>Subtotal:</span>
                                        <span>₹{calculateTotals().subtotal}</span>
                                    </div>
                                    <div className="d-flex justify-content-between">
                                        <span>Total Discount:</span>
                                        <span>₹{calculateTotals().totalDiscount}</span>
                                    </div>
                                    <div className="d-flex justify-content-between">
                                        <span>Total Tax:</span>
                                        <span>₹{calculateTotals().totalTax}</span>
                                    </div>
                                    <div className="d-flex justify-content-between" style={{ fontWeight: "bold" }}>
                                        <span>Grand Total:</span>
                                        <span>₹{calculateTotals().grandTotal}</span>
                                    </div>
                                </div>
                            </div>
                            <div className="mt-4">
                                <Button
                                    BGColor="transparent"
                                    BRColor="#45a049"
                                    Color="#45a049"
                                    OnClick={generatePDF}
                                    Title="Confirm Order"
                                    style={{ width: "100%" }}
                                />
                            </div>
                        </>
                }


            </div>

            {statusIndicatorStatus && (
                <SimpleStatusContainer
                    Message={statusIndicator.message}
                    Desc={statusIndicator.desc}
                    Buttons={statusIndicator.buttons}
                />
            )}

            {
                showAddCustomerModal
                    ? <UAForm Title="New Customer" Inputs={[
                        <SimpleInput Text="Customer Name" BGColor="#010101" BSColor="#77777750" BRR="10" H="50" BRColor="#77777750" Color="white" Type="text" Value={newCustomer.name} CallBack={(val) => setNewCustomer((prev => ({ ...prev, name: val })))} Disabled={false}/>,
                        <SimpleInput Text="Email" BGColor="#010101" BSColor="#77777750" BRR="10" H="50" BRColor="#77777750" Color="white" Type="text" Value={newCustomer.email} CallBack={(val) => setNewCustomer((prev => ({ ...prev, email: val })))} Disabled={false}/>,
                        <SimpleInput Text="Phone" BGColor="#010101" BSColor="#77777750" BRR="10" H="50" BRColor="#77777750" Color="white" Type="text" Value={newCustomer.phone} CallBack={(val) => setNewCustomer((prev => ({ ...prev, phone: val })))} Disabled={false}/>,
                        <SimpleInput Text="Address" BGColor="#010101" BSColor="#77777750" BRR="10" H="50" BRColor="#77777750" Color="white" Type="text" Value={newCustomer.address} CallBack={(val) => setNewCustomer((prev => ({ ...prev, address: val })))} Disabled={false}/>
                    ]} Buttons={[
                        {
                            Title: "Cancel",
                            Color: "#11b112",
                            BGColor: "transferant",
                            BRColor: "#11b112",
                            OnClick: () => setShowAddCustomerModal(false)
                        },
                        {
                            Title: "Confirm",
                            Color: "#ff0000",
                            BGColor: "transferant",
                            BRColor: "#ff0000",
                            OnClick: handleAddCustomer
                        },
                    ]} /> : <></>
            }
        </div>
    );
}

export default Invoice;