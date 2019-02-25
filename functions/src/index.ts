// this for sure
import * as functions from 'firebase-functions';
// this for the database access
import * as admin from 'firebase-admin'
// import fetch from 'node-fetch'

//this functuin run on my server and have access to my config information
admin.initializeApp(functions.config().firebase)

// // Start writing Firebase Functions
// // https://firebase.google.com/docs/functions/typescript
//

export const onWriteUsers = functions.firestore
    .document('users/{id}')
    .onWrite(async (change, context) => {
        // Get an object with the current document value.
        // If the document does not exist, it has been deleted.
        const user = change.after.exists ? change.after.data() : null;
  
        // Get an object with the previous document value (for update or delete)
        const oldUser = change.before.data();
  
        console.log("user = ", user)
        console.log("old user = ", oldUser)
        // perform desired operations ...
        // choices are logged in and loged out and just registered
        let message = null
        if(!oldUser || user.status && !oldUser.status){
            message = "Hi"
        }else if (oldUser.online && !user.online){
            message = "Bye"
        }if(message){
             await admin.firestore().collection("messages").add({ username: "Bot.png", message: message + " " + user.name + "!" , time: new Date() })
            }
    });
export const addMessage = functions.https.onCall(async (data, context) => {
    const  message = data.message
    // the ! mark means that we know better and this cannot be null means ignore ur error and do what i say
    const email = context.auth!.token.email || null;
    console.log("Success!!!")
    if(message == "!hi"){
             await admin.firestore().collection("messages").add({
                username: "admin@admin.com",
                message: "hi to " + email,
                time: new Date()
                })
        }else if (message === "!users"){
            const querySnapshot = await admin.firestore().collection("messages").get()
            let users = new Array()
            let name = ""
            querySnapshot.forEach(doc => {
                const username = doc.data().username
                if (!users.includes(username)){
                    name = name + doc.data().username + "\n"
                    users.push(doc.data().username)
                } 
            })
            return await admin.firestore().collection("messages").add({
                username: "admin@admin.com",
                message: name,
                time: new Date()
                })
        }else if (message == "!help"){
            return await admin.firestore().collection("messages").add({
                username: email,
                message: "!hi \n !users(shows all users)\n !help(shows all the commands)\n !weather(shows the weather)",
                time: new Date()
                })
        }
//         else if (message.contains("!weather")){

//            const json =  await fetch('https://api.openweathermap.org/data/2.5/weather?q=Doha,qatar&appid=47034ddf236c641d6b7d63d2837e0ea0')
//                 .then(res => res.json())
//                 .then(json => console.log(json));

//         return await admin.firestore().collection("messages").add({
//             username: email,
//             message: message,
//             time: new Date()
//             })          
// }
return await admin.firestore().collection("messages").add({
    username: email,
    message: message,
    time: new Date()
    })
})


// this funtion will update image after sometime
export const updateImage = functions.https.onRequest(async (req, res) => {
    // find all the images(user with captions)
    const querySnapshot = await admin.firestore().collection("users").where("caption", ">", "").get()
    const users = new Array()
    querySnapshot.forEach(doc => {
            users.push(doc.id)        
    })
    console.log("number of emails", users.length)

    // pick one at random
    const randomEmail = users[Math.floor(Math.random() * users.length)];
    console.log("random email", randomEmail)

    //change user document in image collection
    await admin.firestore().collection("image").doc("user").update({
        email: randomEmail,
        when: new Date()
        })
    res.status(200).send();
})
