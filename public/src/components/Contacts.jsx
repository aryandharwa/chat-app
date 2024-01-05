import React, { useEffect, useState } from 'react'
import styled from 'styled-components'
import Logo from '../assets/logo.svg'

export default function Contacts({ contacts, currentUser, changeChat }) {

    const [currentUserName, setCurrentUserName] = useState(undefined);
    const [currentUserImage, setCurrentUserImage] = useState(undefined);
    const [currentSelected, setCurrentSelected] = useState(undefined);

    useEffect(() => {
        if(currentUser){
            setCurrentUserName(currentUser.username);
            setCurrentUserImage(currentUser.avatarImage);
        }
    }, [currentUser]);

    const changeCurrentChat = (index, contact) => {
        setCurrentSelected(index);
        changeChat(contact);
    }

  return (
    <>
        {
            currentUserImage && currentUserName && (
                <Container>
                    <div className="brand">
                        <img src={Logo} alt="logo" />
                        <h3>snappy</h3>
                    </div>
                    <div className="contacts">
                        {
                            contacts.map((contact, index) => {
                                return (
                                    <div 
                                        className={`contact ${index === currentSelected ? "selected" : ""}`} 
                                        key={index} 
                                        onClick={() => changeCurrentChat(index, contact)} >
                                        
                                        <div className="avatar">
                                            <img 
                                                src={`data:image/svg+xml;base64,${contact.avatarImage}`}
                                                alt="avatar" />
                                        </div>
                                        <div className="username">
                                            <h3>{contact.username}</h3>
                                        </div>          
                                    </div>
                                )
                            })
                        }
                    </div>

                    <div className="current-user">
                        <div className="avatar">
                            <img 
                                src={`data:image/svg+xml;base64,${currentUserImage}`}
                                alt="avatar" />
                        </div>
                        <div className="username">
                            <h2>{currentUserName}</h2>
                        </div>
                    </div>

                </Container>
            )
        }
    </>
  )
}

const Container = styled.div`
    display: grid;
    grid-template-rows: 10% 70% 15%;
    overflow: hidden;
    background-color: #080420;
    .brand {
        display: flex;
        align-items: center;
        justify-content: center;
        gap: 1rem;
        img {
            height: 2rem;
        }
        h3 {
            color: #fff;
            text-transform: uppercase;
        }    
    }
    .contacts {
        display: flex;
        flex-direction: column;
        align-items: center;
        overflow: auto;
        gap: 0.8rem;
        &::-webkit-scrollbar {
            width: 0.2rem;
            &-thumb {
                background-color: #ffffff39;
                width: 0.1rem;
                border-radius: 1rem;
            }
        }
        .contact {
            background-color: #ffffff39;
            min-height: 5rem;
            width: 90%;
            display: flex;
            align-items: center;
            gap: 1rem;
            padding: 0.4rem;
            border-radius: 0.2rem;
            cursor: pointer;
            transition: 0.2s ease-in-out;
            .avatar {
                img {
                    height: 3rem;
                }
            }
            .username {
                h3 {
                    color: #fff;
                }
            }
        }
        .selected {
            background-color: #9186f3;
        }
    }
    .current-user {
        background-color: #0d0d30;
        display: flex;
        align-items: center;
        justify-content: center;
        gap: 2rem;
        .avatar {
            img {
                height: 4rem;
                max-inline-size: 100%;
            }
        }
        .username {
            h2 {
                color: #fff;
            }
        }
        @media screen and (min-width: 720px) and (max-width: 1080px) {
            Gap: 0.5rem;
            .username {
                h2 {
                    font-size: 1rem;
                }
            }
        }
    }
`;