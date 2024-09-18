import { useParams } from 'react-router-dom';

// Hooks
import useFetch from '../../hooks/useFetch'
import useUpdateData from '../../hooks/useUpdateData';

// Components
import MessageBox from '../../layout/MessageBox';
import CardButton from '../../layout/formelements/CardButton';
import CardInputField from '../../layout/formelements/CardInputField.jsx';
import { useEffect } from 'react';
import LoadingSpinner from '../../layout/LoadingSpinner.jsx';


function CoolingSettings({ setShowCoolingSettings, buildingUid, onSettingsUpdate }) {

    const { projectId } = useParams();

    // Hooks
    const { data, loading, error, refetch } = useFetch(`/project_api/${projectId}/heating/buildingsettings/${buildingUid}/`);

    // Update data
    const { data: updatedBuildingData, response, setData, handleSubmit: updateBuildingData } = useUpdateData(`/project_api/${projectId}/cooling/update_all_rooms/${buildingUid}/`);

    useEffect(() => {
        if (response?.success === true) {
            refetch();
            setData('');
            onSettingsUpdate();
        }
    }, [response]);

    // Handlers
    const handleCloseWindow = () => {
        setShowCoolingSettings(false);
        console.log("asdf")
    }

    const handleSubmit = async (e) => {
        e.preventDefault();

        if (updatedBuildingData) {
            await updateBuildingData(e);
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
            {error && (<MessageBox message={`Feil: ${error}`} />)}
            <div className="flex flex-col pl-3 pr-3 absolute top-1/2 rounded-lg border border-primary-color dark:border-dark-default-border-color left-1/2 transform -translate-x-1/2 overflow-y-auto -translate-y-1/2 h-1/2 w-[400px] bg-secondary-color dark:bg-dark-secondary-color text-primary-color dark:text-dark-primary-color shadow-lg shadow-background-shade justify-start z-[900] text-base">
                {
                    loading ? (
                        <LoadingSpinner text="parametre" />
                    ) : (
                        <>
                            <div className="flex sticky top-0 bg-secondary-color dark:bg-dark-secondary-color flex-col border-default-border-color p-1 font-extrabold w-full">
                                <div className="flex flex-row w-full items-center mb-5">
                                <div className="w-[10%]">

                                </div>
                                <div className="flex flex-1 justify-center text-xl text-center">
                                    Kjøleparametre bygg {data && data.building_data.BuildingName}
                                </div>
                                <div className="flex w-[10%] justify-end">
                                    <span onClick={handleCloseWindow} className="cursor-pointer text-2xl hover:text-accent-color hover:dark:text-dark-accent-color">&times;</span>
                                </div>
                                </div>
                            </div>

                            <div className="flex flex-col h-full text-primary-color dark:text-dark-primary-color justify-start w-full text-base-item-container">
                                <div className="mb-3">
                                    <strong>NB!</strong> Disse verdiene settes for alle rom i bygget. Du kan etterpå justere enkeltrom med egne verdier ved behov.
                                </div>
                                <div>
                                    <form name="building_heating_settings" onSubmit={handleSubmit}>
                                        <div className="pb-10">
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
                        </>
                    )
                }
            </div>
        </>
    );
}

export default CoolingSettings;