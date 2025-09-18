function SimpleDropDown({ Title, Options, BGColor, BSColor, BRR, H, BRColor, Flex, Color, CallBack, id}){
    return <>
        <div className="d-flex flex-row p-2 gap-2 align-items-center justify-content-start" style={{ backgroundColor: `${BGColor}`, boxShadow: `1px 1px 2px ${BSColor}`, borderRadius: `${BRR}px`, height: `${H}px`, border: `1px solid ${BRColor}`, flex : `${Flex}` }}>
            <select style={{ flex : "1", backgroundColor : `${BGColor}`, color : `${Color}`, border : "none", outline : "none" }} onChange={(e) => CallBack(e.target.value)}>
                <option key={0} value={id?? ""}>{id? Options.filter(prev => prev.value == id).map(prev => prev.key) : Title}</option>
                {
                    Options.map((option, index)=><option key={index+1} value={option.value}>{option.key}</option>)
                }
            </select>
        </div>
    </>
}

export default SimpleDropDown;