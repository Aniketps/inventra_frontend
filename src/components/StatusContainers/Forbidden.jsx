import MainLayout from "../../layouts/MainLayout";

function Forbidden() {
    return <>
        <MainLayout>
            <div className="d-flex flex-column align-items-center justify-content-center"
                style={
                    {
                        position: "relative",
                    }
                }>
                <img src="/images/forbidden.png" style={{ height: "500px" }} alt="Page Not Found" />
            </div>
        </MainLayout>
    </>
}

export default Forbidden;