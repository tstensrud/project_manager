function LoadingSpinner() {
    return (
        <>
            <div style={{ display: "flex", width: "100%", height: "100%", justifyContent: "center", textAlign: "center", alignItems: "center" }}>
                <div className="loading-container">
                    <div className="loading-spinner">
                    </div>
                </div>
            </div>
        </>
    );
}

export default LoadingSpinner;