import { StyleSheet, Text, View, Modal } from "react-native";
import React, { useState, useEffect, useCallback } from "react";
import { GiftedChat } from "react-native-gifted-chat";
import { useDispatch, useSelector } from "react-redux";
import BackButton from "../buttons/BackButton";
import { setShowChat,setChatNotification } from "../../../slices/modalSlice";

const Chat = ({ socket, from, to }) => {
  const [messages, setMessages] = useState([]);
  const { showChat,chatNotification } = useSelector((state) => state.modal);

  const dispatch = useDispatch();

  // console.log("Rendering Chat component. showChat:", showChat);

  useEffect(() => {
    setMessages([
      {
        _id: 1,
        text: "Hello developer",
        createdAt: new Date(),
        user: {
          _id: 2,
          name: "React Native",
          avatar: "https://links.papareact.com/7pf",
        },
      },
    ]);
  }, []);

  useEffect(() => {
    // Listen for incoming messages from the server
    socket.on("message", ( message, from,to) => {
      // Update the chat with the received message
      console.log(message);
      setMessages((previousMessages) =>
        GiftedChat.append(previousMessages, message)
      );

      if(!showChat){
        dispatch(setChatNotification(true))
      }
    });

    // Clean up the socket listener when the component unmounts
    return () => {
      socket.off("message");
    };
  }, [socket]);

  const onSend = useCallback((newMessages = []) => {
    if (!Array.isArray(newMessages)) {
      console.error("Invalid messages format:", newMessages);
      return;
    }

    const validMessages = newMessages.filter(
      (message) => message.user && message.user._id
    );

    console.log("Valid messages before updating state:", validMessages);

    setMessages((previousMessages) =>
      GiftedChat.append(previousMessages, validMessages)
    );

    // Emit only valid messages
    socket.emit("message", validMessages, from, to);
    console.log("message sent to socket: ",validMessages)
  }, []);

  return (
    <Modal visible={showChat}>
      <View style={styles.container}>
        <BackButton
          onPress={() => {
            dispatch(setShowChat(false));
          }}
          title={"chat with user"}
          
        />
        <GiftedChat
          messages={messages}
          onSend={(messages) => onSend(messages)}
          user={{
            _id: from,
          }}
        />
      </View>
    </Modal>
  );
};

export default Chat;

const styles = StyleSheet.create({
  // Add your styles here
  // For example:
  container: {
    flex: 1,
    backgroundColor: "#fff",
  },
});
