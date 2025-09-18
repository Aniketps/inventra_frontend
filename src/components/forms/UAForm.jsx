import { SimpleInput, Button } from "../mainComponent";

function UAForm({ Title, Inputs, Buttons }){
    return <>
        <div className="d-flex flex-column gap-3 p-3 justify-content-between"
            style={
                {
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
            <div>
                <h3>{ Title }</h3>
            </div>
            <div className="d-flex flex-column gap-2">
                {
                    Inputs.map(Field => Field)
                }
            </div>
            <div className="d-flex flex-row align-items-center justify-content-end gap-2">
                {
                    Buttons.map(b => <Button Title={b.Title} Color={b.Color} BGColor={b.BGColor} BRColor={b.BRColor} OnClick={b.OnClick}/>)
                }
            </div>
        </div>
    </>
}

export default UAForm;