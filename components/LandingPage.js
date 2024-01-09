import { View, Text, Button, TextInput, StyleSheet, FlatList, ScrollView, Platform } from "react-native"
import { useState, useEffect } from "react"
//import  ReactNativeAsyncStorage from "@react-native-async-storage/async-storage"

//Firebase imports
import { app, database } from "../firebase"
import { getAuth, signInWithEmailAndPassword, createUserWithEmailAndPassword,  signOut, onAuthStateChanged} from "firebase/auth"
import { initializeAuth, getReactNativePersistence } from 'firebase/auth';
import { collection, addDoc } from "firebase/firestore"
import { useCollection } from "react-firebase-hooks/firestore"


import ReactNativeAsyncStorage from '@react-native-async-storage/async-storage';



//login save between session not working; see https://github.com/firebase/firebase-js-sdk/issues/7584
//modified the node module at @firebase/auth/package.json - then the line:
//"typings": "dist/auth.d.ts"
//Was replaced with:
//"typings": "/dist/rn/index.rn.d.ts"
let auth 

if(Platform.OS === 'web'){
    getAuth(app)
} else {
    auth = initializeAuth(app, {
        persistence: getReactNativePersistence(ReactNativeAsyncStorage)
    })
}


const LandingPage = ({navigation}) => {
    


    const [enteredLoginEmail, setEnteredLoginEmail] = useState('someEmail@mail.com')
    const [enteredLoginPassword, setEnteredLoginPassWord] = useState('password')

    const [enteredSignupEmail, setEntereredSignupEmail] = useState('someEmail@email.com')
    const [enteredSignupPassword, setEnteredSignupPassWord] = useState('')

    const [userId, setUserId] = useState(null)

    useEffect(() => {
        const auth_ = getAuth()
        const unsubscribe = onAuthStateChanged(auth_, (currentUser) => {
            if(currentUser){
                setUserId(currentUser.uid)
            } else {
                setUserId(null)
            }
        })
        return () => unsubscribe
    }, [])
   

    async function userLogin(){
        try{
            const userCredential = await signInWithEmailAndPassword(auth, enteredLoginEmail, enteredLoginPassword)
            console.log('logged in ' + userCredential.user.uid)
        } catch(err) {
            console.log('there was an error with login: ' + err)
        }
    }

    async function userLogout(){
        await signOut(auth)
    }

    async function userSignup(){
        try{
            const userCredential = await createUserWithEmailAndPassword(auth, enteredSignupEmail, enteredSignupPassword)
            console.log('oprettet ny bruger: ' + userCredential.user.uid)
            try{
                await addDoc(collection(database, userCredential.user.uid), {
                    autoClickMultiplierVal: 1,
                    autoClickCostVal: 30,
                    clickMultiplierVal: 1,
                    clickerCostVal: 5,
                    pointsVal: 1
                })
                console.log("new game created")
            } catch (err){
                console.log('fejl i DB ' + err)
            }

        } catch(err) {
            console.log('there was an error with signup: ' + err)
        }
    }

     function logUserID(){
        console.log(userId)
    }
    

    return(
        <ScrollView>
            <View style={styles}>

                <Text>This is the landing page</Text>

                <Text></Text>
                <Text></Text>

                { !userId &&
                    <>
                <Text>Sign up</Text>
                <TextInput style={styles.TextInput} onChangeText={(text) => setEntereredSignupEmail(text)} value={enteredSignupEmail}/>
                <TextInput style={styles.TextInput} onChangeText={(pass) => setEnteredSignupPassWord(pass)} value={enteredSignupPassword}/>
                <Button 
                    title='Sign up'
                    onPress={userSignup}
                />

                <Text></Text>

                <Text>Log In</Text>
                <TextInput style={styles.TextInput} onChangeText={(text) => setEnteredLoginEmail(text)} value={enteredLoginEmail}/>
                <TextInput style={styles.TextInput} onChangeText={(pass) => setEnteredLoginPassWord(pass)} value={enteredLoginPassword}/>
                <Button 
                    title='Log in'
                    onPress={userLogin}
                />

                <Text></Text>     
                </>}
                { userId && <>
                <Button 
                    title='Go to clicks'
                    onPress={() => navigation.navigate('Clicks')}
                />

                <Text></Text>

                <Button 
                    title='Go to upgrades'
                    onPress={() => navigation.navigate('Clicks')}

                />

                <Text></Text>

                <Button 
                    title="Sign out"
                    onPress={userLogout}
                />

                <Text></Text>

                <Button
                    title="log current user ID"
                    onPress={logUserID}
                />
                </>}
            
        </View>
    </ScrollView>
    )
}

export default LandingPage

const styles = StyleSheet.create({
    TextInput: {
        backgroundColor: 'white',
        borderStyle: 'solid',
        borderColor: 'grey',
        borderWidth: 1,
        borderRadius: 5
    },
  });
  

//Code for creating new safe files... saved here for future development

//These are imports 
 /*
    import { LogBox } from 'react-native';





 */

//This part needs to be with the other hooks to not get error message
    /*  


        useEffect(() => {
            LogBox.ignoreLogs(['VirtualizedLists should never be nested']);
        }, [])
        

        const [text, setText] = useState('')
        const [notes, setNotes] = useState([])

        const [values, loading, error] = useCollection(collection(database, 'clickery'))
        const data = values?.docs.map((doc) => ({...doc.data(), id: doc.id}))


        async function addGame(){
        try{
            await addDoc(collection(database, 'clickery'), {
                gameName: text,
                autoClickMultiplierVal: 1,
                autoClickCostVal: 30,
                clickMultiplierVal: 1,
                clickerCostVal: 5,
                pointsVal: 1
            })
        } catch (err){
            console.log('fejl i DB ' + err)
        }
    }
    /*

//This part needs to be in the view
    /*
      <Text>Create new save with name (choose belov):</Text>
        <TextInput style={styles.TextInput} onChangeText={(text) => setText(text)}/>
        <Button 
            title="Create new game"
            onPress={addGame}
        />
        <Text></Text>
        <FlatList
            data={data}
            renderItem={(note) => 
                <View>
                    <Text>Load this game: {note.item.id}</Text>
                </View>
        }
        />
  */