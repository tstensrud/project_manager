
import { useContext } from "react";
import { GlobalContext } from '../GlobalContext';
import TodoButton from './TodoButton';

function SubTitleComponent(props) {
    const { activeProject } = useContext(GlobalContext);

    return (
        <div className="sub-header">
            <div style={{ display: "flex", height: "50px" }}>
                <div style={{ display: "flex", alignItems: "center", textAlign: "center", marginRight: "20px" }}>
                    {props.svg}
                </div>
                <div style={{ display: "flex", alignItems: "center", textAlign: "center" }}>
                    <h3>
                        {props.headerText}
                        {props.projectName && props.projectName !== "" ? (<> - {props.projectName}</>) : (<></>)}
                        {props.projectNumber && props.projectNumber !== "" ? (<>- {props.projectNumber}</>) : (<></>)}
                    </h3>
                </div>
            </div>
            <div style={{ display: "flex", justifyContent: "end", marginRight: "20px", flex: "1" }}>
                {
                    (activeProject && activeProject !== "0") ? (
                        <TodoButton />
                    ) : (<></>)
                }
            </div>
        </div>
    );
}

export default SubTitleComponent;