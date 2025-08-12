import MainLayout from "../layouts/MainLayout.jsx";
import { Forbidden, TitledIndicator } from "../components/mainComponent.jsx";
import VerifyEntry from "../services/validateUserEntry.jsx"
import { useEffect, useState } from "react";

function Purchases() {
    const [authStatus, setAuthStatus] = useState(null);
    useEffect(() => {
        (
            async () => {
                const result = await VerifyEntry();
                setAuthStatus(result);
            }
        )();
    });

    if (authStatus === null) {
        return <TitledIndicator Process="Loading..." />
    }

    return <>
        {
            authStatus
                ? <MainLayout>
                    <h1></h1>
                </MainLayout>
                : <Forbidden />
        }
    </>
}

export default Purchases;