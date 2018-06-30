import React from 'react';
import { View, StyleSheet } from 'react-native';
import firebase from 'firebase';

import MemoList from '../components/MemoList';
import CircleButton from '../elements/CircleButton';

class MemoListScreen extends React.Component {
  state = {
    memoList: [],
  }

  // Railsでいうところのbefore action
  componentWillMount() {
    const { currentUser } = firebase.auth();
    const db = firebase.firestore();
    const settings = { /* your settings... */ timestampsInSnapshots: true };
    db.settings(settings);
    db.collection(`users/${currentUser.uid}/memos`).orderBy("created_at", "desc")
      .onSnapshot((snapshot) => {
        const memoList = [];
        snapshot.forEach((doc) => {
          // doc.data()という配列にkey: idという要素を追加
          memoList.push({ ...doc.data(), key: doc.id });
        });
        this.setState({ memoList: memoList });
      });
  }

  handlePress() {
    this.props.navigation.navigate('MemoCreate');
  }

  render() {
    return (
      <View style={styles.container}>
        <MemoList memoList={this.state.memoList} navigation={this.props.navigation} />
        <CircleButton onPress={this.handlePress.bind(this)}>
          {'\uf067'}
        </CircleButton>
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    width: '100%',
    backgroundColor: '#FFFDF6',
  },
});

export default MemoListScreen;
