import { useState } from 'react';
import useSubmitData from '../../hooks/useSubmitData'
import SubTitleComponent from '../../layout/SubTitleComponent';
import { useNavigate } from 'react-router-dom';

function NewProject() {

    const {data, setData, response, loading, error, handleSubmit} = useSubmitData('/projects/new_project/');
    const navigate = useNavigate();

    const handleChange = (e) => {
        setData({
            ...data,
            [e.target.name]: e.target.value,
        });
    }

    const submitProject = async (e) => {
        await handleSubmit(e);
        setData('');
        navigate(`/dashboard/`);
    }

    return (
        <>
            <SubTitleComponent>Opprett nytt prosjekt</SubTitleComponent>
            <div className="main-content">
                {loading && <p>Loading...</p>}
                {error && <p>Error: {error.message}</p>}

                <div className="cards">
                        <div className="information [ card ]">
                            <h2 className="card-title">Opprett nytt prosjekt</h2>
                            <p className="info"></p>
                <form className="custom-form profile-form" onSubmit={submitProject}>
                    <p>
                        Prosjektnummer <br />
                        <input
                            name="projectNumber"
                            onChange={handleChange}
                            className="form-control"
                            type="text"
                            placeholder="Prosjektnummer" />
                    </p>
                    <p>
                        Prosjektnavn <br />
                        <input
                            name="projectName"
                            onChange={handleChange}
                            className="form-control"
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
                    <button type="submit" className="form-button" disabled={loading}>
                        Legg til
                    </button>
                </form>
                        </div>
                    </div>

            </div>
        </>
    );
}

export default NewProject;