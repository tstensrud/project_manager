function NewProject() {
    return (
        <>
            <form className="custom-form profile-form" method="POST" role="form">
                <p>
                    Prosjektnummer <br />
                    <input className="form-control" type="text" name="project_number" id="project_number" placeholder="Prosjektnummer" />
                </p>
                <p>
                    Prosjektnavn <br />
                    <input className="form-control" type="text" name="project_name" id="project_name" placeholder="Navn på prosjekt" />
                </p>
                <p>
                    Prosjektbeskrivelse <br />
                    <textarea className="form-text-area" name="project_description" id="project_description">Kort beskrivelse og annen viktig informasjon</textarea>
                </p>
                <button type="submit" className="form-button">
                    Legg til
                </button>
            </form>
        </>
    );
}

export default NewProject;