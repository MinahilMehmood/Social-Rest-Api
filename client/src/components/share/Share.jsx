import { useContext, useRef, useState } from 'react';
import './share.css';
import { PermMedia, Label, Room, EmojiEmotions, Cancel } from "@mui/icons-material";
import { AuthContext } from '../../context/AuthContext.js';
import axios from 'axios';

const Share = () => {

    const desc = useRef();
    const [file, setFile] = useState(null)
    const { user } = useContext(AuthContext);
    const PF = process.env.REACT_APP_PUBLIC_FOLDER;

    const handleSubmit = async (e) => {
        e.preventDefault();
        const newPost = {
            userId: user._id,
            desc: desc.current.value
        }

        if (file) {
            const data = new FormData();
            const fileName = Date.now() + file.name;
            data.append("name", fileName);
            data.append("file", file);
            newPost.img = fileName;
            try {
                await axios.post("/upload", data);
            } catch (error) {
                console.log(error);
            }
        }

        try {
            await axios.post("/posts/", newPost);
            window.location.reload();
        } catch (error) {
            console.log(error);
        };
    };

    return (
        <div className='share'>
            <div className='share-wrapper'>
                <div className='share-top'>
                    <img src={user.profilePicture ? PF + user.profilePicture : `${PF}person/noAvatar.png`} className='share-profile-img' alt='ProfilePic' />
                    <input ref={desc} className='share-input' placeholder={"Whats in your mind " + user.username + "...?"} />
                </div>
                <hr className='share-hr' />
                {file && (
                    <div className='share-img-container'>
                        <img className='share-img' alt='share-photo' src={URL.createObjectURL(file)} />
                        <Cancel className='share-img-cancel' onClick={() => setFile(null)} />
                    </div>
                )}
                <form onSubmit={handleSubmit} className='share-bottom'>
                    <div className='share-options'>
                        <label htmlFor='file' className='share-option'>
                            <PermMedia htmlColor='tomato' className='share-icon' />
                            <span className='share-option-text'>Photo or video</span>
                            <input onChange={(e) => {
                                setFile(e.target.files[0])
                            }} type='file' id='file' accept='.png, .jpeg, .jpg' />
                        </label>
                        <div className='share-option'>
                            <Label htmlColor='blue' className='share-icon' />
                            <span className='share-option-text'>Tag</span>
                        </div>
                        <div className='share-option'>
                            <Room htmlColor='green' className='share-icon' />
                            <span className='share-option-text'>Location</span>
                        </div>
                        <div className='share-option'>
                            <EmojiEmotions htmlColor='goldenrod' className='share-icon' />
                            <span className='share-option-text'>Feelings</span>
                        </div>
                    </div>
                    <button type='submit' className='share-button'>
                        Share
                    </button>
                </form>
            </div>
        </div>
    );
};

export default Share;
