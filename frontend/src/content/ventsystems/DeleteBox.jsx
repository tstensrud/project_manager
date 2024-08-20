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
            <button onClick={handleDeleteSpec} className="table-button">SLETT</button>
        </>
    );
}

export default DeleteBox;