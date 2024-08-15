function CardTitle(props) {
    return (
        <>
            <div style={{ display: "flex", width: "100%" }}>
                <div style={{ display: "flex", alignItems: "center", textAlign: "center", marginRight: "10px" }}>
                    {props.svg}
                </div>
                <div style={{ display: "flex", alignItems: "center", textAlign: "center", fontSize: "23px" }}>
                    {props.title}
                </div>
            </div>
        </>
    );
}
export default CardTitle;