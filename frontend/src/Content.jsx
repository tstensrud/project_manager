import ToDo from './Todo'

function Content() {
    return(
        <>
        <div className="text-div">
            <ToDo/>
            <div className="subtitle-header-container">
                <h1 className="app-content-subTitleheaderText">
                    SUBTITLE
                </h1>
            </div>
            MASSE INNHOLD
        </div>
        </>
    );
}

export default Content;