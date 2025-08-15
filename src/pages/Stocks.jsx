import DashboardLayout from "../layouts/DashboardLayout.jsx";
import { Forbidden, TitledIndicator, Button, SimpleInput, SimpleStatusContainer, DropDownWithSearch } from "../components/mainComponent.jsx";
import VerifyEntry from "../services/validateUserEntry.jsx"
import { useEffect, useState } from "react";
import { AllStocks, AddStock, DeleteStock, UpdateStock } from "../services/stockService.jsx";
import { AllWholesalers } from "../services/wholesalerService.jsx";
import { AllProducts } from "../services/productService.jsx";

function Stocks() {
    const [authStatus, setAuthStatus] = useState(null);
    const [stocks, setStocks] = useState([]);
    const [wholesalers, setWholesalers] = useState([]);
    const [products, setProducts] = useState([]);
    const [loading, setLoading] = useState(true);
    const [statusMessage, setStatusMessage] = useState("");
    const [showStatus, setShowStatus] = useState(false);
    
    // Form states for adding new stock
    const [newStock, setNewStock] = useState({
        productID: "",
        wholesalerID: "",
        quantity: "",
        totalCost: "",
        sellingPrice: ""
    });
    
    // Form states for editing stock
    const [editingStock, setEditingStock] = useState(null);
    const [editForm, setEditForm] = useState({
        quantity: "",
        totalCost: "",
        sellingPrice: ""
    });

    useEffect(() => {
    (async () => {
        const result = await VerifyEntry();
        setAuthStatus(result);
        if (result) {
            await Promise.all([fetchProducts(), fetchWholesalers()]);
            await fetchStocks();
        }
    })();
}, []);

    
    const fetchStocks = async () => {
        setLoading(true);
        try {
            const response = await AllStocks();
            if (response.status === 200) {
                console.log("All Stocks:", response.data.data);

                
                setStocks(response.data.data[1]);
            }
        } catch (error) {
            console.error("Error fetching stocks:", error);
            showStatusMessage("Error", "Failed to load stocks");
        } finally {
            setLoading(false);
        }
    };
    
    const fetchWholesalers = async () => {
        try {
            const response = await AllWholesalers();
            if (response.status === 200) {
                const data = response.data.data;
                let allWholesalers = [];
                if (Array.isArray(data)) {
                    allWholesalers = data;
                } else if (typeof data === "object" && data !== null) {
                    for (const group in data) {
                        allWholesalers = [...allWholesalers, ...data[group]];
                    }
                }
                setWholesalers(allWholesalers);
            }
        } catch (error) {
            console.error("Error fetching wholesalers:", error);
        }
    };
    
    const fetchProducts = async () => {
        try {
            const response = await AllProducts();
            if (response.status === 200) {
                const productData = response.data.data;
                // Flatten possible grouped product structure
                let allProducts = [];
                if (Array.isArray(productData)) {
                    allProducts = productData; // already an array
                } else if (typeof productData === "object" && productData !== null) {
                    for (const group in productData) {
                        allProducts = [...allProducts, ...productData[group]];
                    }
                }
                setProducts(allProducts);
            }
        } catch (error) {
            console.error("Error fetching products:", error);
        }
    };

    const handleAddStock = async () => {
        // Validate form
        if (!newStock.productID || !newStock.wholesalerID || !newStock.quantity || !newStock.totalCost || !newStock.sellingPrice) {
            showStatusMessage("Error", "All fields are required");
            return;
        }

        try {
            const response = await AddStock({
                productID: Number(newStock.productID),
                wholesalerID: Number(newStock.wholesalerID),
                stock: Number(newStock.quantity),
                totalCost: Number(newStock.totalCost),
                sellingPrice: Number(newStock.sellingPrice)
            });
            
            if (response.status === 201) {
                showStatusMessage("Success", "Stock added successfully");
                setNewStock({
                    productID: "",
                    wholesalerID: "",
                    quantity: "",
                    totalCost: "",
                    sellingPrice: ""
                });
                fetchStocks();
            }
        } catch (error) {
            console.error("Error adding stock:", error);
            showStatusMessage("Error", "Failed to add stock");
        }
    };

    const handleDeleteStock = async (id) => {
        try {
            const response = await DeleteStock(id);
            if (response.status === 200) {
                showStatusMessage("Success", "Stock deleted successfully");
                fetchStocks();
            }
        } catch (error) {
            console.error("Error deleting stock:", error);
            showStatusMessage("Error", "Failed to delete stock");
        }
    };

    const startEditing = (stock) => {
        setEditingStock(stock);
        setEditForm({
            quantity: stock.quantity,
            totalCost: stock.totalCost,
            sellingPrice: stock.sellingPrice
        });
    };

    const handleUpdateStock = async () => {
        if (!editForm.quantity || !editForm.totalCost || !editForm.sellingPrice) {
            showStatusMessage("Error", "All fields are required");
            return;
        }

        try {
            const response = await UpdateStock(
                editingStock.stockID,
                {
                    productID: Number(editingStock.productID),
                    wholesalerID: Number(editingStock.wholesalerID),
                    stock: Number(editForm.quantity),
                    totalCost: Number(editForm.totalCost),
                    sellingPrice: Number(editForm.sellingPrice)
                }
            );
            
            if (response.status === 200) {
                showStatusMessage("Success", "Stock updated successfully");
                setEditingStock(null);
                fetchStocks();
            }
        } catch (error) {
            console.error("Error updating stock:", error);
            showStatusMessage("Error", "Failed to update stock");
        }
    };

    const cancelEditing = () => {
        setEditingStock(null);
    };

    const showStatusMessage = (type, message) => {
        setStatusMessage({ type, message });
        setShowStatus(true);
        setTimeout(() => setShowStatus(false), 3000);
    };
    
    const getProductName = (productID) => {
        console.log("Product ID:", productID);

        
        const product = products.find(p => String(p.productID) === String(productID));
        return product ? product.productName : "Unknown Product";
    };
    
    const getWholesalerName = (wholesalerID) => {
        const wholesaler = wholesalers.find(w => String(w.wholesalerID) === String(wholesalerID));
        return wholesaler ? wholesaler.wholesalerName : "Unknown Wholesaler";
    };

    if (authStatus === null) {
        return <TitledIndicator Process="Loading..." />
    }

    return <>
        {
            authStatus
                ? <DashboardLayout>
                    <div className="container py-4">
                        <h1 className="mb-4 text-white">Stock Management</h1>
                        
                        {/* Add New Stock */}
                        <div className="card mb-4">
                            <div className="card-header bg-dark text-white">
                                <h5 className="mb-0">Add New Stock</h5>
                            </div>
                            <div className="card-body">
                                <div className="row g-3">
                                    <div className="col-md-6">
                                        <label className="form-label">Product</label>
                                        <DropDownWithSearch 
                                            Options={Array.isArray(products) ? products.map(product => ({
                                                ID: product.productID,
                                                Name: product.productName
                                            })) : []} 
                                            OnSelect={(selected) => setNewStock({...newStock, productID: selected.id})} 
                                            Placeholder="Select Product" 
                                            value={newStock.productID}
                                        />
                                    </div>
                                    <div className="col-md-6">
                                        <label className="form-label">Wholesaler</label>
                                        <DropDownWithSearch 
                                            Options={Array.isArray(wholesalers) ? wholesalers.map(wholesaler => ({
                                                ID: wholesaler.wholesalerID,
                                                Name: wholesaler.wholesalerName
                                            })) : []} 
                                            OnSelect={(selected) => setNewStock({...newStock, wholesalerID: selected.id})} 
                                            Placeholder="Select Wholesaler" 
                                            value={newStock.wholesalerID}
                                        />
                                    </div>
                                    <div className="col-md-4">
                                        <label className="form-label">Quantity</label>
                                        <SimpleInput 
                                            Text="Quantity" 
                                            BGColor="#f8f9fa" 
                                            BRColor="#ced4da" 
                                            Color="#212529" 
                                            Value={newStock.quantity} 
                                            CallBack={(value) => setNewStock({...newStock, quantity: value})} 
                                            Type="number"
                                        />
                                    </div>
                                    <div className="col-md-4">
                                        <label className="form-label">Total Cost</label>
                                        <SimpleInput 
                                            Text="Total Cost" 
                                            BGColor="#f8f9fa" 
                                            BRColor="#ced4da" 
                                            Color="#212529" 
                                            Value={newStock.totalCost} 
                                            CallBack={(value) => setNewStock({...newStock, totalCost: value})} 
                                            Type="number"
                                        />
                                    </div>
                                    <div className="col-md-4">
                                        <label className="form-label">Selling Price</label>
                                        <SimpleInput 
                                            Text="Selling Price" 
                                            BGColor="#f8f9fa" 
                                            BRColor="#ced4da" 
                                            Color="#212529" 
                                            Value={newStock.sellingPrice} 
                                            CallBack={(value) => setNewStock({...newStock, sellingPrice: value})} 
                                            Type="number"
                                        />
                                    </div>
                                    <div className="col-12 mt-3">
                                        <Button 
                                            Title="Add Stock" 
                                            BGColor="#0d6efd" 
                                            Color="white" 
                                            BRColor="#0d6efd" 
                                            OnClick={handleAddStock} 
                                        />
                                    </div>
                                </div>
                            </div>
                        </div>
                        
                        {/* Stocks List */}
                        <div className="card">
                            <div className="card-header bg-dark text-white">
                                <h5 className="mb-0">Stocks List</h5>
                            </div>
                            <div className="card-body">
                                {loading ? (
                                    <TitledIndicator Process="Loading stocks..." />
                                ) : stocks.length === 0 ? (
                                    <p className="text-center">No stocks found</p>
                                ) : (
                                    <div className="table-responsive">
                                        <table className="table table-striped table-hover">
                                            <thead>
                                                <tr>
                                                    <th>ID</th>
                                                    <th>Product</th>
                                                    <th>Wholesaler</th>
                                                    <th>Quantity</th>
                                                    <th>Total Cost</th>
                                                    <th>Selling Price</th>
                                                    <th>Actions</th>
                                                </tr>
                                            </thead>
                                            <tbody>
                                                {Array.isArray(stocks) && stocks.length > 0 ? stocks.map(stock => (
                                                    <tr key={stock.stockID}>
                                                        <td>{stock.stockID}</td>
                                                        <td>{stock.productName} </td>
                                                        {/* <td>{getWholesalerName(stock.wholesalerID)}</td> */}
                                                        <td>{stock.wholesalerName}</td>
                                                        <td>
                                                            {editingStock && editingStock.stockID === stock.stockID ? (
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
                                                                stock.stock
                                                            )}
                                                        </td>
                                                        <td>
                                                            {editingStock && editingStock.stockID === stock.stockID ? (
                                                                <SimpleInput 
                                                                    Text="Edit Total Cost" 
                                                                    BGColor="#f8f9fa" 
                                                                    BRColor="#ced4da" 
                                                                    Color="#212529" 
                                                                    Value={editForm.totalCost} 
                                                                    CallBack={(value) => setEditForm({...editForm, totalCost: value})} 
                                                                    Type="number"
                                                                />
                                                            ) : (
                                                                stock.totalCost
                                                            )}
                                                        </td>
                                                        <td>
                                                            {editingStock && editingStock.stockID === stock.stockID ? (
                                                                <SimpleInput 
                                                                    Text="Edit Selling Price" 
                                                                    BGColor="#f8f9fa" 
                                                                    BRColor="#ced4da" 
                                                                    Color="#212529" 
                                                                    Value={editForm.sellingPrice} 
                                                                    CallBack={(value) => setEditForm({...editForm, sellingPrice: value})} 
                                                                    Type="number"
                                                                />
                                                            ) : (
                                                                stock.sellingPrice
                                                            )}
                                                        </td>
                                                        <td>
                                                            {editingStock && editingStock.stockID === stock.stockID ? (
                                                                <div className="d-flex gap-2">
                                                                    <Button 
                                                                        Title="Save" 
                                                                        BGColor="#198754" 
                                                                        Color="white" 
                                                                        BRColor="#198754" 
                                                                        OnClick={handleUpdateStock} 
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
                                                                        OnClick={() => startEditing(stock)} 
                                                                    />
                                                                    <Button 
                                                                        Title="Delete" 
                                                                        BGColor="#dc3545" 
                                                                        Color="white" 
                                                                        BRColor="#dc3545" 
                                                                        OnClick={() => handleDeleteStock(stock.stockID)} 
                                                                    />
                                                                </div>
                                                            )}
                                                        </td>
                                                    </tr>
                                                )) : null}
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

export default Stocks;
