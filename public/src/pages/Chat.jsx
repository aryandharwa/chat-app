import React, { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom';
import styled from 'styled-components'
import axios from 'axios';
import Contacts from '../components/Contacts';
import { allUsersRoute } from '../utils/APIRoutes';
import Welcome from '../components/Welcome';
import { ChatContainer } from '../components/ChatContainer';

function Chat() {

  const navigate = useNavigate();
  const [contacts, setContacts] = useState([]);
  const [currentUser, setCurrentUser] = useState(undefined);
  const [currentChat, setCurrentChat] = useState(undefined);
  const [isLoaded, setIsLoaded] = useState(false);

  useEffect(() => {
    const fetchData = async () => {
      if(!localStorage.getItem('chat-app-user')){
        navigate("/login");
      } else {
        const user = await JSON.parse(localStorage.getItem('chat-app-user'));
        setCurrentUser(user);
        setIsLoaded(true);
      }
    };

    fetchData();    
  }, [])

  useEffect(() => {
    const fetchContacts = async () => {
      if (currentUser) {
        if (currentUser.isAvatarImageSet) {
          const data = await axios.get(`${allUsersRoute}/${currentUser._id}`);
          setContacts(data.data);
        } else {
          navigate('/setAvatar');
        }
      }
    };

    fetchContacts();
  }, [currentUser]);

  const handleChatChange = (chat) => {
    setCurrentChat(chat);
  }

  return (
    <Container>
      <div className="container">
        <Contacts 
          contacts={contacts} 
          currentUser={currentUser} 
          changeChat={handleChatChange}    
        />

        {isLoaded && currentChat === undefined ? (
            <Welcome 
              currentUser={currentUser}
            />
          ) : (
            <ChatContainer currentChat={currentChat} />
          )} 

      </div>
    </Container>


    
  )
}


const Container = styled.div`
  height: 100vh;
  width: 100vw;
  display: flex;
  flex-direction: column;
  justify-content: center;
  gap: 1rem;
  align-items: center;
  background-color: #131324;
  .container {
    height: 85%;
    width: 85%;
    background-color: #00000076;
    display: grid;
    grid-template-columns: 25% 75%;
    @media screen and (min-width: 720px) and (max-width: 1080px) {
      grid-template-columns: 35% 65%;
    }
  }

`;

export default Chat