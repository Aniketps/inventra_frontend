function ButtonWithIcon({ Title, Color, BGColor, BRColor, OnClick, Icon, Width }) {
    return (
        <button
            className="d-flex flex-row align-items-center p-2 gap-1"
            onClick={OnClick()}
            style={{
                color: Color,
                backgroundColor: BGColor,
                border: `2px solid ${BRColor}`,
                borderRadius: "10px",
                cursor: "pointer",
                width : `${Width}%`
            }}
        >
            <img
                src={Icon}
                alt={Title}
                style={{ flex: 1, height: "20px", objectFit: "contain" }}
            />
            <span style={{ flex: 3, textAlign: "left" }}>
                {Title}
            </span>
        </button>
    );
}

export default ButtonWithIcon;
