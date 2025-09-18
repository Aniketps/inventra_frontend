import axios from "axios";
import Cookies from "js-cookie";

export async function AllWholesalerProductEntries(wholesalerName, productName, date) {
    const WholesalerName = wholesalerName || "-";
    const ProductName = productName || "-";
    const Date = date || "-";
    console.log(WholesalerName, ProductName, Date);
    try {
        const data = await axios.get(`http://localhost:3000/api/wholesalerprodcuctentries/${WholesalerName}/${ProductName}/${Date}`, {
            headers: {
                Authorization: Cookies.get("token"),
            }
        });
        return data;
    } catch (err) {
        return err;
    }
}

export async function AddWholesalerProductEntry(productID, wholesalerID, cost, quantity) {
    try {
        const data = await axios.post("http://localhost:3000/api/wholesalerprodcuctentries/new", {
            "productID" : productID,
            "wholesalerID" : wholesalerID,
            "cost" : cost,
            "quantity" : quantity
        },
            {
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
        const data = await axios.put(`http://localhost:3000/api/wholesalerprodcuctentries/${id}`,
            {
                "productID": productID,
                "wholesalerID": wholesalerID,
                "costPrice": costPrice,
                "quantity": quantity
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