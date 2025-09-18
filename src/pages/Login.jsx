import { div } from "three/tsl";
import MainLayout from "../layouts/MainLayout.jsx";
import { SimpleStatusContainer, InputLeftIcon, InputBothSideIcons, Button, TitledIndicator } from "../components/mainComponent.jsx";
import { useState } from "react";
import { LoginAuth } from "../services/auth.jsx";
import Cookies from "js-cookie";
import { useNavigate } from "react-router-dom";

function Login() {

    const navigate = useNavigate();
    let isMobile = window.innerWidth <= 450;
    let [Email, setEmail] = useState("");
    let [Password, setPassword] = useState("");
    let [isVisible, setVisibility] = useState(false);
    let [isStatusVisible, setStatusVisibility] = useState(false);
    let [Data, setData] = useState({});
    let [process, setProcess] = useState(false);

    let Submit = async () => {
        setProcess(true);
        const response = await LoginAuth(Email, Password);
        let Message = '';
        let Desc = '';
        if (response.status == 200) {
            if (response.data.loginStatus) {
                Cookies.set("email", response.data.message.data.email, { expires: 30, path: "/" });
                Cookies.set("token", response.data.message.data.token, { expires: 30, path: "/" });
                navigate("/dashboard");
            } else {
                Message = "Login Success",
                Desc = response.data.error
            }
        } else {
            if (response.response.data.loginStatus) {
            } else {
                Message = "Login Failed",
                Desc = response.response.data.message
            }
            StatusController(true, {
                "message": Message,
                "desc": Desc,
                "Buttons": [
                    {
                        "BGColor": "#0069d9",
                        "BRColor": "#0069d9",
                        "Color": "white",
                        "OnClick": () => setStatusVisibility(false),
                        "Title": "Close"
                    }
                ]
            });
        }
        setProcess(false);
    }
    const StatusController = (visibility, data) => {
        setData(data)
        setStatusVisibility(visibility);
    };
    return <>
        <MainLayout>
            {
                isMobile
                    ? <>
                        <div style={{ height: "20px" }} />
                        <div
                            style={
                                {
                                    height: "400px",
                                    width: "95%",
                                    backgroundColor: "#1C1C1C",
                                    border: "2px solid #77777750",
                                    borderRadius: "20px",
                                    boxShadow: "1px 1px 2px #05009D",
                                    color: "white",
                                    margin: "auto"
                                }
                            }
                            className="d-flex flex-row align-items-center justify-content-center px-3 py-4"
                        >

                            <div className="d-flex flex-column align-items-center justify-content-between" style={{ flex: "1" }}>
                                <h1 className="mb-4">Staff Login</h1>
                                <form className="d-flex flex-column gap-2">
                                    <label htmlFor="email">Email</label>
                                    <InputLeftIcon Image="images/email.png" Text="Email" BGColor="#0F0F0F" BSColor="#3238F5" BRR="10" H="50" BRColor="#77777750" Color="white" Type="text" Value={Email} CallBack={setEmail} />
                                    <label htmlFor="password">Password</label>
                                    <InputBothSideIcons FrontImage="images/password.png" Text="Password" BGColor="#0F0F0F" BSColor="#3238F5" BRR="10" H="50" BRColor="#77777750" Color="white" Type={isVisible ? "text" : "password"} Value={Password} CallBack={setPassword} Operation={setVisibility} BackImage={isVisible ? "images/visible.png" : "images/invisible.png"} />
                                    <div className="d-flex mt-5 flex-row w-100 align-items-center justify-content-end">
                                        <Button BGColor="#0f0f0f" Color="#362a95ff" BRColor="#362a95ff" OnClick={Submit} Title="Submit" />
                                    </div>
                                </form>
                            </div>
                        </div>
                    </>
                    : <div className="d-flex align-items-center justify-content-center" style={{ height: "550px", width: "100%" }}>
                        <div
                            style={
                                {
                                    height: "450px",
                                    width: "75%",
                                    backgroundColor: "#1C1C1C",
                                    border: "2px solid #77777750",
                                    borderRadius: "20px",
                                    boxShadow: "1px 1px 2px #05009D",
                                    color: "white"
                                }
                            }
                            className="d-flex flex-row p-5"
                        >
                            <div style={{ flex: "1" }}>
                                <h1>Inventra</h1>
                                <p>Verify You're Identity</p>
                            </div>
                            <div style={{ flex: "1" }}>
                                <h5>Login</h5>
                                <form className="d-flex flex-column gap-2">
                                    <label htmlFor="email">Email</label>
                                    <InputLeftIcon Image="images/email.png" Text="Email" BGColor="#0F0F0F" BSColor="#3238F5" BRR="10" H="50" BRColor="#77777750" Color="white" Type="email" Value={Email} CallBack={setEmail} />
                                    <label htmlFor="password">Password</label>
                                    <InputBothSideIcons FrontImage="images/password.png" Text="Password" BGColor="#0F0F0F" BSColor="#3238F5" BRR="10" H="50" BRColor="#77777750" Color="white" Type={isVisible ? "text" : "password"} Value={Password} CallBack={setPassword} Operation={setVisibility} BackImage={isVisible ? "images/visible.png" : "images/invisible.png"} />
                                    <div className="d-flex mt-5 flex-row w-100 align-items-center justify-content-end">
                                        <Button BGColor="#0f0f0f" Color="#362a95ff" BRColor="#362a95ff" OnClick={Submit} Title="Submit" />
                                    </div>
                                </form>
                            </div>
                        </div>
                    </div>
            }
            {
                isStatusVisible
                    ? <SimpleStatusContainer Message={Data.message} Desc={Data.desc} Buttons={Data.Buttons} />
                    : <></>
            }
            {
                process
                    ? <TitledIndicator Process="Authenticating..." />
                    : null
            }
        </MainLayout>
    </>
}

export default Login;