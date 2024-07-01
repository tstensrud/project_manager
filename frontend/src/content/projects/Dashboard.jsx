import { useContext, useState, useEffect } from 'react'
import SubTitleComponent from '../../layout/SubTitleComponent';
import useFetch from '../../hooks/useFetch'
import { Link, useNavigate } from 'react-router-dom';
import { GlobalContext } from '../../GlobalContext';

function Dashboard() {
  
  const { activeProject, setActiveProject, setActiveProjectName, token, setToken } = useContext(GlobalContext);
  
  useEffect(() => {
      const activeProjectLayout = setActiveProject('');
      setActiveProjectName('');
  },[]);

    const [projectId, setProjectId] = useState('');
    const {data, loading, error} = useFetch('/projects/');
    const navigate = useNavigate();

    const handleChange = (e) => {
      const projectId = e.target.value;
      const projectName = e.target.key;
      setActiveProjectName(projectName);
      console.log(projectName);
      setProjectId(projectId);

    }

    const handleSubmit = () => {
      navigate(`/project/${projectId}/`);
    } 
    
    if (loading) return <>Loading</>;
    if (error) return <>Error: {error.message}</>;
    return (
      <>
        <SubTitleComponent>
          Dashboard
        </SubTitleComponent>
        <form className="custom-form profile-form" onSubmit={handleSubmit}>
        <div className="text-container">
          <div className="cards">
            <div className="information [ card ]">
              <h2 className="card-title">Velg prosjekt</h2>
              <p className="info">
              <select onChange={handleChange}>
              <option>- Velg prosjekt -</option>
              {Array.isArray(data?.data) ? (
                data.data.map((project, index) => (
                  <option key={index} value={project.uid}>{project.ProjectNumber} {project.ProjectName}</option>
                ))
              ) : (
                <>{data.data}</>
              )}
            </select>

              </p>
              <button type="submit" className="form-button">
              Gå til
            </button>
 
            </div>
          </div>
        </div>
        </form>
        
      </>
    );
}

export default Dashboard;