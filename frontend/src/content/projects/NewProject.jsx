import { useState } from 'react';
import useSubmitData from '../../hooks/useSubmitData'
import SubTitleComponent from '../../layout/SubTitleComponent';

function NewProject() {

    const {data, setData, response, loading, error, handleSubmit} = useSubmitData('/projects/new_project/');

    const handleChange = (e) => {
        setData({
            ...data,
            [e.target.name]: e.target.value,
        });
    }

    return (
        <>
        <SubTitleComponent>Opprett nytt prosjekt</SubTitleComponent>
            {loading && <p>Loading...</p>}
            {error && <p>Error: {error.message}</p>}
            
            <form className="custom-form profile-form" onSubmit={handleSubmit}>
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
        </>
    );
}

export default NewProject;