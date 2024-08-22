import { useState } from 'react';
import { Link } from 'react-router-dom';
import HelpIcon from '../assets/svg/helpIcon.svg?react';

function TableTop({ info }) {
    const [showHelpBox, setShowHelpBox] = useState(false);

    return (
        <>
            {
                showHelpBox === true ? (
                        <div className="help-box-wrapper">
                            <div className="help-box-container">
                                <div className="help-box-card">
                                    <div className="help-box-card-header">
                                        <Link to="" onClick={() => setShowHelpBox(false)}>Lukk</Link>
                                    </div>
                                    <div className="help-box-card-item">
                                        {info}
                                    </div>
                                </div>
                            </div>
                        </div>
                ) : (<></>)
            }

            <div className="table-top-options">
                <Link to="" onClick={() => setShowHelpBox(true)}>
                    <HelpIcon />
                </Link>
            </div>
        </>
    );
}

export default TableTop;