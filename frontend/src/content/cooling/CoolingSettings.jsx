import { useParams } from 'react-router-dom';

// Hooks
import useFetch from '../../hooks/useFetch'
import useUpdateData from '../../hooks/useUpdateData';

// Components
import MessageBox from '../../layout/MessageBox';
import CardButton from '../../layout/formelements/CardButton';
import CardInputField from '../../layout/formelements/CardInputField.jsx';


function CoolingSettings({ setShowHeatingSettings: setShowCoolingSettings, buildingUid, onSettingsUpdate }) {

    const { projectId } = useParams();

    // Hooks
    const { data, loading, error, refetch } = useFetch(`/project_api/${projectId}/heating/buildingsettings/${buildingUid}/`);

    // Update data
    const { data: updatedBuildingData, response, setData, handleSubmit: updateBuildingData } = useUpdateData(`/project_api/${projectId}/cooling/update_all_rooms/${buildingUid}/`);

    // Handlers
    const handleClick = (e) => {
        setShowCoolingSettings(false);
    }

    const handleSubmit = async (e) => {
        e.preventDefault();

        if (updatedBuildingData !== null && updatedBuildingData !== undefined && updatedBuildingData !== '') {
            await updateBuildingData(e);
            refetch();
            setData('');
            onSettingsUpdate();
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
            {response?.error && response.error !== null ? (<MessageBox message={response.error} />) : (<></>)}
            {error?.error && error.error !== null ? (<MessageBox message={error.error} />) : (<></>)}

            <div className="flex flex-col pl-3 pr-3 absolute top-1/2 rounded-lg border border-primary-color left-1/2 transform -translate-x-1/2 overflow-y-auto -translate-y-1/2 h-1/2 w-1/2 bg-secondary-color text-primary-color shadow-lg shadow-background-shade justify-start z-[1000] text-base">
                <div className="flexsticky top-0 bg-secondary-color flex-col border-b-default-border-color p-1 font-extrabold w-full">
                    <div className="flex w-full justify-end">
                        <span onClick={(e) => handleClick(e, setShowCoolingSettings)} className="cursor-pointer hover:text-accent-color">&times;</span>
                    </div>

                    <div className="w-full justify-center text-center">
                        Kjøleinnstillinger bygg {data && data.building_data.BuildingName}
                    </div>
                </div>

                <div className="flex flex-col h-full text-primary-color justify-start w-full text-base-item-container">
                    <div className="mb-3">
                        <strong>NB!</strong> Disse verdiene settes for alle rom i bygget. Du kan etterpå justere enkeltrom med egne verdier ved behov.
                    </div>
                    <div>
                        <form name="building_heating_settings" onSubmit={handleSubmit}>
                            <div>
                                <div>
                                    Romtemp sommer (C&#176;)
                                </div>
                                <div>
                                    <CardInputField name="RoomTempSummer" placeholder="26" changeFunction={handleFormChange} />
                                </div>

                                <div className="mt-3">
                                    Tilluftstemp. sommer (C&#176;)
                                </div>
                                <div>
                                    <CardInputField name="VentairTempSummer" placeholder="18" changeFunction={handleFormChange} />
                                </div>

                                <div className="mt-3">
                                    Internlast lys (W/m<sup>2</sup>)
                                </div>
                                <div>
                                    <CardInputField name="InternalHeatloadLights" placeholder="7" changeFunction={handleFormChange} />
                                </div>

                                <div className="mt-3">
                                    Internlast personer (W/pers)
                                </div>
                                <div>
                                    <CardInputField name="InternalHeatloadPeople" placeholder="100" changeFunction={handleFormChange} />
                                </div>

                                <div className="mt-3">
                                    Soltilskudd (W/m<sup>2</sup>K)
                                </div>
                                <div>
                                    <CardInputField name="SunAdition" placeholder="1" changeFunction={handleFormChange} />
                                </div>

                                <div className="mt-3">
                                    Solreduksjon (0-1,0)
                                </div>
                                <div>
                                    <CardInputField name="SunReduction" placeholder="0,5" changeFunction={handleFormChange} />
                                </div>

                                <div className="mt-3">
                                    <CardButton buttonText="Oppdater" />
                                </div>
                            </div>

                        </form>
                    </div>
                </div>
            </div>
        </>
    );
}

export default CoolingSettings;