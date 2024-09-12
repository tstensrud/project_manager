import { useState } from 'react';

// Components
import CoolingSettings from './CoolingSettings';
import ActiveSortingButton from '../../layout/formelements/ActiveSortingButton.jsx'

function HeatingSettingsWindow({ buildingUid, onSettingsButtonUpdate }) {
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
            <ActiveSortingButton sortButtonClick={(e) => handleClick(e, setShowCoolingSettings)} buttonText="Kjøledata" />
            {showCoolingSettings && <CoolingSettings onSettingsUpdate={handleSettingsUpdate} key={buildingUid} buildingUid={buildingUid} showHeatingSettings={showCoolingSettings} setShowHeatingSettings={setShowCoolingSettings} />}
        </>
    );
}

export default HeatingSettingsWindow;