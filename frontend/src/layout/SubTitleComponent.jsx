
import { useContext } from "react";
import { GlobalContext } from '../context/GlobalContext';
import TodoButton from './TodoButton';

function SubTitleComponent(props) {
    const { activeProject, activeProjectName } = useContext(GlobalContext);

    return (
        <div className="w-full h-12 flex items-center border-t border-b border-table-border-color dark:border-dark-default-border-color bg-secondary-color dark:bg-dark-secondary-color text-primary-color dark:text-dark-primary-color pl-5 pr-5">
            <div className="flex justify-between items-center h-full w-full">

                <div className="flex flex-row h-full w-1/4">
                    <div className="flex items-center text-center mr-5 h-full">
                        {props.svg}
                    </div>
                    <div className="flex items-center">
                        {props.headerText}
                    </div>
                </div>

                <div className="flex flex-1 justify-center items-center text-center text-xl font-semibold h-full">
                    {activeProjectName}
                    {props.projectNumber && props.projectNumber !== "" && (<>&nbsp;{props.projectNumber}</>)}
                </div>

                <div className="flex justify-end w-1/4 h-full">
                    {
                        (activeProject && activeProject !== "0") && (
                            <TodoButton />
                        )
                    }
                </div>
            </div>
        </div>
    );
}

export default SubTitleComponent;