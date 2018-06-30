import React from 'react';
import { StyleSheet, KeyboardAvoidingView, TextInput, Platform } from 'react-native';
import firebase from 'firebase';

import CircleButton from '../elements/CircleButton';

class MemoCreateScreen extends React.Component {
  state = {
    body: '',
  }

  shouldComponentUpdate(nextProps) {
    return Platform.OS !== 'ios' || this.props.value === nextProps.value;
  }

  handleSubmit() {
    const { currentUser } = firebase.auth();
    const db = firebase.firestore();
    const settings = { /* your settings... */ timestampsInSnapshots: true };
    db.settings(settings);
    db.collection(`users/${currentUser.uid}/memos`).add({
      body: this.state.body,
      created_at: new Date(),
    })
      .then(() => {
        this.props.navigation.goBack();
      })
      .catch(() => {
      });
  }

  render() {
    return (
      <KeyboardAvoidingView style={styles.container} behavior="height" keyboardVerticalOffset={80}>
        <TextInput
          style={styles.memoCreateInput}
          multiline
          textAlignVertical='top'
          {...this.props}
          onChangeText={(text) => { this.setState({ body: text }) }}
        />

        <CircleButton onPress={this.handleSubmit.bind(this)}>
          {'\uf00c'}
        </CircleButton>
      </KeyboardAvoidingView>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    width: '100%',

  },
  memoCreateInput: {
    backgroundColor: '#fff',
    paddingTop: 32,
    paddingLeft: 16,
    paddingRight: 16,
    paddingBottom: 16,
    flex: 1,
    fontSize: 16,
  },
});

export default MemoCreateScreen;
