import { useEffect, useContext } from 'react'

// Hooks and utils
import { AuthContext } from '../../context/AuthContext.jsx';
import useFetchRequest from '../../hooks/useFetchRequest.jsx';
import { GlobalContext } from '../../context/GlobalContext.jsx';

// Components
import ChangePassword from './ChangePassword.jsx';
import SubTitleComponent from '../../layout/SubTitleComponent';
import AccountIcon from '../../assets/svg/accountIcon.jsx'
import MainContentContainer from '../../layout/MainContentContainer.jsx';
import LoadingBar from '../../layout/LoadingBar.jsx';
import AdminPanel from './admin/AdminPanel.jsx';
import Userinfo from './Userinfo.jsx';
import UserFavs from './UserFavs.jsx';
import Messages from './messages/Messages.jsx';

function UserProfile() {
    const { currentUser, loading: authLoading } = useContext(AuthContext);
    const { setActiveProject, setActiveProjectName, setUserName } = useContext(GlobalContext);
    
    const { data, loading, fetchData } = useFetchRequest(`/user/${currentUser.uid}/`);
    
    useEffect(() => {
        if (!authLoading) {
            fetchData();
        }
    }, [currentUser]);

    useEffect(() => {
        setActiveProject('0');
        setActiveProjectName('');
      }, []);
      
    return (
        <>
            <SubTitleComponent svg={<AccountIcon />} headerText={!loading && `${data?.data?.server?.user_info?.name ?? ''}`} projectName={""} projectNumber={""} />
            <MainContentContainer>
                {
                    loading ? (
                        <LoadingBar />
                    ) : (
                        <div className="flex flex-row justify-evenly flex-wrap w-full">
                            <Userinfo firebaseData={data?.data?.firebase} userData={data?.data?.server?.user_info} />
                            <UserFavs userData={data?.data?.server?.user_favs} fetchData={fetchData} />
                            <ChangePassword />
                        </div>
                    )
                }
                <div className="flex w-full justify-center">
                    <Messages />
                </div>
                {
                    data?.success && (
                        data?.admin && (
                            <div className="flex w-full pt-5">
                                <AdminPanel uuid={currentUser && currentUser.uid} />
                            </div>
                        )
                    )
                }
            </MainContentContainer>
        </>
    );
}

export default UserProfile;