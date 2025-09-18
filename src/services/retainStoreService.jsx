import axios from "axios";
import Cookies from "js-cookie";

async function RetailStoreInfo (){
    try {
        const data = await axios.get(`http://localhost:3000/api/retailstore`, {
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

export default RetailStoreInfo;