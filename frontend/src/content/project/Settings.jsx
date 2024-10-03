import { useEffect, useState, useContext } from 'react';

import { useNavigate } from 'react-router-dom';

// Hooks
import useFetch from '../../hooks/useFetch';
import useUpdateData from '../../hooks/useUpdateData';
import { GlobalContext } from '../../context/GlobalContext';

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
import MessageBox from '../../layout/MessageBox.jsx';

function Settings() {
    const { activeProject } = useContext(GlobalContext);
    const { data, loading, error } = useFetch(activeProject ? `/project_api/${activeProject}/settings/` : null);
    const { data: specData, loading: specLoading, error: specError } = useFetch(`/specifications/get_specifications/`);
    const { data: updatedProjectData, setData: setUpdatedProjectData, response: updatedDataResponse, error: updatedProjectDataError, handleSubmit: updateProjectDataSubmit } = useUpdateData(activeProject ? `/project_api/${activeProject}/settings/update_project/` : null);

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
            navigate(`/project/${activeProject}`);
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
        e.preventDefault();
        await updateProjectDataSubmit();
    }

    return (
        <>
            <SubTitleComponent svg={<HeaderIcon />} headerText={"Prosjektinnstillinger"} projectName={data && data.data.ProjectName} projectNumber={data && data.data.ProjectNumber} />
            <MainContentContainer>
                {error || specError && <MessageBox closeable={true} message={`${error ?? ''} ${specError ?? ''}`}/>}
                <div className="flex justify-center flex-row w-full">
                    <ContentCard>
                        <div className="w-[900px]">
                            {
                                loading || specLoading ? (
                                    <LoadingSpinner text="prosjektinnstillinger" />
                                ) : (
                                    <>
                                        {
                                            data?.success && specData?.success ? (
                                                <>
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
                                                                <MessageBox closeable={true} message={updatedDataResponse.message} />
                                                            )
                                                        }
                                                        {
                                                            updatedProjectDataError && (
                                                                <MessageBox closeable={true} message={updatedProjectDataError} />
                                                            )
                                                        }
                                                    </form>
                                                </>
                                            ) : (
                                                <>
                                                <MessageBox message={`${data?.message ?? 'Feil har oppstått. Gå inn "min side" eller velg prosjekt og åpne prosjektet du vil jobbe med på nytt.'}`} closeable={false} />
                                                </>
                                            )
                                        }
                                    </>
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