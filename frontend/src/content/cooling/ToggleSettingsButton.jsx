import { useState } from 'react';
import CoolingSettings from './CoolingSettings';

function HeatingSettingsWindow({buildingUid, onSettingsButtonUpdate}) {
    const [showCoolingSettings, setShowCoolingSettings] = useState(false);
    const [settingsUpdatedState, setSettingsUpdatedState] = useState(false);

    // Upon pass change from CoolingSettings to Cooling
    const handleSettingsUpdate = () => {
        onSettingsButtonUpdate();
    }

    const handleClick = (e) => {
        e.preventDefault();
        setShowCoolingSettings(!showCoolingSettings);
    }
    return (
        <>
            <a className="todo-link" href="#" onClick={(e) => handleClick(e, setShowCoolingSettings)}>
                <button className="table-sorting-button" type="submit">Kjøleinnstillinger</button>
            </a>
            {showCoolingSettings && <CoolingSettings onSettingsUpdate={handleSettingsUpdate} key={buildingUid} buildingUid={buildingUid} showHeatingSettings={showCoolingSettings} setShowHeatingSettings={setShowCoolingSettings} />}
        </>
    );
}

export default HeatingSettingsWindow;