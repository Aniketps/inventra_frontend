import axios from "axios";
import Cookies from "js-cookie";

export async function AllCategories() {
    try {
        const data = await axios.get("http://localhost:3000/api/categories?s=0", {
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

export async function AddCategory(name) {
    try {
        const data = await axios.post("http://localhost:3000/api/categories/new", {
            name: name
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

export async function GetCategoryById(id) {
    try {
        const data = await axios.get(`http://localhost:3000/api/categories/${id}`, {
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

export async function SearchCategories(name, date) {
    try {
        const nameParam = name || '-';
        const dateParam = date || '-';
        const data = await axios.get(`http://localhost:3000/api/categories/${nameParam}/${dateParam}`, {
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

export async function UpdateCategory(id, name) {
    try {
        const data = await axios.put(`http://localhost:3000/api/categories/${id}`, {
            name: name
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

export async function DeleteCategory(id) {
    try {
        const data = await axios.delete(`http://localhost:3000/api/categories/${id}`, {
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