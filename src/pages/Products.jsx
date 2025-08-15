import DashboardLayout from "../layouts/DashboardLayout.jsx";
import { Forbidden, TitledIndicator, Button, SimpleInput, SimpleStatusContainer, DropDownWithSearch } from "../components/mainComponent.jsx";
import VerifyEntry from "../services/validateUserEntry.jsx"
import { useEffect, useState } from "react";
import { AllProducts, AddProduct, DeleteProduct, UpdateProduct } from "../services/productService.jsx";
import { AllCategories } from "../services/categoryService.jsx";

function Products() {
    const [authStatus, setAuthStatus] = useState(null);
    const [products, setProducts] = useState([]);
    const [categories, setCategories] = useState([]);
    const [loading, setLoading] = useState(true);
    const [newProduct, setNewProduct] = useState({
        name: "",
        categoryID: ""
    });
    const [editingProduct, setEditingProduct] = useState(null);
    const [editName, setEditName] = useState("");
    const [editCategoryID, setEditCategoryID] = useState("");
    const [statusMessage, setStatusMessage] = useState("");
    const [showStatus, setShowStatus] = useState(false);

    useEffect(() => {
        (
            async () => {
                const result = await VerifyEntry();
                setAuthStatus(result);
                if (result) {
                    fetchProducts();
                    fetchCategories();
                }
            }
        )();
    }, []);
    
    const fetchProducts = async () => {
        setLoading(true);
        try {
            const response = await AllProducts();
            if (response.status === 200) {
                const productData = response.data.data;
                // Flatten the grouped data structure
                let allProducts = [];
                for (const group in productData) {
                    allProducts = [...allProducts, ...productData[group]];
                }
                console.log("All products: ", allProducts);

                setProducts(allProducts);
            }
        } catch (error) {
            console.error("Error fetching products:", error);
            showStatusMessage("Error", "Failed to load products");
        } finally {
            setLoading(false);
        }
    };

    const fetchCategories = async () => {
        try {
            const response = await AllCategories();
            if (response.status === 200) {
                const categoryData = response.data.data;
                // Flatten the grouped data structure
                let allCategories = [];
                for (const group in categoryData) {
                    allCategories = [...allCategories, ...categoryData[group]];
                }
                console.log("All categories: ", allCategories);

                
                setCategories(allCategories);
            }
        } catch (error) {
            console.error("Error fetching categories:", error);
        }
    };

    const handleAddProduct = async () => {
        if (!newProduct.name.trim()) {
            showStatusMessage("Error", "Product name cannot be empty");
            return;
        }

        if (!newProduct.categoryID) {
            showStatusMessage("Error", "Please select a category");
            return;
        }

        try {
            // Ensure consistent type handling for API call
            const response = await AddProduct(
                newProduct.name, 
                String(newProduct.categoryID)
            );
            if (response.status === 201) {
                showStatusMessage("Success", "Product added successfully");
                setNewProduct({
                    name: "",
                    categoryID: ""
                });
                fetchProducts();
            }
        } catch (error) {
            console.error("Error adding product:", error);
            showStatusMessage("Error", "Failed to add product");
        }
    };

    const handleDeleteProduct = async (id) => {
        try {
            const response = await DeleteProduct(id);
            if (response.status === 200) {
                showStatusMessage("Success", "Product deleted successfully");
                fetchProducts();
            }
        } catch (error) {
            console.error("Error deleting product:", error);
            showStatusMessage("Error", "Failed to delete product");
        }
    };

    const startEditing = (product) => {
        setEditingProduct(product);
        setEditName(product.productName);
        // Convert categoryID to string for consistent handling
        setEditCategoryID(product.categoryID ? String(product.categoryID) : "");
    };

    const handleUpdateProduct = async () => {
        if (!editName.trim()) {
            showStatusMessage("Error", "Product name cannot be empty");
            return;
        }

        if (!editCategoryID) {
            showStatusMessage("Error", "Please select a category");
            return;
        }

        try {
            // Ensure consistent type handling for API call
            const response = await UpdateProduct(
                editingProduct.productID, 
                editName, 
                String(editCategoryID)
            );
            if (response.status === 200) {
                showStatusMessage("Success", "Product updated successfully");
                setEditingProduct(null);
                fetchProducts();
            }
        } catch (error) {
            console.error("Error updating product:", error);
            showStatusMessage("Error", "Failed to update product");
        }
    };

    const cancelEditing = () => {
        setEditingProduct(null);
        setEditName("");
        setEditCategoryID("");
    };

    const showStatusMessage = (type, message) => {
        setStatusMessage({ type, message });
        setShowStatus(true);
        setTimeout(() => setShowStatus(false), 3000);
    };

    const getCategoryName = (categoryID) => {
        // Convert categoryID to string for consistent comparison
        const categoryIdString = String(categoryID);
        console.log("Category ID String: ", categoryID);

        
        const category = categories.find(c => String(c.categoryID) === categoryIdString);
        console.log("Category Name: "+(category ));
        console.log("Category ID: "+(category ? category.categoryID : "Unknown"));
        
        return category ? category.categoryName : "Unknown Category";
    };

    if (authStatus === null) {
        return <TitledIndicator Process="Loading..." />
    }

    return <>
        {
            authStatus
                ? <DashboardLayout>
                    <div className="container py-4">
                        <h1 className="mb-4 text-white">Products Management</h1>
                        
                        {/* Add New Product */}
                        <div className="card mb-4">
                            <div className="card-header bg-dark text-white">
                                <h5 className="mb-0">Add New Product</h5>
                            </div>
                            <div className="card-body">
                                <div className="row g-3">
                                    <div className="col-md-6">
                                        <label className="form-label">Product Name</label>
                                        <SimpleInput 
                                            Text="Product Name" 
                                            BGColor="#f8f9fa" 
                                            BRColor="#ced4da" 
                                            Color="#212529" 
                                            Value={newProduct.name} 
                                            CallBack={(value) => setNewProduct({...newProduct, name: value})} 
                                        />
                                    </div>
                                    <div className="col-md-6">
                                        <label className="form-label">Category</label>
                                        <DropDownWithSearch 
                                            Options={Array.isArray(categories) ? categories.map(category => ({
                                                ID: category.categoryID,
                                                Name: category.categoryName
                                            })) : []} 
                                            OnSelect={(selected) => setNewProduct({...newProduct, categoryID: selected.id})} 
                                            Placeholder="Select Category" 
                                        />
                                    </div>
                                    <div className="col-12 mt-3">
                                        <Button 
                                            Title="Add Product" 
                                            BGColor="#0d6efd" 
                                            Color="white" 
                                            BRColor="#0d6efd" 
                                            OnClick={handleAddProduct} 
                                        />
                                    </div>
                                </div>
                            </div>
                        </div>
                        
                        {/* Products List */}
                        <div className="card">
                            <div className="card-header bg-dark text-white">
                                <h5 className="mb-0">Products List</h5>
                            </div>
                            <div className="card-body">
                                {loading ? (
                                    <TitledIndicator Process="Loading products..." />
                                ) : products.length === 0 ? (
                                    <p className="text-center">No products found</p>
                                ) : (
                                    <div className="table-responsive">
                                        <table className="table table-striped table-hover">
                                            <thead>
                                                <tr>
                                                    <th>ID</th>
                                                    <th>Name</th>
                                                    <th>Category</th>
                                                    <th>Created Date</th>
                                                    <th>Actions</th>
                                                </tr>
                                            </thead>
                                            <tbody>
                                                {Array.isArray(products) ? products.map(product => (
                                                    
                                                    <tr key={product.productID}>
                                                        <td>{product.productID}</td>
                                                        <td>
                                                            {editingProduct && editingProduct.productID === product.productID ? (
                                                                <SimpleInput 
                                                                    Text="Edit Name" 
                                                                    BGColor="#f8f9fa" 
                                                                    BRColor="#ced4da" 
                                                                    Color="#212529" 
                                                                    Value={editName} 
                                                                    CallBack={setEditName} 
                                                                />
                                                            ) : (
                                                                product.productName
                                                            )}
                                                        </td>
                                                        <td>
                                                            {editingProduct && editingProduct.productID === product.productID ? (
                                                                <DropDownWithSearch 
                                                                    Options={Array.isArray(categories) ? categories.map(category => ({
                                                                        ID: category.categoryID,
                                                                        Name: category.categoryName
                                                                    })) : []} 
                                                                    OnSelect={(selected) => setEditCategoryID(selected.id)} 
                                                                    Placeholder="Select Category" 
                                                                    DefaultValue={getCategoryName(product.categoryID)}
                                                                />
                                                            ) : (
                                                                getCategoryName(product.categoryID)
                                                            )}
                                                        </td>
                                                        <td>{new Date(product.productCreatedDate).toLocaleDateString()}</td>
                                                        <td>
                                                            {editingProduct && editingProduct.productID === product.productID ? (
                                                                <div className="d-flex gap-2">
                                                                    <Button 
                                                                        Title="Save" 
                                                                        BGColor="#198754" 
                                                                        Color="white" 
                                                                        BRColor="#198754" 
                                                                        OnClick={handleUpdateProduct} 
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
                                                                        OnClick={() => startEditing(product)} 
                                                                    />
                                                                    <Button 
                                                                        Title="Delete" 
                                                                        BGColor="#dc3545" 
                                                                        Color="white" 
                                                                        BRColor="#dc3545" 
                                                                        OnClick={() => handleDeleteProduct(product.productID)} 
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

export default Products;