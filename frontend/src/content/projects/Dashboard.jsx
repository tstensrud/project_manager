import { useContext, useEffect, useState } from 'react'
import { Link, useNavigate } from 'react-router-dom';

// Hooks and utils
import { GlobalContext } from '../../context/GlobalContext';
import useFetch from '../../hooks/useFetch'
import useFetchRequest from '../../hooks/useFetchRequest'

// components
import SubTitleComponent from '../../layout/SubTitleComponent';
import HeaderIcon from '../../assets/svg/dashboardIcon.jsx';
import LoadingSpinner from '../../layout/LoadingSpinner.jsx';
import ContentCard from '../../layout/ContentCard';
import MainContentContainer from '../../layout/MainContentContainer.jsx';
import SearchInput from '../../layout/formelements/SearchInput.jsx';
import MessageBox from '../../layout/MessageBox.jsx';
import Linkbutton from '../../layout/Linkbutton.jsx';
import CheckBox from '../../layout/formelements/CheckBox.jsx';

function Dashboard() {

  const { setActiveProject, setActiveProjectName } = useContext(GlobalContext);
  const { data: allProjectsData, loading: getAllLoading, error, fetchData: getAllProjects } = useFetchRequest(`/projects/`);

  const [searchValue, setSearhValue] = useState("");
  const { data: searchData, setData: setSearchData, loading: searchLoading, fetchData } = useFetchRequest(`/projects/search/${searchValue}/`);

  const [showAll, setShowAll] = useState(false);

  const navigate = useNavigate();

  useEffect(() => {
    setActiveProject('0');
    setActiveProjectName('');
  }, []);

  useEffect(() => {
    if (!searchValue) {
      setSearchData({});
      return;
    } else {
      fetchData();
    }
  }, [searchValue]);

  useEffect(() => {
    if (allProjectsData?.success) {
      setShowAll(!showAll);
    }
  }, [allProjectsData]);


  // Handlers
  const onInputChange = (e) => {
    e.preventDefault();
    setSearhValue(e.target.value)
  }

  const handleShowAll = () => {
    if (!allProjectsData) {
      getAllProjects();
    } else {
      setShowAll(!showAll);
    }
  }

  return (
    <>
      <SubTitleComponent svg={<HeaderIcon />} headerText={"Velg prosjekt"} projectName={""} projectNumber={""} />
      <MainContentContainer>
        {
          getAllLoading ? (
            <LoadingSpinner text="prosjekter" />
          ) : (
            <>

              <div className="flex justify-center flex-row w-full">
                <ContentCard width="44">
                  <div className="w-full flex flex-col">
                    <div className="mb-3">
                      <h2>Velg prosjekt</h2>
                    </div>
                    <div className="flex flex-row mb-3 items-center">
                      <div className="w-1/3">
                        Søk i prosjekter
                      </div>
                      <SearchInput placeholder="Prosjektnr eller prosjektnavn" value={searchValue} changeFunction={onInputChange} />
                    </div>
                    <div>
                      {
                        !searchValue && (
                          <div className="flex flex-row justify-end w-full pt-1 pb-1 pr-2">
                            <div className="w-fit">
                              {
                                showAll ? "Gjem prosjekter" : "Vis alle prosjekter"
                              }
                            </div>
                            <div className="pl-5">
                              <CheckBox changeFunction={handleShowAll} name="" tabIndex="15" />
                            </div>
                          </div>

                        )
                      }
                    </div>

                    <div className="w-full flex flex-col">
                      <table>
                        <thead>
                          <tr className="border-default-border-color border-b dark:border-b-dark-default-border-color">
                            <th className="pt-1 pb-1 pl-3 min-w-[20%] max-w-[20%] w-[20%] text-start">
                              Prosjektnr
                            </th>
                            <th className="pt-1 pb-1 min-w-[70%] max-w-[70%] w-[70%] text-start">
                              Prosjektnavn
                            </th>
                            <th className="pt-1 pb-1 pr-3 min-w-[10%] max-w-[10%] w-[10%] text-end">
                              Påbegynt
                            </th>
                          </tr>
                        </thead>

                        {
                          !searchValue ? (
                            <>
                              {
                                showAll && (
                                  <tbody>
                                    {
                                      allProjectsData?.success === true &&
                                      Object.keys(allProjectsData.data)
                                        .sort((a, b) => {
                                          const numA = allProjectsData.data[a].ProjectNumber;
                                          const numB = allProjectsData.data[b].ProjectNumber;
                                          return numA - numB;
                                        })
                                        .map((key, index) => (
                                          <tr onClick={() => navigate(`/project/${allProjectsData.data[key].uid}/`)} className="cursor-pointer border-default-border-color border-b dark:border-b-dark-default-border-color text-primary-color dark:text-dark-primary-color hover:no-underline hover:text-accent-color hover:dark:text-dark-accent-color transition duration-200" key={index}>
                                            <td className="pt-1 pb-1 pl-3 pr-3 min-w-[20%] max-w-[20%] w-[20%]">

                                              {allProjectsData.data[key].ProjectNumber}

                                            </td>
                                            <td className="pt-1 pb-1 pr-3 min-w-[70%] max-w-[70%] w-[70%]">

                                              {allProjectsData.data[key].ProjectName}

                                            </td>
                                            <td className="pt-1 pb-1 pl-3 pr-3 min-w-[10%] max-w-[10%] w-[10%] text-end">
                                              {allProjectsData.data[key].CreatedAt}
                                            </td>
                                          </tr>
                                        ))
                                    }
                                  </tbody>
                                )
                              }

                            </>
                          ) : (
                            <>
                              <tbody>
                                {
                                  searchData?.success === true &&
                                  searchData?.data && Object.keys(searchData.data).map((key, index) => (
                                    <tr onClick={() => navigate(`/project/${searchData.data[key].uid}/`)} className="cursor-pointer border-default-border-color border-b dark:border-b-dark-default-border-color text-primary-color dark:text-dark-primary-color hover:no-underline hover:text-accent-color hover:dark:text-dark-accent-color transition duration-200" key={index}>
                                      <td className="pt-1 pb-1 pl-3 pr-3 min-w-[20%] max-w-[20%] w-[20%]">
                                        {searchData.data[key].ProjectNumber}
                                      </td>
                                      <td className="pt-1 pb-1 pl-3 pr-3 min-w-[70%] max-w-[70%] w-[70%]">
                                        {searchData.data[key].ProjectName}
                                      </td>
                                      <td className="pt-1 pb-1 pl-3 pr-3 min-w-[10%] max-w-[10%] w-[10%] text-end">
                                        {searchData.data[key].CreatedAt}
                                      </td>
                                    </tr>
                                  ))
                                }
                              </tbody>
                            </>
                          )
                        }
                      </table>
                    </div>

                  </div>
                </ContentCard>

              </div>

              <>
                {
                  allProjectsData?.success === false && <MessageBox message={allProjectsData?.message ?? 'En feil har oppstått. Kontakt admin.'} closeable={false} />
                }
              </>

            </>
          )
        }
      </MainContentContainer>
    </>
  );
}

export default Dashboard;