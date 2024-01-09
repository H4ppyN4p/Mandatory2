import { collection } from "firebase/firestore";
import { createContext, useContext, useEffect, useState } from "react";
import { useCollection } from "react-firebase-hooks/firestore";
import { app, database } from "../firebase";
import { getAuth, onAuthStateChanged } from "firebase/auth";

//firebase




const OnClickContext = createContext()
export function useClicks() {
    return useContext(OnClickContext)
}

const UpdateOnClickContext = createContext()
export function useClicksUpdate() {
    return useContext(UpdateOnClickContext)
}

const OnAutoClickContext = createContext()
export function useAutoClicks() {
    return useContext(OnAutoClickContext)
}

const UpdateOnAutoClickContext = createContext()
export function useAutoClicksUpdate() {
    return useContext(UpdateOnAutoClickContext)
}



export function ClickContextProvider ({children}) {


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

    //run this only when the userId changes and works
    const [valus, loading, error] = useCollection(collection(database, userId))
    const data = valus?.docs.map((doc) => ({...doc.data(), id: doc.id}))
   
    const [hasRunFunction, setHasRunFunction] = useState(false)

    const [clickMultiplier, setClickMultiplier] = useState(1)
    const [autoClickMultiplier, setAutoClickMultiplier] = useState(1)

    function setValueFunc(){
        try{
            setClickMultiplier(data[0].clickMultiplierVal)
            setAutoClickMultiplier(data[0].autoClickMultiplierVal)
            console.log('it worked? - clicks')
        } catch (e) {
            console.log('didnt work - clicks')
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
            <OnClickContext.Provider value={clickMultiplier}>
                <UpdateOnClickContext.Provider value={setClickMultiplier} >
                    <OnAutoClickContext.Provider value={autoClickMultiplier}>
                        <UpdateOnAutoClickContext.Provider value={setAutoClickMultiplier}>
                            {children}
                        </UpdateOnAutoClickContext.Provider>
                    </OnAutoClickContext.Provider>
                </UpdateOnClickContext.Provider>
            </OnClickContext.Provider>
    )
}
