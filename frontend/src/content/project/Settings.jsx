import { useEffect, useState, useContext } from 'react';
import useFetch from '../../hooks/useFetch'
import useSubmitData from '../../hooks/useSubmitData'
import { useParams, useNavigate } from 'react-router-dom';
import { GlobalContext } from '../../GlobalContext';
import SubTitleComponent from '../../layout/SubTitleComponent';

function Settings () {
    const {projectId} = useParams();
    const { activeProject, setActiveProject, token, setToken } = useContext(GlobalContext);
    const {data, loading, error} = useFetch(`/project_api/${projectId}/settings/`);
    const {data: specData, loading: specLoading, error: specError} = useFetch(`/specifications/get_specifications/`);
    const {data: changeSpecData, setData: setSpecData, error: changeSpecError, handleSubmit: changeSpecSubmit} = useSubmitData(`/project_api/${projectId}/settings/update_project/`);

    const [chosenSpec, setChosenSpec] = useState();
    const navigate = useNavigate();

    useEffect(() => {
        setActiveProject(projectId);
    },[]);

    const handleOnSpecChange = (e) => {
        e.preventDefault();
        const spec = e.target.value;
        setSpecData(spec);
        console.log(spec);
    }

    const handleOnSubmit = (e) => {
        changeSpecSubmit(e);
        navigate(`/project/${projectId}/`);

    }

    if (loading) return <>Loading</>;
    if (error || changeSpecError) return <>Feil ved lasting av data</>

    return (
    <>
        <SubTitleComponent>
            Prosjektinnstillinger - {data && data.data.ProjectName} - {data && data.data.ProjectNumber}
        </SubTitleComponent>
        <form className="custom-form profile-form" onSubmit={handleOnSubmit}>

            <p>
                Prosjektnummer
                <br />
                <input type="text" name="project_number" key="number" value={data && data.data.ProjectNumber} readOnly/>
            </p>

            <p>
                Prosjektnavn
                <br />
                <input type="text" name="project_name" key="name" value={data && data.data.ProjectName} readOnly />
            </p>

            <p>
                Prosjektbeskrivelse <br />
                <textarea className="form-text-area" key="desc" value={data && data.data.ProjectDescription} readOnly/>
            </p>

        <p>
            Kravspesifikasjon
            <br />
            <select name="project_specification" onChange={handleOnSpecChange}>
                <option value="none">- Velg -</option>

                {
                specData && specData.data !== undefined && specData.data !== '' ? (
                    <>
                    {specData.data.map((spec, index) => (<><option key={index} value={spec.id}>{spec.name}</option></>))}
                    </>
                ) : (
                    <option>Ingen spesifikasjoner</option>
                )
                }

            </select>
        </p>

        <p>
            <button type="submit" className="form-button">
                Oppdater
            </button>
        </p>
    </form>
    </>);
}

export default Settings;