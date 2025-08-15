function SimpleInput({Text, BGColor, BSColor, BRR, H, BRColor, Color, Type, Value, CallBack, Disabled}){
    return <>
        <div className="w-100 d-flex flex-row p-2 gap-2 align-items-center justify-content-start" style={{ backgroundColor: `${BGColor}`, boxShadow: `1px 1px 2px ${BSColor}`, borderRadius: `${BRR}px`, height: `${H}px`, border: `1px solid ${BRColor}` }}>
            {
                Disabled 
                    ? <input style={{ flex : "1", backgroundColor: "transparent", border: "none", outline: "none", color: `${Color}` }} type={Type} placeholder={Text} value={Value} onChange={(e)=> CallBack && CallBack(e.target.value)} disabled/>
                    : <input style={{ flex : "1", backgroundColor: "transparent", border: "none", outline: "none", color: `${Color}` }} type={Type} placeholder={Text} value={Value} onChange={(e)=> CallBack && CallBack(e.target.value)}/>
            }
        </div>
    </>
}

export default SimpleInput;