import { useState } from 'react';
import HeatingSettings from './HeatingSettings';

function HeatingSettingsWindow({buildingId, msgToParent}) {
    const [showHeatingSettings, setShowHeatingSettings] = useState(false);

    const handleChildMessage = (msg) => {
        if (msg !== undefined) {
            sendMessageToParent(msg);
       }
   }

   const sendMessageToParent = (msg) => {
    msgToParent(msg);
    console.log("Togglesettingsbutton sending message");
    }

    const handleClick = (e) => {
        e.preventDefault();
        setShowHeatingSettings(!showHeatingSettings);
    }
    return (
        <>
            <a className="todo-link" href="#" onClick={(e) => handleClick(e, setShowHeatingSettings)}>
                <button className="table-sorting-button" type="submit">Varmeinnstillinger</button>
            </a>
            {showHeatingSettings && <HeatingSettings msgToParent={handleChildMessage} key={buildingId} buildingId={buildingId} showHeatingSettings={showHeatingSettings} setShowHeatingSettings={setShowHeatingSettings} />}
        </>
    );
}

export default HeatingSettingsWindow;