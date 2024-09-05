import { useEffect, useState, useContext } from 'react';
import useFetch from '../../hooks/useFetch'
import useUpdateData from '../../hooks/useUpdateData'
import { useParams, useNavigate } from 'react-router-dom';
import { GlobalContext } from '../../GlobalContext';
import SubTitleComponent from '../../layout/SubTitleComponent';
import HeaderIcon from '../../assets/svg/projectSettingsIcon.svg?react';

function Settings() {
    const { projectId } = useParams();
    const { activeProject, setActiveProject, token, setToken } = useContext(GlobalContext);
    const { data, loading, error } = useFetch(`/project_api/${projectId}/settings/`);
    const { data: specData, loading: specLoading, error: specError } = useFetch(`/specifications/get_specifications/`);
    const { data: changeSpecData, setData: setSpecData, error: changeSpecError, handleSubmit: changeSpecSubmit } = useUpdateData(`/project_api/${projectId}/settings/update_project/`);

    const [chosenSpec, setChosenSpec] = useState();
    const navigate = useNavigate();

    const handleOnSpecChange = (e) => {
        e.preventDefault();
        setSpecData({
            ...changeSpecData,
            [e.target.name]: e.target.value,
        });
    }

    const handleOnSubmit = (e) => {
        changeSpecSubmit(e);
        navigate(`/project/${projectId}`);

    }

    if (loading) return <>Loading</>;
    if (error || changeSpecError) return <>Feil ved lasting av data</>

    return (
        <>
            <SubTitleComponent svg={<HeaderIcon />} headerText={"Prosjektinnstillinger"} projectName={data && data.data.ProjectName} projectNumber={data && data.data.ProjectNumber} />
            <div className="main-content">

                <div className="flex-container-row">
                    <div className="content-card">
                        <div className="content-card-container">
                            <form className="custom-form profile-form" onSubmit={handleOnSubmit}>
                                <h2 className="card-title">Rediger prosjektinnstillinger</h2>
                                <h4>Prosjektnummer</h4>
                                <input className="card-input" type="text" name="project_number" key="number" value={data && data.data.ProjectNumber} readOnly />
                                <p className="info"> </p>
                                <h4>Prosjektnavn</h4>
                                <input className="card-input" type="text" name="project_name" key="name" value={data && data.data.ProjectName} readOnly />
                                <h4>Prosjektbeskrivelse</h4>
                                <textarea className="form-text-area" key="desc" value={data && data.data.ProjectDescription} readOnly />
                                <h4>Kravspesifikasjon</h4>
                                <p>
                                <select className="card-select" name="project_specification" onChange={handleOnSpecChange}>
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
                        </div>
                    </div>
                </div>
            </div>
        </>
    );
}

export default Settings;