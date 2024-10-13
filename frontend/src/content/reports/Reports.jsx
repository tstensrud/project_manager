import { useContext } from 'react';
import { Link, useParams } from 'react-router-dom';

// Hooks
import useFetchExcel from '../../hooks/useFetchExcel'
import { GlobalContext } from '../../context/GlobalContext';

// Components
import SubTitleComponent from '../../layout/SubTitleComponent';
import HeaderIcon from '../../assets/svg/reportsIcon.jsx';
import LoadingSpinner from '../../layout/LoadingSpinner.jsx';
import MainContentContainer from '../../layout/MainContentContainer.jsx';
import ContentCard from '../../layout/ContentCard.jsx';
import MessageBox from '../../layout/MessageBox.jsx';
import Linkbutton from '../../layout/Linkbutton.jsx';


function Reports() {
    const { activeProject } = useContext(GlobalContext);
    const { response: ventResponse, loading: ventLoading, error: ventError, handleSubmit: submitVentilation } = useFetchExcel(activeProject ? `/project_api/${activeProject}/excel/ventilation/` : null);
    const { response: heatingResponse, loading: heatingLoading, error: heatingError, handleSubmit: submitHeating } = useFetchExcel(activeProject ? `/project_api/${activeProject}/excel/heating/` : null);
    const { response: coolingResponse, loading: coolingLoading, error: coolingError, handleSubmit: submitCooling } = useFetchExcel(activeProject ? `/project_api/${activeProject}/excel/cooling/` : null);

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
                    <ContentCard width="40">
                        <div className="mb-5 w-full flex justify-center">Excel-rapporter</div>
                        <div className="pt-1 pb-1">
                            <Linkbutton text="Luftmengdetabell" onClick={handleGetVentSheet} />

                        </div>
                        <div className="pt-1 pb-1">
                            <Linkbutton text="Varmetapsberegninger" onClick={handleGetHeatingSheet} />

                        </div>
                        <div className="pt-1 pb-1">
                            <Linkbutton text="Kjølebehovsberegninger" onClick={handleGetCoolingSheet} />

                        </div>
                        <div className="pt-1 pb-1">
                            <Linkbutton text="Sanitærutstyr" onClick={``} />

                        </div>
                    </ContentCard>
                </div>

                <div className="flex w-full justify-center">
                    <ContentCard width="40">
                        <h3>Klartgjorte filer</h3>
                        {
                            ventLoading || heatingLoading ? (
                                <>
                                    Genererer fil <LoadingSpinner />
                                </>
                            ) : (
                                <>
                                    <div className="flex flex-col w-full">
                                        {ventError && <MessageBox message={ventError} closeable={true} />}
                                        {heatingError && <MessageBox message={heatingError} closeable={true} />}

                                        {
                                            ventResponse?.success ? (
                                                <div>
                                                    -&nbsp;<Link to={ventResponse.data}>Luftmengdetabell.xlsx</Link>
                                                </div>
                                            ) : (<>{ventResponse?.message}</>)
                                        }

                                        {
                                            heatingResponse?.success ? (
                                                <div>
                                                    -&nbsp;<Link to={heatingResponse.data}>Varmetapsberegning.xlsx</Link>
                                                </div>
                                            ) : (<>{heatingResponse?.message}</>)
                                        }

                                        {
                                            coolingResponse?.success ? (
                                                <div>
                                                    -&nbsp;<Link to={coolingResponse.data}>Kjøleberegning.xlsx</Link>
                                                </div>
                                            ) : (<>{coolingResponse?.message}</>)
                                        }
                                    </div>
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