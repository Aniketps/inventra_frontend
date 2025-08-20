import axios from "axios";
import Cookies from "js-cookie";

export async function AllCustomers(customerName, date, address, phone, email) {
    try {
        const data = await axios.get(`http://localhost:3000/api/customers/${customerName}/${date}/${address}/${phone}/${email}`, {
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
            name,
            email,
            phone,
            address
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