import { useState } from "react";
import "./App.css";
import "@chatscope/chat-ui-kit-styles/dist/default/styles.min.css";
import {
  MessageList,
  Message,
  MessageInput,
  TypingIndicator,
} from "@chatscope/chat-ui-kit-react";

const API_KEY = "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";
// "Explain things like you would to a 10 year old learning how to code."
const systemMessage = {
  //  Explain things like you're talking to a software professional with 5 years of experience.
  role: "system",
  content:
    "Explain things like you're a anime chracter luffy from one piece",
};

function App() {
  const [messages, setMessages] = useState([
    {
      message:
        "Welcome! I'm Bot Luffy, at your service. What can I help you with today?",
      sentTime: "just now",
      sender: "ChatGPT",
    },
  ]);
  const [isTyping, setIsTyping] = useState(false);

  const handleSend = async (message) => {
    const newMessage = {
      message,
      direction: "outgoing",
      sender: "user",
    };

    const newMessages = [...messages, newMessage];

    setMessages(newMessages);

    // Initial system message to determine ChatGPT functionality
    // How it responds, how it talks, etc.
    setIsTyping(true);
    await processMessageToChatGPT(newMessages);
  };

  async function processMessageToChatGPT(chatMessages) {
    // messages is an array of messages
    // Format messages for chatGPT API
    // API is expecting objects in format of { role: "user" or "assistant", "content": "message here"}
    // So we need to reformat

    let apiMessages = chatMessages.map((messageObject) => {
      let role = "";
      if (messageObject.sender === "ChatGPT") {
        role = "assistant";
      } else {
        role = "user";
      }
      return { role: role, content: messageObject.message };
    });

    // Get the request body set up with the model we plan to use
    // and the messages which we formatted above. We add a system message in the front to'
    // determine how we want chatGPT to act.
    const apiRequestBody = {
      model: "gpt-3.5-turbo",
      messages: [
        systemMessage, // The system message DEFINES the logic of our chatGPT
        ...apiMessages, // The messages from our chat with ChatGPT
      ],
    };

    await fetch("https://api.openai.com/v1/chat/completions", {
      method: "POST",
      headers: {
        Authorization: "Bearer " + API_KEY,
        "Content-Type": "application/json",
      },
      body: JSON.stringify(apiRequestBody),
    })
      .then((data) => {
        return data.json();
      })
      .then((data) => {
        console.log(data);
        setMessages([
          ...chatMessages,
          {
            message: data.choices[0].message.content,
            sender: "ChatGPT",
          },
        ]);
        setIsTyping(false);
      });
  }

  return (
    <div className="App " >
      <div
        style={{
          position: "relative",
          height: "800px",
          width: "700px",
          margin: "0 auto",
          borderRadius: "10px",
          overflow: "hidden",
          fontFamily: "Arial, sans-serif",
          fontSize: "16px",
          lineHeight: "1.4",
          display: "flex",
          flexDirection: "column",
          overflowY: "hidden" 
        }}
      >
        <div
          style={{
            backgroundColor: "transparent",
            color: "#fff",
            padding: "10px",
            textAlign: "center",
          }}
        >
          <h1 style={{ margin: 0 }}>Chat D. Luffy</h1>
          <p style={{ margin: 0 }}>Your Pirate ChatBot </p>
        </div>

        <MessageList
          scrollBehavior="smooth"
          typingIndicator={
            isTyping ? <TypingIndicator content="Bot Luffy is typing" /> : null
          }
          style={{
            padding: "10px",
            flex: 1,
            backgroundColor: "transparent",
          }}
        >
          {messages.map((message, i) => {
            console.log(message);
            return <Message key={i} model={message} />;
          })}
        </MessageList>
        <MessageInput
          placeholder="Type message here"
          onSend={handleSend}
          style={{
            border: "none",
            outline: "none",
            padding: "10px",
            width: "100%",
            boxSizing: "border-box",
            fontFamily: "inherit",
            fontSize: "inherit",
            lineHeight: "inherit",
            borderTop: "1px solid #ccc",
            backgroundColor: "#fff",
          }}
        />
      </div>
    </div>
  );
}

export default App;
