import React, { Component } from 'react';
import { Alert, Button, TextInput, View, StyleSheet } from 'react-native';

export default class App extends Component {
  state = {
      username: "",
      password: "",
      name: this.props.username,
    message: "",
    chats: [],
    date: new Date()
  }
  
  onLogin() {
    const { username, password } = this.state;

    Alert.alert('Credentials', `${username} + ${password}`);
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
    let id = 0
    db.collection("Chat").orderBy("Time")
    .onSnapshot(querySnapshot => {
        let chats = [];
        querySnapshot.forEach(doc => {
            chats.push({id: doc.id, ...doc.data()})
            id = doc.id
            console.log("id: ", id)
        });
        this.setState({id})
        this.setState({chats})
        console.log("Current students: ", chats.join(", "))
    });
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
      <View>
        {this.state.flag == false ?
      <View style={styles.container}>
        <TextInput
          value={this.state.username}
          onChangeText={(username) => this.setState({ username })}
          placeholder={'Username'}
          style={styles.input}
        />
        <TextInput
          value={this.state.password}
          onChangeText={(password) => this.setState({ password })}
          placeholder={'Password'}
          secureTextEntry={true}
          style={styles.input}
        />
        
        <Button
          title={'Login'}
          style={styles.input}
          onPress={this.onLogin.bind(this)}
        />
      </View>
  :
      <ScrollView style={styles.container}>
       {/* i added this line to get the data from the firebase database */}
       {this.state.chats.map(chat => 
            <View key={chat.id}>
              <Text style = {{fontWeight: 'bold'}}>
                {chat.UserName}:
              </Text>
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
        }
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#ecf0f1',
  },
  input: {
    width: 200,
    height: 44,
    padding: 10,
    borderWidth: 1,
    borderColor: 'black',
    marginBottom: 10,
  },
});
