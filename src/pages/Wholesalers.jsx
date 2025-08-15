import DashboardLayout from "../layouts/DashboardLayout.jsx";
import { Forbidden, TitledIndicator, Button, SimpleInput, SimpleStatusContainer } from "../components/mainComponent.jsx";
import VerifyEntry from "../services/validateUserEntry.jsx";
import { useEffect, useState } from "react";
import { AllWholesalers, AddWholesaler, DeleteWholesaler, UpdateWholesaler } from "../services/wholesalerService.jsx";

function Wholesalers() {
    const [authStatus, setAuthStatus] = useState(null);
    const [wholesalers, setWholesalers] = useState([]);
    const [loading, setLoading] = useState(true);

    // ✅ Fix: Initialize as object, not string
    const [statusMessage, setStatusMessage] = useState({ type: "", message: "" });
    const [showStatus, setShowStatus] = useState(false);

    // Form states for adding new wholesaler
    const [newWholesaler, setNewWholesaler] = useState({
        name: "",
        address: "",
        phone: "",
        email: ""
    });

    // Form states for editing wholesaler
    const [editingWholesaler, setEditingWholesaler] = useState(null);
    const [editForm, setEditForm] = useState({
        name: "",
        address: "",
        phone: "",
        email: ""
    });

    useEffect(() => {
        (async () => {
            const result = await VerifyEntry();
            setAuthStatus(result);
            if (result) {
                fetchWholesalers();
            }
        })();
    }, []);

    const fetchWholesalers = async () => {
        setLoading(true);
        try {
            const response = await AllWholesalers();
            if (response.status === 200) {
                setWholesalers(response.data.data);
            }
        } catch (error) {
            console.error("Error fetching wholesalers:", error);
            showStatusMessage("Error", "Failed to load wholesalers");
        } finally {
            setLoading(false);
        }
    };

    const handleAddWholesaler = async () => {
        if (!newWholesaler.name.trim()) {
            showStatusMessage("Error", "Wholesaler name cannot be empty");
            return;
        }

        try {
            const response = await AddWholesaler(
                newWholesaler.name,
                newWholesaler.address,
                newWholesaler.phone,
                newWholesaler.email
            );

            if (response.status === 201) {
                showStatusMessage("Success", "Wholesaler added successfully");

                // ✅ Optimize: Update state locally
                setWholesalers(prev => [...prev, response.data.data]);

                setNewWholesaler({
                    name: "",
                    address: "",
                    phone: "",
                    email: ""
                });
            }
        } catch (error) {
            const errMsg = error.response?.data?.message || "Failed to add wholesaler";
            console.error("Error adding wholesaler:", error);
            showStatusMessage("Error", errMsg);
        }
    };

    const handleDeleteWholesaler = async (id) => {
        // ✅ Confirmation before delete
        if (!window.confirm("Are you sure you want to delete this wholesaler?")) return;

        try {
            const response = await DeleteWholesaler(id);
            if (response.status === 200) {
                showStatusMessage("Success", "Wholesaler deleted successfully");

                // ✅ Optimize: Remove from state instead of refetch
                setWholesalers(prev => prev.filter(w => w.wholesalerID !== id));
            }
        } catch (error) {
            const errMsg = error.response?.data?.message || "Failed to delete wholesaler";
            console.error("Error deleting wholesaler:", error);
            showStatusMessage("Error", errMsg);
        }
    };

    const startEditing = (wholesaler) => {
        setEditingWholesaler(wholesaler);
        setEditForm({
            name: wholesaler.wholesalerName,
            address: wholesaler.wholesalerAddress || "",
            phone: wholesaler.wholesalerPhone || "",
            email: wholesaler.wholesalerEmail || ""
        });
    };

    const handleUpdateWholesaler = async () => {
        if (!editForm.name.trim()) {
            showStatusMessage("Error", "Wholesaler name cannot be empty");
            return;
        }

        try {
            const response = await UpdateWholesaler(
                editingWholesaler.wholesalerID,
                editForm.name,
                editForm.address,
                editForm.phone,
                editForm.email
            );

            if (response.status === 200) {
                showStatusMessage("Success", "Wholesaler updated successfully");

                // ✅ Optimize: Update state locally
                setWholesalers(prev =>
                    prev.map(w =>
                        w.wholesalerID === editingWholesaler.wholesalerID
                            ? { ...w, wholesalerName: editForm.name, wholesalerAddress: editForm.address, wholesalerPhone: editForm.phone, wholesalerEmail: editForm.email }
                            : w
                    )
                );

                setEditingWholesaler(null);
            }
        } catch (error) {
            const errMsg = error.response?.data?.message || "Failed to update wholesaler";
            console.error("Error updating wholesaler:", error);
            showStatusMessage("Error", errMsg);
        }
    };

    const cancelEditing = () => {
        setEditingWholesaler(null);
    };

    const showStatusMessage = (type, message) => {
        setStatusMessage({ type, message });
        setShowStatus(true);
        setTimeout(() => setShowStatus(false), 3000);
    };

    if (authStatus === null) {
        return <TitledIndicator Process="Loading..." />;
    }

    return (
        <>
            {authStatus ? (
                <DashboardLayout>
                    <div className="container py-4">
                        <h1 className="mb-4">Wholesalers Management</h1>

                        {/* Add New Wholesaler */}
                        <div className="card mb-4">
                            <div className="card-header bg-dark text-white">
                                <h5 className="mb-0">Add New Wholesaler</h5>
                            </div>
                            <div className="card-body">
                                <div className="row g-3">
                                    <div className="col-md-6">
                                        <label className="form-label">Name</label>
                                        <SimpleInput
                                            Text="Wholesaler Name"
                                            BGColor="#f8f9fa"
                                            BRColor="#ced4da"
                                            Color="#212529"
                                            Value={newWholesaler.name}
                                            CallBack={(value) => setNewWholesaler({ ...newWholesaler, name: value })}
                                        />
                                    </div>
                                    <div className="col-md-6">
                                        <label className="form-label">Address</label>
                                        <SimpleInput
                                            Text="Address"
                                            BGColor="#f8f9fa"
                                            BRColor="#ced4da"
                                            Color="#212529"
                                            Value={newWholesaler.address}
                                            CallBack={(value) => setNewWholesaler({ ...newWholesaler, address: value })}
                                        />
                                    </div>
                                    <div className="col-md-6">
                                        <label className="form-label">Phone</label>
                                        <SimpleInput
                                            Text="Phone Number"
                                            BGColor="#f8f9fa"
                                            BRColor="#ced4da"
                                            Color="#212529"
                                            Value={newWholesaler.phone}
                                            CallBack={(value) => setNewWholesaler({ ...newWholesaler, phone: value })}
                                        />
                                    </div>
                                    <div className="col-md-6">
                                        <label className="form-label">Email</label>
                                        <SimpleInput
                                            Text="Email Address"
                                            BGColor="#f8f9fa"
                                            BRColor="#ced4da"
                                            Color="#212529"
                                            Value={newWholesaler.email}
                                            CallBack={(value) => setNewWholesaler({ ...newWholesaler, email: value })}
                                        />
                                    </div>
                                    <div className="col-12 mt-3">
                                        <Button
                                            Title="Add Wholesaler"
                                            BGColor="#0d6efd"
                                            Color="white"
                                            BRColor="#0d6efd"
                                            OnClick={handleAddWholesaler}
                                        />
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Wholesalers List */}
                        <div className="card">
                            <div className="card-header bg-dark text-white">
                                <h5 className="mb-0">Wholesalers List</h5>
                            </div>
                            <div className="card-body">
                                {loading ? (
                                    <TitledIndicator Process="Loading wholesalers..." />
                                ) : wholesalers.length === 0 ? (
                                    <p className="text-center">No wholesalers found</p>
                                ) : (
                                    <div className="table-responsive">
                                        <table className="table table-striped table-hover">
                                            <thead>
                                                <tr>
                                                    <th>ID</th>
                                                    <th>Name</th>
                                                    <th>Address</th>
                                                    <th>Phone</th>
                                                    <th>Email</th>
                                                    <th>Actions</th>
                                                </tr>
                                            </thead>
                                            <tbody>
                                                {wholesalers.map(wholesaler => (
                                                    <tr key={wholesaler.wholesalerID}>
                                                        <td>{wholesaler.wholesalerID}</td>
                                                        <td>
                                                            {editingWholesaler?.wholesalerID === wholesaler.wholesalerID ? (
                                                                <SimpleInput
                                                                    Text="Edit Name"
                                                                    BGColor="#f8f9fa"
                                                                    BRColor="#ced4da"
                                                                    Color="#212529"
                                                                    Value={editForm.name}
                                                                    CallBack={(value) => setEditForm({ ...editForm, name: value })}
                                                                />
                                                            ) : (
                                                                wholesaler.wholesalerName
                                                            )}
                                                        </td>
                                                        <td>
                                                            {editingWholesaler?.wholesalerID === wholesaler.wholesalerID ? (
                                                                <SimpleInput
                                                                    Text="Edit Address"
                                                                    BGColor="#f8f9fa"
                                                                    BRColor="#ced4da"
                                                                    Color="#212529"
                                                                    Value={editForm.address}
                                                                    CallBack={(value) => setEditForm({ ...editForm, address: value })}
                                                                />
                                                            ) : (
                                                                wholesaler.wholesalerAddress || "-"
                                                            )}
                                                        </td>
                                                        <td>
                                                            {editingWholesaler?.wholesalerID === wholesaler.wholesalerID ? (
                                                                <SimpleInput
                                                                    Text="Edit Phone"
                                                                    BGColor="#f8f9fa"
                                                                    BRColor="#ced4da"
                                                                    Color="#212529"
                                                                    Value={editForm.phone}
                                                                    CallBack={(value) => setEditForm({ ...editForm, phone: value })}
                                                                />
                                                            ) : (
                                                                wholesaler.wholesalerPhone || "-"
                                                            )}
                                                        </td>
                                                        <td>
                                                            {editingWholesaler?.wholesalerID === wholesaler.wholesalerID ? (
                                                                <SimpleInput
                                                                    Text="Edit Email"
                                                                    BGColor="#f8f9fa"
                                                                    BRColor="#ced4da"
                                                                    Color="#212529"
                                                                    Value={editForm.email}
                                                                    CallBack={(value) => setEditForm({ ...editForm, email: value })}
                                                                />
                                                            ) : (
                                                                wholesaler.wholesalerEmail || "-"
                                                            )}
                                                        </td>
                                                        <td>
                                                            {editingWholesaler?.wholesalerID === wholesaler.wholesalerID ? (
                                                                <div className="d-flex gap-2">
                                                                    <Button
                                                                        Title="Save"
                                                                        BGColor="#198754"
                                                                        Color="white"
                                                                        BRColor="#198754"
                                                                        OnClick={handleUpdateWholesaler}
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
                                                                        OnClick={() => startEditing(wholesaler)}
                                                                    />
                                                                    <Button
                                                                        Title="Delete"
                                                                        BGColor="#dc3545"
                                                                        Color="white"
                                                                        BRColor="#dc3545"
                                                                        OnClick={() => handleDeleteWholesaler(wholesaler.wholesalerID)}
                                                                    />
                                                                </div>
                                                            )}
                                                        </td>
                                                    </tr>
                                                ))}
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
            ) : (
                <Forbidden />
            )}
        </>
    );
}

export default Wholesalers;
