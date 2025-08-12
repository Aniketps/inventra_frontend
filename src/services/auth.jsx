import axios from "axios";

// function delay(ms) {
//     return new Promise(resolve => setTimeout(resolve, ms));
// }

export async function LoginAuth(email, password) {
    try {
        const data = await axios.post("http://localhost:3000/api/admin/login", {
            "email": email,
            "password": password
        })
        return data;
    } catch (err) {
        return err;
    }
}