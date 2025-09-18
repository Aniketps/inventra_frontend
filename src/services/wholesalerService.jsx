import axios from "axios";
import Cookies from "js-cookie";

export async function AllWholesalers(date, address, name, contact, email) {
    const Date = date || '-';
    const Address = address || '-';
    const Name = name || '-';
    const Contact = contact || '-';
    const Email = email || '-';
    try {
        const data = await axios.get(`http://localhost:3000/api/wholesalers/${Date}/${Address}/${Name}/${Contact}/${Email}`, {
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

export async function AddWholesaler(name, address, phone, email) {
    try {
        const data = await axios.post("http://localhost:3000/api/wholesalers/new",
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
        console.log(err);
        return err;
    }
}

export async function GetWholesalerById(id) {
    try {
        const data = await axios.get(`http://localhost:3000/api/wholesalers/${id}`, {
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

export async function SearchWholesalers(date, address, name, phone, email) {
    try {
        const dateParam = date || '-';
        const addressParam = address || '-';
        const nameParam = name || '-';
        const phoneParam = phone || '-';
        const emailParam = email || '-';
        
        const data = await axios.get(`http://localhost:3000/api/wholesalers/${dateParam}/${addressParam}/${nameParam}/${phoneParam}/${emailParam}`, {
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

export async function UpdateWholesaler(id, name, address, phone, email) {
    try {
        const data = await axios.put(`http://localhost:3000/api/wholesalers/${id}`, 
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

export async function DeleteWholesaler(id) {
    try {
        const data = await axios.delete(`http://localhost:3000/api/wholesalers/${id}`, {
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