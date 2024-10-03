import { useParams } from 'react-router-dom';
import { useEffect, useRef, useState } from 'react';

// Hooks
import useFetch from '../../hooks/useFetch'

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
    const { projectId } = useParams();
    const buildingNameRef = useRef(null);

    // Hooks
    const { data, loading, error, refetch: refetchBuildingData } = useFetch(`/project_api/${projectId}/buildings/`);
    const { data: buildingData, response: newBuildingResponse, setData, handleSubmit } = useSubmitData(`/project_api/${projectId}/buildings/new_building/`);

    // States
    const [formInput, setFormInput] = useState('');

    useEffect(() => {
        if (newBuildingResponse?.success === true) {
            refetchBuildingData();
            setFormInput('');
        }
    }, [newBuildingResponse])

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
                    loading && <LoadingBar />
                }
                {
                    newBuildingResponse?.success === false && <MessageBox closeable={true} message={newBuildingResponse.message} />
                }

                {
                    data?.success === true ? (
                        <>
                            <form onSubmit={handleFormSubmit}>
                                <div className="flex flex-col w-full items-center justify-center text-center">
                                    <div className="flex h-20 flex-row w-full items-center justify-center text-center">
                                        <div className="mr-5 w-96">
                                            <InputField buildingNameRef={buildingNameRef} changeFunction={handleChange} value={formInput} name="buildingName" placeholder="Navn på bygg. Eks.: A, Hovedbygg" required={true} />
                                        </div>
                                        <div className="items-center justify-center text-center">
                                            <FormButton buttonText="Legg til" />
                                        </div>
                                    </div>
                                </div>
                            </form>

                            <div className="flex justify-center flex-row flex-wrap w-full">
                                {
                                    !loading && (
                                        <>
                                            {
                                                data?.building_data === null ? (
                                                    <p className=" text-primary-color text-xs">{data.error}</p>
                                                ) : (
                                                    data && data.building_data && Object.keys(data.building_data).map((key, index) => (
                                                        <BuildingSummary refetchBuildingData={refetchBuildingData} key={index} buildingData={data.building_data[key]} />
                                                    ))
                                                )
                                            }
                                        </>
                                    )
                                }
                            </div>
                        </>
                    ) : (
                        <MessageBox closeable={false} message={`${data?.message} - ${error}`} />
                    )
                }

            </MainContentContainer>
        </>
    );
}

export default Buildings;