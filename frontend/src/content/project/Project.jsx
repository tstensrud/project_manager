import { useEffect, useState, useContext } from 'react';
import useFetch from '../../hooks/useFetch'
import { Link, useParams } from 'react-router-dom';
import { GlobalContext } from '../../GlobalContext';
import SubTitleComponent from '../../layout/SubTitleComponent';
import HeaderIcon from '../../assets/svg/projectIcon.svg?react';

function Project () {
    const {projectId} = useParams();
    const { activeProject, setActiveProject, setActiveProjectName, token, setToken } = useContext(GlobalContext);
    const {data, loading, error} = useFetch(`/project_api/${projectId}/`)
    
    
    useEffect(() => {
        setActiveProject(projectId);
    },[]);

    useEffect(() => {
        setActiveProjectName(data && data.data.ProjectName);
    },[data]);
    
    return (
        <>
            <SubTitleComponent>
              <HeaderIcon /> &nbsp; Prosjektoversikt - {data && data.data.ProjectNumber} {data && data.data.ProjectName}
            </SubTitleComponent>
            <div className="main-content">
                <div className="flex-container-row">
                    <div className="cards">
                        <div className="information [ card ]">
                            <h2 className="card-title">{data && data.data.ProjectName} oppsummert</h2>
                            <h4>Prosjektbeskrivelse</h4>
                            <p className="info">{data && data.data.ProjectDescription} </p>
                            <h4>Oppsummering</h4>
                            <p className="info">Kravspesifikasjon<br />
                                <Link url="">{data && data.data.SpecificationName}</Link>
                            </p>
                            <p className="info">Prosjektert luftmengde<br />
                                m<sup>3</sup>/h
                            </p>
                            <p className="info">Prosjektert varme<br />
                                W
                            </p>
                        </div>
                    </div>
                </div>
            </div>
        </>
    );
}

export default Project;