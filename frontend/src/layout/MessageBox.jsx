import { useEffect, useState } from "react";

function MessageBox({ message }) {
    const [errorPopUpClass, setErrorPopUpClass] = useState('popup-hide');

    useEffect(() => {
        setErrorPopUpClass('popup-show')
    }, [message]);

    const closeMessagePopUp = () => {
        setErrorPopUpClass('popup-hide');
    }

    return (
            <div className={errorPopUpClass}>
                <span className="popup-close" onClick={closeMessagePopUp}>×</span>
                <p>{message}</p>
            </div>
    );
}

export default MessageBox;