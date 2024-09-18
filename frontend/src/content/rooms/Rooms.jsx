import React, { useState, useEffect, useRef } from 'react'
import { useParams } from 'react-router-dom';

import useFetch from '../../hooks/useFetch'
import useSubmitData from '../../hooks/useSubmitData'


// components
import RoomIcon from '../../assets/svg/roomsIcon.jsx'
import SubTitleComponent from '../../layout/SubTitleComponent';
import MessageBox from '../../layout/MessageBox';
import TableTop from '../../layout/TableTop';
import HelpBox from './HelpBox.jsx';
import MainContentContainer from '../../layout/MainContentContainer.jsx';
import FormButton from '../../layout/formelements/FormButton.jsx';
import InputField from '../../layout/formelements/InputField.jsx';
import SelectElement from '../../layout/formelements/SelectElement.jsx';
import SortingButtons from '../../layout/SortingButtons.jsx';
import RoomTable from './RoomTable.jsx';
import LoadingSpinner from '../../layout/LoadingSpinner.jsx';



function Rooms() {
    const { projectId } = useParams();

    // Form fields
    const roomTypeRef = useRef(null);
    const inputRoomNumberRef = useRef(null);
    const inputRoomNameRef = useRef(null);
    const inputAreaRef = useRef(null);
    const inputPopRef = useRef(null);

    // Initial fetch of data
    const { data: buildingData, loading: buildingDataLoading } = useFetch(`/project_api/${projectId}/buildings/get_project_buildings/`);
    const { data: specData, loading: specDataLoading } = useFetch(`/project_api/${projectId}/project_specification/`);
    const { data: roomTypeData, loading: roomTypeLoading, error: roomTypeError } = useFetch(specData?.data?.uid ? `/specifications/get_spec_room_types/${specData.data.uid}/` : null);

    // Sorting
    const [buildings, setBuildings] = useState([]);
    const [currentBuilding, setCurrentBuilding] = useState(-1);
    const [submitUrl, setSubmitUrl] = useState(null);

    // Submit new room
    const { data: newRoomData, response: newRoomDataResponse, setData, handleSubmit } = useSubmitData(`${submitUrl}`);
    const [callRefetchOfRooms, setCallRefetchOfRooms] = useState(false);

    const [disabled, setDisabled] = useState(true);

    // useEffects
    useEffect(() => {
        if (buildingData?.success === true) {
            const fetchedBuildingData = Object.keys(buildingData.data).map(key => buildingData.data[key])
            setBuildings(fetchedBuildingData);
        }
    }, [buildingData]);

    useEffect(() => {
        if (newRoomDataResponse?.success === true) {
            inputRoomNumberRef.current.value = "";
            inputRoomNameRef.current.value = "";
            inputAreaRef.current.value = "";
            inputPopRef.current.value = "";
            roomTypeRef.current.value = roomTypeRef.current.options[0].value;
            setCallRefetchOfRooms(!callRefetchOfRooms);

        }
    }, [newRoomDataResponse]);

    useEffect(() => {
        if (buildings[currentBuilding]) {
            setSubmitUrl(`/project_api/${projectId}/rooms/new_room/${buildings[currentBuilding].uid}/`);
        }
    }, [currentBuilding])

    // Handlers
    const sortButtonClick = (index) => {
        setCurrentBuilding(index);
        setDisabled(false)
    }

    const handleFormChange = (e) => {
        setData((prev) => ({
            ...prev,
            [e.target.name]: e.target.value,
        }))
    }

    const handleOnSubmit = async (e) => {
        e.preventDefault();
        if (!newRoomData.roomType) {
            roomTypeRef.current.focus();
            return;
        }
        await handleSubmit(e);
    }

    return (
        <>
            {newRoomDataResponse?.success === false && (<MessageBox message={newRoomDataResponse.message} />)}
            <SubTitleComponent svg={<RoomIcon />} headerText={"Romskjema"} projectName={""} projectNumber={""} />
            <MainContentContainer>

                {
                    buildingDataLoading || specDataLoading || roomTypeLoading ? (
                        <LoadingSpinner text="data" />
                    ) : (
                        <>
                            <div className="flex h-20 items-center justify-center text-center flex-row w-full">
                                <form onSubmit={handleOnSubmit}>
                                    <div className="flex flex-row w-full">
                                        <div className="mr-2 w-24">
                                            <InputField name="floor" changeFunction={handleFormChange} placeholder="Etasje" tabIndex={2} required={true} disabled={disabled} />
                                        </div>
                                        <div className="mr-2 w-36">
                                            <InputField ref={inputRoomNumberRef} name="roomNumber" changeFunction={handleFormChange} placeholder="Romnr" tabIndex={3} required={true} disabled={disabled} />
                                        </div>
                                        <div className="mr-2">
                                            <SelectElement ref={roomTypeRef} name="roomType" changeFunction={handleFormChange} tabIndex={4} disabled={disabled}>
                                                <option key="0" value="">- Velg romtype -</option>
                                                {roomTypeData && roomTypeData.spec_room_type_data !== undefined && roomTypeData.spec_room_type_data.map(type => (
                                                    <option key={type.uid} value={type.uid}>{type.name}</option>
                                                ))};
                                            </SelectElement>
                                        </div>
                                        <div className="mr-2 w-52">
                                            <InputField ref={inputRoomNameRef} name="roomName" changeFunction={handleFormChange} placeholder="Romnavn" tabIndex={5} required={true} disabled={disabled} />
                                        </div>
                                        <div className="mr-2 w-24">
                                            <InputField ref={inputAreaRef} name="roomArea" changeFunction={handleFormChange} placeholder="Areal" tabIndex={6} required={true} disabled={disabled} />
                                        </div>
                                        <div className="mr-2 w-28">
                                            <InputField ref={inputPopRef} name="roomPeople" changeFunction={handleFormChange} placeholder="Personer" tabIndex={7} required={true} disabled={disabled} />
                                        </div>
                                        <div className="mr-2">
                                            <FormButton buttonText="Legg til" tabIndex={7} disabled={disabled} />
                                        </div>
                                    </div>
                                </form>
                            </div>

                            <SortingButtons buildings={buildings} currentBuilding={currentBuilding} sortButtonClick={sortButtonClick} />

                            {
                                currentBuilding === -1 ? (
                                    <>
                                        <div className="w-full flex justify-center mt-12">
                                            Velg bygg
                                        </div>
                                    </>
                                ) : (
                                    <div className="">
                                        <TableTop info={<HelpBox />} />
                                        <RoomTable callRefetchOfRooms={callRefetchOfRooms} projectId={projectId} buildingUid={buildings[currentBuilding].uid} />
                                    </div>
                                )
                            }
                        </>
                    )

                }
            </MainContentContainer>
        </>
    );
}

export default Rooms;