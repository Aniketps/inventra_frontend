import MainLayout from "../layouts/MainLayout.jsx";

function AboutUs(){
    let isMobile = window.innerWidth <= 450;

    return <>
        <MainLayout>
            <div className="d-flex flex-column align-items-center justify-content-center" style={{ width: "100%", height: "auto", color: "white", margin: "auto", padding: "120px 20px" }}>
                <h1 style={{ fontFamily: "'Italiana'", color: "white", letterSpacing: "5px" }}>About Us</h1>
                <p>Started In : 2025</p>
                <p style={{ textAlign: "center", width: `${isMobile ? "100%" : "75%"}`, fontFamily: "'Ruluko'", fontSize: `${isMobile ? "16px" : "26px"}` }}>We provide a smart and reliable Inventory Management System designed to help businesses streamline their stock operations, reduce waste, and maximize efficiency. Our platform offers real-time tracking, automated stock control, and insightful analytics to support better decision-making. Whether you're managing a small warehouse or a large supply chain, our system adapts to your needs—ensuring you never lose track of your inventory.</p>
            </div>
        </MainLayout>
    </>
}

export default AboutUs;