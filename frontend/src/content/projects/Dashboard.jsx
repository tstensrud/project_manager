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
  const { data, loading, error } = useFetch(`/projects/`);

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
  }, [searchValue])


  // Handlers
  const onInputChange = (e) => {
    e.preventDefault();
    setSearhValue(e.target.value)
  }

  const handleShowAll = (e) => {
    setShowAll(!showAll);
  }

  return (
    <>
      <SubTitleComponent svg={<HeaderIcon />} headerText={"Velg prosjekt"} projectName={""} projectNumber={""} />
      <MainContentContainer>
        {
          loading ? (
            <LoadingSpinner text="prosjekter" />
          ) : (
            <>
              {
                data?.success ? (
                  <div className="flex justify-center flex-row w-full">
                    <ContentCard>
                      <div className="w-full flex flex-col">
                        <div className="mb-3">
                          <h2>Velg prosjekt</h2>
                        </div>
                        <div className="flex flex-row mb-3 items-center">
                          <div className="w-1/3">
                            Søk i prosjekter
                          </div>
                          <SearchInput value={searchValue} changeFunction={onInputChange} />
                        </div>
                        <div>
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
                                          data?.success === true &&
                                          Object.keys(data.data)
                                            .sort((a, b) => {
                                              const numA = data.data[a].ProjectNumber;
                                              const numB = data.data[b].ProjectNumber;
                                              return numA - numB;
                                            })
                                            .map((key, index) => (
                                              <tr onClick={() => navigate(`/project/${data.data[key].uid}/`)} className="cursor-pointer border-default-border-color border-b dark:border-b-dark-default-border-color text-primary-color dark:text-dark-primary-color hover:no-underline hover:text-accent-color hover:dark:text-dark-accent-color transition duration-200" key={index}>
                                                <td className="pt-1 pb-1 pl-3 pr-3 min-w-[20%] max-w-[20%] w-[20%]">

                                                  {data.data[key].ProjectNumber}

                                                </td>
                                                <td className="pt-1 pb-1 pr-3 min-w-[70%] max-w-[70%] w-[70%]">

                                                  {data.data[key].ProjectName}

                                                </td>
                                                <td className="pt-1 pb-1 pl-3 pr-3 min-w-[10%] max-w-[10%] w-[10%] text-end">
                                                  {data.data[key].CreatedAt}
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
                        {error && error}
                      </div>
                    </ContentCard>
                  </div>
                ) : (
                  <>
                    {
                      !loading && <MessageBox message={data?.message ?? 'En alvorlig feil har oppstått. Kontakt admin.'} closeable={false} />
                    }
                  </>
                )
              }
            </>
          )
        }
      </MainContentContainer>
    </>
  );
}

export default Dashboard;