import React, { useState, useEffect, useRef } from 'react';
import styled from 'styled-components';
import { Logout } from './Logout';
import { ChatInput } from './ChatInput';
import { getAllMessagesRoute, sendMessageRoute } from '../utils/APIRoutes';
import axios from 'axios';
import { v4 as uuidv4 } from 'uuid';

export const ChatContainer = ({ currentChat, currentUser, socket }) => {
  const [messages, setMessages] = useState([]);
  const [arrivalMessage, setArrivalMessage] = useState(null);

  const scrollRef = useRef();

  useEffect(() => {
    async function fetchData() {
        try {
            // Check if currentUser and currentChat are truthy before making the request
            if (currentUser && currentChat) {
                const res = await axios.post(getAllMessagesRoute, {
                    from: currentUser._id,
                    to: currentChat._id,
                });
                console.log('Server Response:', res.data);
                setMessages(res.data.messages);
            }
        } catch (error) {
            console.error('Error fetching messages:', error);
        }
    }
    fetchData();
}, [currentChat, currentUser?._id]);




  // useEffect(() => {
  //   const fetchData = async () => {
  //     try {
  //       if (currentChat && currentUser?._id) {
  //         const res = await axios.post(getAllMessagesRoute, {
  //           from: currentUser._id,
  //           to: currentChat._id,
  //         });
  //         console.log('Messages from API:', res);
  //         setMessages(res.data);
  //       }
  //     } catch (error) {
  //       console.error('Error fetching messages:', error);
  //     }
  //   };

  //   fetchData();
  // }, [currentChat, currentUser?._id]);

  // console.log('Messages state:', messages);

  // useEffect(() => {
  //   const fetchData = async () => {
  //     try {
  //       if (currentChat && currentUser?._id) {
  //         const res = await axios.post(getAllMessagesRoute, {
  //           from: currentUser._id,
  //           to: currentChat._id,
  //         });
  //         setMessages(res.data);
  //       }
  //     } catch (error) {
  //       console.error('Error fetching messages:', error);
  //     }
  //   };

  //   fetchData();
  // }, [currentChat, currentUser?._id]);

  const handleSendMsg = async (msg) => {
    console.log('Sending message:', msg);
    console.log('Sender ID:', currentUser._id);

    try {
      if (currentChat && currentChat._id) {
        await axios.post(sendMessageRoute, {
          from: currentUser._id,
          to: currentChat._id,
          message: msg,
        });
      }
    } catch (error) {
      console.error('Error sending message:', error);
    }
    socket.current.emit('send-message', {
      to: currentChat._id,
      from: currentUser._id,
      message: msg,
    });

    const msgs = [...messages];
    msgs.push({fromSelf: true, message: msg});
    setMessages(msgs);
  };

  useEffect(() => {
    if (socket.current) {
      socket.current.on("msg-receive", (msg) => {
        setArrivalMessage({ fromSelf: false, message: msg });
      })
    }
  }, []);

  useEffect(() => {
    arrivalMessage && setMessages((prev) => [...prev, arrivalMessage]);
  }, [arrivalMessage]);

  useEffect(() => {
    if (scrollRef.current) {
        scrollRef.current.scrollIntoView({ behavior: "smooth" });
    }
}, [messages]);

  return (
    <>
      {currentChat && (
        <Container>
          <div className="chat-header">
            <div className="user-details">
              <div className="avatar">
                <img
                  className="avatar-img"
                  src={`data:image/svg+xml;base64,${currentChat.avatarImage}`}
                  alt="avatar"
                />
              </div>
              <div className="username">
                <h3>{currentChat.username}</h3>
              </div>
            </div>
            <Logout />
          </div>
          <div className="chat-messages">
            {messages.map((message) => {
              return (
              <div ref={scrollRef} key={uuidv4()} >
                <div className={`message ${message.fromSelf ? 'sended' : 'received'}`}>
                  <div className="content">
                    <p>{message.message}</p>
                    {console.log('Message:', message.message)}
                  </div>
                </div>
              </div>
              );
            })}
          </div>
          <ChatInput handleSendMsg={handleSendMsg} />
        </Container>
      )}
    </>
  );
};

const Container = styled.div`
  padding-top: 1rem;
  display: grid;
  grid-template-rows: 10% 78% 12%;
  gap: 0.1rem;
  overflow: hidden;
  @media screen and (min-width: 720px) and (max-width: 1080px) {
      grid-template-rows: 15% 75% 15%;
    }
  .chat-header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding: 0 2rem;
    .user-details {
      display: flex;
      align-items: center;
      gap: 1rem;
      .avatar {
        .avatar-img {
          height: 3rem;
        }
      }
      .username {
        h3 {
          color: #fff;
        }
      }
    }
  }
  .chat-messages {
    padding: 1rem 2rem;
    display: flex;
    flex-direction: column;
    gap: 1rem;
    overflow: auto;
    &::-webkit-scrollbar {
      width: 0.2rem;
      &-thumb {
        background-color: #ffffff39;
        width: 0.1rem;
        border-radius: 1rem;
      }
    }
    .message {
      display: flex;
      align-items: center;
      .content {
        max-width: 40%;
        overflow-wrap: break-word;
        padding: 1rem;
        font-size: 1.1rem;
        border-radius: 1rem;
        color: #d1d1d1;
      }
    }
    .sended {
      justify-content: flex-end;
      .content {
        background-color: #4f04ff21;
      }
    }
    .recieved {
      justify-content: flex-start;
      .content {
        background-color: #9900ff20;
      }
    }
  }
`;
