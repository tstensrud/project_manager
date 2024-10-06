import { useEffect, useContext } from 'react'

// Hooks and utils
import { AuthContext } from '../../context/AuthContext.jsx';
import useFetchRequest from '../../hooks/useFetchRequest.jsx';

// Components
import ChangePassword from './ChangePassword.jsx';
import SubTitleComponent from '../../layout/SubTitleComponent';
import AccountIcon from '../../assets/svg/accountIcon.jsx'
import MainContentContainer from '../../layout/MainContentContainer.jsx';
import LoadingBar from '../../layout/LoadingBar.jsx';
import AdminPanel from './admin/AdminPanel.jsx';
import Userinfo from './Userinfo.jsx';
import UserFavs from './UserFavs.jsx';

function UserProfile() {
    const { currentUser, idToken, dispatch, loading: authLoading } = useContext(AuthContext);
    const { data, loading, fetchData } = useFetchRequest(`/user/${currentUser.uid}/`);
    
    useEffect(() => {
        if (!authLoading) {
            fetchData();
        }
    }, [currentUser]);

    return (
        <>
            <SubTitleComponent svg={<AccountIcon />} headerText={!loading && `Velkommen tilbake, ${data?.data?.server?.user_info?.name ?? ''}!`} projectName={""} projectNumber={""} />
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
                {
                    data?.success && (
                        data?.admin && (
                            <div className="flex w-full p-5">
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