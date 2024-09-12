
import { useContext } from "react";
import { GlobalContext } from '../GlobalContext';
import TodoButton from './TodoButton';

function SubTitleComponent(props) {
    const { activeProject } = useContext(GlobalContext);

    return (
        <div className="w-full flex items-center border-t border-t-default-border-color border-b border-b-default-border-color bg-tertiary-color text-primary-color pl-5 pr-5">
            <div className="flex h-12">
                <div className="flex items-center text-center mr-5">
                    {props.svg}
                </div>
                <div className="flex items-center text-center text-xl font-semibold">
                    {props.headerText}
                    {props.projectName && props.projectName !== "" ? (<> - {props.projectName}</>) : (<></>)}
                    {props.projectNumber && props.projectNumber !== "" ? (<>- {props.projectNumber}</>) : (<></>)}
                </div>
            </div>
            <div className="flex justify-end flex-1">
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