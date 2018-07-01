import React from 'react';
import { StyleSheet, View, Text, TouchableHighlight, FlatList } from 'react-native';
import firebase from 'firebase';

import Swipeable from 'react-native-swipeable';

const dateString = (date) => {
  const str = date.toDate().toLocaleDateString();
  return str.split('/').join('-');
};

const handlePressDelete = (docId) => {
  const { currentUser } = firebase.auth();
  const db = firebase.firestore();
  const settings = { timestampsInSnapshots: true };
  db.settings(settings);
  db.collection(`users/${currentUser.uid}/memos`).doc(docId).delete()
    .then()
    .catch();
};

const rightButtons = (key) => {
  return [
    <TouchableHighlight
      style={{
        backgroundColor: 'red',
        flex: 1,
        justifyContent: 'center',
      }}
      onPress={() => { handlePressDelete(key); }}
    >
      <Text
        style={{
          color: '#fff',
          marginLeft: 15,
        }}
      >
        Delete
      </Text>
    </TouchableHighlight>,
  ];
};

class MemoList extends React.Component {
  renderMemo({ item }) {
    return (
      <Swipeable rightButtons={rightButtons(item.key)}>
        <TouchableHighlight onPress={() => { this.props.navigation.navigate('MemoDetail', { memo: item }); }}>
          <View style={styles.memoListItem}>
            <Text style={styles.memoTitle}>{item.body.substring(0, 15)}</Text>
            <Text style={styles.memoDate}>{dateString(item.created_at)}</Text>
          </View>
        </TouchableHighlight>
      </Swipeable>
    );
  }

  render() {
    return (
      <View style={styles.memoList}>
        <FlatList
          data={this.props.memoList}
          renderItem={this.renderMemo.bind(this)}
        />
      </View>
    );
  }
}

const styles = StyleSheet.create({
  memoTitle: {
    fontSize: 18,
    marginBottom: 4,
    fontWeight: 'bold',
  },
  memoDate: {
    fontSize: 12,
    color: '#a2a2a2',
  },
  memoList: {
    width: '100%',
    flex: 1,
  },
  memoListItem: {
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#ddd',
    backgroundColor: '#fff',
  },
  deleteView: {
    backgroundColor: 'red',
  },
  deleteText: {
    color: '#fff',
  },
});

export default MemoList;
