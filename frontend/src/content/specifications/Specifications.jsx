import { Link, useParams } from 'react-router-dom';
import { useEffect, useState, useContext } from 'react';

// Hooks ++
import { GlobalContext } from '../../GlobalContext';
import useFetch from '../../hooks/useFetch'

// components
import SubTitleComponent from '../../layout/SubTitleComponent';
import HeaderIcon from '../../assets/svg/specificationsIcon.jsx';
import LoadingSpinner from '../../layout/LoadingSpinner';
import MainContentContainer from '../../layout/MainContentContainer.jsx';
import ContentCard from '../../layout/ContentCard.jsx';

function Specifications() {
    const { projectId } = useParams();
    const { activeProject, setActiveProject, token, setToken } = useContext(GlobalContext);
    const { data, loading, error, refetch } = useFetch(`/specifications/get_specifications/`);

    /* useEffect(() => {
        setActiveProject(projectId);
    }, []); */

    return (
        <>
            <SubTitleComponent svg={<HeaderIcon />} headerText={"Kravspesifikasjoner"} projectName={""} projectNumber={""} />
            <MainContentContainer>
                <div className="flex justify-center flex-row w-full">
                    <ContentCard>
                        {
                            loading && loading === true ? (
                                <LoadingSpinner />
                            ) : (
                                <>
                                    <h2>Kravspesifikasjoner i databasen</h2>
                                    <p className="info">
                                        Velg kravspesifikasjon fra listen under for å og legge til romtyper.
                                        Du kan opprette en ny for ditt prosjekt dersom de eksisterende i databasen ikke er relevante
                                    </p>
                                    <span className="info">
                                        <ul>
                                            {
                                                data && data.data !== null ? (
                                                    data.data.map((spec, index) => (
                                                        <li key={index}>
                                                            <Link to={`/specifications/${spec.id}/`}>{spec.name}</Link>
                                                        </li>
                                                    )
                                                    )) : (
                                                    <>
                                                        Ingen spesifikasjoner i databasen
                                                    </>
                                                )
                                            }
                                        </ul>
                                    </span>
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