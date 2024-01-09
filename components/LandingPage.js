import { View, Text, Button, TextInput, StyleSheet, FlatList, ScrollView, Platform } from "react-native"
import { useState, useEffect } from "react"
//import  ReactNativeAsyncStorage from "@react-native-async-storage/async-storage"

//Firebase imports
import { app, database, } from "../firebase"
import { getAuth, signInWithEmailAndPassword, createUserWithEmailAndPassword,  signOut, onAuthStateChanged} from "firebase/auth"
import { initializeAuth, getReactNativePersistence } from 'firebase/auth';
import { collection, addDoc, setDoc, getDoc, doc, updateDoc } from "firebase/firestore"

//Contexts
import { useClicks, useAutoClicks } from "../contexts/ClickContext";
import { clickerCostState, autoClickerCostState } from "../contexts/UpgradeContext";
import { usePointsState } from "../contexts/PointsContext";

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

    const points = usePointsState()
    const clickValue = useClicks()
    const autoClickValue = useAutoClicks()
    const clickUpgradeCost = clickerCostState()
    const autoClickerUpgradeCost = autoClickerCostState()
    

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

            //checks that it's been logged in
            console.log('oprettet ny bruger: ' + userCredential.user.uid)

            //Create a new game
            try{
                await setDoc(doc(database, userCredential.user.uid,  'GAME'), {
                    autoClickMultiplierVal: 1,
                    autoClickerCostVal: 30,
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
    
    async function getCurrentDoc(){

        console.log(autoClickerUpgradeCost)
        const docRef = doc(database, userId, 'GAME');
        const docSnap = await getDoc(docRef)

        if (docSnap.exists()) {
            console.log('Document data: ', docSnap.data());
        } else {
            console.log('no such doc')
        }
    }

    function saveGameState(){
        updateDoc(doc(database, userId, 'GAME'), {
            autoClickMultiplierVal: autoClickValue,
            autoClickerCostVal: autoClickerUpgradeCost,
            clickMultiplierVal: clickValue,
            clickerCostVal: clickUpgradeCost,
            pointsVal: points
        })
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
                <Text>You currently have {points} points</Text>
                
                <Text>Each click currently generates {clickValue} points</Text>
                <Text>It currently cost {clickUpgradeCost} points to upgrade the click</Text>

                <Text>Each auto-click currently generates {autoClickValue} points</Text>
                <Text>It currently cost {autoClickerUpgradeCost} points to upgrade the auto-click</Text>

                <Button 
                title="Save game"
                onPress={saveGameState}
                />
                <Text></Text>

                <Button 
                    title='Go to clicks'
                    onPress={() => navigation.navigate('Clicks')}
                />

                
                
                <Text></Text>

                <Button 
                    title="Sign out"
                    onPress={userLogout}
                />

                

                <Text></Text>

                <Button 
                    title="Get current doc"
                    onPress={getCurrentDoc}
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
    import { useCollection } from "react-firebase-hooks/firestore"
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