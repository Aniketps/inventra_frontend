import DashboardLayout from "../layouts/DashboardLayout.jsx";
import { Forbidden, TitledIndicator } from "../components/mainComponent.jsx";
import VerifyEntry from "../services/validateUserEntry.jsx"
import { useEffect, useState } from "react";

function Wholesalers() {
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
                ? <DashboardLayout>
                    <h1></h1>
                </DashboardLayout>
                : <Forbidden />
        }
    </>
}

export default Wholesalers;