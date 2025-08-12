function SectionBar({Title, Image, ToggleIcon}){
    
    return <>
        <div className="d-flex flex-row align-items-center p-3" style={
            { 
                height : "50px", 
                border : "1px solid #77777750",
                borderRadius : "10px",
                backgroundColor : "#0f0f0f",
                boxShadow : "1px 1px 2px #00009b8f"
            }}>
            <img src={Image} alt={Title} style={{ height : "30px" }} />
            <p className="m-0 p-2" style={{ fontSize : "20px", flex : "1" }}>{Title}</p>
            <img src={ToggleIcon} alt="Products" style={{ height : "20px" }} />
        </div>
    </>
}

export default SectionBar;