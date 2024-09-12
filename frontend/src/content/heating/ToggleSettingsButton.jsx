import { useState } from 'react';
import HeatingSettings from './HeatingSettings';

function HeatingSettingsWindow({buildingUid, onSettingsButtonUpdate}) {
    const [showHeatingSettings, setShowHeatingSettings] = useState(false);
    const [settingsUpdatedState, setSettingsUpdatedState] = useState(false);

    // Upon pass change from HeatingSettings to Heating
    const handleSettingsUpdate = () => {
        onSettingsButtonUpdate();
    }

    const handleClick = (e) => {
        e.preventDefault();
        setShowHeatingSettings(!showHeatingSettings);
    }
    return (
        <>
            <a  href="#" onClick={(e) => handleClick(e, setShowHeatingSettings)}>
                <button className="table-sorting-button" type="submit">Varmedata</button>
            </a>
            {showHeatingSettings && <HeatingSettings onSettingsUpdate={handleSettingsUpdate} key={buildingUid} buildingUid={buildingUid} showHeatingSettings={showHeatingSettings} setShowHeatingSettings={setShowHeatingSettings} />}
        </>
    );
}

export default HeatingSettingsWindow;