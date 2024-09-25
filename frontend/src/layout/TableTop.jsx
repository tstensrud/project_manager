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

            <div className="bg-secondary-color dark:bg-dark-secondary-color sticky ml-5 mr-5 mt-5 p-3 rounded-tl-lg rounded-tr-lg">
                <Link to="" onClick={toggleHelpBox}>
                    <HelpIcon />
                </Link>
            </div>
        </>
    );
}

export default TableTop;