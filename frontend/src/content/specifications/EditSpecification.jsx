import { useParams, Link, useNavigate } from 'react-router-dom';
import { useContext, useState } from 'react';

import { GlobalContext } from '../../GlobalContext';
import useFetch from '../../hooks/useFetch'
import useDeleteData from '../../hooks/useDeleteData';

// SVG
import HeaderIcon from '../../assets/svg/editIcon.jsx';
import DeleteIcon from '../../assets/svg/deleteIcon.jsx'

// Components
import EditSpecTableRow from './EditSpecTableRow';
import DeleteBox from './DeleteBox';
import TableTop from '../../layout/TableTop';
import HelpBoxEdit from './HelpBoxEdit';
import MainContentContainer from '../../layout/MainContentContainer.jsx';

function EditSpecification() {
    const { suid, name } = useParams();
    const navigate = useNavigate();
    const [showDeleteDialog, setShowDeleteDialog] = useState(false);

    // Hooks
    const { data, loading, error, refetch } = useFetch(`/specifications/get_spec_rooms/${suid}/`);
    const { data: deleteData, loading: deleteLoading, error: deleteError, handleSubmit } = useDeleteData(`/specifications/delete_spec/${suid}/`);

    // Handlers

    const deleteSpecification = async (e) => {
        e.preventDefault();
        await handleSubmit(e);
        navigate(`/specifications`);
    }

    const openDeleteDialog = (e) => {
        e.preventDefault();
        setShowDeleteDialog(true);
    }

    return (
        <MainContentContainer>
            {
                showDeleteDialog === true ? <DeleteBox deleteSpecification={deleteSpecification} setShowDeleteDialog={setShowDeleteDialog} /> : ""
            }
            <div className="w-full flex items-center border-t-default-border-color border-b-default-border-color bg-tertiary-color text-primary-color pl-5 pr-5">
                <div style={{ display: "flex", height: "50px" }}>
                    <div style={{ display: "flex", alignItems: "center", textAlign: "center", marginRight: "20px" }}>
                        <HeaderIcon />
                    </div>
                    <div style={{ display: "flex", alignItems: "center", textAlign: "center" }}>
                        <h3>
                            Rediger kravspesifikasjon - <Link to={`/specifications/${suid}`}>{name}</Link>
                        </h3>
                    </div>
                </div>
            </div>
            <div className="overflow-y-hidden flex justify-center items-center mr-5 ml-5 h-32-spec">
                <div style={{ display: "flex", flex: "1", justifyContent: "flex-start", alignItems: "center", marginRight: "20px", cursor: "pointer" }}>
                    <Link to="#" onClick={openDeleteDialog}>Slett kravspesifikasjon</Link>&nbsp;&nbsp; <DeleteIcon />
                </div>
            </div>
            <TableTop info={<HelpBoxEdit />} />
            <div className="flex flex-col ml-5 mr-5 mt-0 h-auto rounded-bl-lg rounded-br-lg bg-secondary-color shadow-lg shadow-background-shade mb-5">
                <table className="fl-table">
                    <thead>
                        <tr>
                            <th width="15%">Romtype</th>
                            <th width="5%">Luft per person<br />m<sup>3</sup>/h/pers</th>
                            <th width="5%">Emisjon<br />m<sup>3</sup>/m<sup>2</sup>/h</th>
                            <th width="5%">Prosess<br />m<sup>3</sup>/h</th>
                            <th width="5%">Luft minimum<br />m<sup>3</sup>/h</th>
                            <th width="5%">Vent.prinsipp</th>
                            <th width="5%">Gjenvinner</th>
                            <th width="5%">Styring</th>
                            <th width="25%">Presiseringer</th>
                            <th width="5%">dB teknisk</th>
                            <th width="5%">dB naborom</th>
                            <th width="5%">dB korridor</th>
                            <th width="5%">Kommentar</th>
                            <th width="5%">Slett</th>
                        </tr>
                    </thead>
                    <tbody>
                        {
                            data && data.data !== undefined && data.data !== null && data.data.map((uid) => (
                                <EditSpecTableRow key={uid} roomUid={uid} totalColumns={14} />
                            ))
                        }
                    </tbody>
                </table>

            </div>
        </MainContentContainer>
    );
}

export default EditSpecification;
