import { useState } from 'react';
import { Link } from 'react-router-dom';
import HelpIcon from '../assets/svg/helpIcon.jsx';
import HelpBox from '../layout/HelpBox.jsx'

function TableTop({ title, sections }) {
    const [showHelpBox, setShowHelpBox] = useState(false);

    const toggleHelpBox = (e) => {
        e.preventDefault();
        setShowHelpBox(!showHelpBox);
    }

    return (
        <>
            {
                showHelpBox === true && (
                    <HelpBox title={title} sections={sections} setShowHelpBox={toggleHelpBox} />
                )
            }
            <div className="flex flex-row w-full">
                <div onClick={toggleHelpBox} className="flex cursor-pointer bg-secondary-color dark:bg-dark-secondary-color sticky mt-5 p-3 rounded-tl-lg">
                    <HelpIcon />
                </div>
                <div className="flex flex-1 bg-secondary-color dark:bg-dark-secondary-color sticky mt-5 p-3 rounded-tr-lg">

                </div>
            </div>
        </>
    );
}

export default TableTop;