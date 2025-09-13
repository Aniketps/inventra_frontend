import DashboardLayout from "../layouts/DashboardLayout.jsx";
import {
  Forbidden,
  TitledIndicator,
  Button,
  SimpleLabel,
  SimpleInput,
  SimpleStatusContainer,
  MainForm,
  UAForm,
} from "../components/mainComponent.jsx";
import VerifyEntry from "../services/validateUserEntry.jsx";
import { useEffect, useState } from "react";
import {
  AllCustomers,
  addCustomer,
  DeleteCustomer,
  UpdateCustomer,
} from "../services/customerService.jsx";

function Customers() {
  const [authStatus, setAuthStatus] = useState(null);
  const [customers, setCustomers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState("1");
  const [statusData, setStatusData] = useState({});
  const [confirmation, setConfimation] = useState(false);
  const [newForm, setNewForm] = useState(false);
  const [updateForm, setUpdateForm] = useState(false);

  const [newCustomerName, setNewCustomerName] = useState("");
  const [newCustomerAddress, setNewCustomerAddress] = useState("");
  const [newCustomerPhone, setNewCustomerPhone] = useState("");
  const [newCustomerEmail, setNewCustomerEmail] = useState("");

  const [updateCustomerData, setUpdateCustomerData] = useState({});

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
          fetchCustomers();
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
      const response = await UpdateCustomer(
        updateCustomerData.customerID,
        updateCustomerData.customerName,
        updateCustomerData.address,
        updateCustomerData.phone,
        updateCustomerData.email
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

  const updateCustomer = async (...data) => {
    await setUpdateCustomerData(data[0]);
    setUpdateForm(true);
  };

  const deleteCustomer = (id) => {
    const del = async () => {
      setLoading(true);
      try {
        const response = await DeleteCustomer(id);
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

  async function addNewCustomer(name, email, phone, address) {
    setConfimation(false);
    const response = await addCustomer(name, email, phone, address);
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

  const isConfirmNewCustomer = () => {
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
            await addNewCustomer(
              newCustomerName,
              newCustomerEmail,
              newCustomerPhone,
              newCustomerAddress
            ),
        },
      ],
    });
    setConfimation(true);
  };

  const fetchCustomers = async () => {
    setLoading(true);
    try {
      const response = await AllCustomers(
        searchName,
        searchDate,
        searchAddress,
        searchContact,
        searchEmail
      );
      if (response.status === 200) {
        const customerData = response.data.data;
        if (Object.keys(customerData).length == 0) {
          setCustomers({ 1: [] });
        } else {
          setCustomers(customerData);
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
            <TitledIndicator Process="Loading Customers..." />
          ) : Object.keys(customers).length == 0 ? (
            <>
              <div
                className="d-flex flex-column justify-content-center align-items-center"
                style={{ height: "90vh", width: "100%", color: "white" }}
              >
                <h2>No Customers Found</h2>
                <Button
                  Title="New Customer"
                  Color="#0069d9"
                  BGColor="transferant"
                  BRColor="#0069d9"
                  OnClick={() => setNewForm(true)}
                />
              </div>
            </>
          ) : (
            <MainForm
              Title="Customers"
              SearchHint="Search Customer Name"
              ButtonTitle="Add Customer"
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
              Columns={["CustomerID", columns]}
              DataFields={[
                "customerName",
                "phone",
                "email",
                "address",
                "registeredDate",
              ]}
              Data={[customers[page]]}
              Page={Paging}
              Update={updateCustomer}
              Delete={deleteCustomer}
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
          Title={"New Customer"}
          Inputs={[
            <SimpleLabel
      Text="Customer Name"
      Color="white"
      Size="16px"
    />,
            <SimpleInput
              Text="Customer Name"
              BGColor="#0f0f0f"
              BSColor="#77777750"
              BRR="10"
              H="50"
              BRColor="#77777750"
              Color="white"
              Type="text"
              Value={newCustomerName}
              CallBack={setNewCustomerName}
              Disabled={false}
            />,
            <SimpleLabel
      Text="Address"
      Color="white"
      Size="16px"
    />,
            <SimpleInput
              Text="Address"
              BGColor="#0f0f0f"
              BSColor="#77777750"
              BRR="10"
              H="50"
              BRColor="#77777750"
              Color="white"
              Type="text"
              Value={newCustomerAddress}
              CallBack={setNewCustomerAddress}
              Disabled={false}
            />,
                 <SimpleLabel
      Text="Contact"
      Color="white"
      Size="16px"
    />,
            <SimpleInput
              Text="Contact"
              BGColor="#0f0f0f"
              BSColor="#77777750"
              BRR="10"
              H="50"
              BRColor="#77777750"
              Color="white"
              Type="text"
              Value={newCustomerPhone}
              CallBack={setNewCustomerPhone}
              Disabled={false}
            />,
                 <SimpleLabel
      Text="Email"
      Color="white"
      Size="16px"
    />,
            <SimpleInput
              Text="Email"
              BGColor="#0f0f0f"
              BSColor="#77777750"
              BRR="10"
              H="50"
              BRColor="#77777750"
              Color="white"
              Type="text"
              Value={newCustomerEmail}
              CallBack={setNewCustomerEmail}
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
              OnClick: () => isConfirmNewCustomer(),
            },
          ]}
        />
      ) : (
        <></>
      )}

      {updateForm ? (
        <UAForm
          Title={"Update Customer"}
          Inputs={[
                 <SimpleLabel
      Text="Customer Name"
      Color="white"
      Size="16px"
    />,
            <SimpleInput
              Text="Customer Name"
              BGColor="#0f0f0f"
              BSColor="#77777750"
              BRR="10"
              H="50"
              BRColor="#77777750"
              Color="white"
              Type="text"
              Value={updateCustomerData.customerName}
              CallBack={(val) =>
                setUpdateCustomerData((prev) => ({
                  ...prev,
                  customerName: val,
                }))
              }
              Disabled={false}
            />,
                 <SimpleLabel
      Text="Address"
      Color="white"
      Size="16px"
    />,
            <SimpleInput
              Text="Address"
              BGColor="#0f0f0f"
              BSColor="#77777750"
              BRR="10"
              H="50"
              BRColor="#77777750"
              Color="white"
              Type="text"
              Value={updateCustomerData.address}
              CallBack={(val) =>
                setUpdateCustomerData((prev) => ({ ...prev, address: val }))
              }
              Disabled={false}
            />,
                 <SimpleLabel
      Text="Contact"
      Color="white"
      Size="16px"
    />,
            <SimpleInput
              Text="Contact"
              BGColor="#0f0f0f"
              BSColor="#77777750"
              BRR="10"
              H="50"
              BRColor="#77777750"
              Color="white"
              Type="text"
              Value={updateCustomerData.phone}
              CallBack={(val) =>
                setUpdateCustomerData((prev) => ({ ...prev, phone: val }))
              }
              Disabled={false}
            />,
                 <SimpleLabel
      Text="Email"
      Color="white"
      Size="16px"
    />,
            <SimpleInput
              Text="Email"
              BGColor="#0f0f0f"
              BSColor="#77777750"
              BRR="10"
              H="50"
              BRColor="#77777750"
              Color="white"
              Type="text"
              Value={updateCustomerData.email}
              CallBack={(val) =>
                setUpdateCustomerData((prev) => ({ ...prev, email: val }))
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

export default Customers;
