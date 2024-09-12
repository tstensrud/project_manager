import { Link, useParams } from 'react-router-dom';

// Hooks
import useFetchExcel from '../../hooks/useFetchExcel'

// Components
import SubTitleComponent from '../../layout/SubTitleComponent';
import HeaderIcon from '../../assets/svg/reportsIcon.jsx';
import LoadingSpinner from '../../layout/LoadingSpinner.jsx';
import MainContentContainer from '../../layout/MainContentContainer.jsx';
import ContentCard from '../../layout/ContentCard.jsx';


function Reports() {
    const { projectId } = useParams();
    const { response: ventResponse, loading: ventLoading, error: ventError, handleSubmit: submitVentilation } = useFetchExcel(`/project_api/${projectId}/excel/ventilation/`);
    const { response: heatingResponse, loading: heatingLoading, error: heatingError, handleSubmit: submitHeating } = useFetchExcel(`/project_api/${projectId}/excel/heating/`);
    const { response: coolingResponse, loading: coolingLoading, error: coolingError, handleSubmit: submitCooling } = useFetchExcel(`/project_api/${projectId}/excel/cooling/`);

    const handleGetVentSheet = (e) => {
        e.preventDefault(e);
        submitVentilation(e);
    }

    const handleGetHeatingSheet = (e) => {
        e.preventDefault(e);
        submitHeating(e);
    }

    const handleGetCoolingSheet = (e) => {
        e.preventDefault();
        submitCooling(e);
    }

    const handleGetSanitarySheet = (e) => {
        e.preventDefault();
    }

    return (
        <>
            <SubTitleComponent svg={<HeaderIcon />} headerText={"Rapporter"} projectName="" projectNumber="" />
            <MainContentContainer>
                <div className="flex justify-center flex-row w-full">
                    <ContentCard>
                        <h3>Excel-utskrifter</h3>
                        <ul>
                            <li>
                                <Link to="#" onClick={handleGetVentSheet}>Luftmengdetabell</Link>
                            </li>
                            <li>
                                <Link to="#" onClick={handleGetHeatingSheet}>Varmetapsberegning</Link>
                            </li>
                            <li>
                                <Link to="#" onClick={handleGetCoolingSheet}>Kjølebehov</Link>
                            </li>
                            <li>
                                <Link to="#" /* onClick={handleGetSanitarySheet }*/>Sanitærutstyr</Link>
                            </li>
                        </ul>
                    </ContentCard>
                </div>

                <div className="flex w-full justify-center">
                    <ContentCard>
                        <h3>Klartgjorte filer</h3>
                        {
                            ventLoading && ventLoading === true || heatingLoading && heatingLoading === true ? (
                                <>
                                    Genererer fil <LoadingSpinner />
                                </>
                            ) : (
                                <>
                                    <span className="flex flex-col w-full">
                                        {
                                            ventError && ventError || heatingError && heatingError ? (
                                                <>
                                                    <p>
                                                        {ventError}
                                                    </p>
                                                    <p>
                                                        {heatingError}
                                                    </p>
                                                </>
                                            ) : (<></>)
                                        }

                                        {
                                            ventResponse && ventResponse.success === true ? (
                                                <span>
                                                    -&nbsp;<Link to={ventResponse.data}>Luftmengdetabell.xlsx</Link>
                                                </span>
                                            ) : (<>{ventResponse && ventResponse.message}</>)
                                        }

                                        {
                                            heatingResponse && heatingResponse.success === true ? (
                                                <span>
                                                    -&nbsp;<Link to={heatingResponse.data}>Varmetapsberegning.xlsx</Link>
                                                </span>
                                            ) : (<>{heatingResponse && heatingResponse.message}</>)
                                        }

                                        {
                                            coolingResponse && coolingResponse.success === true ? (
                                                <span>
                                                    -&nbsp;<Link to={coolingResponse.data}>Kjøleberegning.xlsx</Link>
                                                </span>
                                            ) : (<>{coolingResponse && coolingResponse.message}</>)
                                        }
                                    </span>
                                </>
                            )
                        }
                    </ContentCard>
                </div>
            </MainContentContainer>
        </>
    );
}

export default Reports;