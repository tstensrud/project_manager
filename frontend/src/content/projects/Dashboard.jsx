import { useContext, useState, useEffect } from 'react'
import SubTitleComponent from '../../layout/SubTitleComponent';
import useFetch from '../../hooks/useFetch'
import { useNavigate } from 'react-router-dom';
import { GlobalContext } from '../../GlobalContext';

function Dashboard() {
  
  const { activeProject, setActiveProject, token, setToken } = useContext(GlobalContext);
  useEffect(() => {
      const activeProjectLayout = setActiveProject(0)
  },[]);

    const [projectId, setProjectId] = useState('');
    const {data, loading, error} = useFetch('/projects/');
    const navigate = useNavigate();
    console.log(data);
    const handleChange = (e) => {
      const projectId = e.target.value;
      setProjectId(projectId);      
      console.log("ProjectID on change: " + projectId);
    }

    const handleSubmit = () => {
      console.log("Project id before submit: " + projectId);
      navigate(`/project/${projectId}/`);
    } 
    
    if (loading) return <>Loading</>;
    if (error) return <>Error: {error.message}</>;
    return (
      <>
        <SubTitleComponent>
          Prosjekter
        </SubTitleComponent>
        <form className="custom-form profile-form" onSubmit={handleSubmit}>
          <p>
            <select onChange={handleChange}>
              <option>- Velg prosjekt -</option>
              {Array.isArray(data?.data) ? (
                data.data.map((project, index) => (
                  <option key={index} value={project.id}>{project.ProjectNumber} {project.ProjectName}</option>
                ))
              ) : (
                <>{data.data}</>
              )}
            </select>
          </p>
          <p>
            <button type="submit" className="form-button">
              Gå til
            </button>
          </p>
        </form>
      </>
    );
}

export default Dashboard;