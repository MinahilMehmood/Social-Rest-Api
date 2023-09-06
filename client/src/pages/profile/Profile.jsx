import "./profile.css";
import Topbar from "../../components/topbar/Topbar";
import Sidebar from "../../components/sidebar/Sidebar";
import Rightbar from "../../components/rightbar/Rightbar";
import Feed from "../../components/feed/Feed";
import { useEffect, useState } from "react";
import { useParams } from "react-router";
import axios from "axios";

const Profile = () => {

    const PF = process.env.REACT_APP_PUBLIC_FOLDER;
    const [user, setUser] = useState({});
    const username = useParams().username;

    useEffect(() => {
        const fetchUser = async () => {
            const res = await axios.get(`/users?username=${username}`);
            setUser(res.data)
        };
        fetchUser();
    }, [username]);

    return (
        <>
            <Topbar />
            <div className="profile">
                <Sidebar />
                <div className="profile-right">
                    <div className="profile-right-top">
                        <div className="profile-cover">
                            <img className="profile-cover-img" src={user.coverPicture ? PF + user.coverPicture : `${PF}person/noCover.png`} alt="profileCover" />
                            <img className="profile-user-img" src={user.profilePicture ? PF + user.profilePicture : `${PF}person/noAvatar.png`} alt="profileCover" />
                        </div>
                        <div className="profile-info">
                            <h4 className="profile-info-name">{user.username}</h4>
                            <span className="profile-info-desc">{user.desc}</span>
                        </div>
                    </div>
                    <div className="profile-right-bottom">
                        <Feed username={username} />
                        <Rightbar user={user} />
                    </div>
                </div>
            </div>
        </>
    );
};

export default Profile;
