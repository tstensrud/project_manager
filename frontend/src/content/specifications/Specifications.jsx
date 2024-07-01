import SubTitleComponent from '../../layout/SubTitleComponent';

import { GlobalContext } from '../../GlobalContext';
import useFetch from '../../hooks/useFetch'
import { Link, useParams } from 'react-router-dom';
import { useEffect, useState, useContext } from 'react';


function Specifications() {
    const {projectId} = useParams();
    const { activeProject, setActiveProject, token, setToken } = useContext(GlobalContext);
    const {data, loading, error, refetch} = useFetch(`/specifications/get_specifications/`);
        
    useEffect(() => {
        setActiveProject(projectId);
    },[]);

    return (
        <>
        <SubTitleComponent>
            Kravspesifikasjoner
        </SubTitleComponent>
            <div className='main-content'>
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
                                        <><li><Link to={`/specifications/${spec.id}/`}>{spec.name}</Link></li></>
                                    )
                                )) : (<>Ingen spesifikasjoner i databasen</>)
                            }
                            </ul>
                        </p>
                    </div>
                </div>
            </div>
        </>
    );
}

export default Specifications;