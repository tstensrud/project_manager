import { useState } from 'react';

// Components
import HeatingSettings from './HeatingSettings';
import SortingButton from '../../layout/formelements/SortingButton.jsx'

function HeatingSettingsWindow({ buildingUid, onSettingsButtonUpdate, buttonText }) {
    const [showHeatingSettings, setShowHeatingSettings] = useState(false);

    // Upon pass change from HeatingSettings to Heating
    const handleSettingsUpdate = () => {
        onSettingsButtonUpdate();
    }

    const handleClick = () => {
        setShowHeatingSettings(!showHeatingSettings);
    }
    return (
        <>
            <SortingButton sortButtonClick={handleClick} buttonText={buttonText} />
            {showHeatingSettings && <HeatingSettings onSettingsUpdate={handleSettingsUpdate} key={buildingUid} buildingUid={buildingUid} showHeatingSettings={showHeatingSettings} setShowHeatingSettings={setShowHeatingSettings} />}
        </>
    );
}

export default HeatingSettingsWindow;