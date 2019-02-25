import React from 'react';
import { ScrollView, StyleSheet, Text, TextInput, View, Button } from 'react-native';
import db from '../db'
import Firebase from 'firebase'
import firebase from 'firebase'


export default class Chat extends React.Component {
  static navigationOptions = {
    title: 'Create',
  };

  state = {
    name: this.props.username,
    message: "",
    chats: [],
    date: new Date()
  }


  componentDidMount() {
    this.pageload()
  }
  logout = async () => {
    firebase.auth().signOut().then(function() {
      alert ("logout")
      // Sign-out successful.
    }).catch(function(error) {
      // An error happened.
      alert ("not logout")
    });
  }

pageload = () => {
    // let id = 0
    // db.collection("Chat").orderBy("Time")
    // .onSnapshot(querySnapshot => {
    //     let chats = [];
    //     querySnapshot.forEach(doc => {
    //         chats.push({id: doc.id, ...doc.data()})
    //         id = doc.id
    //         console.log("id: ", id)
    //     });
    //     this.setState({id})
    //     this.setState({chats})
    //     console.log("Current students: ", chats.join(", "))
    // });

    // go to the database and get all the users:
    db.collection("users")
    .onSnapshot(querySnapshot => {
        this.users = []
        querySnapshot.forEach(doc => {
          this.users.push({id: doc.id, ...doc.data()})
        });
        console.log("Current users : ", this.users.length)
    })
    
  
    // go to the database and get all the records:
    db.collection("messages").orderBy("time")
    .onSnapshot(querySnapshot => {
        let chats = []
        querySnapshot.forEach(doc => {
          chats.push({id: doc.id, ...doc.data()})
        });
        this.setState({ chats })
        console.log("Current chat : ", chats.join(", "))
    })
}
  create = () => {
      id = (this.state.id * 1) + 1
    console.log("create clicked")
    console.log("username", this.state.name)
    if(this.state.name != "" || this.state.message != ""){
        db.collection("Chat").add({
        UserName: this.state.name,
        Message: this.state.message,
        Time: new Date()
        })
    }
    this.setState({name: "", message: ""})
  }

  render() {
    return (
      <ScrollView style={styles.container}>
       {/* i added this line to get the data from the firebase database */}
       {this.state.chats.map(chat => 
            <View key={chat.id}>
              <Text style = {{fontWeight: 'bold'}}>
                {chat.UserName}:
              </Text>
              <Image style={{width:25, height: 25}} source={{uri: 'https://firebasestorage.googleapis.com/v0/b/cp4210-221812.appspot.com/o/download.jpeg?alt=media&token=80a4bfa4-075d-41f3-af49-746cc9d7bd26'}}/>
                 <Text style={{fontWeight: 'bold', fontSize: 20}}> {this.users.find(u => u.id === chat.username).name} </Text>
              <Text>       {chat.Message}</Text>
            </View>  
          )}
        <View>
          {/* <TextInput
            placeholder = "Username"
            onChangeText={name => this.setState({name})} value={this.state.name}
          /> */}

          <TextInput
            placeholder = "Message"
            onChangeText={message => this.setState({message})} value = {this.state.message}
          />
      </View>

      <Button onPress={(this.create)} title="Create" style={{ width: 100, paddingTop: 20 }} />
      <Button onPress={(this.logout)} title="logout" style={{ width: 100, paddingTop: 20 }} />
      </ScrollView>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingTop: 15,
    backgroundColor: '#fff',
  },
});
