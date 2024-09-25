import { useState } from "react";
import { Link } from "react-router-dom";

function DeleteBox({ systemName, setShowDeleteDialog, deleteSystem }) {

    const closeDialog = () => {
        setShowDeleteDialog(false);
    }

    const handleDeleteSpec = (e) => {
        deleteSystem(e);
        setShowDeleteDialog(false);
    }

    return (
        <>
            <span style={{ fontSize: "15px" }}>
                <Link to="#" onClick={closeDialog}>AVBRYT</Link>
                <br />
                Dette kan ikke angres. Alle systemene til rom tilknyttet {systemName} nullstilles.
            </span>
            <br />
            <br />
            <button onClick={handleDeleteSpec} className="text-primary-color dark:text-dark-primary-color font-semibold hover:text-accent-color hover:dark:text-dark-accent-color">SLETT</button>
        </>
    );
}

export default DeleteBox;