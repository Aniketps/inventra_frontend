import DashboardLayout from "../layouts/DashboardLayout.jsx";
import { Forbidden, TitledIndicator, Button, SimpleInput, SimpleStatusContainer, DropDownWithSearch } from "../components/mainComponent.jsx";
import VerifyEntry from "../services/validateUserEntry.jsx"
import { useEffect, useState } from "react";
import { AllSales, AddSale, DeleteSale, UpdateSale } from "../services/salesService.jsx";
import { AllCustomers } from "../services/customerService.jsx";
import { AllProducts } from "../services/productService.jsx";

function Sales() {
    const [authStatus, setAuthStatus] = useState(null);
    const [sales, setSales] = useState([]);
    const [customers, setCustomers] = useState([]);
    const [products, setProducts] = useState([]);
    const [loading, setLoading] = useState(true);
    const [statusMessage, setStatusMessage] = useState("");
    const [showStatus, setShowStatus] = useState(false);
    
    // Form states for adding new sale
    const [newSale, setNewSale] = useState({
        customerID: "",
        productID: "",
        quantity: "",
        totalPrice: "",
        purchaseDate: new Date().toISOString().split('T')[0]
    });
    
    // Form states for editing sale
    const [editingSale, setEditingSale] = useState(null);
    const [editForm, setEditForm] = useState({
        quantity: "",
        totalPrice: "",
        purchaseDate: ""
    });

    useEffect(() => {
        (
            async () => {
                const result = await VerifyEntry();
                setAuthStatus(result);
                if (result) {
                    fetchSales();
                    fetchCustomers();
                    fetchProducts();
                }
            }
        )();
    }, []);
    
    const fetchSales = async () => {
        setLoading(true);
        try {
            const response = await AllSales();
            if (response.status === 200) {
                setSales(response.data.data);
            }
        } catch (error) {
            console.error("Error fetching sales:", error);
            showStatusMessage("Error", "Failed to load sales");
        } finally {
            setLoading(false);
        }
    };
    
    const fetchCustomers = async () => {
        try {
            const response = await AllCustomers();
            if (response.status === 200) {
                setCustomers(response.data.data);
            }
        } catch (error) {
            console.error("Error fetching customers:", error);
        }
    };
    
    const fetchProducts = async () => {
        try {
            const response = await AllProducts();
            if (response.status === 200) {
                setProducts(response.data.data);
            }
        } catch (error) {
            console.error("Error fetching products:", error);
        }
    };

    const handleAddSale = async () => {
        // Validate form
        if (!newSale.customerID || !newSale.productID || !newSale.quantity || !newSale.totalPrice || !newSale.purchaseDate) {
            showStatusMessage("Error", "All fields are required");
            return;
        }

        try {
            const response = await AddSale(
                newSale.customerID,
                newSale.productID,
                newSale.quantity,
                newSale.totalPrice,
                newSale.purchaseDate
            );
            
            if (response.status === 201) {
                showStatusMessage("Success", "Sale added successfully");
                setNewSale({
                    customerID: "",
                    productID: "",
                    quantity: "",
                    totalPrice: "",
                    purchaseDate: new Date().toISOString().split('T')[0]
                });
                fetchSales();
            }
        } catch (error) {
            console.error("Error adding sale:", error);
            showStatusMessage("Error", "Failed to add sale");
        }
    };

    const handleDeleteSale = async (id) => {
        try {
            const response = await DeleteSale(id);
            if (response.status === 200) {
                showStatusMessage("Success", "Sale deleted successfully");
                fetchSales();
            }
        } catch (error) {
            console.error("Error deleting sale:", error);
            showStatusMessage("Error", "Failed to delete sale");
        }
    };

    const startEditing = (sale) => {
        setEditingSale(sale);
        setEditForm({
            quantity: sale.quantity,
            totalPrice: sale.totalPrice,
            purchaseDate: new Date(sale.purchaseDate).toISOString().split('T')[0]
        });
    };

    const handleUpdateSale = async () => {
        if (!editForm.quantity || !editForm.totalPrice || !editForm.purchaseDate) {
            showStatusMessage("Error", "All fields are required");
            return;
        }

        try {
            const response = await UpdateSale(
                editingSale.saleID,
                editForm.quantity,
                editForm.totalPrice,
                editForm.purchaseDate
            );
            
            if (response.status === 200) {
                showStatusMessage("Success", "Sale updated successfully");
                setEditingSale(null);
                fetchSales();
            }
        } catch (error) {
            console.error("Error updating sale:", error);
            showStatusMessage("Error", "Failed to update sale");
        }
    };

    const cancelEditing = () => {
        setEditingSale(null);
    };

    const showStatusMessage = (type, message) => {
        setStatusMessage({ type, message });
        setShowStatus(true);
        setTimeout(() => setShowStatus(false), 3000);
    };
    
    const getCustomerName = (customerID) => {
        const customer = customers.find(c => c.customerID === customerID);
        return customer ? customer.customerName : "Unknown Customer";
    };
    
    const getProductName = (productID) => {
        const product = products.find(p => p.productID === productID);
        return product ? product.productName : "Unknown Product";
    };

    if (authStatus === null) {
        return <TitledIndicator Process="Loading..." />
    }

    return <>
        {
            authStatus
                ? <DashboardLayout>
                    <div className="container py-4">
                        <h1 className="mb-4">Sales Management</h1>
                        
                        {/* Add New Sale */}
                        <div className="card mb-4">
                            <div className="card-header bg-dark text-white">
                                <h5 className="mb-0">Add New Sale</h5>
                            </div>
                            <div className="card-body">
                                <div className="row g-3">
                                    <div className="col-md-6">
                                        <label className="form-label">Customer</label>
                                        <DropDownWithSearch 
                                            Options={Array.isArray(customers) ? customers.map(customer => ({
                                                ID: customer.customerID,
                                                Name: customer.customerName
                                            })) : []} 
                                            OnSelect={(selected) => setNewSale({...newSale, customerID: selected.ID})} 
                                            Placeholder="Select Customer" 
                                        />
                                    </div>
                                    <div className="col-md-6">
                                        <label className="form-label">Product</label>
                                        <DropDownWithSearch 
                                            Options={Array.isArray(products) ? products.map(product => ({
                                                ID: product.productID,
                                                Name: product.productName
                                            })) : []} 
                                            OnSelect={(selected) => setNewSale({...newSale, productID: selected.ID})} 
                                            Placeholder="Select Product" 
                                        />
                                    </div>
                                    <div className="col-md-4">
                                        <label className="form-label">Quantity</label>
                                        <SimpleInput 
                                            Text="Quantity" 
                                            BGColor="#f8f9fa" 
                                            BRColor="#ced4da" 
                                            Color="#212529" 
                                            Value={newSale.quantity} 
                                            CallBack={(value) => setNewSale({...newSale, quantity: value})} 
                                            Type="number"
                                        />
                                    </div>
                                    <div className="col-md-4">
                                        <label className="form-label">Total Price</label>
                                        <SimpleInput 
                                            Text="Total Price" 
                                            BGColor="#f8f9fa" 
                                            BRColor="#ced4da" 
                                            Color="#212529" 
                                            Value={newSale.totalPrice} 
                                            CallBack={(value) => setNewSale({...newSale, totalPrice: value})} 
                                            Type="number"
                                        />
                                    </div>
                                    <div className="col-md-4">
                                        <label className="form-label">Purchase Date</label>
                                        <SimpleInput 
                                            Text="Purchase Date" 
                                            BGColor="#f8f9fa" 
                                            BRColor="#ced4da" 
                                            Color="#212529" 
                                            Value={newSale.purchaseDate} 
                                            CallBack={(value) => setNewSale({...newSale, purchaseDate: value})} 
                                            Type="date"
                                        />
                                    </div>
                                    <div className="col-12 mt-3">
                                        <Button 
                                            Title="Add Sale" 
                                            BGColor="#0d6efd" 
                                            Color="white" 
                                            BRColor="#0d6efd" 
                                            OnClick={handleAddSale} 
                                        />
                                    </div>
                                </div>
                            </div>
                        </div>
                        
                        {/* Sales List */}
                        <div className="card">
                            <div className="card-header bg-dark text-white">
                                <h5 className="mb-0">Sales List</h5>
                            </div>
                            <div className="card-body">
                                {loading ? (
                                    <TitledIndicator Process="Loading sales..." />
                                ) : sales.length === 0 ? (
                                    <p className="text-center">No sales found</p>
                                ) : (
                                    <div className="table-responsive">
                                        <table className="table table-striped table-hover">
                                            <thead>
                                                <tr>
                                                    <th>ID</th>
                                                    <th>Customer</th>
                                                    <th>Product</th>
                                                    <th>Quantity</th>
                                                    <th>Total Price</th>
                                                    <th>Purchase Date</th>
                                                    <th>Actions</th>
                                                </tr>
                                            </thead>
                                            <tbody>
                                                {Array.isArray(sales) ? sales.map(sale => (
                                                    <tr key={sale.saleID}>
                                                        <td>{sale.saleID}</td>
                                                        <td>{getCustomerName(sale.customerID)}</td>
                                                        <td>{getProductName(sale.productID)}</td>
                                                        <td>
                                                            {editingSale && editingSale.saleID === sale.saleID ? (
                                                                <SimpleInput 
                                                                    Text="Edit Quantity" 
                                                                    BGColor="#f8f9fa" 
                                                                    BRColor="#ced4da" 
                                                                    Color="#212529" 
                                                                    Value={editForm.quantity} 
                                                                    CallBack={(value) => setEditForm({...editForm, quantity: value})} 
                                                                    Type="number"
                                                                />
                                                            ) : (
                                                                sale.quantity
                                                            )}
                                                        </td>
                                                        <td>
                                                            {editingSale && editingSale.saleID === sale.saleID ? (
                                                                <SimpleInput 
                                                                    Text="Edit Total Price" 
                                                                    BGColor="#f8f9fa" 
                                                                    BRColor="#ced4da" 
                                                                    Color="#212529" 
                                                                    Value={editForm.totalPrice} 
                                                                    CallBack={(value) => setEditForm({...editForm, totalPrice: value})} 
                                                                    Type="number"
                                                                />
                                                            ) : (
                                                                sale.totalPrice
                                                            )}
                                                        </td>
                                                        <td>
                                                            {editingSale && editingSale.saleID === sale.saleID ? (
                                                                <SimpleInput 
                                                                    Text="Edit Purchase Date" 
                                                                    BGColor="#f8f9fa" 
                                                                    BRColor="#ced4da" 
                                                                    Color="#212529" 
                                                                    Value={editForm.purchaseDate} 
                                                                    CallBack={(value) => setEditForm({...editForm, purchaseDate: value})} 
                                                                    Type="date"
                                                                />
                                                            ) : (
                                                                new Date(sale.purchaseDate).toLocaleDateString()
                                                            )}
                                                        </td>
                                                        <td>
                                                            {editingSale && editingSale.saleID === sale.saleID ? (
                                                                <div className="d-flex gap-2">
                                                                    <Button 
                                                                        Title="Save" 
                                                                        BGColor="#198754" 
                                                                        Color="white" 
                                                                        BRColor="#198754" 
                                                                        OnClick={handleUpdateSale} 
                                                                    />
                                                                    <Button 
                                                                        Title="Cancel" 
                                                                        BGColor="#6c757d" 
                                                                        Color="white" 
                                                                        BRColor="#6c757d" 
                                                                        OnClick={cancelEditing} 
                                                                    />
                                                                </div>
                                                            ) : (
                                                                <div className="d-flex gap-2">
                                                                    <Button 
                                                                        Title="Edit" 
                                                                        BGColor="#0d6efd" 
                                                                        Color="white" 
                                                                        BRColor="#0d6efd" 
                                                                        OnClick={() => startEditing(sale)} 
                                                                    />
                                                                    <Button 
                                                                        Title="Delete" 
                                                                        BGColor="#dc3545" 
                                                                        Color="white" 
                                                                        BRColor="#dc3545" 
                                                                        OnClick={() => handleDeleteSale(sale.saleID)} 
                                                                    />
                                                                </div>
                                                            )}
                                                        </td>
                                                    </tr>
                                                )) : []}
                                            </tbody>
                                        </table>
                                    </div>
                                )}
                            </div>
                        </div>
                    </div>
                    
                    {/* Status Message */}
                    {showStatus && statusMessage && (
                        <SimpleStatusContainer 
                            Message={statusMessage.type} 
                            Desc={statusMessage.message} 
                            Buttons={[
                                {
                                    BGColor: "#0d6efd",
                                    BRColor: "#0d6efd",
                                    Color: "white",
                                    OnClick: () => setShowStatus(false),
                                    Title: "Close"
                                }
                            ]}
                        />
                    )}
                </DashboardLayout>
                : <Forbidden />
        }
    </>
}

export default Sales;