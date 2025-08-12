import axios from "axios";
import Cookies from "js-cookie";

export async function AllProducts() {
    try {
        const data = await axios.get("http://localhost:3000/api/stocks?s=0", {
            headers: {
                Authorization : Cookies.get("token"),
            }
        })
        return data;
    } catch (err) {
        return err;
    }
}