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

function Dashboard() {

  const { setActiveProject, setActiveProjectName } = useContext(GlobalContext);
  const { data, loading, error } = useFetch(`/projects/`);

  const [searchValue, setSearhValue] = useState("");
  const { data: searchData, setData: setSearchData, loading: searchLoading, fetchData } = useFetchRequest(`/projects/search/${searchValue}/`);

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


  return (
    <>
      <SubTitleComponent svg={<HeaderIcon />} headerText={"Dashboard - velg prosjekt"} projectName={""} projectNumber={""} />
      <MainContentContainer>
        {
          loading && loading === true ? (
            <LoadingSpinner text="prosjekter" />
          ) : (
            <div className="flex justify-center flex-row w-full mb-32">
              <ContentCard>
                <div className="w-[900px] flex flex-col">
                  <div className="mb-3">
                    <h2>Velg prosjekt</h2>
                  </div>
                  <div className="flex flex-row mb-3 items-center">
                    <div className="w-1/3">
                      Søk i prosjekter
                    </div>
                      <SearchInput value={searchValue} changeFunction={onInputChange} />
                  </div>

                  <div className="w-full flex flex-col">
                    <table>
                      <thead>
                        <tr className="border-default-border-color  border-b dark:border-b-dark-default-border-color w-56">
                          <th className="pt-1 pb-1 pl-3 min-w-[300px] max-w-[300px] w-[300px] text-start">
                            Prosjektnr
                          </th>
                          <th className="pt-1 pb-1 min-w-[400px] max-w-[400px] w-[400px] text-start">
                            Prosjektnavn
                          </th>
                          <th className="pt-1 pb-1 pr-3 min-w-[200px] max-w-[200px] w-[200px] text-end">
                            Påbegynt
                          </th>
                        </tr>
                      </thead>

                      {
                        !searchValue ? (
                          <>
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
                                    <tr onClick={() => navigate(`/project/${data.data[key].uid}/`)} className="cursor-pointer border-default-border-color border-b dark:border-b-dark-default-border-color text-primary-color dark:text-dark-primary-color hover:no-underline hover:text-accent-color hover:dark:text-dark-accent-color transition duration-300" key={index}>
                                      <td className="pt-1 pb-1 pl-3 pr-3 min-w-[300px] max-w-[300px] w-[300px]">

                                        {data.data[key].ProjectNumber}

                                      </td>
                                      <td className="pt-1 pb-1 pr-3 min-w-[400px] max-w-[400px] w-[400px]">

                                        {data.data[key].ProjectName}

                                      </td>
                                      <td className="pt-1 pb-1 pl-3 pr-3 min-w-[200px] max-w-[200px] w-[200px] text-end">
                                        {data.data[key].CreatedAt}
                                      </td>
                                    </tr>
                                  ))
                              }
                            </tbody>
                          </>
                        ) : (
                          <>
                            <tbody>
                              {
                                searchData?.success === true &&
                                searchData?.data && Object.keys(searchData.data).map((key, index) => (
                                  <tr onClick={() => navigate(`/project/${searchData.data[key].uid}/`)} className="cursor-pointer border-default-border-color border-b dark:border-b-dark-default-border-color text-primary-color dark:text-dark-primary-color hover:no-underline hover:text-accent-color hover:dark:text-dark-accent-color transition duration-300" key={index}>
                                    <td className="pt-1 pb-1 pl-3 pr-3 min-w-[300px] max-w-[300px] w-[300px]">
                                      {searchData.data[key].ProjectNumber}
                                    </td>
                                    <td className="pt-1 pb-1 pl-3 pr-3 min-w-[400px] max-w-[400px] w-[400px]">
                                      {searchData.data[key].ProjectName}
                                    </td>
                                    <td className="pt-1 pb-1 pl-3 pr-3 min-w-[200px] max-w-[200px] w-[200px] text-end">
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
          )
        }
      </MainContentContainer>
    </>
  );
}

export default Dashboard;