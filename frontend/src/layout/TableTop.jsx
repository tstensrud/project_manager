import { useState } from 'react';
import { Link } from 'react-router-dom';
import HelpIcon from '../assets/svg/helpIcon.jsx';

function TableTop({ info }) {
    const [showHelpBox, setShowHelpBox] = useState(false);

    return (
        <>
            {
                showHelpBox === true ? (
                        <div className="fixed h-full w-full justify-center items-center z-[1000] left-0 top-[15%]">
                            <div className="w-full h-full flex flex-col mt-[2%] items-center">
                                <div className="bg-tertiary-color flex flex-col pl-5 pr-5 rounded-lg w-[30%] h-[50%] overflow-y-auto shadow-lg shadow-background-shade border border-default-border-color">
                                    <div className="w-full bg-tertiary-color flex justify-end sticky top-0 pt-3">
                                        <Link to="" onClick={() => setShowHelpBox(false)}>Lukk</Link>
                                    </div>
                                    <div className="w-full flex flex-col">
                                        {info}
                                    </div>
                                </div>
                            </div>
                        </div>
                ) : (<></>)
            }

            <div className="bg-secondary-color sticky ml-5 mr-5 mt-5 p-3 rounded-tl-lg rounded-tr-lg">
                <Link to="" onClick={() => setShowHelpBox(true)}>
                    <HelpIcon />
                </Link>
            </div>
        </>
    );
}

export default TableTop;