function MainFooter() {
    const Divider = (Width) => <div className="my-4" style={{ border: "1px solid #DBDBDB", width: `${Width}%` }} />;
    const SocialLinkedIn = (name, link) => {
        return <>
            <div className="d-flex flex-row justify-content-end align-items-center gap-2" style={{ color: "white" }}>
                <h6>{name}</h6>
                <a href={link} target="_blank">
                    <img src="images/linkedin.png" alt="LinkedIn" style={{ height: "35px" }} />
                </a>
            </div>
        </>
    }
    const contents = (Width) => <div className={`d-flex flex-column`} style={{ width : `${Width}%` }}>
        <h1 style={{ fontFamily: "'Italiana'", color: "white" }}>Inventra</h1>
        <h2 style={{ color: "white" }}>Where care meets convenience. From sudden needs to everyday help — we're here, always.</h2>
    </div>;
    const links = (Width, Gap) => <div className={`d-flex flex-column gap-${Gap}`} style={{ width : `${Width}%` }}>
        {SocialLinkedIn("Aniket Pardeshi", "https://www.linkedin.com/in/aniket-pardeshi-7a1663273/")}
        {SocialLinkedIn("Umesh Chimane", "https://www.linkedin.com/in/umesh-chimane-07b005250/")}
        {SocialLinkedIn("Aditya More", "https://www.linkedin.com/in/aditya-more-0aa018203/")}
    </div>;
    if(window.innerWidth >= 450){
        return <>
            <div className="px-3 d-flex flex-column align-items-center gap-2">
            {Divider(100)}
            <div className="d-flex flex-row py-5 align-items-center justify-content-between" style={{ width: "80%", flexWrap: "wrap" }}>
                {contents(75)}
                {links(25, 3)}
            </div>
            {Divider(100)}
            <div>
                <p style={{ color: "#ffffff71", textAlign : "center" }}>© 2025 Inventra. Compassion. Reliability. Delivered.</p>
            </div>
        </div>
        </>
    }else{
        return <>
        <div className="px-3 d-flex flex-column w-100 align-items-center gap-2">
            {Divider(100)}
            <div className="d-flex flex-column py-5 gap-3 align-items-center justify-content-between" style={{ width: "90%", flexWrap: "wrap" }}>
                {contents(100)}
                {links(100, 2)}
            </div>
            {Divider(100)}
            <div>
                <p style={{ color: "#ffffff71", textAlign : "center" }}>© 2025 Inventra. Compassion. Reliability. Delivered.</p>
            </div>
        </div>
        </>
    }
}

export default MainFooter;