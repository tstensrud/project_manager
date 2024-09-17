import { useState } from 'react';

// Components
import CoolingSettings from './CoolingSettings';
import SortingButton from '../../layout/formelements/SortingButton.jsx'

function HeatingSettingsWindow({ buildingUid, onSettingsButtonUpdate, buttonText }) {
    const [showCoolingSettings, setShowCoolingSettings] = useState(false);
    
    // Upon pass change from CoolingSettings to Cooling
    const handleSettingsUpdate = () => {
        onSettingsButtonUpdate();
    }

    const handleClick = () => {
        setShowCoolingSettings(!showCoolingSettings);
    }
    return (
        <>
            <SortingButton sortButtonClick={handleClick} buttonText={buttonText} />
            {showCoolingSettings && <CoolingSettings onSettingsUpdate={handleSettingsUpdate} key={buildingUid} buildingUid={buildingUid} showCoolingSettings={showCoolingSettings} setShowCoolingSettings={setShowCoolingSettings} />}
        </>
    );
}

export default HeatingSettingsWindow;