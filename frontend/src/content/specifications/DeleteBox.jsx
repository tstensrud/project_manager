import { useState } from "react";
import { Link } from "react-router-dom";

function DeleteBox({ setShowDeleteDialog, deleteSpecification }) {

    const [deleteSpec, setDeleteSpec] = useState("");
    const handleInput = (e) => {
        setDeleteSpec(e.target.value);
    }

    const closeDialog = () => {
        setShowDeleteDialog(false);
    }

    const checkIfInputMatch = (e) => {
        e.preventDefault();
        if (deleteSpec === "SLETT") {
            handleDeleteSpec(e);
        }
    }
    const handleDeleteSpec = (e) => {
        deleteSpecification(e);
    }

    return (
        <>
            <div className="delete-confirmation-wrapper">
                <div className="delete-confirmation-container">
                    <div className="delete-confirmation-card">
                        <h4>Slett kravspesifikasjon</h4>
                        <div style={{ marginBottom: "10px" }}>
                            Denne handlingen er <strong>ikke</strong> reversibel og alle romtyper assosisert blir slettet. Rom som allerede er lagt inn med data fra denne spesifikasjonen blir ikke slettet.
                        </div>
                        <div style={{ marginBottom: "10px" }}>
                            Skriv "SLETT" i boksen under for å bekrefte.
                        </div>
                        <div style={{ marginBottom: "10px" }}>
                            <input onChange={handleInput} type="text" style={{ width: "200px" }} />
                        </div>
                        <div style={{ marginBottom: "10px" }}>
                            <button onClick={checkIfInputMatch} className="form-button">Slett</button>
                        </div>
                        <div>
                            <Link to="#" onClick={closeDialog}>Avbryt</Link>
                        </div>
                    </div>
                </div>
            </div>
        </>
    );
}

export default DeleteBox;