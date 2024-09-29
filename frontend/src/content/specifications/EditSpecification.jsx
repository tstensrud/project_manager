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
import MainContentContainer from '../../layout/MainContentContainer.jsx';
import Table from '../../layout/tableelements/Table.jsx';
import TableWrapper from '../../layout/tableelements/TableWrapper.jsx';
import TableTHelement from '../../layout/tableelements/TableTHelement.jsx';
import TableHeader from '../../layout/tableelements/TableHeader.jsx';
import LoadingSpinner from '../../layout/LoadingSpinner.jsx';

// help
import { title, sections } from '../help/SpecEditTableHelp.jsx'

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
        await handleSubmit();
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
                                <div className="group flex flex-row flex-1 justify-end items-center cursor-pointer text-accent-color dark:text-dark-accent-color hover:text-primary-color hover:dark:text-dark-primary-color transition duration-300">
                                    <div className="pr-3" onClick={openDeleteDialog}>
                                        Slett kravspesifikasjon
                                    </div>
                                    <div>
                                        <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="stroke-accent-color dark:stroke-dark-accent-color fill-none group-hover:stroke-primary-color group-hover:dark:stroke-dark-primary-color transition duration-300">
                                            <path d="M21 4H8l-7 8 7 8h13a2 2 0 0 0 2-2V6a2 2 0 0 0-2-2z"></path>
                                            <line x1="18" y1="9" x2="12" y2="15"></line><line x1="12" y1="9" x2="18" y2="15"></line>
                                        </svg>
                                    </div>
                                </div>
                            </div>
                            <TableTop title={title} sections={sections} />
                            <TableHeader>
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
                            </TableHeader>
                            <Table>
                                <tbody>
                                    {
                                        data?.data && Object.entries(data.data)
                                            .slice()
                                            .sort((a, b) => {
                                                if (a[0] && b[0]) {
                                                    return a[0].localeCompare(a[0]);
                                                }
                                                return 0;
                                            })
                                            .map(([key, value], index) => (
                                                <EditSpecTableRow key={index} roomUid={value} totalColumns={14} refetch={refetch} />
                                            ))
                                    }
                                </tbody>
                            </Table>
                        </>
                    )
                }

            </MainContentContainer>
        </>
    );
}

export default EditSpecification;
