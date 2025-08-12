import "./services.css"

function ServiceCard({Title, Description, URL}){
    return <>
        <div className="d-flex flex-column align-items-center p-3 service">
            <img src={URL} alt={Title} style={{ width : "50%" }}/>
            <h3 style={{ textAlign : "center" }}>{Title}</h3>
            <p style={{ textAlign : "center" }}>{Description}</p>
        </div>
    </>
}

export default ServiceCard;