function InputBothSideIcons({FrontImage, Text, BGColor, BSColor, BRR, H, BRColor, Color, Type, Value, CallBack, Operation, BackImage}){
    return <>
        <div className="d-flex flex-row p-2 gap-2 align-items-center justify-content-start" style={{ backgroundColor: `${BGColor}`, boxShadow: `1px 1px 2px ${BSColor}`, borderRadius: `${BRR}px`, height: `${H}px`, border: `1px solid ${BRColor}` }}>
            <img src={FrontImage} alt={Text} style={{ height: "30px" }} />
            <div className="h-100" style={{ border: "1px solid #777777" }} />
            <input style={{ flex: "8", backgroundColor: "transparent", border: "none", outline: "none", color: `${Color}` }} type={Type} placeholder={Text} value={Value} onChange={(e)=> CallBack(e.target.value)}/>
            <div className="h-100" style={{ border: "1px solid #777777" }} />
            <img onClick={()=> Type == "password"? Operation(true) : Operation(false)} src={BackImage} alt={Text} style={{ height: "30px" }} />
        </div>
    </>
}

export default InputBothSideIcons;