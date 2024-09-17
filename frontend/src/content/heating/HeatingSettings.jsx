import { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';

// Hooks
import useFetch from '../../hooks/useFetch'
import useUpdateData from '../../hooks/useUpdateData';

// Components
import MessageBox from '../../layout/MessageBox';
import CardButton from '../../layout/formelements/CardButton';
import CardInputField from '../../layout/formelements/CardInputField.jsx';
import LoadingSpinner from '../../layout/LoadingSpinner.jsx';


function HeatingSettings({ setShowHeatingSettings, buildingUid, onSettingsUpdate }) {

    const { projectId } = useParams();

    // Hooks
    const { data, loading, error, refetch } = useFetch(`/project_api/${projectId}/heating/buildingsettings/${buildingUid}/`);

    // Update data
    const { data: updatedBuildingData, response, setData, handleSubmit: updateBuildingData } = useUpdateData(`/project_api/${projectId}/heating/buildingsettings/update/${buildingUid}/`);

    // Set heat source for rooms in building
    const { data: updatedHeatSourceData, response: responseHeatsource, setData: setHeatSourceData, handleSubmit: updateHeatSource } = useUpdateData(`/project_api/${projectId}/heating/buildingsettings/setheatsource/${buildingUid}/`);

    // Handlers
    const handleCloseWindow = () => {
        setShowHeatingSettings(false);
    }

    const handleSubmit = async (e) => {
        e.preventDefault();

        if (updatedBuildingData !== null && updatedBuildingData !== undefined && updatedBuildingData !== '') {
            await updateBuildingData(e);
            refetch();
            setData('');
            onSettingsUpdate(); // Pass a message of change to HeatingTableRowComponent
        }
    }

    const handleHeatSourceChange = (e) => {
        setHeatSourceData({ [e.target.name]: e.target.value });
    }

    const handleHeatSourceSubmit = async (e) => {
        e.preventDefault();
        await updateHeatSource(e);
        setHeatSourceData('');
        onSettingsUpdate(); // Pass a message of change to HeatingTableRowComponent
    }

    const handleFormChange = (e) => {
        setData({
            ...updatedBuildingData,
            [e.target.name]: e.target.value,
        })
    }

    return (
        <>
            {response?.error && response.error !== null ? (<MessageBox message={response.error} />) : (<></>)}
            {error?.error && error.error !== null ? (<MessageBox message={error.error} />) : (<></>)}

            <div className="flex flex-col pl-3 pr-3 absolute top-1/2 rounded-lg border border-primary-color dark:border-dark-default-border-color left-1/2 transform -translate-x-1/2 overflow-y-auto -translate-y-1/2 h-1/2 w-[700px] bg-secondary-color dark:bg-dark-secondary-color text-primary-color dark:text-dark-primary-color shadow-lg shadow-background-shade justify-start z-[1000] text-base">
                {
                    loading ? (
                        <LoadingSpinner text="parametre" />
                    ) : (
                        <>
                            <div className="flex sticky top-0 bg-secondary-color dark:bg-dark-secondary-color flex-col border-default-border-color p-1 font-extrabold w-full">
                                <div className="flex flex-row w-full items-center">
                                    <div className="w-[10%]"></div>
                                    <div className="flex flex-1 justify-center text-center">
                                        Varmeparametre bygg {data && data.building_data.BuildingName}
                                    </div>
                                    <div className="flex w-[10%] justify-end">
                                        <span onClick={handleCloseWindow} className="cursor-pointer text-2xl hover:text-accent-color hover:dark:text-dark-accent-color">&times;</span>
                                    </div>

                                </div>
                            </div>

                            <div className="flex flex-row h-full text-primary-color dark:text-dark-primary-color justify-start text-base">
                                <div className="flex flex-col w-1/2 pl-3">
                                    <form name="building_heating_settings" onSubmit={handleSubmit}>
                                        <div>
                                            <h3>Oppdater varmedata</h3>
                                            <div>
                                                Innetempertaur (C&#176;)
                                            </div>
                                            <div>
                                                <CardInputField name="inside_temp" placeholder={data && data.building_data.InsideTemp} changeFunction={handleFormChange} />
                                            </div>

                                            <div className="mt-2">
                                                DUT (C&#176;)
                                            </div>
                                            <div>
                                                <CardInputField name="dut" placeholder={data && data.building_data.Dut} changeFunction={handleFormChange} />
                                            </div>

                                            <div className="mt-2">
                                                Temp ventilasjon (C&#176;)
                                            </div>
                                            <div className="mt-2">
                                                <CardInputField name="vent_temp" placeholder={data && data.building_data.VentTemp} changeFunction={handleFormChange} />
                                            </div>

                                            <div className="mt-2">
                                                Luftveksling infilt. (1/h)
                                            </div>
                                            <div>
                                                <CardInputField name="infiltration" placeholder={data && data.building_data.Infiltration} changeFunction={handleFormChange} />
                                            </div>

                                            <div className="mt-2">
                                                U-verdi yttervegg (W/m<sup>2</sup>K)
                                            </div>
                                            <div>
                                                <CardInputField name="u_value_outer_wall" placeholder={data && data.building_data.UvalueOuterWall} changeFunction={handleFormChange} />
                                            </div>

                                            <div className="mt-2">
                                                U-verdi vindu/dør (W/m<sup>2</sup>K)
                                            </div>
                                            <div>
                                                <CardInputField name="u_value_window_door" placeholder={data && data.building_data.UvalueWindowDoor} changeFunction={handleFormChange} />
                                            </div>

                                            <div className="mt-2">
                                                U-verdi gulv grunn (W/m<sup>2</sup>K)
                                            </div>
                                            <div>
                                                <CardInputField name="u_value_floor_ground" placeholder={data && data.building_data.UvalueFloorGround} changeFunction={handleFormChange} />
                                            </div>

                                            <div className="mt-2">
                                                U-verdi gulv luft (W/m<sup>2</sup>K)
                                            </div>
                                            <div>
                                                <CardInputField name="u_value_floor_air" placeholder={data && data.building_data.UvalueFloorAir} changeFunction={handleFormChange} />
                                            </div>

                                            <div className="mt-2">
                                                U-verdi tak (W/m<sup>2</sup>K)
                                            </div>
                                            <div>
                                                <CardInputField name="u_value_roof" placeholder={data && data.building_data.UvalueRoof} changeFunction={handleFormChange} />
                                            </div>

                                            <div className="mt-2">
                                                Kuldebroveri (W/m<sup>2</sup>K)
                                            </div>
                                            <div>
                                                <CardInputField name="cold_bridge_value" placeholder={data && data.building_data.ColdBridge} changeFunction={handleFormChange} />
                                            </div>

                                            <div className="mt-2">
                                                Årsmiddeltemp. (C&#176;)
                                            </div>
                                            <div>
                                                <CardInputField name="year_mid_temp" placeholder={data && data.building_data.YearMidTemp} changeFunction={handleFormChange} />
                                            </div>

                                            <div className="mt-2">
                                                Temp gulv mot luft (C&#176;)
                                            </div>
                                            <div>
                                                <CardInputField name="temp_floor_air" placeholder={data && data.building_data.TempFloorAir} changeFunction={handleFormChange} />
                                            </div>

                                            <div className="mt-2">
                                                Tillegg (%)
                                            </div>
                                            <div>
                                                <CardInputField name="safety" placeholder={data && data.building_data.Safety} changeFunction={handleFormChange} />
                                            </div>

                                            <div className="mt-2 mb-10">
                                                <CardButton buttonText="Oppdater" />
                                            </div>
                                        </div>
                                    </form>
                                </div>

                                <div className="flex flex-col w-1/2 pr-3 items-end text-end">
                                    <form onSubmit={handleHeatSourceSubmit}>
                                        <div>
                                            <h3>Sett primærvarmekilde</h3>
                                        </div>
                                        <div>
                                            <CardInputField name="heat_source" changeFunction={handleHeatSourceChange} placeholder='Radiator' /> <br></br>
                                        </div>
                                        <div className="mt-3">
                                            <CardButton buttonText="Lagre" />
                                        </div>

                                    </form>
                                </div>
                            </div>
                        </>
                    )
                }

            </div>
        </>
    );
}

export default HeatingSettings;