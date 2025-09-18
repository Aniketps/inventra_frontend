import axios from "axios";
import Cookies from "js-cookie";

export async function AllStocks(p, w) {
    const W = w === ""? '-' : w;
    const P = p === ""? '-' : p;
    try {
        const data = await axios.get(`http://localhost:3000/api/stocks/${W}/${P}`, {
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

export async function AddStock(stockData) {
    try {
        const data = await axios.post("http://localhost:3000/api/stocks/new", stockData, {
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

export async function GetStockById(id) {
    try {
        const data = await axios.get(`http://localhost:3000/api/stocks/${id}`, {
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

export async function GetStockByQuantity(quantity) {
    try {
        const data = await axios.get(`http://localhost:3000/api/stocks/quantity?s=${quantity}`, {
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

export async function GetStockByTotalCost(totalCost) {
    try {
        const data = await axios.get(`http://localhost:3000/api/stocks/totalcost?tc=${totalCost}`, {
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

export async function GetStockByPrice(price) {
    try {
        const data = await axios.get(`http://localhost:3000/api/stocks/price?p=${price}`, {
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

export async function GetStockByWholesalerName(name) {
    try {
        const data = await axios.get(`http://localhost:3000/api/stocks/wholesaler?n=${name}`, {
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

export async function GetStockByWholesalerId(id) {
    try {
        const data = await axios.get(`http://localhost:3000/api/stocks/wholesaler?i=${id}`, {
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

export async function UpdateStock(id, productID, stock, sellingPrice, wholesalerID) {
    try {
        const data = await axios.put(`http://localhost:3000/api/stocks/${id}`,
            {
                "productID" : productID,
                "stock" : stock,
                "sellingPrice" : sellingPrice,
                "wholesalerID" : wholesalerID
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

export async function DeleteStock(id) {
    try {
        const data = await axios.delete(`http://localhost:3000/api/stocks/${id}`, {
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