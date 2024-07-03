import { useContext, useState, useEffect } from 'react'
import SubTitleComponent from '../../layout/SubTitleComponent';
import useFetch from '../../hooks/useFetch'
import { Link, useNavigate } from 'react-router-dom';
import { GlobalContext } from '../../GlobalContext';
import HeaderIcon from '../../assets/svg/dashboardIcon.svg?react';

function Dashboard() {
  
  const { activeProject, setActiveProject, setActiveProjectName, token, setToken } = useContext(GlobalContext);
  
  useEffect(() => {
      const activeProjectLayout = setActiveProject('0');
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
         <HeaderIcon /> Dashboard
        </SubTitleComponent>
        
        <div className="main-content">
          <div className="cards">
            <div className="information [ card ]">
              <h2 className="card-title">Velg prosjekt</h2>
              <form className="custom-form profile-form" onSubmit={handleSubmit}>
              <p className="info">Velg prosjekt å jobbe på fra menyen under, eller opprett nytt prosjekt fra menyen over: Dashboard - Nytt prosjekt</p>
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
                  <p>
                  <button type="submit" className="form-button">
                    Gå til valgt prosjekt
                  </button>
                  </p>
              </p>
              </form>
            </div>
          </div>

        </div>
      </>
    );
}

export default Dashboard;