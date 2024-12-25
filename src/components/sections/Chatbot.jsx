import React, { useState, useEffect, useRef } from 'react';
import './Chatbot.css';
import styled from "styled-components";

const Chatbot = () => {
    const [messages, setMessages] = useState([
        { type: 'bot', text: 'Hi! Ask me anything about Akshat.' },
        { type: 'bot', text: 'Ask me about Akshat, his qualification, and much more!' }
    ]);
    const [input, setInput] = useState('');
    const [editing, setEditing] = useState(false);
    const [editIndex, setEditIndex] = useState(null);
    const [loading, setLoading] = useState(false);
    const [chatbotOpen, setChatbotOpen] = useState(false);
    const [botResponding, setBotResponding] = useState(false);
    const messagesEndRef = useRef(null);

    useEffect(() => {
        scrollToBottom();
    }, [messages]);

    const handleInputChange = (e) => setInput(e.target.value);

    const sendMessage = async () => {
        if (input.trim() === '') return;

        const newMessages = [...messages];
        if (editing) {
            newMessages[editIndex].text = input;
            setEditing(false);
            setEditIndex(null);
        } else {
            newMessages.push({ type: 'user', text: input });
        }

        setMessages(newMessages);
        setInput('');
        setLoading(true);

        try {
            const response = await fetch('http://localhost:5000/send-msg', {
                method: 'POST',
                headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
                body: new URLSearchParams({ MSG: input }),
            });

            const data = await response.json();
            const botResponse = data.Reply || "Sorry, I didn't understand that.";
            setLoading(false);
            typeWriterEffect(botResponse);
        } catch (error) {
            setMessages(prevMessages => [
                ...prevMessages,
                { type: 'bot', text: 'Error: Unable to connect to the server.' },
            ]);
            setLoading(false);
        }
    };

    const typeWriterEffect = (text) => {
        let index = 0;
        const newBotMessage = { type: 'bot', text: '', partial: true };
        setMessages((prevMessages) => [...prevMessages, newBotMessage]);
        setBotResponding(true);

        const interval = setInterval(() => {
            index++;
            setMessages((prevMessages) => {
                const updatedMessages = [...prevMessages];
                const lastMessageIndex = updatedMessages.length - 1;
                if (updatedMessages[lastMessageIndex]?.partial) {
                    updatedMessages[lastMessageIndex].text = text.slice(0, index);
                }
                return updatedMessages;
            });

            if (index === text.length) {
                clearInterval(interval);
                setMessages((prevMessages) => {
                    const updatedMessages = [...prevMessages];
                    const lastMessageIndex = updatedMessages.length - 1;
                    if (updatedMessages[lastMessageIndex]?.partial) {
                        updatedMessages[lastMessageIndex].partial = false;
                    }
                    return updatedMessages;
                });
                setBotResponding(false);
                scrollToBottom();
            }
        }, 50);
    };

    const editMessage = (index) => {
        setEditing(true);
        setEditIndex(index);
        setInput(messages[index].text);
        setMessages((prevMessages) => {
            const updatedMessages = [...prevMessages];
            const nextMessageIndex = index + 1;
            if (updatedMessages[nextMessageIndex]?.type === 'bot') {
                updatedMessages.splice(nextMessageIndex, 1);
            }
            return updatedMessages;
        });
    };

    const handleKeyPress = (e) => {
        if (e.key === 'Enter') sendMessage();
    };

    const scrollToBottom = () => {
        messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    };

    const resetChat = () => {
        setMessages([{ type: 'bot', text: 'Hi! Ask me anything about Akshat.' }]);
        setInput('');
        setEditing(false);
    };

    const BotButton = styled.button`
        position: fixed;
        bottom: 30px;
        right: 30px;
        height: 60px;
        width: 60px;
        border-radius: 50%;
        background-color: ${({ theme }) => theme.primary || "#6C63FF"};
        color: white;
        font-size: 30px;
        display: flex;
        justify-content: center;
        align-items: center;
        border: none;
        cursor: pointer;
        box-shadow: 0px 0px 10px rgba(0, 0, 0, 0.1);
        z-index: 10;
        transition: all 0.3s ease;
        &:hover {
            transform: scale(1.2);
            background-color: #4C4AFF;
        }
    `;

    return (
        <>
            <div className="chatbot-wrapper">
                {!chatbotOpen && (
                    <BotButton onClick={() => setChatbotOpen(true)}>
                        🐼
                    </BotButton>
                )}

                {chatbotOpen && (
                    <div className="chatbot-container">
                        <div className="chatbox">
                            <div className="chatbox-header">
                                🐼 Akshat's Virtual Assistant
                                <button onClick={resetChat} className="refresh-chatbot-btn">🔄</button>
                                <button onClick={() => setChatbotOpen(false)} className="close-chatbot-btn">❌</button>
                            </div>
                            <div className="messages">
                                {messages.map((message, index) => (
                                    <div key={index} className={`message ${message.type}`}>
                                        {message.type === 'user' && (
                                            <button className="edit-button" onClick={() => editMessage(index)}>✏</button>
                                        )}
                                        {message.text}
                                    </div>
                                ))}
                                {loading && <div className="message bot">Fetching data...</div>}
                                <div ref={messagesEndRef}></div>
                            </div>
                            <div className="input-container">
                                <input
                                    type="text"
                                    value={input}
                                    onChange={handleInputChange}
                                    onKeyDown={handleKeyPress}
                                    placeholder="Type a message..."
                                />
                                <button onClick={sendMessage}>Send</button>
                            </div>
                        </div>
                    </div>
                )}
            </div>
        </>
    );
};

export default Chatbot;
