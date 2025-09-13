import DashboardLayout from "../layouts/DashboardLayout.jsx";
import {
  Forbidden,
  TitledIndicator,
  Button,
  SimpleInput,
  SimpleLabel,
  SimpleStatusContainer,
  MainForm,
  UAForm,
} from "../components/mainComponent.jsx";
import VerifyEntry from "../services/validateUserEntry.jsx";
import { useEffect, useState } from "react";
import {
  AllCategories,
  AddCategory,
  DeleteCategory,
  UpdateCategory,
} from "../services/categoryService.jsx";
import {
  AllWholesalers,
  DeleteWholesaler,
  UpdateWholesaler,
  AddWholesaler,
} from "../services/wholesalerService.jsx";

function Wholesalers() {
  const [authStatus, setAuthStatus] = useState(null);
  const [wholesalers, setWholesalers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState("1");
  const [statusData, setStatusData] = useState({});
  const [confirmation, setConfimation] = useState(false);
  const [newForm, setNewForm] = useState(false);
  const [updateForm, setUpdateForm] = useState(false);

  const [newWholesalersName, setNewWholesalersName] = useState("");
  const [newWholesalersAddress, setNewWholesalersAddress] = useState("");
  const [newWholesalersPhone, setNewWholesalersPhone] = useState("");
  const [newWholesalersEmail, setNewWholesalersEmail] = useState("");

  const [updateWholesalerData, setUpdateWholesalerData] = useState({});

  const [searchAddress, setSearchAddress] = useState("-");
  const [searchDate, setSearchDate] = useState("-");
  const [searchContact, setSearchContact] = useState("-");
  const [searchEmail, setSearchEmail] = useState("-");
  const [searchName, setSearchName] = useState("-");

  const columns = [
    "Sr. No",
    "Name",
    "Contact",
    "Email",
    "Address",
    "Date",
    "Update",
    "Delete",
  ];

  useEffect(() => {
    let timed;
    (async () => {
      const result = await VerifyEntry();
      setAuthStatus(result);
      if (result) {
        const timed = setTimeout(() => {
          fetchWholesalers();
        }, 1000);
      }
    })();
    if (timed) return () => clearTimeout(timed);
  }, [
    confirmation,
    searchAddress,
    searchDate,
    searchContact,
    searchEmail,
    searchName,
  ]);

  const update = async () => {
    setLoading(true);
    try {
      const response = await UpdateWholesaler(
        updateWholesalerData.wholesalerID,
        updateWholesalerData.wholesalerName,
        updateWholesalerData.address,
        updateWholesalerData.phone,
        updateWholesalerData.email
      );
      if (response.status === 200) {
        setStatusData({
          Message: "Updated Successfully",
          Desc: "Record Has been Updated Successfully...",
          Buttons: [
            {
              Title: "Close",
              Color: "white",
              BGColor: "#0069d9",
              BRColor: "#0069d9",
              OnClick: () => setConfimation(false),
            },
          ],
        });
        setConfimation(true);
      } else {
        setStatusData({
          Message: "Failed To Updated",
          Desc: response.response.data.message,
          Buttons: [
            {
              Title: "Close",
              Color: "white",
              BGColor: "#0069d9",
              BRColor: "#0069d9",
              OnClick: () => setConfimation(false),
            },
          ],
        });
        setConfimation(true);
      }
    } catch (error) {
      setStatusData({
        Message: "Failed To Updated",
        Desc: response.response.data.message,
        Buttons: [
          {
            Title: "Close",
            Color: "white",
            BGColor: "#0069d9",
            BRColor: "#0069d9",
            OnClick: () => setConfimation(false),
          },
        ],
      });
      setConfimation(true);
    } finally {
      setLoading(false);
    }
  };

  const updateConfirmation = () => {
    setUpdateForm(false);
    setStatusData({
      Message: "Are You Sure?",
      Desc: "Sure you want to Update the record?",
      Buttons: [
        {
          Title: "Cancel",
          Color: "white",
          BGColor: "#11b112",
          BRColor: "#11b112",
          OnClick: () => setConfimation(false),
        },
        {
          Title: "Update",
          Color: "white",
          BGColor: "#ff0000",
          BRColor: "#ff0000",
          OnClick: update,
        },
      ],
    });
    setConfimation(true);
  };

  const updateWholesaler = async (...data) => {
    await setUpdateWholesalerData(data[0]);
    setUpdateForm(true);
  };

  const deleteWholesaler = (id) => {
    const del = async () => {
      setLoading(true);
      try {
        const response = await DeleteWholesaler(id);
        if (response.status === 200) {
          setStatusData({
            Message: "Deleted Successfully",
            Desc: "Record Has been Deleted Successfully... ",
            Buttons: [
              {
                Title: "Close",
                Color: "white",
                BGColor: "#0069d9",
                BRColor: "#0069d9",
                OnClick: () => setConfimation(false),
              },
            ],
          });
          setConfimation(true);
        }
      } catch (error) {
        setStatusData({
          Message: "Failed To Delete",
          Desc: error,
          Buttons: [
            {
              Title: "Close",
              Color: "white",
              BGColor: "#0069d9",
              BRColor: "#0069d9",
              OnClick: () => setConfimation(false),
            },
          ],
        });
        setConfimation(true);
      } finally {
        setLoading(false);
      }
    };

    setStatusData({
      Message: "Are You Sure?",
      Desc: "Sure you want to delete the record?",
      Buttons: [
        {
          Title: "Cancel",
          Color: "white",
          BGColor: "#11b112",
          BRColor: "#11b112",
          OnClick: () => setConfimation(false),
        },
        {
          Title: "Delete",
          Color: "white",
          BGColor: "#ff0000",
          BRColor: "#ff0000",
          OnClick: del,
        },
      ],
    });

    setConfimation(true);
  };

  async function addNewWholesaler(name, address, phone, email) {
    setConfimation(false);
    const response = await AddWholesaler(name, address, phone, email);
    if (response.status === 201) {
      setStatusData({
        Message: "Added Successfully",
        Desc: "Record Has been Added Successfully... ",
        Buttons: [
          {
            Title: "Close",
            Color: "white",
            BGColor: "#0069d9",
            BRColor: "#0069d9",
            OnClick: () => setConfimation(false),
          },
        ],
      });
      setConfimation(true);
    } else {
      setStatusData({
        Message: "Failed To Add",
        Desc: response.response.data.message,
        Buttons: [
          {
            Title: "Close",
            Color: "white",
            BGColor: "#0069d9",
            BRColor: "#0069d9",
            OnClick: () => setConfimation(false),
          },
        ],
      });
      setConfimation(true);
    }
  }

  const isConfirmNewWholesaler = () => {
    setNewForm(false);
    setStatusData({
      Message: "Are You Sure?",
      Desc: "Sure you want to add new record?",
      Buttons: [
        {
          Title: "Cancel",
          Color: "white",
          BGColor: "#11b112",
          BRColor: "#11b112",
          OnClick: () => setConfimation(false),
        },
        {
          Title: "Confirm",
          Color: "white",
          BGColor: "#ff0000",
          BRColor: "#ff0000",
          OnClick: async () =>
            await addNewWholesaler(
              newWholesalersName,
              newWholesalersAddress,
              newWholesalersPhone,
              newWholesalersEmail
            ),
        },
      ],
    });
    setConfimation(true);
  };

  const fetchWholesalers = async () => {
    setLoading(true);
    try {
      const response = await AllWholesalers(
        searchDate,
        searchAddress,
        searchName,
        searchContact,
        searchEmail
      );
      if (response.status === 200) {
        const wholesalerData = response.data.data;
        if (Object.keys(wholesalerData).length == 0) {
          setWholesalers({ 1: [] });
        } else {
          setWholesalers(wholesalerData);
        }
      }
    } catch (error) {
    } finally {
      setLoading(false);
    }
  };

  if (authStatus === null) {
    return <TitledIndicator Process="Loading..." />;
  }

  const Paging = (pageNo) => {
    if (pageNo === 1) {
      if (parseInt(page) + 1 <= Object.keys(wholesalers).length) {
        setPage((prev) => `${parseInt(prev) + pageNo}`);
      }
    } else {
      if (page !== "1") {
        setPage((prev) => `${parseInt(prev) + pageNo}`);
      }
    }
  };

  return (
    <>
      {authStatus ? (
        <div>
          {loading ? (
            <TitledIndicator Process="Loading Wholesalers..." />
          ) : Object.keys(wholesalers).length == 0 ? (
            <>
              <div
                className="d-flex flex-column justify-content-center align-items-center"
                style={{ height: "90vh", width: "100%", color: "white" }}
              >
                <h2>No Wholesalers Found</h2>
                <Button
                  Title="New Wholesaler"
                  Color="#0069d9"
                  BGColor="transferant"
                  BRColor="#0069d9"
                  OnClick={() => setNewForm(true)}
                />
              </div>
            </>
          ) : (
            <MainForm
              Title="Wholesalers"
              SearchHint="Search Wholesaler Name"
              ButtonTitle="Add Wholesaler"
              Filters={[
                <SimpleInput
                  Text="Select Date"
                  BGColor="#0f0f0f"
                  BSColor="#77777750"
                  BRR="10"
                  H="40"
                  BRColor="#77777750"
                  Color="white"
                  Type="date"
                  Value={searchDate == "-" ? "" : searchDate}
                  CallBack={setSearchDate}
                  Disabled={false}
                />,
                <SimpleInput
                  Text="Address"
                  BGColor="#0f0f0f"
                  BSColor="#77777750"
                  BRR="10"
                  H="40"
                  BRColor="#77777750"
                  Color="white"
                  Type="text"
                  Value={searchAddress == "-" ? "" : searchAddress}
                  CallBack={setSearchAddress}
                  Disabled={false}
                />,
                <SimpleInput
                  Text="Contact"
                  BGColor="#0f0f0f"
                  BSColor="#77777750"
                  BRR="10"
                  H="40"
                  BRColor="#77777750"
                  Color="white"
                  Type="text"
                  Value={searchContact == "-" ? "" : searchContact}
                  CallBack={setSearchContact}
                  Disabled={false}
                />,
                <SimpleInput
                  Text="Email"
                  BGColor="#0f0f0f"
                  BSColor="#77777750"
                  BRR="10"
                  H="40"
                  BRColor="#77777750"
                  Color="white"
                  Type="text"
                  Value={searchEmail == "-" ? "" : searchEmail}
                  CallBack={setSearchEmail}
                  Disabled={false}
                />,
              ]}
              Columns={["wholesalerID", columns]}
              DataFields={[
                "wholesalerName",
                "phone",
                "email",
                "address",
                "connectedDate",
              ]}
              Data={[wholesalers[page]]}
              Page={Paging}
              Update={updateWholesaler}
              Delete={deleteWholesaler}
              Add={() => setNewForm(true)}
              Search={searchName}
              SetSearch={setSearchName}
            />
          )}
        </div>
      ) : (
        <Forbidden />
      )}
      {confirmation ? (
        <SimpleStatusContainer
          Message={statusData.Message}
          Desc={statusData.Desc}
          Buttons={statusData.Buttons}
        />
      ) : (
        <></>
      )}
{newForm ? (
  <UAForm
    Title={"New Wholesaler"}
    Inputs={[
      // Wholesaler Name Field
      <SimpleLabel
        Text="Wholesaler Name"
        Color="white"
        Size="16px"
      />,
      <SimpleInput
        Text="Enter wholesaler name"
        BGColor="#0f0f0f"
        BSColor="#77777750"
        BRR="10"
        H="50"
        BRColor="#77777750"
        Color="white"
        Type="text"
        Value={newWholesalersName}
        CallBack={setNewWholesalersName}
        Disabled={false}
      />,
      
      // Address Field
      
      <SimpleLabel
        Text="Address"
        Color="white"
        Size="16px"
      />,
      <SimpleInput
        Text="Enter address"
        BGColor="#0f0f0f"
        BSColor="#77777750"
        BRR="10"
        H="50"
        BRColor="#77777750"
        Color="white"
        Type="text"
        Value={newWholesalersAddress}
        CallBack={setNewWholesalersAddress}
        Disabled={false}
      />,
      
      // Contact Field
      <SimpleLabel
        Text="Contact Number"
        Color="white"
        Size="16px"
      />,
      <SimpleInput
        Text="Enter contact number"
        BGColor="#0f0f0f"
        BSColor="#77777750"
        BRR="10"
        H="50"
        BRColor="#77777750"
        Color="white"
        Type="text"
        Value={newWholesalersPhone}
        CallBack={setNewWholesalersPhone}
        Disabled={false}
      />,
      
      // Email Field
      <SimpleLabel
        Text="Email Address"
        Color="white"
        Size="16px"

      />,
      <SimpleInput
        Text="Enter email address"
        BGColor="#0f0f0f"
        BSColor="#77777750"
        BRR="10"
        H="50"
        BRColor="#77777750"
        Color="white"
        Type="text"
        Value={newWholesalersEmail}
        CallBack={setNewWholesalersEmail}
        Disabled={false}
      />,
    ]}
    Buttons={[
      {
        Title: "Cancel",
        Color: "#11b112",
        BGColor: "transferant",
        BRColor: "#11b112",
        OnClick: () => setNewForm(false),
      },
      {
        Title: "Confirm",
        Color: "#ff0000",
        BGColor: "transferant",
        BRColor: "#ff0000",
        OnClick: () => isConfirmNewWholesaler(),
      },
    ]}
  />
) : (
  <></>
)}

      {updateForm ? (
        <UAForm
  Title={"Update Wholesaler"}
  Inputs={[
    // Wholesaler Name
    <SimpleLabel
      Text="Wholesaler Name"
      Color="white"
      Size="16px"
    />,
    <SimpleInput
      Text="Enter wholesaler name"
      BGColor="#0f0f0f"
      BSColor="#77777750"
      BRR="10"
      H="50"
      BRColor="#77777750"
      Color="white"
      Type="text"
      Value={updateWholesalerData.wholesalerName}
      CallBack={(val) =>
        setUpdateWholesalerData((prev) => ({
          ...prev,
          wholesalerName: val,
        }))
      }
      Disabled={false}
    />,
    
    // Address
    <SimpleLabel
      Text="Address"
      Color="white"
      Size="16px"
    />,
    <SimpleInput
      Text="Enter address"
      BGColor="#0f0f0f"
      BSColor="#77777750"
      BRR="10"
      H="50"
      BRColor="#77777750"
      Color="white"
      Type="text"
      Value={updateWholesalerData.address}
      CallBack={(val) =>
        setUpdateWholesalerData((prev) => ({ ...prev, address: val }))
      }
      Disabled={false}
    />,
    
    // Contact
    <SimpleLabel
      Text="Contact Number"
      Color="white"
      Size="16px"
    />,
    <SimpleInput
      Text="Enter contact number"
      BGColor="#0f0f0f"
      BSColor="#77777750"
      BRR="10"
      H="50"
      BRColor="#77777750"
      Color="white"
      Type="text"
      Value={updateWholesalerData.phone}
      CallBack={(val) =>
        setUpdateWholesalerData((prev) => ({ ...prev, phone: val }))
      }
      Disabled={false}
    />,
    
    // Email
    <SimpleLabel
      Text="Email Address"
      Color="white"
      Size="16px"
    />,
    <SimpleInput
      Text="Enter email address"
      BGColor="#0f0f0f"
      BSColor="#77777750"
      BRR="10"
      H="50"
      BRColor="#77777750"
      Color="white"
      Type="text"
      Value={updateWholesalerData.email}
      CallBack={(val) =>
        setUpdateWholesalerData((prev) => ({ ...prev, email: val }))
      }
      Disabled={false}
    />,
  ]}
  Buttons={[
    {
      Title: "Cancel",
      Color: "#11b112",
      BGColor: "transferant",
      BRColor: "#11b112",
      OnClick: () => setUpdateForm(false),
    },
    {
      Title: "Confirm",
      Color: "#ff0000",
      BGColor: "transferant",
      BRColor: "#ff0000",
      OnClick: () => updateConfirmation(),
    },
  ]}
/>
      ) : (
        <></>
      )}
    </>
  );
}

export default Wholesalers;
