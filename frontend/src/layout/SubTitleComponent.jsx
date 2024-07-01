import { Outlet } from 'react-router-dom';

function SubTitleComponent({ children }) {
    return (
        <>
            <div className="sub-header">
                
                    <h3>{children}</h3>
                
            </div>
        </>
    );
}

export default SubTitleComponent;