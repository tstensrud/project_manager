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

    useEffect(() => {
        if (response?.success === true) {
            refetch();
            setData('');
            onSettingsUpdate();
        }
    }, [response]);

    useEffect(() => {
        if (responseHeatsource?.success === true) {
            setHeatSourceData('');
            onSettingsUpdate();
        }
    }, [responseHeatsource])

    // Handlers
    const handleCloseWindow = () => {
        setShowHeatingSettings(false);
    }

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (updatedBuildingData) {
            await updateBuildingData();
        }
    }

    const handleHeatSourceChange = (e) => {
        setHeatSourceData({ [e.target.name]: e.target.value });
    }

    const handleHeatSourceSubmit = async (e) => {
        e.preventDefault();
        if (updatedHeatSourceData) {
            await updateHeatSource();
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
            {response?.success === false && (<MessageBox message={response.message} />)}
                <div className="flex flex-col absolute top-1/2 rounded-lg border border-primary-color dark:border-dark-default-border-color left-1/2 transform -translate-x-1/2 overflow-y-auto -translate-y-1/2 h-1/2 w-[700px] bg-secondary-color dark:bg-dark-secondary-color text-primary-color dark:text-dark-primary-color shadow-lg shadow-background-shade justify-start z-[1000] text-base">
                    {
                        loading ? (
                            <LoadingSpinner text="parametre" />
                        ) : (
                            <>
                                <div className="flex sticky top-0 bg-secondary-color dark:bg-dark-secondary-color flex-col border-default-border-color p-1 font-semibold w-full border-b dark:border-dark-default-border-color">
                                    <div className="flex flex-row w-full items-center mb-5">
                                        <div className="w-[10%]">

                                        </div>
                                        <div className="flex flex-1 justify-center text-xl text-center pl-3">
                                            Varmeparametre bygg {data && data.building_data.BuildingName}
                                        </div>
                                        <div className="flex w-[10%] justify-end pr-3">
                                            <span onClick={handleCloseWindow} className="cursor-pointer text-2xl hover:text-accent-color hover:dark:text-dark-accent-color">&times;</span>
                                        </div>
                                    </div>
                                </div>

                                <div className="flex flex-row h-full text-primary-color dark:text-dark-primary-color justify-start text-base pl-3">
                                    <div className="flex flex-col w-1/2">
                                        <form name="building_heating_settings" onSubmit={handleSubmit}>
                                            <div>
                                                <h3>Oppdater varmeparemetre</h3>
                                                <div className="mt-3">
                                                    Innetempertaur (C&#176;)
                                                </div>
                                                <div>
                                                    <CardInputField name="inside_temp" changeFunction={handleFormChange} />
                                                </div>

                                                <div className="mt-2 flex flex-row">
                                                    DUT (C&#176;)
                                                </div>
                                                <div>
                                                    <CardInputField name="dut" changeFunction={handleFormChange} />
                                                </div>

                                                <div className="mt-2 flex flex-row">
                                                    Temp ventilasjon (C&#176;)
                                                </div>
                                                <div className="mt-2 flex flex-row">
                                                    <CardInputField name="vent_temp" changeFunction={handleFormChange} />
                                                </div>

                                                <div className="mt-2 flex flex-row">
                                                    Luftveksling infilt. (1/h)
                                                </div>
                                                <div>
                                                    <CardInputField name="infiltration" changeFunction={handleFormChange} />
                                                </div>

                                                <div className="mt-2 flex flex-row">
                                                    U-verdi yttervegg (W/m<div><sup>2</sup></div>K)
                                                </div>
                                                <div>
                                                    <CardInputField name="u_value_outer_wall" changeFunction={handleFormChange} />
                                                </div>

                                                <div className="mt-2 flex flex-row">
                                                    U-verdi vindu/dør (W/m<div><sup>2</sup></div>K)
                                                </div>
                                                <div>
                                                    <CardInputField name="u_value_window_door" changeFunction={handleFormChange} />
                                                </div>

                                                <div className="mt-2 flex flex-row">
                                                    U-verdi gulv grunn (W/m<div><sup>2</sup></div>K)
                                                </div>
                                                <div>
                                                    <CardInputField name="u_value_floor_ground" changeFunction={handleFormChange} />
                                                </div>

                                                <div className="mt-2 flex flex-row">
                                                    U-verdi gulv luft (W/m<div><sup>2</sup></div>K)
                                                </div>
                                                <div>
                                                    <CardInputField name="u_value_floor_air" changeFunction={handleFormChange} />
                                                </div>

                                                <div className="mt-2 flex flex-row">
                                                    U-verdi tak (W/m<div><sup>2</sup></div>K)
                                                </div>
                                                <div>
                                                    <CardInputField name="u_value_roof" changeFunction={handleFormChange} />
                                                </div>

                                                <div className="mt-2 flex flex-row">
                                                    Kuldebroveri (W/m<div><sup>2</sup></div>K)
                                                </div>
                                                <div>
                                                    <CardInputField name="cold_bridge_value" changeFunction={handleFormChange} />
                                                </div>

                                                <div className="mt-2 flex flex-row">
                                                    Årsmiddeltemp. (C&#176;)
                                                </div>
                                                <div>
                                                    <CardInputField name="year_mid_temp" changeFunction={handleFormChange} />
                                                </div>

                                                <div className="mt-2 flex flex-row">
                                                    Temp gulv mot luft (C&#176;)
                                                </div>
                                                <div>
                                                    <CardInputField name="temp_floor_air" changeFunction={handleFormChange} />
                                                </div>

                                                <div className="mt-2 flex flex-row">
                                                    Tillegg (%)
                                                </div>
                                                <div>
                                                    <CardInputField name="safety" changeFunction={handleFormChange} />
                                                </div>

                                                <div className="mt-2 mb-5">
                                                    <CardButton buttonText="Oppdater" />
                                                </div>
                                            </div>
                                        </form>
                                    </div>

                                    <div className="flex flex-col w-1/2 items-end text-end pr-3">
                                        <form onSubmit={handleHeatSourceSubmit}>
                                            <div>
                                                <h3>Sett primærvarmekilde</h3>
                                            </div>
                                            <div className="mt-3">
                                                <CardInputField name="heat_source" changeFunction={handleHeatSourceChange} />
                                            </div>
                                            <div className="mt-3">
                                                <CardButton buttonText="Lagre varmekilde" />
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