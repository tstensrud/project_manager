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

function Settings() {
    const { projectId } = useParams();
    const { activeProject, setActiveProject, token, setToken } = useContext(GlobalContext);
    const { data, loading, error } = useFetch(`/project_api/${projectId}/settings/`);
    const { data: specData, loading: specLoading, error: specError } = useFetch(`/specifications/get_specifications/`);
    const { data: updatedProjectData, setData: setUpdatedProjectData, response: updatedDataResponse, error: updatedProjectDataError, handleSubmit: updateProjectDataSubmit } = useUpdateData(`/project_api/${projectId}/settings/update_project/`);

    const [description, setDescription] = useState();
    const navigate = useNavigate();

    // useEffects
    useEffect(() => {
        setDescription(data?.data?.ProjectDescription);
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
                        <form onSubmit={handleOnSubmit}>
                            <h2 >Rediger prosjektinnstillinger</h2>
                            <h4>Prosjektnummer</h4>
                            <input className="card-input" type="text" name="project_number" key="number" value={data && data.data.ProjectNumber} readOnly />
                            <p className="info"> </p>
                            <h4>Prosjektnavn</h4>
                            <input className="card-input" type="text" name="project_name" key="name" value={data && data.data.ProjectName} readOnly />
                            <h4>Prosjektbeskrivelse</h4>
                            <textarea className="form-text-area" name="description" onChange={handleChange} value={description} />
                            <h4>Kravspesifikasjon</h4>
                            <p>
                                <select className="card-select" name="project_specification" onChange={handleChange}>
                                    <option value="none">- Velg -</option>

                                    {
                                        specData && specData.data !== undefined && specData.data !== '' ? (
                                            <>
                                                {specData.data.map((spec, index) => (<option key={index} value={spec.id}>{spec.name}</option>))}
                                            </>
                                        ) : (
                                            <option>Ingen spesifikasjoner</option>
                                        )
                                    }

                                </select>
                            </p>
                            <p>
                                <button type="submit" className="card-button">
                                    Oppdater
                                </button>
                            </p>
                        </form>
                    </ContentCard>

                </div>
            </MainContentContainer>
        </>
    );
}

export default Settings;