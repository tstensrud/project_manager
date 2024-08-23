import { useContext, useState, useEffect, useRef } from 'react'
import { Link, useNavigate } from 'react-router-dom';
import { GlobalContext } from '../../GlobalContext';

import SubTitleComponent from '../../layout/SubTitleComponent';
import useFetch from '../../hooks/useFetch'
import HeaderIcon from '../../assets/svg/dashboardIcon.svg?react';
import LoadingSpinner from '../../layout/LoadingSpinner.jsx';

function Dashboard() {

  const { setActiveProject, setActiveProjectName } = useContext(GlobalContext);

  const [projectId, setProjectId] = useState('');
  const { data, loading, error } = useFetch('/projects/');
  const inputRef = useRef(null);
  const navigate = useNavigate();

  useEffect(() => {
    setActiveProject('0');
    setActiveProjectName('');
    localStorage.removeItem("projectid");
    localStorage.removeItem("projectname");
  }, []);

  const handleChange = (e) => {
    const projectId = e.target.value;
    setProjectId(projectId);
    setActiveProject(projectId);
    localStorage.setItem("projectid", projectId);
  }

  const handleSubmit = (e) => {
    e.preventDefault();
    if (projectId === "" ) {
      inputRef.current.focus();
      return;
    }
    navigate(`/project/${projectId}`);
  }
  
  return (
    <>
      <SubTitleComponent svg={<HeaderIcon />} headerText={"Dashboard - velg prosjekt"} projectName={""} projectNumber={""} />
      <div className="main-content">
        {
          loading && loading === true ? (
            <LoadingSpinner />
          ) : (
            <>
              <div className="flex-container-row">
                <div className="content-card">
                  <div className="content-card-container">
                    <h2 className="card-title">Velg prosjekt</h2>
                    <form className="custom-form profile-form" onSubmit={handleSubmit}>
                      <p className="info">Velg prosjekt å jobbe på fra menyen under, eller opprett nytt prosjekt fra menyen over: Dashboard - Nytt prosjekt</p>
                      <p className="info">
                        <select className="card-select" ref={inputRef} onChange={handleChange}>
                          <option>- Velg prosjekt -</option>
                          {Array.isArray(data?.data) ? (
                            data.data.map((project) => (
                              <option key={project.ProjectName} value={project.uid}>{project.ProjectNumber} {project.ProjectName}</option>
                            ))
                          ) : (
                            <>{data.data}</>
                          )}
                        </select>
                      </p>
                      <p>
                        <button type="submit" className="card-button">
                          Gå til valgt prosjekt
                        </button>
                      </p>
                    </form>
                  </div>
                  <div>
                    {error && error.message}
                  </div>
                </div>
              </div>
            </>
          )
        }
      </div>
    </>
  );
}

export default Dashboard;