import axios from "axios";
import Cookies from "js-cookie";

export async function AllSales(customerName, date, categoryName, wholesalerName, productName) {
    const CustomerName = customerName || '-';
    const Date = date || '-';
    const CategoryName = categoryName || '-';
    const WholesalerName = wholesalerName || '-';
    const ProductName = productName || '-';
    try {
        const data = await axios.get(`http://localhost:3000/api/sales/${CustomerName}/${Date}/${CategoryName}/${WholesalerName}/${ProductName}`, {
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

export async function AddSale(saleData) {
    try {
        const data = await axios.post("http://localhost:3000/api/sales/new", saleData, {
            headers: {
                Authorization: Cookies.get("token"),
            }
        });
        console.log(data);
        return data;
    } catch (err) {
        console.log(err);
        return err;
    }
}

export async function GetSaleById(id) {
    try {
        const data = await axios.get(`http://localhost:3000/api/sales/${id}`, {
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

export async function SearchSales(customerName, purchaseDate, productCategory, wholesaler, productName) {
    try {
        const customerNameParam = customerName || '-';
        const purchaseDateParam = purchaseDate || '-';
        const productCategoryParam = productCategory || '-';
        const wholesalerParam = wholesaler || '-';
        const productNameParam = productName || '-';

        const data = await axios.get(`http://localhost:3000/api/sales/${customerNameParam}/${purchaseDateParam}/${productCategoryParam}/${wholesalerParam}/${productNameParam}`, {
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

export async function UpdateSale(id, stockID, quantity, discount, tax, totalBill, customerID) {
    try {
        const data = await axios.put(`http://localhost:3000/api/sales/${id}`,
            {
                "stockID": stockID,
                "quantity": quantity,
                "discount": discount,
                "tax": tax,
                "totalBill": totalBill,
                "customerID": customerID
            },
            {
                headers: {
                    Authorization: Cookies.get("token"),
                }
            });
        return data;
    } catch (err) {
        return err;
    }
}

export async function DeleteSale(id) {
    try {
        const data = await axios.delete(`http://localhost:3000/api/sales/${id}`, {
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