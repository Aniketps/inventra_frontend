import MainLayout from "../layouts/MainLayout.jsx";
import { Forbidden, TitledIndicator, Button, SimpleInput, SimpleStatusContainer, DropDownWithSearch } from "../components/mainComponent.jsx";
import VerifyEntry from "../services/validateUserEntry.jsx"
import { useEffect, useState } from "react";
import { AllWholesalerProductEntries, AddWholesalerProductEntry, DeleteWholesalerProductEntry, UpdateWholesalerProductEntry } from "../services/wholesalerProductEntryService.jsx";
import { AllProducts } from "../services/productService.jsx";
import { AllWholesalers } from "../services/wholesalerService.jsx";

function Purchases() {
    const [authStatus, setAuthStatus] = useState(null);
    const [purchases, setPurchases] = useState([]);
    const [products, setProducts] = useState([]);
    const [wholesalers, setWholesalers] = useState([]);
    const [loading, setLoading] = useState(true);
    const [newPurchase, setNewPurchase] = useState({
        productID: "",
        wholesalerID: "",
        cost: "",
        quantity: ""
    });
    const [editingPurchase, setEditingPurchase] = useState(null);
    const [statusMessage, setStatusMessage] = useState({ message: "", type: "" });

    useEffect(() => {
        (
            async () => {
                const result = await VerifyEntry();
                setAuthStatus(result);
                if (result) {
                    fetchPurchases();
                    fetchProducts();
                    fetchWholesalers();
                }
            }
        )();
    }, []);

    const fetchPurchases = async () => {
        try {
            setLoading(true);
            const response = await AllWholesalerProductEntries();
            if (response.status === 200) {
                setPurchases(response.data.data[1] || []);
            }
            setLoading(false);
        } catch (error) {
            console.error("Error fetching purchases:", error);
            setLoading(false);
        }
    };

    const fetchProducts = async () => {
        try {
            const response = await AllProducts();
            if (response.status === 200) {
                setProducts(response.data.data[1] || []);
            }
        } catch (error) {
            console.error("Error fetching products:", error);
        }
    };

    const fetchWholesalers = async () => {
        try {
            const response = await AllWholesalers();
            if (response.status === 200) {
                setWholesalers(response.data.data[1] || []);
            }
        } catch (error) {
            console.error("Error fetching wholesalers:", error);
        }
    };

    const handleAddPurchase = async () => {
        try {
            if (!newPurchase.productID || !newPurchase.wholesalerID || !newPurchase.cost || !newPurchase.quantity) {
                showStatusMessage("Please fill all fields", "error");
                return;
            }

            const response = await AddWholesalerProductEntry(
                newPurchase.productID,
                newPurchase.wholesalerID,
                newPurchase.cost,
                newPurchase.quantity
            );

            if (response.status === 201) {
                showStatusMessage("Purchase added successfully", "success");
                setNewPurchase({
                    productID: "",
                    wholesalerID: "",
                    cost: "",
                    quantity: ""
                });
                fetchPurchases();
            } else {
                showStatusMessage("Failed to add purchase", "error");
            }
        } catch (error) {
            console.error("Error adding purchase:", error);
            showStatusMessage("Failed to add purchase", "error");
        }
    };

    const handleDeletePurchase = async (id) => {
        try {
            const response = await DeleteWholesalerProductEntry(id);
            if (response.status === 200) {
                showStatusMessage("Purchase deleted successfully", "success");
                fetchPurchases();
            } else {
                showStatusMessage("Failed to delete purchase", "error");
            }
        } catch (error) {
            console.error("Error deleting purchase:", error);
            showStatusMessage("Failed to delete purchase", "error");
        }
    };

    const startEditing = (purchase) => {
        setEditingPurchase({
            ...purchase,
            productID: getProductIdByName(purchase.productName),
            wholesalerID: getWholesalerIdByName(purchase.wholesalerName)
        });
    };

    const handleUpdatePurchase = async () => {
        try {
            if (!editingPurchase.productID || !editingPurchase.wholesalerID || !editingPurchase.stock || !editingPurchase.costPrice) {
                showStatusMessage("Please fill all fields", "error");
                return;
            }

            const response = await UpdateWholesalerProductEntry(
                editingPurchase.wholesalerProductID,
                editingPurchase.productID,
                editingPurchase.wholesalerID,
                editingPurchase.stock,
                editingPurchase.costPrice
            );

            if (response.status === 200) {
                showStatusMessage("Purchase updated successfully", "success");
                setEditingPurchase(null);
                fetchPurchases();
            } else {
                showStatusMessage("Failed to update purchase", "error");
            }
        } catch (error) {
            console.error("Error updating purchase:", error);
            showStatusMessage("Failed to update purchase", "error");
        }
    };

    const cancelEditing = () => {
        setEditingPurchase(null);
    };

    const showStatusMessage = (message, type) => {
        setStatusMessage({ message, type });
        setTimeout(() => {
            setStatusMessage({ message: "", type: "" });
        }, 3000);
    };

    const getProductIdByName = (productName) => {
        const product = products.find(p => p.productName === productName);
        return product ? product.productID : "";
    };

    const getWholesalerIdByName = (wholesalerName) => {
        const wholesaler = wholesalers.find(w => w.wholesalerName === wholesalerName);
        return wholesaler ? wholesaler.wholesalerID : "";
    };

    const getProductName = (productId) => {
        const product = products.find(p => p.productID === productId);
        return product ? product.productName : "Unknown Product";
    };

    const getWholesalerName = (wholesalerId) => {
        const wholesaler = wholesalers.find(w => w.wholesalerID === wholesalerId);
        return wholesaler ? wholesaler.wholesalerName : "Unknown Wholesaler";
    };

    if (authStatus === null) {
        return <TitledIndicator Process="Loading..." />
    }

    return <>
        {
            authStatus
                ? <MainLayout>
                    <div className="container mx-auto p-4">
                        <h1 className="text-2xl font-bold mb-6">Manage Purchases</h1>
                        
                        {/* Add New Purchase Form */}
                        <div className="bg-white p-4 rounded shadow mb-6">
                            <h2 className="text-xl font-semibold mb-4">Add New Purchase</h2>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">Product</label>
                                    <DropDownWithSearch 
                                        options={Array.isArray(products) ? products.map(product => ({
                                            value: product.productID,
                                            label: product.productName
                                        })) : []}
                                        onChange={(value) => setNewPurchase({...newPurchase, productID: value})}
                                        value={newPurchase.productID}
                                        placeholder="Select Product"
                                    />
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">Wholesaler</label>
                                    <DropDownWithSearch 
                                        options={Array.isArray(wholesalers) ? wholesalers.map(wholesaler => ({
                                            value: wholesaler.wholesalerID,
                                            label: wholesaler.wholesalerName
                                        })) : []}
                                        onChange={(value) => setNewPurchase({...newPurchase, wholesalerID: value})}
                                        value={newPurchase.wholesalerID}
                                        placeholder="Select Wholesaler"
                                    />
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">Cost Price</label>
                                    <SimpleInput 
                                        type="number"
                                        value={newPurchase.cost}
                                        onChange={(e) => setNewPurchase({...newPurchase, cost: e.target.value})}
                                        placeholder="Enter Cost Price"
                                    />
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">Quantity</label>
                                    <SimpleInput 
                                        type="number"
                                        value={newPurchase.quantity}
                                        onChange={(e) => setNewPurchase({...newPurchase, quantity: e.target.value})}
                                        placeholder="Enter Quantity"
                                    />
                                </div>
                            </div>
                            <Button 
                                text="Add Purchase"
                                onClick={handleAddPurchase}
                                className="bg-blue-600 hover:bg-blue-700 text-white"
                            />
                        </div>
                        
                        {/* Status Message */}
                        {statusMessage.message && (
                            <SimpleStatusContainer 
                                message={statusMessage.message} 
                                type={statusMessage.type} 
                            />
                        )}
                        
                        {/* Purchases List */}
                        <div className="bg-white p-4 rounded shadow">
                            <h2 className="text-xl font-semibold mb-4">Purchases List</h2>
                            {loading ? (
                                <TitledIndicator Process="Loading purchases..." />
                            ) : purchases.length === 0 ? (
                                <p className="text-gray-500">No purchases found.</p>
                            ) : (
                                <div className="overflow-x-auto">
                                    <table className="min-w-full bg-white">
                                        <thead className="bg-gray-100">
                                            <tr>
                                                <th className="py-2 px-4 border-b text-left">ID</th>
                                                <th className="py-2 px-4 border-b text-left">Product</th>
                                                <th className="py-2 px-4 border-b text-left">Wholesaler</th>
                                                <th className="py-2 px-4 border-b text-left">Date</th>
                                                <th className="py-2 px-4 border-b text-left">Quantity</th>
                                                <th className="py-2 px-4 border-b text-left">Cost Price</th>
                                                <th className="py-2 px-4 border-b text-left">Total Cost</th>
                                                <th className="py-2 px-4 border-b text-left">Actions</th>
                                            </tr>
                                        </thead>
                                        <tbody>
                                            {Array.isArray(purchases) ? purchases.map((purchase) => (
                                                <tr key={purchase.wholesalerProductID}>
                                                    <td className="py-2 px-4 border-b">{purchase.wholesalerProductID}</td>
                                                    <td className="py-2 px-4 border-b">
                                                        {editingPurchase && editingPurchase.wholesalerProductID === purchase.wholesalerProductID ? (
                                                            <DropDownWithSearch 
                                                                options={Array.isArray(products) ? products.map(product => ({
                                                                    value: product.productID,
                                                                    label: product.productName
                                                                })) : []}
                                                                onChange={(value) => setEditingPurchase({...editingPurchase, productID: value})}
                                                                value={editingPurchase.productID}
                                                                placeholder="Select Product"
                                                            />
                                                        ) : (
                                                            purchase.productName
                                                        )}
                                                    </td>
                                                    <td className="py-2 px-4 border-b">
                                                        {editingPurchase && editingPurchase.wholesalerProductID === purchase.wholesalerProductID ? (
                                                            <DropDownWithSearch 
                                                                options={Array.isArray(wholesalers) ? wholesalers.map(wholesaler => ({
                                                                    value: wholesaler.wholesalerID,
                                                                    label: wholesaler.wholesalerName
                                                                })) : []}
                                                                onChange={(value) => setEditingPurchase({...editingPurchase, wholesalerID: value})}
                                                                value={editingPurchase.wholesalerID}
                                                                placeholder="Select Wholesaler"
                                                            />
                                                        ) : (
                                                            purchase.wholesalerName
                                                        )}
                                                    </td>
                                                    <td className="py-2 px-4 border-b">{purchase.entryDate}</td>
                                                    <td className="py-2 px-4 border-b">
                                                        {editingPurchase && editingPurchase.wholesalerProductID === purchase.wholesalerProductID ? (
                                                            <SimpleInput 
                                                                type="number"
                                                                value={editingPurchase.stock}
                                                                onChange={(e) => setEditingPurchase({...editingPurchase, stock: e.target.value})}
                                                                placeholder="Enter Quantity"
                                                            />
                                                        ) : (
                                                            purchase.stock
                                                        )}
                                                    </td>
                                                    <td className="py-2 px-4 border-b">
                                                        {editingPurchase && editingPurchase.wholesalerProductID === purchase.wholesalerProductID ? (
                                                            <SimpleInput 
                                                                type="number"
                                                                value={editingPurchase.costPrice}
                                                                onChange={(e) => setEditingPurchase({...editingPurchase, costPrice: e.target.value})}
                                                                placeholder="Enter Cost Price"
                                                            />
                                                        ) : (
                                                            purchase.costPrice
                                                        )}
                                                    </td>
                                                    <td className="py-2 px-4 border-b">{purchase.totalCost}</td>
                                                    <td className="py-2 px-4 border-b">
                                                        {editingPurchase && editingPurchase.wholesalerProductID === purchase.wholesalerProductID ? (
                                                            <div className="flex space-x-2">
                                                                <Button 
                                                                    text="Save"
                                                                    onClick={handleUpdatePurchase}
                                                                    className="bg-green-600 hover:bg-green-700 text-white text-sm px-2 py-1"
                                                                />
                                                                <Button 
                                                                    text="Cancel"
                                                                    onClick={cancelEditing}
                                                                    className="bg-gray-500 hover:bg-gray-600 text-white text-sm px-2 py-1"
                                                                />
                                                            </div>
                                                        ) : (
                                                            <div className="flex space-x-2">
                                                                <Button 
                                                                    text="Edit"
                                                                    onClick={() => startEditing(purchase)}
                                                                    className="bg-blue-600 hover:bg-blue-700 text-white text-sm px-2 py-1"
                                                                />
                                                                <Button 
                                                                    text="Delete"
                                                                    onClick={() => handleDeletePurchase(purchase.wholesalerProductID)}
                                                                    className="bg-red-600 hover:bg-red-700 text-white text-sm px-2 py-1"
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
                </MainLayout>
                : <Forbidden />
        }
    </>
}

export default Purchases;