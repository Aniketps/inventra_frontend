import "./button.css"

function Button({Title, Color, BGColor, BRColor, OnClick}){
    return <>
        <button type="button" onClick={() => OnClick()} className="btn px-4 py-2" style={{ color: Color, backgroundColor:BGColor, border: `2px solid ${BRColor}`, borderRadius : "10px" }}>
            { Title }
        </button>
    </>
}

export default Button;