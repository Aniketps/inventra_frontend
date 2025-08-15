import DashboardLayout from "../layouts/DashboardLayout.jsx";
import { Forbidden, TitledIndicator, Button, SimpleInput, SimpleStatusContainer } from "../components/mainComponent.jsx";
import VerifyEntry from "../services/validateUserEntry.jsx"
import { useEffect, useState } from "react";
import { AllCategories, AddCategory, DeleteCategory, UpdateCategory } from "../services/categoryService.jsx";

function Categories() {
    const [authStatus, setAuthStatus] = useState(null);
    const [categories, setCategories] = useState([]);
    const [loading, setLoading] = useState(true);
    const [newCategoryName, setNewCategoryName] = useState("");
    const [editingCategory, setEditingCategory] = useState(null);
    const [editName, setEditName] = useState("");
    const [statusMessage, setStatusMessage] = useState("");
    const [showStatus, setShowStatus] = useState(false);

    useEffect(() => {
        (
            async () => {
                const result = await VerifyEntry();
                setAuthStatus(result);
                if (result) {
                    fetchCategories();
                }
            }
        )();
    }, []);
    
    const fetchCategories = async () => {
        setLoading(true);
        try {
            const response = await AllCategories();
            if (response.status === 200) {
                const categoryData = response.data.data;
                // Flatten the grouped data structure
                let allCategories = [];
                for (const group in categoryData) {
                    allCategories = [...allCategories, ...categoryData[group]];
                }
                setCategories(allCategories);
            }
        } catch (error) {
            console.error("Error fetching categories:", error);
            showStatusMessage("Error", "Failed to load categories");
        } finally {
            setLoading(false);
        }
    };

    const handleAddCategory = async () => {
        if (!newCategoryName.trim()) {
            showStatusMessage("Error", "Category name cannot be empty");
            return;
        }

        try {
            const response = await AddCategory(newCategoryName);
            if (response.status === 201) {
                showStatusMessage("Success", "Category added successfully");
                setNewCategoryName("");
                fetchCategories();
            }
        } catch (error) {
            console.error("Error adding category:", error);
            showStatusMessage("Error", "Failed to add category");
        }
    };

    const handleDeleteCategory = async (id) => {
        try {
            const response = await DeleteCategory(id);
            if (response.status === 200) {
                showStatusMessage("Success", "Category deleted successfully");
                fetchCategories();
            }
        } catch (error) {
            console.error("Error deleting category:", error);
            showStatusMessage("Error", "Failed to delete category");
        }
    };

    const startEditing = (category) => {
        setEditingCategory(category);
        setEditName(category.categoryName);
    };

    const handleUpdateCategory = async () => {
        if (!editName.trim()) {
            showStatusMessage("Error", "Category name cannot be empty");
            return;
        }

        try {
            const response = await UpdateCategory(editingCategory.categoryID, editName);
            if (response.status === 200) {
                showStatusMessage("Success", "Category updated successfully");
                setEditingCategory(null);
                fetchCategories();
            }
        } catch (error) {
            console.error("Error updating category:", error);
            showStatusMessage("Error", "Failed to update category");
        }
    };

    const cancelEditing = () => {
        setEditingCategory(null);
        setEditName("");
    };

    const showStatusMessage = (type, message) => {
        setStatusMessage({ type, message });
        setShowStatus(true);
        setTimeout(() => setShowStatus(false), 3000);
    };

    if (authStatus === null) {
        return <TitledIndicator Process="Loading..." />
    }

    return <>
        {
            authStatus
                ? <DashboardLayout>
                    <div className="container py-4">
                        <h1 className="mb-4 text-white">Categories Management</h1>
                        
                        {/* Add New Category */}
                        <div className="card mb-4">
                            <div className="card-header bg-dark text-white">
                                <h5 className="mb-0">Add New Category</h5>
                            </div>
                            <div className="card-body">
                                <div className="row g-3 align-items-center">
                                    <div className="col-md-8">
                                        <SimpleInput 
                                            Text="Category Name" 
                                            BGColor="#f8f9fa" 
                                            BRColor="#ced4da" 
                                            Color="#212529" 
                                            Value={newCategoryName} 
                                            CallBack={setNewCategoryName} 
                                        />
                                    </div>
                                    <div className="col-md-4">
                                        <Button 
                                            Title="Add Category" 
                                            BGColor="#0d6efd" 
                                            Color="white" 
                                            BRColor="#0d6efd" 
                                            OnClick={handleAddCategory} 
                                        />
                                    </div>
                                </div>
                            </div>
                        </div>
                        
                        {/* Categories List */}
                        <div className="card">
                            <div className="card-header bg-dark text-white">
                                <h5 className="mb-0">Categories List</h5>
                            </div>
                            <div className="card-body">
                                {loading ? (
                                    <TitledIndicator Process="Loading categories..." />
                                ) : categories.length === 0 ? (
                                    <p className="text-center">No categories found</p>
                                ) : (
                                    <div className="table-responsive">
                                        <table className="table table-striped table-hover">
                                            <thead>
                                                <tr>
                                                    <th>ID</th>
                                                    <th>Name</th>
                                                    <th>Created Date</th>
                                                    <th>Actions</th>
                                                </tr>
                                            </thead>
                                            <tbody>
                                                {Array.isArray(categories) ? categories.map(category => (
                                                    <tr key={category.categoryID}>
                                                        <td>{category.categoryID}</td>
                                                        <td>
                                                            {editingCategory && editingCategory.categoryID === category.categoryID ? (
                                                                <SimpleInput 
                                                                    Text="Edit Name" 
                                                                    BGColor="#f8f9fa" 
                                                                    BRColor="#ced4da" 
                                                                    Color="#212529" 
                                                                    Value={editName} 
                                                                    CallBack={setEditName} 
                                                                />
                                                            ) : (
                                                                category.categoryName
                                                            )}
                                                        </td>
                                                        <td>{new Date(category.createdDate).toLocaleDateString()}</td>
                                                        <td>
                                                            {editingCategory && editingCategory.categoryID === category.categoryID ? (
                                                                <div className="d-flex gap-2">
                                                                    <Button 
                                                                        Title="Save" 
                                                                        BGColor="#198754" 
                                                                        Color="white" 
                                                                        BRColor="#198754" 
                                                                        OnClick={handleUpdateCategory} 
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
                                                                        OnClick={() => startEditing(category)} 
                                                                    />
                                                                    <Button 
                                                                        Title="Delete" 
                                                                        BGColor="#dc3545" 
                                                                        Color="white" 
                                                                        BRColor="#dc3545" 
                                                                        OnClick={() => handleDeleteCategory(category.categoryID)} 
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

export default Categories;