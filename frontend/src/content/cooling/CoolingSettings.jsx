import { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import useFetch from '../../hooks/useFetch'
import useUpdateData from '../../hooks/useUpdateData';
import MessageBox from '../../layout/MessageBox';



function CoolingSettings ({setShowHeatingSettings: setShowCoolingSettings, buildingUid, onSettingsUpdate}) {
    
    const {projectId} = useParams();

    // Hooks
    const {data, loading, error, refetch} = useFetch(`/project_api/${projectId}/heating/buildingsettings/${buildingUid}/`);

    // Update data
    const {data: updatedBuildingData, response, setData, handleSubmit: updateBuildingData} = useUpdateData(`/project_api/${projectId}/cooling/update_all_rooms/${buildingUid}/`);

    // Handlers
    const handleClick = (e) => {
        setShowCoolingSettings(false);
    }

    const handleSubmit = async (e) =>{
        e.preventDefault();
        
        if (updatedBuildingData !== null && updatedBuildingData !== undefined && updatedBuildingData !== '') {
            await updateBuildingData(e);
            refetch();
            setData('');
            onSettingsUpdate(); // Pass a message of change to CoolingTableRowComponent
        }
    }

    const handleFormChange = (e) => {
        setData({
            ...updatedBuildingData,
            [e.target.name]: e.target.value,
        })
    }



    return (
        <>
        {response && response.error && response.error !== null ? (<MessageBox message={response.error} /> ) : (<></>)}
        {error && error.error && error.error !== null ? (<MessageBox message={error.error} /> ) : (<></>)}

            <div className="settings-popup">
                <div className="todo-popup-header">
                    <span onClick={(e) => handleClick(e, setShowCoolingSettings)} className="todo-close-btn">&times;</span>
                    <br />
                    Kjøleinnstillinger bygg {data && data.building_data.BuildingName}
                </div>
                <div className="settings-popup-item-container">
                    <p>
                        <strong>NB!</strong> Disse verdiene settes for alle rom i bygget. Du kan etterpå justere enkeltrom med egne verdier ved behov.
                    </p>
                    <form name="building_heating_settings" onSubmit={handleSubmit}>
                        Romtemp sommer (C&#176;) <br />
                        <input name="RoomTempSummer" placeholder="26" className="input-heating" onChange={handleFormChange} /><br />
                        Tilluftstemp. sommer (C&#176;) <br />
                        <input name="VentairTempSummer" placeholder="18" className="input-heating" onChange={handleFormChange} /><br />
                        Internlast lys (W/m<sup>2</sup>) <br />
                        <input name="InternalHeatloadLights" placeholder="7"  className="input-heating" onChange={handleFormChange} /><br />
                        Internlast personer (W/pers) <br />
                        <input name="InternalHeatloadPeople" placeholder="100" className="input-heating" onChange={handleFormChange} /><br />
                        Soltilskudd (W/m<sup>2</sup>K)<br />
                        <input name="SunAdition" placeholder="1" className="input-heating" onChange={handleFormChange} /><br />
                        Solreduksjon  (0-1,0)<br />
                        <input name="SunReduction" placeholder="0,5" className="input-heating" onChange={handleFormChange} /><br />
                        <p>
                            <button className="form-button" type="submit">Oppdater</button>
                        </p>
                    </form>
                </div>
            </div>
        </>
    );
}

export default CoolingSettings;