import { useEffect, useState, useContext } from 'react';
import useFetch from '../../hooks/useFetch'
import { Link, useParams } from 'react-router-dom';
import { GlobalContext } from '../../GlobalContext';
import SubTitleComponent from '../../layout/SubTitleComponent';

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
            Prosjektoversikt - {data && data.data.ProjectNumber} {data && data.data.ProjectName}
        </SubTitleComponent>
            <div className="text-container">

                <div className="cards">
                    <div className="information [ card ]">
                        <h2 className="card-title">{data && data.data.ProjectName} oppsummert</h2>
                        <h4>Prosjektbeskrivelse</h4>
                        <p className="info">{data && data.data.ProjectDescription} Lorem ipsum dolor sit amet consectetur adipisicing elit. Repellat perferendis dolores quod hic vitae, aut aliquid ad eos nam vero itaque, iure sint perspiciatis minima voluptates necessitatibus porro eius neque. Lorem ipsum dolor sit amet consectetur adipisicing elit. Itaque ipsam aliquid neque minus tenetur pariatur sequi veniam labore. Amet eius itaque temporibus nobis, doloremque cupiditate soluta magnam obcaecati incidunt quae.</p>
                        <h4>Oppsummering</h4>
                        <p className="info">Kravspesifikasjon<br/>
                        <Link url="">{data && data.data.SpecificationName}</Link>
                        </p>
                        <p className="info">Prosjektert luftmengde<br/>
                        m<sup>3</sup>/h
                        </p>
                        <p className="info">Prosjektert varme<br/>
                        W
                        </p>
                    </div>
                </div>

                <div className="cards">
                    <div className="information [ card ]">
                        <h2 className="card-title">{data && data.data.ProjectName} oppsummert</h2>
                        <h4>Prosjektbeskrivelse</h4>
                        <p className="info">{data && data.data.ProjectDescription} Lorem ipsum dolor sit amet consectetur adipisicing elit. Repellat perferendis dolores quod hic vitae, aut aliquid ad eos nam vero itaque, iure sint perspiciatis minima voluptates necessitatibus porro eius neque. Lorem ipsum dolor sit amet consectetur adipisicing elit. Itaque ipsam aliquid neque minus tenetur pariatur sequi veniam labore. Amet eius itaque temporibus nobis, doloremque cupiditate soluta magnam obcaecati incidunt quae.</p>
                        <h4>Oppsummering</h4>
                        <p className="info">Kravspesifikasjon<br/>
                        <Link url="">{data && data.data.SpecificationName}</Link>
                        </p>
                        <p className="info">Prosjektert luftmengde<br/>
                        m<sup>3</sup>/h
                        </p>
                        <p className="info">Prosjektert varme<br/>
                        W
                        </p>
                    </div>
                </div>

            </div>
            
        </>
    );
}

export default Project;