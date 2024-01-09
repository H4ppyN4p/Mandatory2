import {createContext, useContext, useState } from "react";
import { getAuth, onAuthStateChanged } from "firebase/auth";

//Firebase
import { app, database } from "../firebase";
import { useCollection } from "react-firebase-hooks/firestore";
import { collection, doc } from "firebase/firestore";

//Create the context
const pointsState = createContext()
//export the context
export function usePointsState(){
    return useContext(pointsState)
}


const setPointsState = createContext()
export function useSetPointState(){
    return useContext(setPointsState)
}


export function PointsContextProvider ({children}) {

    const auth = getAuth();
    onAuthStateChanged(auth, (user) => {
        if (user) {
            setUserId(user.uid)
        } else 
        {
            console.log('not logged in')
        }
    })  

    const [userId, setUserId] = useState('notEmpty')

    const [values, loading, error] = useCollection(collection(database, userId))
    const data = values?.docs.map((doc) => ({...doc.data(), id: doc.id}))

    const [hasRunFunction, setHasRunFunction] = useState(false)
    const [points, setPoints] = useState(1)


    function setValueFunc(){
        try{
            setPoints(data[0].pointsVal)
            console.log('it worked - points?')
        } catch (e) {
            console.log('didnt work - points')
        }
        setHasRunFunction(true)
    }

    if (hasRunFunction){

    } else {
        setTimeout(() => {
            setValueFunc()
        }, 2000)
    }



    return (
        <pointsState.Provider value={points}>
            <setPointsState.Provider value={setPoints}>
                {children}
            </setPointsState.Provider>
        </pointsState.Provider>
    )
}