import { useEffect } from 'react';
import { useParams } from 'react-router-dom';
import useFetch from '../../hooks/useFetch'
import useUpdateData from '../../hooks/useUpdateData';
import MessageBox from '../../layout/MessageBox';



function HeatingSettings ({setShowHeatingSettings, buildingId, msgToParent}) {
    
    const {projectId} = useParams();

    // Hooks
    const {data, loading, error, refetch} = useFetch(`/project_api/${projectId}/heating/buildingsettings/${buildingId}/`);

    // Update data
    const {data: updatedBuildingData, response, setData, handleSubmit: updateBuildingData} = useUpdateData(`/project_api/${projectId}/heating/buildingsettings/update/${buildingId}/`);

    // Handlers
    const handleClick = (e) => {
        setShowHeatingSettings(false);
    }

    const handleSubmit = async (e) =>{
        e.preventDefault();
        
        if (updatedBuildingData !== null && updatedBuildingData !== undefined && updatedBuildingData !== '') {
            console.log(updatedBuildingData);
            await updateBuildingData(e);
            refetch();
            setData('');
            sendMessageToParent("update");
        }
    }

    const handleFormChange = (e) => {
        setData({
            ...updatedBuildingData,
            [e.target.name]: e.target.value,
        })
    }

    const sendMessageToParent = (msg) => {
        msgToParent(msg);
        console.log("Heating settings snding message")
        }

    return (
        <>
        {response && response.error && response.error !== null ? (<MessageBox message={response.error} /> ) : (<></>)}
        {error && error.error && error.error !== null ? (<MessageBox message={error.error} /> ) : (<></>)}

            <div className="settings-popup">
                <div className="todo-popup-header">
                    <span onClick={(e) => handleClick(e, setShowHeatingSettings)} className="todo-close-btn">&times;</span>
                    <br />
                    Varmeinnstillinger bygg {buildingId}
                </div>
                <div className="settings-popup-item-container">
                    <form name="building_heating_settings" onSubmit={handleSubmit}>
                        Innetempertaur (C&#176;) <br />
                        <input name="inside_temp" placeholder={data && data.building_data.InsideTemp} className="input-heating" onChange={handleFormChange} /><br />
                        DUT (C&#176;) <br />
                        <input name="dut" placeholder={data && data.building_data.Dut} className="input-heating" onChange={handleFormChange} /><br />
                        Temp ventilasjon (C&#176;) <br />
                        <input name="vent_temp" placeholder={data && data.building_data.VentTemp}  className="input-heating" onChange={handleFormChange} /><br />
                        Luftveksling infilt. (1/h) <br />
                        <input name="infiltration" placeholder={data && data.building_data.Infiltration} className="input-heating" onChange={handleFormChange} /><br />
                        U-verdi yttervegg (W/m<sup>2</sup>K)<br />
                        <input name="u_value_outer_wall" placeholder={data && data.building_data.UvalueOuterWall} className="input-heating" onChange={handleFormChange} /><br />
                        U-verdi vindu/dør (W/m<sup>2</sup>K)<br />
                        <input name="u_value_window_door" placeholder={data && data.building_data.UvalueWindowDoor} className="input-heating" onChange={handleFormChange} /><br />
                        U-verdi gulv grunn (W/m<sup>2</sup>K)<br />
                        <input name="u_value_floor_ground" placeholder={data && data.building_data.UvalueFloorGround} className="input-heating" onChange={handleFormChange} /><br />
                        U-verdi gulv luft (W/m<sup>2</sup>K)<br />
                        <input name="u_value_floor_air" placeholder={data && data.building_data.UvalueFloorAir} className="input-heating" onChange={handleFormChange} /><br />
                        U-verdi tak (W/m<sup>2</sup>K) <br />
                        <input name="u_value_roof"  placeholder={data && data.building_data.UvalueRoof} className="input-heating" onChange={handleFormChange} /><br />
                        Kuldebroveri (W/m<sup>2</sup>K) <br />
                        <input name="cold_bridge_value" placeholder={data && data.building_data.ColdBridge} className="input-heating" onChange={handleFormChange} /><br />
                        Årsmiddeltemp. (C&#176;)<br />
                        <input name="year_mid_temp" placeholder={data && data.building_data.YearMidTemp} className="input-heating" onChange={handleFormChange} /><br />
                        Temp gulv mot luft (C&#176;)<br />
                        <input name="temp_floor_air" placeholder={data && data.building_data.TempFloorAir}className="input-heating" onChange={handleFormChange} /><br />
                        Tillegg (%)<br />
                        <input name="safety" placeholder={data && data.building_data.Safety} className="input-heating" onChange={handleFormChange} /><br />
                        <p>
                            <button className="form-button" type="submit">Oppdater</button>
                        </p>
                    </form>
                </div>
            </div>
        </>
    );
}

export default HeatingSettings;