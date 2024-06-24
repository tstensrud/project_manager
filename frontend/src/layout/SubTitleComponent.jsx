import { Outlet } from 'react-router-dom';

function SubTitleComponent({ children }) {
    return (
        <>
            <div className="subtitle-header-container">
                <h1 className="app-content-subTitleheaderText">
                    {children}
                </h1>
            </div>
        </>
    );
}

export default SubTitleComponent;