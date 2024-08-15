import { GlobalContext } from '../../GlobalContext';
import { Link, useParams } from 'react-router-dom';
import { useEffect, useState, useContext } from 'react';
import useFetch from '../../hooks/useFetch'
import SubTitleComponent from '../../layout/SubTitleComponent';
import HeaderIcon from '../../assets/svg/specificationsIcon.svg?react';

function Specifications() {
    const {projectId} = useParams();
    const { activeProject, setActiveProject, token, setToken } = useContext(GlobalContext);
    const {data, loading, error, refetch} = useFetch(`/specifications/get_specifications/`);
        
    useEffect(() => {
        setActiveProject(projectId);
    },[]);

    return (
        <>
            
            <SubTitleComponent svg={<HeaderIcon />} headerText={"Kravspesifikasjoner"} projectName={""} projectNumber={""} />
            <div className='main-content'>
                <div className="flex-container-row">
                    <div className="cards">
                        <div className="information [ card ]">
                            <h2 className="card-title">Kravspesifikasjoner i databasen</h2>
                            <p className="info">Velg kravspesifikasjon fra listen under for å og legge til romtyper.
                                Du kan opprette en ny for ditt prosjekt dersom de eksisterende i databasen ikke er relevante</p>
                            <p className="info">
                                <ul>
                                    {
                                        data && data.data !== null ? (
                                            data.data.map((spec) => (
                                                <><li><Link to={`/specifications/${spec.id}/${activeProject}/`}>{spec.name}</Link></li></>
                                            )
                                            )) : (<>Ingen spesifikasjoner i databasen</>)
                                    }
                                </ul>
                            </p>
                        </div>
                    </div>
                </div>
            </div>
        </>
    );
}

export default Specifications;