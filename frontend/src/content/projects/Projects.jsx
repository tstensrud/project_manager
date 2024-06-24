import { useState, useEffect } from 'react'
import SubTitleComponent from '../../layout/SubTitleComponent';

function Projects() {
    
    const [projects, setProjects] = useState([])

    useEffect(() => {
      fetchProjects();
    }, []);
  
    const fetchProjects = async () => {
      const response = await fetch("http://127.0.0.1:5000/projects");
      const data = await response.json();
      setProjects(data);
    };

    return (
        <>
        <SubTitleComponent>
          Prosjekter
        </SubTitleComponent>
        {projects}
        </>
    );
}

export default Projects;