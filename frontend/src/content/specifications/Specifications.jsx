import { Link } from 'react-router-dom';

// Hooks ++
import useFetch from '../../hooks/useFetch'

// components
import SubTitleComponent from '../../layout/SubTitleComponent';
import HeaderIcon from '../../assets/svg/specificationsIcon.jsx';
import LoadingSpinner from '../../layout/LoadingSpinner';
import MainContentContainer from '../../layout/MainContentContainer.jsx';
import ContentCard from '../../layout/ContentCard.jsx';

function Specifications() {

    const { data, loading, error, refetch } = useFetch(`/specifications/get_specifications/`);

    return (
        <>
            <SubTitleComponent svg={<HeaderIcon />} headerText={"Kravspesifikasjoner"} projectName={""} projectNumber={""} />
            <MainContentContainer>
                <div className="flex justify-center flex-row w-full">
                    <ContentCard width="44">
                        {
                            loading && loading === true ? (
                                <LoadingSpinner text="kravspesifikasjoner" />
                            ) : (
                                <>
                                    <div className="mb-3">
                                        <h2>Kravspesifikasjoner i databasen</h2>
                                    </div>
                                    <div className="mb-3">
                                        Velg kravspesifikasjon fra listen under for å og legge til romtyper.
                                        Du kan opprette en ny for ditt prosjekt dersom de eksisterende i databasen ikke er relevante
                                    </div>
                                    <div>
                                        <div className="w-full flex flex-col">
                                            <table>
                                                <thead>
                                                    <tr className="bg-tertiary-color border-default-border-color dark:bg-dark-tertiary-color border-b dark:border-b-dark-default-border-color">
                                                        <th className="pt-1 pb-1 pl-3 text-start">
                                                            Kravspesifikasjon
                                                        </th>
                                                        <th className="pt-1 pb-1">
                                                            Opprettet
                                                        </th>
                                                        <th className="pt-1 pb-1 pr-3 text-end">
                                                            Opprettet av
                                                        </th>
                                                    </tr>
                                                </thead>
                                                <tbody>
                                                    {
                                                        data?.success === true ? (
                                                            Object.keys(data.data).map((key, index) => (
                                                                <tr className="border-default-border-color border-b dark:border-b-dark-default-border-color" key={index}>
                                                                    <td className="pt-1 pb-1 pl-3">
                                                                        <Link to={`/specifications/${data.data[key].uid}/`}>{data.data[key].name}</Link>
                                                                    </td>
                                                                    <td className="pt-1 pb-1 text-center">
                                                                        {data.data[key].created_at}
                                                                    </td>
                                                                    <td className="pt-1 pb-1 pr-3 text-end">
                                                                        {data.data[key].created_by}
                                                                    </td>
                                                                </tr>
                                                            )
                                                            )) : (
                                                            <>
                                                            <tr>
                                                                <td>
                                                                Ingen spesifikasjoner i databasen
                                                                </td>
                                                            </tr>
                                                            </>
                                                        )
                                                    }
                                                </tbody>
                                            </table>
                                        </div>
                                    </div>
                                </>
                            )
                        }
                    </ContentCard>
                </div>
            </MainContentContainer>
        </>
    );
}

export default Specifications;