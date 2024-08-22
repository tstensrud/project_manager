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
        <div className="cards">
            <div className="information [ card ]">
                {
                    editBuildingContainer && editBuildingContainer === true ? (
                        <>
                            <form>
                                <div style={{ display: "flex", flexDirection: "row" }}>
                                    <div style={{ display: "flex", marginRight: "15px" }}>
                                        <input className="card-input" onChange={handleNameChange} type="text" name="buildingName" placeholder='Endre navn..' />
                                    </div>
                                    <div style={{ display: "flex", marginRight: "15px" }}>
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

                <p className="info">Prosjektert areal<br />
                    {area.toLocaleString()} m<sup>2</sup>
                </p>

                <p className="info">Prosjektert luftmengde<br />
                    {PlusIcon && <PlusIcon />}
                    <span className="supply-text"> {supplyAir.toLocaleString()} </span> m<sup>3</sup>/h
                    <br />
                    {MinusIcon && <MinusIcon />}
                    <span className="extract-text"> {extractAir.toLocaleString()} </span> m<sup>3</sup>/h
                </p>
                <p>Betjenes av ventilasjonssystem:</p>
                <ul>
                    {
                        buildingData.systems.map((system, index) => <li key={index}>{system}</li>)
                    }
                </ul>
                <p className="info">Prosjektert varme<br />
                    {Number((heating / 1000).toFixed(1)).toLocaleString()} kW
                </p>
                <div style={{ display: "flex", flexDirection: "row" }}>
                    <div style={{ display: "flex", marginTop: "50px", width: "100%", alignItems: "center", justifyContent: "end" }}>
                        {
                            editBuildingContainer && editBuildingContainer === true ? (
                                <div style={{ display: "flex", flexDirection: "column", width: "100%" }}>
                                    <div style={{ display: "flex", flexDirection: "row", width: "100%" }}>
                                        <div style={{ display: "flex", justifyContent: "start", alignItems: "center", width: "50%" }}>
                                            <Link onClick={handleDeleteBuilding} to="">Slett bygg</Link> &nbsp; <DeleteIcon />
                                        </div>
                                        <div style={{ display: "flex", justifyContent: "end", alignItems: "center", width: "50%" }}>
                                            <Link to="" onClick={closeEditOptions}>Avbryt</Link>
                                        </div>
                                    </div>
                                    <div>
                                        {
                                            deleteResponse && deleteResponse.success === false ? deleteResponse.error : ''
                                        }
                                    </div>
                                </div>
                            ) : (
                                <>
                                    <div style={{ display: "flex", marginRight: "15px" }}>
                                        <Link to="" onClick={showEditOptions}>Rediger bygg</Link>
                                    </div>
                                    <div style={{ display: "flex" }}>
                                        <EditIcon />
                                    </div>
                                </>
                            )
                        }
                    </div>
                </div>
            </div>
        </div>
    );
}

export default BuildingSummary;