import { useParams, Link, useNavigate } from 'react-router-dom';
import { useState } from 'react';

// Hooks
import useFetch from '../../hooks/useFetch'

// SVG
import SubTitleComponent from '../../layout/SubTitleComponent';
import HeaderIcon from '../../assets/svg/specificationsIcon.jsx';
import LoadingSpinner from '../../layout/LoadingSpinner';
import LinkButton from '../../layout/Linkbutton.jsx'
import TableTop from '../../layout/TableTop';
import MessageBox from '../../layout/MessageBox';
import TableFooter from '../../layout/tableelements/TableFooter.jsx'
import MainContentContainer from '../../layout/MainContentContainer.jsx';
import Table from '../../layout/tableelements/Table.jsx';
import TableTHelement from '../../layout/tableelements/TableTHelement.jsx';
import TableTDelement from "../../layout/tableelements/TableTDelement.jsx";
import TableHeader from '../../layout/tableelements/TableHeader.jsx';
import TableContainer from '../../layout/tableelements/TableContainer.jsx';

// help
import { title, sections } from '../help/SpecificationHelp.jsx'


function Specification() {

    const { suid } = useParams();

    // Hooks
    const { data, loading, error, refetch } = useFetch(`/specifications/get_spec_room_data/${suid}/`);

    const [warning, setWarning] = useState('');
    const navigate = useNavigate();

    const handleEditClick = () => {
        navigate(`/specifications/edit/${suid}/${data.spec_name}`)
    }

    return (
        <>
            <SubTitleComponent svg={<HeaderIcon />} headerText={"Kravspesifikasjon"} projectName={data && data.spec_name} projectNumber={""} />

            <MainContentContainer>
                {error && <MessageBox message={error} closeable={true} />}
                {
                    loading ? (
                        <LoadingSpinner text="romtyper" />
                    ) : (
                        <>
                            <div className="overflow-y-hidden flex justify-center items-center pt-5 pb-5 h-32-spec">
                                <div className='container-flex-col-spec'>
                                    <LinkButton icon={false} text="Legg inn nye romtyper" url={`/specifications/${suid}/new_room`} />
                                </div>
                                <div className="flex flex-row flex-1 justify-end items-center cursor-pointer text-accent-color dark:text-dark-accent-color hover:text-primary-color hover:dark:text-dark-primary-color transition duration-200">
                                        <LinkButton icon={false} text="Rediger kravspesifikasjon" url={`/specifications/edit/${suid}/${data.spec_name}`} />
                                </div>
                            </div>
                            {
                                data?.success ? (
                                    <>
                                        <TableTop title={title} sections={sections} setCollapseAll={null} />
                                        <TableContainer>
                                            <TableHeader>
                                                <TableTHelement width="15%">Romtype</TableTHelement>
                                                <TableTHelement width="5%">Luft per person<br />m<sup>3</sup>/h/pers</TableTHelement>
                                                <TableTHelement width="5%">Emisjon<br />m<sup>3</sup>/m<sup>2</sup>/h</TableTHelement>
                                                <TableTHelement width="5%">Prosess<br />m<sup>3</sup>/h</TableTHelement>
                                                <TableTHelement width="5%">m<sup>3</sup>/m<sup>2</sup><br />per time</TableTHelement>
                                                <TableTHelement width="5%">Vent.prinsipp</TableTHelement>
                                                <TableTHelement width="5%">Gjenvinner</TableTHelement>
                                                <TableTHelement width="5%">Styring</TableTHelement>
                                                <TableTHelement width="30%">Presiseringer</TableTHelement>
                                                <TableTHelement width="5%">dB teknisk</TableTHelement>
                                                <TableTHelement width="5%">dB naborom</TableTHelement>
                                                <TableTHelement width="5%">dB korridor</TableTHelement>
                                                <TableTHelement width="5%">Kommentar</TableTHelement>
                                            </TableHeader>
                                            <Table>
                                                <tbody>
                                                    {
                                                        data?.data && Object.keys(data.data)
                                                            .sort((a, b) => {
                                                                const nameA = data.data[a].name;
                                                                const nameB = data.data[b].name;
                                                                return nameA.localeCompare(nameB);
                                                            })
                                                            .map((key, index) =>
                                                                <tr className="hover:bg-table-hover hover:dark:bg-dark-table-hover" key={index}>
                                                                    <TableTDelement width="15%">{data.data[key].name}</TableTDelement>
                                                                    <TableTDelement width="5%">{data.data[key].air_per_person}</TableTDelement>
                                                                    <TableTDelement width="5%">{data.data[key].air_emission}</TableTDelement>
                                                                    <TableTDelement width="5%">{data.data[key].air_process}</TableTDelement>
                                                                    <TableTDelement width="5%">{data.data[key].air_per_area}</TableTDelement>
                                                                    <TableTDelement width="5%">{data.data[key].ventilation_principle}</TableTDelement>
                                                                    <TableTDelement width="5%">{data.data[key].heat_exchange}</TableTDelement>
                                                                    <TableTDelement width="5%">{data.data[key].room_control}</TableTDelement>
                                                                    <TableTDelement width="30%">{data.data[key].notes}</TableTDelement>
                                                                    <TableTDelement width="5%">{data.data[key].db_technical}</TableTDelement>
                                                                    <TableTDelement width="5%">{data.data[key].db_neighbour}</TableTDelement>
                                                                    <TableTDelement width="5%">{data.data[key].db_corridor}</TableTDelement>
                                                                    <TableTDelement width="5%">{data.data[key].comments}</TableTDelement>
                                                                </tr>
                                                            )
                                                    }
                                                </tbody>
                                            </Table>
                                        </TableContainer>
                                        <TableFooter>
                                            <td className="h-6" colspan="13"></td>
                                        </TableFooter>
                                    </>
                                ) : (
                                    <>
                                    {
                                        !loading && <MessageBox message={data?.message ?? 'En feil har oppstått. Prøv på nytt og kontakt admin hvis feilen vedvarer'} closeable={false} />
                                    }
                                    </>
                                    
                                )
                            }
                        </>
                    )
                }
            </MainContentContainer>
        </>
    );
}

export default Specification;