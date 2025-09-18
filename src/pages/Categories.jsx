import DashboardLayout from "../layouts/DashboardLayout.jsx";
import { Forbidden, TitledIndicator, Button, SimpleInput, SimpleStatusContainer, MainForm, UAForm } from "../components/mainComponent.jsx";
import VerifyEntry from "../services/validateUserEntry.jsx"
import { useEffect, useState } from "react";
import { AllCategories, AddCategory, DeleteCategory, UpdateCategory } from "../services/categoryService.jsx";

function Categories() {
    const [authStatus, setAuthStatus] = useState(null);
    const [categories, setCategories] = useState([]);
    const [loading, setLoading] = useState(true);
    const [page, setPage] = useState('1');
    const [statusData, setStatusData] = useState({});
    const [confirmation, setConfimation] = useState(false);
    const [newForm, setNewForm] = useState(false);
    const [updateForm, setUpdateForm] = useState(false);
    const [newCategoryName, setNewCategoryName] = useState('');
    const [updateCategoryData, setUpdateCategoryData] = useState({});
    const [searchDate, setSearchDate] = useState("-");
    const [searchName, setSearchName] = useState("-");

    const columns = ["Sr. No", "Category Name", "Created Date", "Update", "Delete"];

    useEffect(() => {
        let timed;

        const verifyAndFetch = async () => {
            const result = await VerifyEntry();
            setAuthStatus(result);

            if (result) {
                timed = setTimeout(() => {
                    fetchCategories();
                }, 1000);
            }
        };

        verifyAndFetch();

        return () => {
            if (timed) clearTimeout(timed);
        };
    }, [confirmation, searchDate, searchName]);


    const update = async () => {
        setLoading(true);
        try {
            const response = await UpdateCategory(updateCategoryData.categoryID, updateCategoryData.categoryName);
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

    const updateCategory = async (...data) => {
        await setUpdateCategoryData(data[0]);
        setUpdateForm(true);
    }

    const deleteCategory = (id) => {
        const del = async () => {
            setLoading(true);
            try {
                const response = await DeleteCategory(id);
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

    async function addNewCategory(name) {
        setConfimation(false);
        const response = await AddCategory(name);
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
                    OnClick: async () => await addNewCategory(newCategoryName)
                },
            ]
        });
        setConfimation(true);
    }

    const fetchCategories = async () => {
        setLoading(true);
        try {
            const response = await AllCategories(searchName, searchDate);
            if (response.status === 200) {
                const categoryData = response.data.data;
                if(Object.keys(categoryData).length == 0){
                    setCategories({1:[]});
                }else{
                    setCategories(categoryData);
                }
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
            if (parseInt(page) + 1 <= Object.keys(categories).length) {
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
                            ? <TitledIndicator Process="Loading Categories..." />
                            : Object.keys(categories).length == 0
                                ? <>
                                    <div
                                        className="d-flex flex-column justify-content-center align-items-center"
                                        style={{ height: "90vh", width: "100%", color: "white" }}
                                    >
                                        <h2>No Categories Found</h2>
                                        <Button Title="New Category" Color="#0069d9" BGColor="transferant" BRColor="#0069d9" OnClick={() => setNewForm(true)} />
                                    </div>
                                </>
                                : <MainForm Title="Categories" SearchHint="Search Category Name" ButtonTitle="Add Category" Filters={[
                                    <SimpleInput Text="Select Date" BGColor="#0f0f0f" BSColor="#77777750" BRR="10" H="40" BRColor="#77777750" Color="white" Type="date" Value={searchDate == '-' ? "" : searchDate} CallBack={setSearchDate} Disabled={false} />,
                                ]} Columns={['categoryID', columns]} DataFields={["categoryName", "createdDate"]} Data={[categories[page]]} Page={Paging} Update={updateCategory} Delete={deleteCategory} Add={() => setNewForm(true)} Search={searchName} SetSearch={setSearchName} />
                    }
                </div>
                : <Forbidden />
        }
        {
            confirmation ? <SimpleStatusContainer Message={statusData.Message} Desc={statusData.Desc} Buttons={statusData.Buttons} /> : <></>
        }
        {
            newForm ? <UAForm Title={"New Category"} Inputs={[
                <SimpleInput Text="Category Name" BGColor="#0f0f0f" BSColor="#77777750" BRR="10" H="50" BRColor="#77777750" Color="white" Type="text" Value={newCategoryName} CallBack={setNewCategoryName} Disabled={false} />
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
            updateForm ? <UAForm Title={"Update Category"} Inputs={[
                <SimpleInput Text="Category Name" BGColor="#0f0f0f" BSColor="#77777750" BRR="10" H="50" BRColor="#77777750" Color="white" Type="text" Value={updateCategoryData.categoryName} CallBack={(val) => setUpdateCategoryData((prev => ({ ...prev, categoryName: val })))} Disabled={false} />
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

export default Categories;