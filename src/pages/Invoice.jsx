import DashboardLayout from "../layouts/DashboardLayout.jsx";
import { Forbidden, TitledIndicator, Button, SimpleDropDown, SimpleInput, SimpleStatusContainer } from "../components/mainComponent.jsx";
import VerifyEntry from "../services/validateUserEntry.jsx"
import { useEffect, useState } from "react";
import { AllProducts } from "../services/productService.jsx";
import { AllCustomers, addCustomer } from "../services/customerService.jsx";
import jsPDF from 'jspdf';

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
    const [products, setProducts] = useState([]);
    const [allProducts, setAllProducts] = useState([]);
    const [allCustomers, setAllCustomers] = useState([]);
    const [selectedCustomer, setSelectedCustomer] = useState(null);
    const [selectedProductFromDropdown, setSelectedProductFromDropdown] = useState(null);
    const [showAddCustomerModal, setShowAddCustomerModal] = useState(false);
    const [newCustomer, setNewCustomer] = useState({ name: '', email: '', phone: '', address: '' });

    useEffect(() => {
        (async () => {
            const result = await VerifyEntry();
            setAuthStatus(result);
            if (!result) return;

            try {
                const allProductResponse = await AllProducts();
                if (allProductResponse.status === 200) {
                    const productsData = allProductResponse.data?.data?.[1] || [];
                    const mappedProducts = productsData.map(p => ({
                        ...p,
                        key: p.productName,
                        value: p.stockID || p.productID
                    }));
                    setAllProducts(mappedProducts);
                }
            } catch (error) {
                console.error("Error loading products:", error);
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
                const allCustomerResponse = await AllCustomers();
                if (allCustomerResponse.status === 200) {
                    const customersData = allCustomerResponse.data?.data?.[1] || [];
                    const mappedCustomers = customersData.map(c => ({
                        key: c.customerName,
                        value: c.customerID
                    }));
                    setAllCustomers(mappedCustomers);
                }
            } catch (error) {
                console.error("Error loading customers:", error);
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

    const currentDate = new Date();

    const addProduct = (productId) => {
        const existingProductIndex = products.findIndex(p => String(p.id) === String(productId));

        if (existingProductIndex > -1) {
            // Product already exists, increment quantity
            setProducts(prev =>
                prev.map((p, index) =>
                    index === existingProductIndex ? { ...p, quantity: p.quantity + 1 } : p
                )
            );
        } else {
            // Product does not exist, add new product
            const productDetails = allProducts.find(p => String(p.value) === String(productId));
            if (productDetails) {
                setProducts(prev => [
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
        }
    };

    const removeProduct = (id) => {
        setProducts(prev => prev.filter(p => p.id !== id));
    };

    const updateProductField = (id, field, value) => {
        setProducts(prev =>
            prev.map(p =>
                p.id === id ? { ...p, [field]: Number(value) || 0 } : p
            )
        );
    };

    const calculateTotals = () => {
        let subtotal = 0;
        let totalDiscount = 0;
        let totalTax = 0;

        products.forEach(p => {
            const itemTotal = p.cost * p.quantity;
            const itemDiscount = (p.discount / 100) * itemTotal;
            const itemTax = (p.tax / 100) * (itemTotal - itemDiscount);
            
            subtotal += itemTotal;
            totalDiscount += itemDiscount;
            totalTax += itemTax;
        });

        return { 
            subtotal: subtotal.toFixed(2),
            totalDiscount: totalDiscount.toFixed(2),
            totalTax: totalTax.toFixed(2),
            grandTotal: (subtotal - totalDiscount + totalTax).toFixed(2)
        };
    };

    const generatePDF = () => {
        if (!selectedCustomer) {
            setStatusIndicator({
                message: "Error",
                desc: "Please select a customer first",
                buttons: []
            });
            setStatusIndicatorStatus(true);
            return;
        }

        if (products.length === 0) {
            setStatusIndicator({
                message: "Error",
                desc: "Please add at least one product",
                buttons: []
            });
            setStatusIndicatorStatus(true);
            return;
        }

        const doc = new jsPDF();
        const totals = calculateTotals();

        // Invoice Header
        doc.setFontSize(20);
        doc.text('INVOICE', 105, 20, { align: 'center' });
        
        // Date and Customer Info
        doc.setFontSize(12);
        doc.text(`Date: ${currentDate.toLocaleDateString()}`, 15, 35);
        doc.text(`Customer: ${selectedCustomer.key}`, 15, 45);
        
        // Products Table Header
        doc.text('Item', 15, 60);
        doc.text('Qty', 60, 60);
        doc.text('Price', 85, 60);
        doc.text('Discount', 115, 60);
        doc.text('Tax', 145, 60);
        doc.text('Total', 175, 60);
        
        // Products List
        let y = 70;
        products.forEach((p, index) => {
    const basePrice = p.cost * p.quantity;
    const discountAmount = (basePrice * p.discount) / 100;
    const priceAfterDiscount = basePrice - discountAmount;
    const taxAmount = (priceAfterDiscount * p.tax) / 100;
    const itemTotal = (priceAfterDiscount + taxAmount).toFixed(2);

    doc.text(`${index + 1}. ${p.name}`, 15, y);
    doc.text(p.quantity.toString(), 60, y);
    doc.text(`Rs ${p.cost.toFixed(2)}`, 85, y);
    doc.text(`${p.discount}%`, 115, y);
    doc.text(`${p.tax}%`, 145, y);
    doc.text(`Rs ${itemTotal}`, 175, y);

    y += 10;
});

        // Totals
        y += 20;
        doc.text(`Subtotal: Rs ${totals.subtotal}`, 145, y);
        doc.text(`Discount: Rs ${totals.totalDiscount}`, 145, y + 10);
        doc.text(`Tax: Rs ${totals.totalTax}`, 145, y + 20);
        doc.setFont('helvetica', 'bold');
        doc.text(`Grand Total: Rs ${totals.grandTotal}`, 145, y + 30);
        
        doc.save(`invoice_${selectedCustomer.key}_${currentDate.toISOString().split('T')[0]}.pdf`);
    };

    const handleCustomerInput = (field, value) => {
        setNewCustomer(prev => ({ ...prev, [field]: value }));
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
        <DashboardLayout>
            <div className="w-100 h-100 p-3" style={{
                backgroundColor: "#1C1C1C",
                border: "1px solid #77777750",
                borderRadius: "10px",
                boxShadow: "1px 1px 2px #00009b8f",
                color: "white"
            }}>
                <h3>Invoice Generator</h3>
                <p>Today's Date: {currentDate.toLocaleDateString()}</p>
                
                {/* Customer Section */}
                <div className="w-100 d-flex flex-column mb-4">
                    <h4>Customer Details</h4>
                    <div className="w-100 d-flex flex-row align-items-center justify-content-between gap-3">
                        <div style={{ flex: "3" }}>
                            <SimpleDropDown 
                                Title="Select Customer" 
                                Options={allCustomers} 
                                BGColor="#010101" 
                                BSColor="#77777750" 
                                BRR="10px" 
                                H="45px" 
                                BRColor="#77777750" 
                                Color="white"
                                CallBack={(value) => {
                                    const customer = allCustomers.find(c => String(c.value) === String(value));
                                    setSelectedCustomer(customer);
                                }}
                            />
                        </div>
                        <div style={{ flex: "1" }}>
                            <Button 
                                BGColor="#010101" 
                                BRColor="#77777750" 
                                Color="white" 
                                Title="Add Customer" 
                                OnClick={() => setShowAddCustomerModal(true)}
                            />
                        </div>
                    </div>
                    {selectedCustomer && (
                        <div className="mt-2">
                            <p>Selected: {selectedCustomer.key}</p>
                        </div>
                    )}
                </div>
                
                {/* Products Section */}
                <div className="w-100 d-flex flex-column gap-2 mb-4">
                    <h4>Products</h4>
                    <div className="w-100 d-flex flex-row justify-content-between align-items-center gap-2">
                        <div style={{ flex: "3" }}>
                            <SimpleDropDown 
                                Title="Select Product" 
                                Options={allProducts} 
                                BGColor="#010101" 
                                BSColor="#77777750" 
                                BRR="10px" 
                                H="50px" 
                                BRColor="#77777750" 
                                Color="white"
                                CallBack={(value) => {
                                    setSelectedProductFromDropdown(value);
                                }}
                            />
                        </div>
                        <div style={{ flex: "1" }}>
                            <Button 
                                BGColor="#010101" 
                                BRColor="#77777750" 
                                Color="white" 
                                Title="+" 
                                OnClick={() => {
                                    if (selectedProductFromDropdown) {
                                        addProduct(selectedProductFromDropdown);
                                    }
                                }}
                            />
                        </div>
                        <h5 style={{ flex: "1" }}>Quantity</h5>
                        <h5 style={{ flex: "1" }}>Cost(₹)</h5>
                        <h5 style={{ flex: "1" }}>Discount(%)</h5>
                        <h5 style={{ flex: "1" }}>Tax(%)</h5>
                    </div>
                    
                    {products.map(product => (
                        <div key={product.id} className="w-100 d-flex flex-row justify-content-between align-items-center gap-2">
                            <div style={{ flex: "3" }}>
                                <SimpleInput 
                                    Title={product.name} 
                                    BGColor="#010101" 
                                    BSColor="#77777750" 
                                    BRR="10px" 
                                    H="50px" 
                                    BRColor="#77777750" 
                                    Color="white" 
                                    Disabled={true} 
                                    Value={product.name} 
                                />
                            </div>
                            <div style={{ flex: "1" }}>
                                <Button 
                                    BGColor="#010101" 
                                    BRColor="#77777750" 
                                    Color="white" 
                                    OnClick={() => removeProduct(product.id)} 
                                    Title="-" 
                                />
                            </div>
                            <div style={{ flex: "1" }}>
                                <SimpleInput 
                                    Title="Qty" 
                                    BGColor="#010101" 
                                    BSColor="#77777750" 
                                    BRR="10px" 
                                    H="50px" 
                                    BRColor="#77777750" 
                                    Color="white" 
                                    Value={product.quantity} 
                                    CallBack={(val) => updateProductField(product.id, "quantity", val)}
                                />
                            </div>
                            <div style={{ flex: "1" }}>
                                <SimpleInput 
                                    Title="Price" 
                                    BGColor="#010101" 
                                    BSColor="#77777750" 
                                    BRR="10px" 
                                    H="50px" 
                                    BRColor="#77777750" 
                                    Color="white" 
                                    Value={product.cost} 
                                    CallBack={(val) => updateProductField(product.id, "cost", val)}
                                />
                            </div>
                            <div style={{ flex: "1" }}>
                                <SimpleInput 
                                    Title="Disc%" 
                                    BGColor="#010101" 
                                    BSColor="#77777750" 
                                    BRR="10px" 
                                    H="50px" 
                                    BRColor="#77777750" 
                                    Color="white" 
                                    Value={product.discount} 
                                    CallBack={(val) => updateProductField(product.id, "discount", val)}
                                />
                            </div>
                            <div style={{ flex: "1" }}>
                                <SimpleInput 
                                    Title="Tax%" 
                                    BGColor="#010101" 
                                    BSColor="#77777750" 
                                    BRR="10px" 
                                    H="50px" 
                                    BRColor="#77777750" 
                                    Color="white" 
                                    Value={product.tax} 
                                    CallBack={(val) => updateProductField(product.id, "tax", val)}
                                />
                            </div>
                        </div>
                    ))}
                </div>
                
                {/* Totals Section */}
                {products.length > 0 && (
                    <div className="mt-4 p-3" style={{
                        backgroundColor: "#2A2A2A",
                        borderRadius: "10px"
                    }}>
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
                )}
                
                {/* Generate PDF Button */}
                <div className="mt-4">
                    <Button 
                        BGColor="#4CAF50" 
                        BRColor="#45a049" 
                        Color="white" 
                        OnClick={generatePDF} 
                        Title="Generate PDF" 
                        style={{ width: "100%" }}
                    />
                </div>
            </div>
            
            {/* Status Indicator */}
            {statusIndicatorStatus && (
                <SimpleStatusContainer
                    Message={statusIndicator.message}
                    Desc={statusIndicator.desc}
                    Buttons={statusIndicator.buttons}
                />
            )}

            {/* Add Customer Modal */}
            {showAddCustomerModal && (
                <div style={{ position: 'fixed', top: 0, left: 0, width: '100%', height: '100%', background: 'rgba(0,0,0,0.5)', display: 'flex', justifyContent: 'center', alignItems: 'center', zIndex: 1000 }}>
                    <div style={{ background: '#1C1C1C', padding: '20px', borderRadius: '10px', width: '400px', color: 'white' }}>
                        <h4>Add New Customer</h4>
                        
Name
                        <SimpleInput Title="Name" Value={newCustomer.name} CallBack={(val) => handleCustomerInput('name', val)} BGColor="#010101" BRColor="#77777750" Color="white" />
                        Email
                        <SimpleInput Title="Email" Value={newCustomer.email} CallBack={(val) => handleCustomerInput('email', val)} BGColor="#010101" BRColor="#77777750" Color="white" />

                        Phone
                        <SimpleInput Title="Phone" Value={newCustomer.phone} CallBack={(val) => handleCustomerInput('phone', val)} BGColor="#010101" BRColor="#77777750" Color="white" />
                        Address
                        <SimpleInput Title="Address" Value={newCustomer.address} CallBack={(val) => handleCustomerInput('address', val)} BGColor="#010101" BRColor="#77777750" Color="white" />
                        <div className="d-flex gap-2 mt-3">
                            <Button Title="Submit" BGColor="#4CAF50" Color="white" OnClick={handleAddCustomer} />
                            <Button Title="Cancel" BGColor="#ff4d4f" Color="white" OnClick={() => setShowAddCustomerModal(false)} />
                        </div>
                    </div>
                </div>
            )}
        </DashboardLayout>
    );
}

export default Invoice;