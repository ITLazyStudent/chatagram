import React, { Component } from 'react';
import { Alert, Button, TextInput, View, StyleSheet, ScrollView, Text, Image } from 'react-native';
import firebase from 'firebase'
import functions from 'firebase/functions';
import Chat from "./Chat.js"
import db from '../db'
import {uploadImageAsync} from '../ImageUtils'
import { ImagePicker, Permissions } from 'expo';

export default class App extends Component {
  state = {
    email: "",
      password: "",
      flag: false,
      username: "",
      name: "",
    message: "",
    chats: [],
    date: new Date(),
    image: null,
    avatar: null,
    imageEmail : null

  }
  users=[]
  async componentWillMount() {
    const prompt = await Permissions.askAsync(Permissions.CAMERA_ROLL)
    const result = await Permissions.getAsync(Permissions.CAMERA_ROLL)
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
    // db.collection("messages").orderBy("time")
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


    db.collection("image")
    .onSnapshot(querySnapshot => {
        let images = []
        querySnapshot.forEach(doc => {
          images.push({id: doc.id, ...doc.data()})
        });
        this.setState({ imageEmail: images[0].email })
        console.log("Current imageEmail : ", images[0].email)
    })
}
  create = async () => {
      const addMessage = firebase.functions().httpsCallable('addMessage');
      const result = await addMessage({message: this.state.message})
      this.setState({message: ""})
    // console.log("create clicked")
    // console.log("username", this.state.username)
    // if(this.state.name != "" || this.state.message != ""){
    //     db.collection("messages").add({
    //     username: this.state.username,
    //     message: this.state.message,
    //     time: new Date()
    //     })
    // }
    // this.setState({name: "", message: ""})
  }

  updateImage = async () => {
    await firebase.functions().httpsCallable('updateImage')();
}
  
  onLoginRegister = async () => {
    let avatar = "default.png"
    try {
      await firebase.auth().createUserWithEmailAndPassword(this.state.email, this.state.password)
      
    
    if(this.state.avatar){
       avatar = this.state.email 
      await uploadImageAsync("avatar", this.state.avatar, this.state.email)
    }
    let name = this.state.name || this.state.email
      await db.collection('users').doc(this.state.email).set({
      name: name,
      avatar:avatar,
      online: true
  })
    
    
    this.setState({flag: true})
    console.log("image thingy", result)
    } catch (error) {
      // Handle Errors here.
      var errorCode = error.code;
      console.log("catch1", errorCode)
      var errorMessage = error.message;
      // ...
      if (errorCode == "auth/email-already-in-use"){
        try{
          await firebase.auth().signInWithEmailAndPassword(this.state.email, this.state.password)
          
          if(this.state.avatar){
             avatar = this.state.email 
            await uploadImageAsync("avatar", this.state.avatar, this.state.email)
            await db.collection('users').doc(this.state.email).update({avatar:avatar})
          }
          await db.collection('users').doc(this.state.email).update({online: true})
          if(this.state.name){
            await db.collection('users').doc(this.state.email).update({name: this.state.name})
          }
          this.setState({flag: true})
          
          // let username = await firebase.auth().currentUser.email
          // await this.setState({flag: true, username: username})
          // console.log("print user", this.state.username)
          
         } catch(error){// Handle Errors here.
            var errorCode = error.code;
            var errorMessage = error.message;
            console.log("catch", errorCode)
            console.log("flag", this.state.flag)
            // ...
        }
          }
        }
      }

      pickAvatar = async () => {
        let result = await ImagePicker.launchImageLibraryAsync({
          allowsEditing: true,
          aspect: [4, 3],
        });
    
        console.log(result);
    
        if (!result.cancelled) {
          this.setState({ avatar: result.uri });
        }
      };

      pickImage = async () => {
        let result = await ImagePicker.launchImageLibraryAsync({
          allowsEditing: true,
          aspect: [4, 3],
        });
    
        console.log(result);
    
        if (!result.cancelled) {
          await uploadImageAsync("images",result.uri, this.state.email)
          console.log("image wala email", this.state.email)
          await db.collection('users').doc(this.state.email).update({caption: this.state.caption})
        }
      };

      avatarURL = ( email) => {
        return "avatar%2F" + this.users.find(u =>console.log("id",u.id)|| u.id === email).avatar.replace("@", "%40")
        // return"avatar%2F" + email.replace("@", "%40")
      }
      imageURL = (email) => {
        return  "images%2F" + email.replace("@", "%40")
      }

  render() {
    return (
      <ScrollView> 
        <View>
        {this.state.flag == false ? 
      <View>
        {
          this.state.image &&
          <Image style={{width:100, height: 100}} source={{uri: this.state.avatar}}/>
        }
        
          <TextInput
          autoCapitalize="none"
            value={this.state.email}
            onChangeText={(email) => this.setState({ email })}
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
           <TextInput
            value={this.state.name}
            onChangeText={(name) => this.setState({ name })}
            placeholder={'Name'}
            style={styles.input}
          />
          
          <Button
            title={'Login/Register'}
            style={styles.input}
            onPress={this.onLoginRegister}
          />
          <Button
            title={'Select Avatar'}
            style={styles.input}
            onPress={this.pickAvatar}
          />
          <TextInput
          autoCapitalize="none"
          value={this.state.caption}
            onChangeText={(caption) => this.setState({ caption })}
            placeholder={'Caption'}
            style={styles.input}
          />
           <Button
            title={'Upload new Image'}
            style={styles.input}
            onPress={this.pickImage}
          />
        </View>
        :
        <View>
                        
          <ScrollView>
            {this.state.imageEmail && 
            <View>
          <Image style={{width:400, height: 400}} source={{uri: `https://firebasestorage.googleapis.com/v0/b/chatapp-9b3de.appspot.com/o/${this.imageURL(this.state.imageEmail)}?alt=media&token=15b7e9e2-5fa8-4fcb-843c-ecf2254b0ea8`}}/>
          <Text> {this.users.find(u =>console.log("id",u.id)|| u.id === this.state.imageEmail).caption}</Text>
              </View>}
       {/* i added this line to get the data from the firebase database */}
       {this.state.chats.map(chat => 
            <View key={chat.id}>
            
              {/* <Text style = {{fontWeight: 'bold'}}>
                {chat.username}:
              </Text> */}
              <Image style={{width:25, height: 25}} source={{uri: `https://firebasestorage.googleapis.com/v0/b/chatapp-9b3de.appspot.com/o/${this.avatarURL(chat.username)}?alt=media&token=15b7e9e2-5fa8-4fcb-843c-ecf2254b0ea8`}}/>
                 <Text style={{fontWeight: 'bold', fontSize: 20}}> {this.users.find(u =>console.log("id",u.id)|| u.id === chat.username).name} </Text>
                 <Text>{chat.message}</Text>
              
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
      <Button onPress={(this.updateImage)} title="Change" style={{ width: 100, paddingTop: 20 }} />
      <Button onPress={(this.logout)} title="logout" style={{ width: 100, paddingTop: 20 }} />
      </ScrollView>
      </View>
      
        }
      </View> 
      </ScrollView>
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
