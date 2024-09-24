import { useEffect, useState } from 'react'

// Hooks and utils
import useFetchRequest from '../../../hooks/useFetchRequest'

// Components
import useFetch from '../../../hooks/useFetch'
import ProjectTableRow from './ProjectTableRow';
import LoadingSpinner from '../../../layout/LoadingSpinner';

function ProjectList() {
    const [searchValue, setSearhValue] = useState(null);

    const { data, loading, error, refetch } = useFetch(`/projects/`);
    const { data: searchData, setData: setSearchData, loading: searchLoading, fetchData } = useFetchRequest(`/projects/search/${searchValue}/`);

    useEffect(() => {
        if (!searchValue) {
            setSearchData({});
            return;
        } else {
            fetchData();
        }
    }, [searchValue]);

    // Handlers
    const onInputChange = (e) => {
        e.preventDefault();
        setSearhValue(e.target.value)
    }

    return (
        <div className="flex flex-col">
            <div className="flex flex-col w-full">
                <div className="flex flex-row mb-3 items-center">
                    <div className="w-1/2">
                        <input
                            className="
                      bg-form-background-color
                      dark:bg-dark-form-background-color
                      border-form-border-color
                      dark:border-dark-form-border-color
                      text-primary-color
                      dark:text-dark-primary-color
                      outline-none
                      w-full
                      border-2
                      pl-5
                      pr-5
                      text-sm
                      rounded-3xl
                      h-9
                      focus:border-form-focus-border-color
                      focus:dark:border-dark-form-focus-border-color
                      hover:border-form-element-hover
                      hover:dark:border-dark-form-element-hover"
                            onChange={onInputChange}
                            type="text"
                            value={searchValue}
                            placeholder="Søk i prosjekter"
                        />
                    </div>
                </div>
                {
                    loading ? (
                        <LoadingSpinner />
                    ) : (
                        <table className="w-2/3">
                            <thead>
                                <tr className="border-default-border-color text-grey-text dark:text-dark-grey-text  border-b dark:border-b-dark-default-border-color w-56">
                                    <th className="pt-1 pb-1 pl-3 min-w-[10%] max-w-[10%] w-[10%] text-start">
                                        ID
                                    </th>
                                    <th className="pt-1 pb-1 min-w-[20%] max-w-[20%] w-[20%] text-start">
                                        UID
                                    </th>
                                    <th className="pt-1 pb-1 pr-3 min-w-[15%] max-w-[15%] w-[15%] text-start">
                                        Prosjektnummer
                                    </th>
                                    <th className="pt-1 pb-1 pr-3 min-w-[30%] max-w-[30%] w-[30%] text-start">
                                        Navn
                                    </th>
                                    <th className="pt-1 pb-1 pr-3 min-w-[10%] max-w-[10%] w-[10%] text-start">
                                        Opprettet
                                    </th>
                                    <th className="pt-1 pb-1 pr-3 min-w-[10%] max-w-[10%] w-[10%]">
                                        Slett
                                    </th>
                                </tr>
                            </thead>

                            {
                                !searchValue ? (
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
                                                    <ProjectTableRow refetch={refetch} key={index} data={data.data[key]} />
                                                )
                                                )
                                        }
                                    </tbody>
                                ) : (
                                    <tbody>
                                        {
                                            searchData?.success === true &&
                                            searchData?.data && Object.keys(searchData.data).map((key, index) => (
                                                <ProjectTableRow refetch={fetchData} key={index} data={searchData.data[key]} />
                                            ))
                                        }
                                    </tbody>
                                )
                            }
                        </table>
                    )
                }

            </div>
        </div>
    );
}

export default ProjectList;