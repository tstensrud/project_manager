import { useState } from 'react';

// Components
import HeatingSettings from './HeatingSettings';
import ActiveSortingButton from '../../layout/formelements/ActiveSortingButton.jsx'

function HeatingSettingsWindow({ buildingUid, onSettingsButtonUpdate }) {
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
            <ActiveSortingButton sortButtonClick={(e) => handleClick(e, setShowHeatingSettings)} buttonText="Varmedata" />
            {showHeatingSettings && <HeatingSettings onSettingsUpdate={handleSettingsUpdate} key={buildingUid} buildingUid={buildingUid} showHeatingSettings={showHeatingSettings} setShowHeatingSettings={setShowHeatingSettings} />}
        </>
    );
}

export default HeatingSettingsWindow;