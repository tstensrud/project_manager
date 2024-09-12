import { useParams } from 'react-router-dom';
import { useState } from 'react';

// Hooks
import useFetch from '../../hooks/useFetch'

// Components
import MainContentContainer from '../../layout/MainContentContainer.jsx'
import FormButton from '../../layout/formelements/FormButton.jsx';
import SubTitleComponent from '../../layout/SubTitleComponent.jsx'
import BuildingSummary from './BuildingSummary';
import useSubmitData from '../../hooks/useSubmitData'
import HeaderIcon from '../../assets/svg/buildingIcon.jsx';
import LoadingSpinner from '../../layout/LoadingSpinner';
import InputField from '../../layout/formelements/InputField.jsx';

function Buildings() {
    const { projectId } = useParams();

    // Hooks
    const { data, loading, refetch: refetchBuildingData } = useFetch(`/project_api/${projectId}/buildings/`);
    const { buildingData, setData, handleSubmit } = useSubmitData(`/project_api/${projectId}/buildings/new_building/`);
    const [formInput, setFormInput] = useState('');

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
        await handleSubmit(e);
        refetchBuildingData();
        setFormInput('');
    }

    return (<>
        <SubTitleComponent svg={<HeaderIcon />} headerText={"Bygg"} projectName={""} projectNumber={""} />
        <MainContentContainer>

            <div className="flex h-20 items-center justify-center text-center flex-row">
                <form onSubmit={handleFormSubmit}>
                    <InputField changeFunction={handleChange} value={formInput} name="buildingName" placeholder="Navn på bygg. Eks.: A, Hovedbygg" />
                    &nbsp;&nbsp;
                    <FormButton buttonText="Legg til"/>
                </form>
            </div>

            <div className="flex justify-center flex-row w-full">


                {
                    loading && loading === true ? (
                        <>
                            <span className="blur-sm opacity-50">####</span>
                            <br />
                            <LoadingSpinner />
                        </>
                    ) : (
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
        </MainContentContainer>
    </>
    );
}

export default Buildings;