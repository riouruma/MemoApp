import React from 'react';
import { StyleSheet, KeyboardAvoidingView, TextInput } from 'react-native';

import firebase from 'firebase';

import CircleButton from '../elements/CircleButton';

class MemoEditScreen extends React.Component {
  state = {
    body: '',
    key: '',
  }

  componentWillMount() {
    const { params } = this.props.navigation.state;
    this.setState({
      body: params.body,
      key: params.key
    });
  }

  shouldComponentUpdate(nextProps, nextState){
    if(this.state.body !== nextState.body){
      return false;
    }
    return true;
  }

  handlePress() {
    const db = firebase.firestore();
    const settings = { /* your settings... */ timestampsInSnapshots: true };
    db.settings(settings);

    // Dateとして送ると文字列変換処理でエラーになるため、firebaseの型に合わせる
    const newDate = firebase.firestore.Timestamp.fromDate(new Date());
    const { currentUser } = firebase.auth();

    db.collection(`users/${currentUser.uid}/memos`).doc(this.state.key)
      .update({
        body: this.state.body,
        created_at: newDate,
      })
      .then(() => {
        const { navigation } = this.props;
        navigation.state.params.returnMemo({
          body: this.state.body,
          key: this.state.key,
          created_at: newDate,
        });
        navigation.goBack();
      })
      .catch((error) => {
      
      });
  }

  render() {
    return (
      <KeyboardAvoidingView style={styles.container} behavior="height" keyboardVerticalOffset={80}>
        <TextInput
          style={styles.memoEditInput}
          multiline
          underlineColorAndroid='transparent'
          textAlignVertical='top'
          {...this.props}
          value={this.state.body}
          onChangeText={(text) => { this.setState({ body: text }) }}
        />

        <CircleButton
          onPress={this.handlePress.bind(this)}
        >
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
  memoEditInput: {
    backgroundColor: '#fff',
    paddingTop: 32,
    paddingLeft: 16,
    paddingRight: 16,
    paddingBottom: 16,
    flex: 1,
    fontSize: 16,
  },
});

export default MemoEditScreen;
