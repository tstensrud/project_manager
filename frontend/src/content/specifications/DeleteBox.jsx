import { useState } from "react";
import { Link } from "react-router-dom";

import CardButton from '../../layout/formelements/CardButton.jsx';
import CardInputField from '../../layout/formelements/CardInputField.jsx';

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
        } else {
            return;
        }
    }
    const handleDeleteSpec = (e) => {
        deleteSpecification(e);
    }

    return (
        <div className="fixed top-0 h-full w-full justify-center items-center z-[1000] bg-background-shade">
            <div className="w-full h-full flex flex-col justify-center items-center">
                <div className="bg-secondary-color dark:bg-dark-secondary-color flex flex-col p-5 rounded-lg w-[400px] h-[400px] justify-center items-center text-center">
                    <h4>Slett kravspesifikasjon</h4>
                    <div className="mb-3">
                        Denne handlingen er <strong>ikke</strong> reversibel og alle romtyper assosisert blir slettet. Rom som allerede er lagt inn med data fra denne spesifikasjonen blir ikke slettet.
                    </div>
                    <div className="mb-3">
                        Skriv "SLETT" i boksen under for å bekrefte.
                    </div>
                    <div className="mb-3">
                        <CardInputField changeFunction={handleInput} type="text" style={{ width: "200px" }} />
                    </div>
                    <div className="mb-3">
                        <CardButton clickFunction={checkIfInputMatch} buttonText="Slett" />
                    </div>
                    <div>
                        <Link to="#" onClick={closeDialog}>Avbryt</Link>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default DeleteBox;