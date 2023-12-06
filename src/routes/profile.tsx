import styled from "styled-components";
import { auth, db, storage } from "../firebase";
import React, { useEffect, useState } from "react";
import { getDownloadURL, ref, uploadBytes } from "firebase/storage";
import { updateProfile } from "firebase/auth";
import { collection, getDocs, limit, orderBy, query, where } from "firebase/firestore";
import { ITweet } from "../components/timeline";
import Tweet from "../components/tweet";

const Wrapper = styled.div`
    display: flex;
    align-items: center;
    flex-direction: column;
    gap: 20px;
`;

const AvatarUpload = styled.label`
    width: 80px;
    overflow: hidden;
    height: 80px;
    border-radius: 50%;
    background-color: #1d9bf0;
    cursor: pointer;
    display: flex;
    justify-content: center;
    align-items: center;
    svg {
        width: 50px;
    }
`;

const AvatarImg = styled.img`
    width: 100%;
`;

const AvatarInput = styled.input`
    display: none;
`;

const Name = styled.span`
    font-size: 22px;
    color: plum;
`;

const Tweets = styled.div`
    display: flex;
    width: 100%;
    flex-direction: column;
    gap: 10px;
`;

const EditButton = styled.button`
  background-color: purple;
  color: white;
  font-weight: 600;
  border: 0;
  font-size: 12px;
  padding: 5px 10px;
  text-transform: uppercase;
  border-radius: 5px;
  cursor: pointer;
`;

export default function Profile(){
    const user = auth.currentUser;
    const [avatar, setAvatar] = useState(user?.photoURL);
    const [tweets,setTweets] = useState<ITweet[]>([]);
    const onAvatarChange = async(e: React.ChangeEvent<HTMLInputElement>) => {
        const {files} = e.target;
        if (!user) return;
        if(files && files.length === 1) {
            const file = files[0];
            const locationRef = ref(storage, `avatars/${user?.uid}`);
            const result = await uploadBytes(locationRef, file);
            const avatarUrl = await getDownloadURL(result.ref);
            setAvatar(avatarUrl);
            await updateProfile(user, {
                photoURL: avatarUrl,
            });
        }
    };
    const fetchTweets = async () => {
        const tweetQuery = query(
            collection(db, "tweets"),
            where("userId","==",user?.uid),
            orderBy("createAt","desc"),
            limit(25)
        );
        const snapshot = await getDocs(tweetQuery);
        const tweets = snapshot.docs.map(doc => {
            const { tweet, createAt, userId, username, photo } = doc.data();
                return {
                    tweet,
                    createAt,
                    userId,
                    username,
                    photo,
                    id: doc.id,
                };
        });
        setTweets(tweets);
    };
    useEffect(() => {
        fetchTweets();
    }, []);
    const onNameEdit = async () => {
        try {
            if(!user) return;
            let editpop = prompt('수정할 닉네임을 적어주세요!');
            let upname = editpop;
            if(upname){
                await updateProfile(user, {
                displayName: upname,
                });
                alert('닉네임이 수정되었습니다! 새로고침을 해주세요 ><');
            }
        } catch (e) {
            console.log(e);
        } finally {
        }
    };
    return (
        <Wrapper>
            <AvatarUpload htmlFor="avatar">
                {avatar ? (
                <AvatarImg src={avatar} />
                ) : (
                    <svg fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">
                    <path d="M10 8a3 3 0 100-6 3 3 0 000 6zM3.465 14.493a1.23 1.23 0 00.41 1.412A9.957 9.957 0 0010 18c2.31 0 4.438-.784 6.131-2.1.43-.333.604-.903.408-1.41a7.002 7.002 0 00-13.074.003z" />
                    </svg>
                )}
            </AvatarUpload>
            <AvatarInput onChange={onAvatarChange} id="avatar" type="file" accept="image/*" />
            <Name>
                { user?.displayName ?? "Anonymous"}
            </Name>
            <EditButton onClick={onNameEdit}>Name Edit</EditButton>
            <Tweets>
                {tweets.map(tweet => <Tweet key={tweet.id} {...tweet}/>)}
            </Tweets>
        </Wrapper>
    );
}