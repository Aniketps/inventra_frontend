import axios from "axios";
import Cookies from "js-cookie";

export async function AllCustomers(customerName, date, address, phone, email) {
    const CustomerName = customerName || '-';
    const Date = date || '-';
    const Address = address || '-';
    const Phone = phone || '-';
    const Email = email || '-';

    try {
        const data = await axios.get(`http://localhost:3000/api/customers/${CustomerName}/${Date}/${Address}/${Phone}/${Email}`, {
            headers: {
                Authorization : Cookies.get("token"),
            }
        });
        return data;
    } catch (err) {
        console.log(err);
        return err;
    }
}

export async function addCustomer(name, email, phone, address) {
    try {
        const data = await axios.post("http://localhost:3000/api/customers/new", {
            name : name,
            email : email,
            phone : phone,
            address : address
        }, {
            headers: {
                Authorization: Cookies.get("token"),
            }
        });
        return data;
    } catch (err) {
        console.log(err);
        return err;
    }
}

export async function UpdateCustomer(id, name, address, phone, email) {
    try {
        const data = await axios.put(`http://localhost:3000/api/customers/${id}`, 
            {
                "name" : name,
                "address" : address,
                "phone" : phone,
                "email" : email
            },
            {
            headers: {
                Authorization : Cookies.get("token"),
            }
        });
        return data;
    } catch (err) {
        return err;
    }
}

export async function DeleteCustomer(id) {
    try {
        const data = await axios.delete(`http://localhost:3000/api/customers/${id}`, {
            headers: {
                Authorization : Cookies.get("token"),
            }
        });
        return data;
    } catch (err) {
        console.log(err);
        return err;
    }
}