// Chat.jsx
import React, { Component } from 'react';
import { SafeAreaView, Modal, StyleSheet, View, Text, Button } from 'react-native';
import ChatBot from 'react-native-chatbot';
// import CaptureImage from '../js/CaptureImage';

const steps = [
  {
    id: '0',
    message: 'Hello! How may I help you?',
    trigger: '1'
  },
  {
    id: '1',
    user: true,
    trigger: '2'
  },
  {
    id: '2',
    message: 'Sorry for the inconvenience. You will get your payment back shortly',
    trigger: '4'
  },
  {
    id: '4',
    message: 'Was your issue resolved?',
    trigger: '5'
  },
  {
    id: '5',
    options: [
      { value: 1, label: 'YES', trigger: '6' },
      { value: 2, label: 'NO', trigger: '8' },
    ],
  },
  {
    id: '6',
    message: 'Please rate us.',
    trigger: '9'
  },
  {
    id: '8',
    message: 'You will receive a call from our customer support shortly.',
    trigger: '9'
  },
  {
    id: '9',
    message: 'Thank you!!',
    end: true
  }
];

export default class Chat extends Component {
  state = {
    modalVisible: false
  };

  setModalVisible = (visible) => {
    this.setState({ modalVisible: visible });
  };

  render() {
    const { modalVisible } = this.state;

    return (
      <SafeAreaView style={styles.container}>
        <Button title="Support" onPress={() => this.setModalVisible(true)} />
        <Modal
          animationType="slide"
          transparent={false}
          visible={modalVisible}
          onRequestClose={() => this.setModalVisible(false)}
        >
          <View style={styles.modalContainer}>
            <ChatBot steps={steps} />
            <Button title="Close" onPress={() => this.setModalVisible(false)} />
          </View>
        </Modal>
      </SafeAreaView>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center'
  },
  modalContainer: {
    flex: 1,
    justifyContent: 'center',
    padding: 20
  }
});
