import { useEffect, useState } from 'react';
import { Link, useParams } from 'react-router-dom';

// Hooks
import useUpdateData from '../../hooks/useUpdateData';
import useDeleteData from '../../hooks/useDeleteData';

// Components
import CardTitle from '../../layout/CardTitle';
import ContentCard from '../../layout/ContentCard';
import CardButton from '../../layout/formelements/CardButton';
import CardInputField from '../../layout/formelements/CardInputField.jsx';
import MessageBox from '../../layout/MessageBox.jsx'

// SVG imports
import PlusIcon from '../../assets/svg/plusIcon.jsx';
import MinusIcon from '../../assets/svg/minusIcon.jsx';
import BuildingIcon from '../../assets/svg/buildingIcon.jsx';

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
        await handleDeleteSubmit();
    }

    return (

        <ContentCard>
            {response?.success === false && <MessageBox message={response.message} /> }
            {
                editBuildingContainer && editBuildingContainer === true ? (
                    <>
                        <form onSubmit={submitNameChange}>
                            <div className="flex flex-col">
                                <div className="flex mb-1">
                                    <CardInputField changeFunction={handleNameChange} name="buildingName" placeholder="Endre navn.."/>
                                </div>
                                <div className="flex items-center">
                                    <CardButton buttonText="Lagre"/> {error && error}
                                </div>
                            </div>
                        </form>
                    </>
                ) : (
                    <CardTitle svg={<BuildingIcon />} title={buildingName} />
                )
            }
            <div className="border-0 p-3 rounder-lg">
                <div className="text-grey-text dark:text-dark-grey-text mb-3">
                    <h4>Prosjektert areal</h4>
                </div>

                <div className="mb-5">
                    {area.toLocaleString()} m<sup>2</sup>
                </div>


                <div className="text-grey-text dark:text-dark-grey-text mb-3">
                    <h4>Prosjektert luftmengde</h4>
                </div>

                <div className="mb-5">
                    {PlusIcon && <PlusIcon />}
                    <span className="text-supply-color"> {supplyAir.toLocaleString()} </span> m<sup>3</sup>/h
                    <br />
                    {MinusIcon && <MinusIcon />}
                    <span className="text-extract-color"> {extractAir.toLocaleString()} </span> m<sup>3</sup>/h
                </div>

                <div className="mb-5">
                    <div className="text-grey-text dark:text-dark-grey-text mb-3">
                        <h4>Betjenes av ventilasjonssystem</h4>
                    </div>
                    {
                        buildingData.systems.map((system, index) =>
                            <div key={index} className="flex flex-row">
                                <div className="flex w-full">
                                    {system}
                                </div>
                            </div>
                        )
                    }
                </div>



                <div className="text-grey-text dark:text-dark-grey-text mb-3">
                    <h4>Prosjektert varme</h4>
                </div>
                <div className="mb-5">
                    {Number((heating / 1000).toFixed(2)).toLocaleString()} kW
                </div>
            </div>
            <div className="flex flex-row h-full">
                <div className="flex w-full h-full items-end justify-end">
                    {
                        editBuildingContainer && editBuildingContainer === true ? (
                            <div className="flex flex-col w-full">
                                <div className="flex flex-row w-full">
                                    <CardButton buttonText="Slett bygg" clickFunction={handleDeleteBuilding} />
                                    
                                    <div className="flex justify-end flex-1">
                                        <CardButton buttonText="Avbryt" clickFunction={closeEditOptions} />
                                    </div>
                                </div>
                                <div className="mt-3">
                                    {
                                        deleteResponse && deleteResponse.success === false ? deleteResponse.error : ''
                                    }
                                </div>
                            </div>
                        ) : (
                            <CardButton buttonText="Rediger bygg" clickFunction={showEditOptions} />
                        )
                    }
                </div>
            </div>

        </ContentCard>
    );
}

export default BuildingSummary;