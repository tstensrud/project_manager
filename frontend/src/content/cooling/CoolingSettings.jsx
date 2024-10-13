import { useContext } from 'react';

// Hooks
import useFetch from '../../hooks/useFetch'
import useUpdateData from '../../hooks/useUpdateData';
import { GlobalContext } from '../../context/GlobalContext';

// Components
import MessageBox from '../../layout/MessageBox';
import CardButton from '../../layout/formelements/CardButton';
import CardInputField from '../../layout/formelements/CardInputField.jsx';
import { useEffect } from 'react';
import LoadingSpinner from '../../layout/LoadingSpinner.jsx';


function CoolingSettings({ setShowCoolingSettings, buildingUid, onSettingsUpdate }) {
    const { activeProject } = useContext(GlobalContext);

    // Hooks
    const { data, loading, error, refetch } = useFetch(`/project_api/${activeProject}/heating/buildingsettings/${buildingUid}/`);

    // Update data
    const { data: updatedBuildingData, response, loading: updateDataLoading, setData, handleSubmit: updateBuildingData } = useUpdateData(`/project_api/${activeProject}/cooling/update_all_rooms/${buildingUid}/`);

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
    }

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (updatedBuildingData) {
            await updateBuildingData();
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
            {response?.success === false && (<MessageBox closeable={true} message={response.message} />)}
            {error && (<MessageBox closeable={true} message={`Feil: ${error}`} />)}
            <div className="flex flex-col absolute top-1/2 rounded-lg border border-primary-color dark:border-dark-default-border-color left-1/2 transform -translate-x-1/2 overflow-y-auto -translate-y-1/2 h-1/2 w-[450px] bg-secondary-color dark:bg-dark-secondary-color text-primary-color dark:text-dark-primary-color shadow-lg shadow-background-shade justify-start z-[900] text-base">
                {
                    loading ? (
                        <LoadingSpinner text="parametre" />
                    ) : (
                        <>
                            <div className="flex pl-3 sticky top-0 bg-secondary-color dark:bg-dark-secondary-color flex-col border-default-border-color p-1 font-semibold w-full border-b dark:border-dark-default-border-color">
                                <div className="flex flex-row w-full items-center pb-1 pt-1">
                                    <div className="w-[10%]">

                                    </div>
                                    <div className="flex flex-1 justify-center text-xl text-center">
                                        Kjøleparametre {data?.data?.BuildingName}
                                    </div>
                                    <div className="flex w-[10%] justify-end pr-3">
                                        <span onClick={handleCloseWindow} className="cursor-pointer text-2xl hover:text-accent-color hover:dark:text-dark-accent-color">&times;</span>
                                    </div>
                                </div>
                            </div>

                            <div className="flex flex-col pl-3 pr-3 mt-3 h-full text-primary-color dark:text-dark-primary-color justify-start w-full text-base-item-container">
                                <div>
                                    <form name="building_heating_settings" onSubmit={handleSubmit}>
                                        <div>
                                            <div>
                                                Romtemp sommer (C&#176;)
                                            </div>
                                            <div>
                                                <CardInputField name="RoomTempSummer" changeFunction={handleFormChange} />
                                            </div>

                                            <div className="mt-3">
                                                Tilluftstemp. sommer (C&#176;)
                                            </div>
                                            <div>
                                                <CardInputField name="VentairTempSummer" changeFunction={handleFormChange} />
                                            </div>

                                            <div className="mt-3">
                                                Internlast lys (W/m<sup>2</sup>)
                                            </div>
                                            <div>
                                                <CardInputField name="InternalHeatloadLights" changeFunction={handleFormChange} />
                                            </div>

                                            <div className="mt-3">
                                                Internlast personer (W/pers)
                                            </div>
                                            <div>
                                                <CardInputField name="InternalHeatloadPeople" changeFunction={handleFormChange} />
                                            </div>

                                            <div className="mt-3">
                                                Soltilskudd (W/m<sup>2</sup>K)
                                            </div>
                                            <div>
                                                <CardInputField name="SunAdition" changeFunction={handleFormChange} />
                                            </div>

                                            <div className="mt-3">
                                                Solreduksjon (0-1,0)
                                            </div>
                                            <div>
                                                <CardInputField name="SunReduction" changeFunction={handleFormChange} />
                                            </div>

                                            <div className="mt-3">
                                                <CardButton loading={updateDataLoading} buttonText="Oppdater" />
                                            </div>
                                        </div>

                                    </form>
                                    <div className="pt-2 pb-2">
                                        <strong>NB!</strong> Disse verdiene settes for alle rom i bygget. Du kan etterpå justere enkeltrom med egne verdier ved behov.
                                    </div>
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