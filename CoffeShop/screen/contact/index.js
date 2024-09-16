// Contact.js

import React, { useState } from 'react';
import { View, Text, StyleSheet, TextInput, TouchableOpacity, Alert } from 'react-native';
const url_api = "http://192.168.30.102:3000/contacts";

const Contact = () => {

  const [message, setMessage] = useState('');

  const handleSubmit = () => {
    if (message.trim() == "") {
      Alert.alert('Error', 'Please fill in all fields');
      return;
    } else {
      let cobjContact = { "message": message };

      fetch(url_api, {
        method: 'POST',
        headers: {
          Accept: 'application/json',
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(cobjContact)
      })
        .then((res) => {
          if (res.status == 201) {
            console.log('Add To contacts');
            setMessage('');
            Alert.alert('Success', 'Message sent successfully!');

          }
        })
        .catch((ex) => {
          console.log(ex);
        });
    }








  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Contact Us</Text>


      <TextInput
        style={[styles.input, styles.messageInput]}
        placeholder="Your Message"
        value={message}
        onChangeText={(text) => setMessage(text)}
        multiline
        numberOfLines={5}
      />

      <TouchableOpacity style={styles.submitButton} onPress={handleSubmit}>
        <Text style={styles.submitButtonText}>Submit</Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
  },
  title: {
    fontSize: 25,
    fontWeight: 'bold',
    marginBottom: 20,
    marginTop: 40,
  },
  input: {
    height: 40,
    borderColor: 'gray',
    borderWidth: 1,
    borderRadius: 5,
    marginBottom: 15,
    paddingLeft: 10,
  },
  messageInput: {
    height: 100,
    textAlignVertical: 'top',
  },
  submitButton: {
   backgroundColor:'yellow',
    padding: 15,
    borderRadius: 5,
    alignItems: 'center',
  },
  submitButtonText: {
    color: 'white',
    fontWeight: 'bold',
  },
});

export default Contact;
