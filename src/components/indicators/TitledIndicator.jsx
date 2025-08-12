function TitledIndicator({Process}){

    return <>
        <div className="d-flex flex-row align-items-center justify-content-start p-3" 
        style={
            { 
                width : "250px", 
                height : "45px" ,
                position : "fixed",
                left : "20px",
                bottom : "20px",
                backgroundColor : "#1c1c1c",
                borderRadius : "10px",
                border : "1px solid #77777750",
                boxShadow : "1px 1px 1px #77777750",
                color : "#fcfcfc7e"
            }
        }>
            <h6 style={{ margin : "0" }}>{Process}</h6>
        </div>
    </>
}

export default TitledIndicator;