import { Button } from "../mainComponent";

function SimpleStatusContainer({ Message, Desc, Buttons }) {
    return <>
        <div className="d-flex flex-column gap-3 align-items-center justify-content-center"
            style={
                {
                    height: "280px",
                    width: "650px",
                    color : "white",
                    background: "white",
                    border: "1px solid #77777750",
                    position: "fixed",
                    zIndex : "10000",
                    top : "50%",
                    left : "50%",
                    transform : "translate(-50%, -50%)",
                    backgroundColor : "#1c1c1c",
                    boxShadow : "1px 1px 2px #000098ff",
                     borderRadius : "20px"
                }
            }>
            <h1>{ Message }</h1>
            <p>{ Desc }</p>
            <div className="w-100 d-flex flex-row align-items-center" style={{ justifyContent : "space-evenly" }}>
                {
                    Buttons.map((data)=><Button BGColor={data.BGColor} BRColor={data.BRColor} Color={data.Color} OnClick={data.OnClick} Title={data.Title}/>)
                }
            </div>
        </div>
    </>
}

export default SimpleStatusContainer;