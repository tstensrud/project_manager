import { useEffect, useState, useContext } from 'react';
import { GlobalContext } from '../../GlobalContext';
import useSubmitData from '../../hooks/useSubmitData'
import SubTitleComponent from '../../layout/SubTitleComponent';
import { useNavigate } from 'react-router-dom';
import HeaderIcon from '../../assets/svg/newProjectIcon.svg?react';

function NewProject() {

    const {data, setData, response, loading, error, handleSubmit} = useSubmitData('/projects/new_project/');
    const navigate = useNavigate();
    const { activeProject, setActiveProject, setActiveProjectName } = useContext(GlobalContext);

    useEffect(() => {
        setActiveProject(null);
        setActiveProjectName(null)
    },[])

    // Handlers
    const handleChange = (e) => {
        setData({
            ...data,
            [e.target.name]: e.target.value,
        });
    }

    const submitProject = async (e) => {
        await handleSubmit(e);
        setData('');
        navigate(`/dashboard`);
    }

    return (
        <>
            <SubTitleComponent svg={<HeaderIcon />} headerText={"Opprett nytt prosjekt"} projectName={""} projectNumber={""} />
            <div className="main-content">
                <div className="flex-container-row">
                    {error && <p>Error: {error.message}</p>}

                    <div className="content-card">
                        <div className="content-card-container">
                            <h2 className="card-title">Opprett nytt prosjekt</h2>
                            <form className="custom-form profile-form" onSubmit={submitProject}>
                                <p>
                                    Prosjektnummer <br />
                                    <input
                                        name="projectNumber"
                                        className="card-input"
                                        onChange={handleChange}
                                        type="text"
                                        placeholder="Prosjektnummer" />
                                </p>
                                <p>
                                    Prosjektnavn <br />
                                    <input
                                        name="projectName"
                                        className="card-input"
                                        onChange={handleChange}
                                        type="text"
                                        placeholder="Navn på prosjekt" />
                                </p>
                                <p>
                                    Prosjektbeskrivelse <br />
                                    <textarea
                                        name="projectDescription"
                                        onChange={handleChange}
                                        className="form-text-area">
                                    </textarea>
                                </p>
                                <button type="submit" className="card-button" disabled={loading}>
                                    Legg til
                                </button>
                            </form>
                        </div>
                    </div>
                </div>
            </div>
        </>
    );
}

export default NewProject;