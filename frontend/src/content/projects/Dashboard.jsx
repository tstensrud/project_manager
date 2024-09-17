import { useContext, useEffect } from 'react'
import { Link } from 'react-router-dom';

import { GlobalContext } from '../../GlobalContext';

// components
import SubTitleComponent from '../../layout/SubTitleComponent';
import useFetch from '../../hooks/useFetch'
import HeaderIcon from '../../assets/svg/dashboardIcon.jsx';
import LoadingSpinner from '../../layout/LoadingSpinner.jsx';
import ContentCard from '../../layout/ContentCard';
import InputField from '../../layout/formelements/InputField.jsx'
import MainContentContainer from '../../layout/MainContentContainer.jsx';

function Dashboard() {

  const { setActiveProject, setActiveProjectName } = useContext(GlobalContext);
  const { data, loading, error } = useFetch('/projects/');

  useEffect(() => {
    setActiveProject('0');
    setActiveProjectName('');
  }, []);

  return (
    <>
      <SubTitleComponent svg={<HeaderIcon />} headerText={"Dashboard - velg prosjekt"} projectName={""} projectNumber={""} />
      <MainContentContainer>
        {
          loading && loading === true ? (
            <LoadingSpinner text="prosjekter" />
          ) : (
            <div className="flex justify-center flex-row w-full">
              <ContentCard>
                <div className="w-[900px] flex flex-col">
                  <div className="mb-3">
                    <h2>Velg prosjekt</h2>
                  </div>
                  <div className="flex flex-row mb-3 items-center">
                    <div className="w-1/3">
                      Søk i prosjekter
                    </div>
                    <div className="w-2/3">
                      <InputField />
                    </div>

                  </div>

                  <div className="w-full flex flex-col">
                    <table>
                      <thead>
                        <tr className="bg-tertiary-color border-default-border-color dark:bg-dark-tertiary-color border-b dark:border-b-dark-default-border-color">
                          <th className="pt-1 pb-1 pl-3">
                            Prosjektnr
                          </th>
                          <th className="pt-1 pb-1">
                            Prosjektnavn
                          </th>
                          <th className="pt-1 pb-1 pr-3">
                            Påbegynt
                          </th>
                          <th className="pt-1 pb-1 pr-3">
                            Kravspesifikasjon
                          </th>
                        </tr>
                      </thead>
                      <tbody>
                        {
                          data?.success === true &&
                          Object.keys(data.data).map((key, index) => (
                            <tr className="hover:dark:bg-table-hover hover:bg-table-hover border-default-border-color border-b dark:border-b-dark-default-border-color" key={index}>
                              <td className="pt-1 pb-1 pl-3 pr-3">
                                <Link to={`/project/${data.data[key].uid}/`}>{data.data[key].ProjectNumber}</Link>
                              </td>
                              <td className="pt-1 pb-1 pl-3 pr-3">
                                {data.data[key].ProjectName}
                              </td>
                              <td className="pt-1 pb-1 pl-3 pr-3">
                                {data.data[key].CreatedAt}
                              </td>
                              <td className="pt-1 pb-1 pr-3 pl-3">
                                {data.data[key].Specification}
                              </td>
                            </tr>
                          ))
                        }
                      </tbody>

                    </table>
                  </div>

                  {error && error}
                </div>
              </ContentCard>
            </div>
          )
        }
      </MainContentContainer>
    </>
  );
}

export default Dashboard;