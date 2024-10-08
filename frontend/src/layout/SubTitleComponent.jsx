
import { useContext } from "react";
import { GlobalContext } from '../context/GlobalContext';
import TodoButton from './TodoButton';

function SubTitleComponent(props) {
    const { activeProject, activeProjectName } = useContext(GlobalContext);

    return (
        <div className="w-full h-16 flex items-center bg-tertiary-color dark:bg-dark-secondary-color text-primary-color dark:text-dark-primary-color pl-8 pr-8 ">
            <div className="flex justify-between items-center h-full w-full bg-secondary-color dark:bg-dark-tertiary-color rounded-lg pl-3 pr-3 ">

                <div className="flex flex-row h-full w-1/4">
                    <div className="flex items-center text-center mr-5 h-full">
                        <div className="dark:bg-dark-accent-color bg-accent-color p-1 border border-accent-color dark:border-dark-accent-color rounded-lg">
                            {props.svg}
                        </div>
                    </div>
                    <div className="flex items-center">
                        {props.headerText}
                    </div>
                </div>

                <div className="flex flex-1 justify-center items-center text-center text-xl font-semibold h-full">
                    {activeProjectName}
                    {props.projectNumber && props.projectNumber !== "" && (<>&nbsp;{props.projectNumber}</>)}
                </div>

                <div className="flex flex-row h-full w-1/4">
                </div>
            </div>
        </div>
    );
}

export default SubTitleComponent;