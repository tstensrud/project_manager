import { useEffect, useRef, useState, useContext } from 'react';

// Hooks
import useFetch from '../../hooks/useFetch';
import { GlobalContext } from '../../context/GlobalContext';

// Components
import MainContentContainer from '../../layout/MainContentContainer.jsx'
import FormButton from '../../layout/formelements/FormButton.jsx';
import SubTitleComponent from '../../layout/SubTitleComponent.jsx'
import BuildingSummary from './BuildingSummary';
import useSubmitData from '../../hooks/useSubmitData'
import HeaderIcon from '../../assets/svg/buildingIcon.jsx';
import InputField from '../../layout/formelements/InputField.jsx';
import MessageBox from '../../layout/MessageBox.jsx';
import LoadingBar from '../../layout/LoadingBar.jsx'

function Buildings() {
    const { activeProject } = useContext(GlobalContext);
    const buildingNameRef = useRef(null);

    // Hooks
    const { data, loading, error, refetch: refetchBuildingData } = useFetch(activeProject ? `/project_api/${activeProject}/buildings/` : null);
    const { data: buildingData, response: newBuildingResponse, setData, handleSubmit } = useSubmitData(activeProject ? `/project_api/${activeProject}/buildings/new_building/` : null);

    // States
    const [formInput, setFormInput] = useState('');

    useEffect(() => {
        if (newBuildingResponse?.success === true) {
            refetchBuildingData();
            setFormInput('');
        }
    }, [newBuildingResponse]);

    // Handlers
    const handleChange = (e) => {
        setData({
            ...buildingData,
            [e.target.name]: e.target.value,
        })
        setFormInput(e.target.value);
    }

    const handleFormSubmit = async (e) => {
        e.preventDefault();
        await handleSubmit();
    }

    return (
        <>
            <SubTitleComponent svg={<HeaderIcon />} headerText={"Bygg"} projectName={""} projectNumber={""} />
            <MainContentContainer>
                {
                    newBuildingResponse?.success === false && <MessageBox closeable={true} message={newBuildingResponse.message} />
                }
                {
                    loading ? (
                        <LoadingBar />
                    ) : (
                        <>
                            {
                                data?.success === true ? (
                                    <>
                                        <form onSubmit={handleFormSubmit}>
                                            <div className="flex flex-col w-full items-center justify-center pt-5 sm:pt-0 text-center">
                                                <div className="flex h-20 flex-row flex-wrap w-full items-center justify-center text-center">
                                                    <div className="mr-5">
                                                        <InputField buildingNameRef={buildingNameRef} changeFunction={handleChange} value={formInput} name="buildingName" placeholder="Navn på bygg. Eks.: A, Hovedbygg" required={true} />
                                                    </div>
                                                    <div className="items-center justify-center text-center">
                                                        <FormButton buttonText="Legg til" />
                                                    </div>
                                                </div>
                                            </div>
                                        </form>

                                        <div className="flex justify-evenly flex-row flex-wrap w-full">
                                            {
                                                data?.building_data === null ? (
                                                    <p className=" text-primary-color text-xs">{data?.message}</p>
                                                ) : (
                                                    data?.building_data && Object.keys(data.building_data).map((key, index) => (
                                                        <BuildingSummary refetchBuildingData={refetchBuildingData} key={index} buildingData={data.building_data[key]} />
                                                    ))
                                                )
                                            }
                                        </div>
                                    </>
                                ) : (
                                    <>
                                    {
                                        !loading && <MessageBox closeable={false} message={`${data?.message} - ${error}`} />
                                    }
                                    </>
                                )
                            }
                        </>
                    )
                }
            </MainContentContainer>
        </>
    );
}

export default Buildings;