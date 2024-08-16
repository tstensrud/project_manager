import { GlobalContext } from '../../GlobalContext';
import { useParams, Link } from 'react-router-dom';
import { useState, useContext } from 'react';

import useFetch from '../../hooks/useFetch'
import HeaderIcon from '../../assets/svg/editIcon.svg?react';
import SubTitleComponent from '../../layout/SubTitleComponent';

function EditSpecification() {
    const { suid } = useParams();
    
    // Hooks
    const { data, loading, error, refetch } = useFetch(`/specifications/get_spec_room_data/${suid}/`);
    
    return (
        <>
        <div className="main-content">
            <SubTitleComponent svg={<HeaderIcon />} headerText={"Rediger kravspesifikasjon"} projectName={""} projectNumber={""} />
            <br />
            {
                data && data.data.map((room) => (
                    <>{room.name} - {room.uid} <br/></>
               ))
            }
        </div>
            
        </>
    );
}

export default EditSpecification;