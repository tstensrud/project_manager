import { useEffect, useState, useContext } from 'react';

import { useParams, useNavigate } from 'react-router-dom';
import { GlobalContext } from '../../GlobalContext';

// Hooks
import useFetch from '../../hooks/useFetch'
import useUpdateData from '../../hooks/useUpdateData'

// Components
import SubTitleComponent from '../../layout/SubTitleComponent';
import HeaderIcon from '../../assets/svg/projectSettingsIcon.jsx';
import ContentCard from '../../layout/ContentCard';
import MainContentContainer from '../../layout/MainContentContainer.jsx';
import CardButton from '../../layout/formelements/CardButton';
import CardSelect from '../../layout/formelements/CardSelect';
import CardInputField from '../../layout/formelements/CardInputField.jsx';
import TextArea from '../../layout/formelements/TextArea.jsx';
import LoadingSpinner from '../../layout/LoadingSpinner.jsx';

function Settings() {
    const { projectId } = useParams();
    const { data, loading, error } = useFetch(`/project_api/${projectId}/settings/`);
    const { data: specData, loading: specLoading, error: specError } = useFetch(`/specifications/get_specifications/`);
    const { data: updatedProjectData, setData: setUpdatedProjectData, response: updatedDataResponse, error: updatedProjectDataError, handleSubmit: updateProjectDataSubmit } = useUpdateData(`/project_api/${projectId}/settings/update_project/`);

    const [description, setDescription] = useState();
    const [projectNumber, setProjectNumber] = useState();
    const [projectName, setProjectName] = useState();

    const navigate = useNavigate();

    // useEffects
    useEffect(() => {
        setDescription(data?.data?.ProjectDescription);
        setProjectName(data?.data?.ProjectName);
        setProjectNumber(data?.data?.ProjectNumber)
    }, [data]);

    useEffect(() => {
        if (updatedDataResponse?.success && updatedDataResponse.success === true) {
            navigate(`/project/${projectId}`);
        }
    }, [updatedDataResponse]);

    // Handlers
    const handleChange = (e) => {
        e.preventDefault();
        setUpdatedProjectData({
            ...updatedProjectData,
            [e.target.name]: e.target.value,
        });
        if (e.target.name === "description") {
            setDescription(e.target.value);
        } else if (e.target.name === "project_number") {
            setProjectNumber(e.target.value);
        } else if (e.target.name === "project_name") {
            setProjectName(e.target.value);
        }
    }

    const handleOnSubmit = async (e) => {
        await updateProjectDataSubmit(e);
    }

    return (
        <>
            <SubTitleComponent svg={<HeaderIcon />} headerText={"Prosjektinnstillinger"} projectName={data && data.data.ProjectName} projectNumber={data && data.data.ProjectNumber} />
            <MainContentContainer>

                <div className="flex justify-center flex-row w-full">
                    <ContentCard>
                        <div className="w-[900px]">
                            {
                                loading && specLoading ? (
                                    <LoadingSpinner text="prosjektinnstillinger" />
                                ) : (
                                    <form onSubmit={handleOnSubmit}>
                                        <h2 >Rediger prosjektinnstillinger</h2>
                                        <div>Prosjektnummer</div>
                                        <div>
                                            <CardInputField type="text" name="project_number" changeFunction={handleChange} key="number" value={projectNumber} />
                                        </div>

                                        <div className="mt-3">Prosjektnavn</div>
                                        <div>
                                            <CardInputField type="text" name="project_name" changeFunction={handleChange} key="name" value={projectName} />
                                        </div>
                                        <div className="mt-3">Prosjektbeskrivelse</div>
                                        <div>
                                            <TextArea className="form-text-area" name="description" changeFunction={handleChange} value={description} />
                                        </div>
                                        <div className="mt-3">Kravspesifikasjon</div>
                                        <div>
                                            <CardSelect name="project_specification" changeFunction={handleChange}>
                                                <option value="none">- Velg -</option>

                                                {
                                                    specData?.success === true ? (
                                                        Object.keys(specData.data).map((key, index) => (
                                                            <option key={index} value={specData.data[key].uid}>{specData.data[key].name}</option>
                                                        ))

                                                    ) : (
                                                        <option>Ingen spesifikasjoner</option>
                                                    )
                                                }
                                            </CardSelect>

                                        </div>
                                        <div className="mt-3">
                                            <CardButton buttonText="Oppdater" />
                                        </div>
                                        {
                                            updatedDataResponse?.success === false && (
                                                <div className="mt-3">
                                                    {updatedDataResponse.message}
                                                </div>
                                            )
                                        }
                                        {
                                            updatedProjectDataError && (
                                                <div className="mt-3">
                                                    {updatedProjectDataError}
                                                </div>
                                            )
                                        }
                                    </form>
                                )
                            }
                        </div>
                    </ContentCard>
                </div>
            </MainContentContainer>
        </>
    );
}

export default Settings;