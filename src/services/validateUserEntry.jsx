import Cookies from "js-cookie";
import MainLayout from "../layouts/MainLayout";
import axios from "axios";

const VerifyEntry = async() => {
    const token = Cookies.get('token');
    
    if (!token) return false;

    try{
        const resopnse = await axios.post("http://localhost:3000/api/admin/verifyToken", {
            "token": token
        });
        return true;
    }catch(err){
        return false;
    };
}

export default VerifyEntry;