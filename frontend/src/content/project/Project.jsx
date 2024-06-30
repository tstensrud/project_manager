import { useEffect, useState, useContext } from 'react';
import useFetch from '../../hooks/useFetch'
import { useParams } from 'react-router-dom';
import { GlobalContext } from '../../GlobalContext';
import SubTitleComponent from '../../layout/SubTitleComponent';

function Project () {
    const {projectId} = useParams();
    const { activeProject, setActiveProject, token, setToken } = useContext(GlobalContext);
    const {data, loading, error} = useFetch(`/project_api/${projectId}/`)
    
    
    useEffect(() => {
        setActiveProject(projectId);
    },[]);
    
    return (
        <>
        <SubTitleComponent>
            {data && data.data.ProjectName} - {data && data.data.ProjectNumber}
        </SubTitleComponent>
            <div className="text-container">
                <div className="summaries-wrapper">

                    <div className="summaries-table">
                        <div className="summaries-row header blue">
                            <div className="summaries-cell white">
                                Gjellende kravspesifikasjon
                            </div>
                        </div>

                        <div className="summaries-row">
                            <div className="summaries-cell">
                                <a href="">{data && data.data.SpecificationName}</a>
                            </div>
                        </div>

                        <div className="summaries-row header blue">
                            <div className="summaries-cell white">
                                Prosjektbeskrivelse
                            </div>
                        </div>

                        <div className="summaries-row">
                            <div className="summaries-cell">
                            {data && data.data.ProjectDescription}
                            </div>
                        </div>

                        <div className="summaries-row header blue">
                            <div className="summaries-cell white">
                                Noe annen informasjon som kunne være av nytte
                            </div>
                        </div>

                        <div className="summaries-row">
                            <div className="summaries-cell">
                                {data && data.data.ProjectDescription}
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </>
    );
}

export default Project;