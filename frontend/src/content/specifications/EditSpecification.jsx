import { useParams, Link, useNavigate } from 'react-router-dom';
import { useContext, useState } from 'react';

import { GlobalContext } from '../../GlobalContext';
import useFetch from '../../hooks/useFetch'
import useDeleteData from '../../hooks/useDeleteData';

// SVG
import HeaderIcon from '../../assets/svg/editIcon.jsx';
import DeleteIcon from '../../assets/svg/deleteIcon.jsx'

// Components
import SubTitleComponent from '../../layout/SubTitleComponent';
import EditSpecTableRow from './EditSpecTableRow';
import DeleteBox from './DeleteBox';
import TableTop from '../../layout/TableTop';
import HelpBoxEdit from './HelpBoxEdit';
import MainContentContainer from '../../layout/MainContentContainer.jsx';
import Table from '../../layout/tableelements/Table.jsx';
import TableWrapper from '../../layout/tableelements/TableWrapper.jsx';
import TableTHelement from '../../layout/tableelements/TableTHelement.jsx';
import TableHeader from '../../layout/tableelements/TableHeader.jsx';
import LoadingSpinner from '../../layout/LoadingSpinner.jsx';

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
        <>
            <SubTitleComponent svg={<HeaderIcon />} headerText={"Rediger kravspesifikasjon"} projectName={data && data.spec_name} projectNumber={""} />
            <MainContentContainer>
                {
                    loading ? (
                        <LoadingSpinner text="romtyper" />
                    ) : (
                        <>
                            {
                                showDeleteDialog === true ? <DeleteBox deleteSpecification={deleteSpecification} setShowDeleteDialog={setShowDeleteDialog} /> : ""
                            }
                            <div className="w-full h-10 mt-3 flex flex-row items-center bg-tertiary-color dark:bg-dark-tertiary-color text-primary-color dark:text-dark-primary-color pl-5 pr-5">
                                <div className="items-center text-center">
                                    <h3>
                                        <Link to={`/specifications/${suid}`}>{name}</Link>
                                    </h3>
                                </div>
                                <div className="flex flex-1 justify-end text-end items-end">
                                    <Link to="#" onClick={openDeleteDialog}>Slett kravspesifikasjon</Link>&nbsp;&nbsp; <DeleteIcon />
                                </div>
                            </div>
                            <TableTop info={<HelpBoxEdit />} />
                            <TableHeader>
                                <thead>
                                    <tr>
                                        <TableTHelement width="15%">Romtype</TableTHelement>
                                        <TableTHelement width="5%">Luft per person<br />m<sup>3</sup>/h/pers</TableTHelement>
                                        <TableTHelement width="5%">Emisjon<br />m<sup>3</sup>/m<sup>2</sup>/h</TableTHelement>
                                        <TableTHelement width="5%">Prosess<br />m<sup>3</sup>/h</TableTHelement>
                                        <TableTHelement width="5%">Luft minimum<br />m<sup>3</sup>/h</TableTHelement>
                                        <TableTHelement width="5%">Vent.prinsipp</TableTHelement>
                                        <TableTHelement width="5%">Gjenvinner</TableTHelement>
                                        <TableTHelement width="5%">Styring</TableTHelement>
                                        <TableTHelement width="25%">Presiseringer</TableTHelement>
                                        <TableTHelement width="5%">dB teknisk</TableTHelement>
                                        <TableTHelement width="5%">dB naborom</TableTHelement>
                                        <TableTHelement width="5%">dB korridor</TableTHelement>
                                        <TableTHelement width="5%">Kommentar</TableTHelement>
                                        <TableTHelement width="5%">Slett</TableTHelement>
                                    </tr>
                                </thead>
                            </TableHeader>
                            <TableWrapper>
                                <Table>
                                    <tbody>
                                        {
                                            data?.data && data.data.map((uid) => (
                                                <EditSpecTableRow key={uid} roomUid={uid} totalColumns={14} refetch={refetch} />
                                            ))
                                        }
                                    </tbody>
                                </Table>
                            </TableWrapper>
                        </>
                    )
                }

            </MainContentContainer>
        </>
    );
}

export default EditSpecification;
