
import { useContext } from "react";
import { GlobalContext } from '../context/GlobalContext';
import TodoButton from './TodoButton';

function SubTitleComponent(props) {
    const { activeProject } = useContext(GlobalContext);

    return (
        <div className="w-full h-12 flex items-center border-t border-b border-default-border-color dark:border-dark-default-border-color bg-secondary-color dark:bg-dark-secondary-color text-primary-color dark:text-dark-primary-color pl-5 pr-5">
            <div className="flex items-center h-full">
                <div className="flex items-center text-center mr-5 h-full">
                    {props.svg}
                </div>
                <div className="flex items-center text-center text-xl font-semibold h-full">
                    {props.headerText}
                    {props.projectName && props.projectName !== "" && (<>&nbsp;-&nbsp;{props.projectName}</>)}
                    {props.projectNumber && props.projectNumber !== "" && (<>&nbsp;{props.projectNumber}</>)}
                </div>
            </div>
            <div className="flex justify-end flex-1 h-full">
                {
                    (activeProject && activeProject !== "0") && (
                        <TodoButton />
                    )
                }
            </div>
        </div>
    );
}

export default SubTitleComponent;