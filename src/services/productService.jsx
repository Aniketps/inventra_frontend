import axios from "axios";
import Cookies from "js-cookie";

export async function AllProducts(name, date, cat) {
    try {
        const data = await axios.get(`http://localhost:3000/api/products/${name}/${date}/${cat}`, {
            headers: {
                Authorization : Cookies.get("token"),
            }
        })
        return data;
    } catch (err) {
        return err;
    }
}

export async function AddProduct(name, categoryID) {
    try {
        const data = await axios.post("http://localhost:3000/api/products/new", {
            name,
            categoryID
        }, {
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

export async function GetProductById(id) {
    try {
        const data = await axios.get(`http://localhost:3000/api/products/${id}`, {
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

export async function SearchProducts(name, category) {
    try {
        const nameParam = name || '-';
        const categoryParam = category || '-';
        
        const data = await axios.get(`http://localhost:3000/api/products/${nameParam}/${categoryParam}`, {
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

export async function UpdateProduct(id, name, categoryID) {
    try {
        const data = await axios.put(`http://localhost:3000/api/products/${id}`, {
            name,
            categoryID
        }, {
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

export async function DeleteProduct(id) {
    try {
        const data = await axios.delete(`http://localhost:3000/api/products/${id}`, {
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