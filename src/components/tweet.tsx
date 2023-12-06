import styled from "styled-components";
import { ITweet } from "./timeline";
import { auth, db, storage } from "../firebase";
import { deleteDoc, deleteField, doc, updateDoc } from "firebase/firestore";
import { deleteObject, getDownloadURL, ref, uploadBytes } from "firebase/storage";

const Wrapper = styled.div`
  display: grid;
  grid-template-columns: 3fr 1fr;
  padding: 20px;
  border: 1px solid rgba(255, 255, 255, 0.5);
  border-radius: 15px;
`;

const Column = styled.div``;

const Photo = styled.img`
  width: 100px;
  height: 100px;
  border-radius: 15px;
`;

const Username = styled.span`
  font-weight: 600;
  font-size: 15px;
`;

const Payload = styled.p`
  margin: 10px 0px;
  font-size: 18px;
`;

const DeleteButton = styled.button`
  background-color: tomato;
  color: white;
  font-weight: 600;
  border: 0;
  font-size: 12px;
  padding: 5px 10px;
  margin-right: 5px;
  margin-bottom: 5px;
  text-transform: uppercase;
  border-radius: 5px;
  cursor: pointer;
`;

const EditButton = styled.button`
  background-color: tomato;
  color: white;
  font-weight: 600;
  border: 0;
  font-size: 12px;
  padding: 5px 10px;
  margin-right: 5px;
  margin-bottom: 5px;
  text-transform: uppercase;
  border-radius: 5px;
  cursor: pointer;
`;

const PhotoButton = styled.button`
  background-color: tomato;
  color: white;
  font-weight: 600;
  border: 0;
  font-size: 12px;
  padding: 5px 10px;
  margin-right: 5px;
  margin-bottom: 5px;
  text-transform: uppercase;
  border-radius: 5px;
  cursor: pointer;
`;

const PhotoInput = styled.input`
    display: none;
`;

export default function Tweet({ username, photo, tweet, userId, id }: ITweet) {
    const user = auth.currentUser;
    const onDelete = async () => {
        const ok = confirm("Are you sur you want to delete this tweet?!? :D ");
        if (!ok || user?.uid !== userId) return;
        try {
            await deleteDoc(doc(db, "tweets", id));
            if(photo){
                const photoRef = ref(storage, `tweets/${user.uid}/${id}`);
                await deleteObject(photoRef);
            }
        } catch (e) {
            console.log(e);
        } finally {
        }
    };
    const onEdit = async () => {
      if (user?.uid !== userId) return;
      try {
        let editpop = prompt('트윗을 수정해주세요!');
        let uptweet = editpop;
        if(uptweet) {
          alert('수정되었습니다!');
          await updateDoc(doc(db,"tweets",id), {
            tweet: uptweet,
          });
        }
      } catch (e) {
        console.log(e);
      } finally{}
    };
    const onPhotoChange = async(e:React.ChangeEvent<HTMLInputElement>) => {
      const { files } = e.target;
      if (user?.uid !== userId) return;
      if (files && files.length === 1) {
        const file = files[0];
        const locationRef = ref(
          storage,
          `tweets/${user.uid}/${id}`
        );
        const result = await uploadBytes(locationRef, file);
        const url = await getDownloadURL(result.ref);
        await updateDoc(doc(db,"tweets",id), {
            photo: url,
        });
      }
    };
    const onPhoto = async () => {
      if (user?.uid !== userId) return;
      let myInput = document.getElementById("photo");
      myInput?.click();

    };
    const onPhotoDelete = async () => {
      const ok = confirm("Are you sur you want to delete this Photo?!? :D ");
      if (!ok || user?.uid !== userId) return;
      try {
          if(photo){
              const photoRef = ref(storage, `tweets/${user.uid}/${id}`);
              await deleteObject(photoRef);
              await updateDoc(doc(db,"tweets",id), {
                photo: deleteField(),
              });
          }
          else {
            alert('삭제할 사진이 없어용!');
          }
      } catch (e) {
          console.log(e);
      } finally {
      }

    };
    return(
        <Wrapper>
            <Column>
                <Username>{username}</Username>
                <Payload>{tweet}</Payload>
                {user?.uid === userId ? <DeleteButton onClick={onDelete}>Tweet Delete</DeleteButton> : null}
                {user?.uid === userId ? <EditButton onClick={onEdit}>Edit</EditButton> : null}
                {user?.uid === userId ? <PhotoButton onClick={onPhoto}>Photo Edit</PhotoButton> : null}
                <PhotoInput onChange={onPhotoChange} type="file" id="photo" accept="image/*"  />
                {user?.uid === userId ? <DeleteButton onClick={onPhotoDelete}>Photo Delete</DeleteButton> : null}
            </Column>
            <Column>{photo ? <Photo src={photo} /> : null}</Column>
        </Wrapper>
    );
}