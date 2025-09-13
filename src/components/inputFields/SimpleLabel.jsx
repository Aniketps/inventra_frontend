function SimpleLabel({ Text, Color, Size = "14px", Weight = "normal" }) {
    return <>
        <div className="w-100 d-flex flex-row align-items-center justify-content-start" style={{ paddingLeft: "5px" }}>
            <label style={{ 
                color: Color, 
                fontSize: Size, 
                fontWeight: Weight,
                marginLeft: "5px"
            }}>
                {Text}
            </label>
        </div>
    </>
}

export default SimpleLabel;