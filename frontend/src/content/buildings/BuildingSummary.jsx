import { useEffect, useState } from 'react';
import { Link, useParams } from 'react-router-dom';

// Hooks
import useUpdateData from '../../hooks/useUpdateData';
import useDeleteData from '../../hooks/useDeleteData';

// Components
import CardTitle from '../../layout/CardTitle';

// SVG imports
import PlusIcon from '../../assets/svg/plusIcon.svg?react';
import MinusIcon from '../../assets/svg/minusIcon.svg?react';
import DeleteIcon from '../../assets/svg/deleteIcon.svg?react';
import BuildingIcon from '../../assets/svg/buildingIcon.svg?react';
import EditIcon from '../../assets/svg/editIcon.svg?react';



function BuildingSummary({ refetchBuildingData, buildingData }) {

    const { projectId } = useParams();

    // States
    const [editBuildingContainer, setEditBuildingContainer] = useState(false);

    // hooks
    const { data, setData, loading, response, error, handleSubmit } = useUpdateData(`/project_api/${projectId}/buildings/edit/${buildingData.uid}/`);
    const { data: deleteData, setData: setDeleteData, response: deleteResponse, handleSubmit: handleDeleteSubmit } = useDeleteData(`/project_api/${projectId}/buildings/delete/${buildingData.uid}/`);

    const buildingName = buildingData.BuildingName || '';
    const area = buildingData.area || '';
    const supplyAir = buildingData.supplyAir || '';
    const extractAir = buildingData.extractAir || '';
    const heating = buildingData.heating || '';

    // useEffects
    useEffect(() => {
        if (response && response.success === true) {
            setEditBuildingContainer(false);
            refetchBuildingData();
        }
    }, [response]);

    useEffect(() => {
        if (deleteResponse && deleteResponse.success === true) {
            setEditBuildingContainer(false);
            refetchBuildingData();
        }
    }, [deleteResponse]);

    useEffect(() => {
        setDeleteData({ buildingUid: buildingData.uid })
    }, [])

    // Handlers
    const showEditOptions = (e) => {
        e.preventDefault();
        setEditBuildingContainer(true);
    }

    const closeEditOptions = (e) => {
        e.preventDefault();
        setEditBuildingContainer(false);
    }

    const handleNameChange = (e) => {
        e.preventDefault();
        setData({ [e.target.name]: e.target.value });
    }

    const submitNameChange = async (e) => {
        e.preventDefault();
        await handleSubmit(e);
    }

    const handleDeleteBuilding = async (e) => {
        e.preventDefault();
        await handleDeleteSubmit(e);
    }

    return (

        <div className="content-card">
            <div className="content-card-container">
                {
                    editBuildingContainer && editBuildingContainer === true ? (
                        <>
                            <form>
                                <div style={{ display: "flex", flexDirection: "column" }}>
                                    <div style={{ display: "flex"}}>
                                        <input className="card-input" onChange={handleNameChange} type="text" name="buildingName" placeholder='Endre navn..' />
                                    </div>
                                    <div style={{ display: "flex" }}>
                                        <button onClick={submitNameChange} className="card-button">Lagre</button>
                                    </div>
                                </div>
                            </form>
                            <div style={{ display: "flex", marginRight: "15px" }}>
                                <span className="supply-text">
                                    {response && response.error ? <>FEIL: {response.error}</> : ''}
                                    {error && error ? <>{error}</> : ""}
                                </span>
                            </div>
                        </>
                    ) : (
                        <CardTitle svg={<BuildingIcon />} title={buildingName} />
                    )
                }
                <div className="content-card-inner-container">
                    <h4>Prosjektert areal</h4>

                    <p className="info">
                        {area.toLocaleString()} m<sup>2</sup>

                    </p>


                    <h4>Prosjektert luftmengde</h4>

                    <p className="info">
                        {PlusIcon && <PlusIcon />}
                        <span className="supply-text"> {supplyAir.toLocaleString()} </span> m<sup>3</sup>/h
                        <br />
                        {MinusIcon && <MinusIcon />}
                        <span className="extract-text"> {extractAir.toLocaleString()} </span> m<sup>3</sup>/h
                    </p>


                    <h4>Betjenes av ventilasjonssystem:</h4>

                    <ul>
                        {
                            buildingData.systems.map((system, index) => <li key={index}>{system}</li>)
                        }
                    </ul>


                    <h4>Prosjektert varme</h4>
                    <p className="info">
                        {Number((heating / 1000).toFixed(2)).toLocaleString()} kW
                    </p>
                </div>
                <div style={{ display: "flex", flexDirection: "row", height: "100%" }}>
                    <div style={{ display: "flex", width: "100%", height: "100%", alignItems: "end", justifyContent: "end" }}>
                        {
                            editBuildingContainer && editBuildingContainer === true ? (
                                <div style={{ display: "flex", flexDirection: "column", width: "100%" }}>
                                    <div style={{ display: "flex", flexDirection: "row", width: "100%" }}>
                                        <button onClick={handleDeleteBuilding} className="card-button">
                                            Slett bygg
                                        </button>
                                        <div style={{ display: "flex", justifyContent: "end", flex: "1" }}>
                                            <button onClick={closeEditOptions} className="card-button">
                                                Avbryt
                                            </button>
                                        </div>
                                    </div>
                                    <div>
                                        {
                                            deleteResponse && deleteResponse.success === false ? deleteResponse.error : ''
                                        }
                                    </div>
                                </div>
                            ) : (
                                    <button onClick={showEditOptions} className="card-button">Rediger bygg</button>
                            )
                        }
                    </div>
                </div>
            </div>
        </div>
    );
}

export default BuildingSummary;