import axios from "axios";
import Cookies from "js-cookie";

export async function AllWholesalerProductEntries() {
    try {
        const data = await axios.get("http://localhost:3000/api/wholesalerProductEntries?s=0", {
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

export async function AddWholesalerProductEntry(productID, wholesalerID, cost, quantity) {
    try {
        const data = await axios.post("http://localhost:3000/api/wholesalerProductEntries", {
            productID,
            wholesalerID,
            cost,
            quantity
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

export async function GetWholesalerProductEntryByID(id) {
    try {
        const data = await axios.get(`http://localhost:3000/api/wholesalerProductEntries/${id}`, {
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

export async function SearchWholesalerProductEntries(productName, wholesalerName, date) {
    try {
        // Handle empty search parameters
        const p = productName || '-';
        const w = wholesalerName || '-';
        const d = date || '-';
        
        const data = await axios.get(`http://localhost:3000/api/wholesalerProductEntries/search/${p}/${w}/${d}`, {
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

export async function UpdateWholesalerProductEntry(id, productID, wholesalerID, quantity, costPrice) {
    try {
        const data = await axios.put(`http://localhost:3000/api/wholesalerProductEntries/${id}`, {
            productID,
            wholesalerID,
            quantity,
            costPrice
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

export async function DeleteWholesalerProductEntry(id) {
    try {
        const data = await axios.delete(`http://localhost:3000/api/wholesalerProductEntries/${id}`, {
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