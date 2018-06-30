import React from 'react';
import { StyleSheet, View, TextInput } from 'react-native';
import firebase from 'firebase';

import CircleButton from '../elements/CircleButton';

class MemoCreateScreen extends React.Component {
  state = {
    body: '',
  }

  handleSubmit() {
    const { params } = this.props.navigation.state;
    console.log(params);
    this.props.navigation.navigate('MemoEdit');
    const db = firebase.firestore();
    const settings = { /* your settings... */ timestampsInSnapshots: true };
    db.settings(settings);
    db.collection(`users/${params.currentUser.user.uid}/memos`).add({
      body: this.state.body,
      created_at: new Date(),
    })
      .then((docRef) => {
        console.log(docRef.id);
      })
      .catch((error) => {
        console.log(error);
      });
  }

  render() {
    return (
      <View style={styles.container}>
        <TextInput
          style={styles.memoCreateInput}
          multiline
          value={this.state.body}
          onChangeText={(text) => { this.setState({ body: text }) }}
        />

        <CircleButton onPress={this.handleSubmit.bind(this)}>
          {'\uf00c'}
        </CircleButton>
      </View>
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
