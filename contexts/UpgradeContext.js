import { useState, useContext, createContext } from "react";
import { getAuth, onAuthStateChanged } from "firebase/auth";

//Firebase
import { app, database } from "../firebase";
import { useCollection } from "react-firebase-hooks/firestore";
import { collection, doc } from "firebase/firestore";

const ClickerUpgradeCostState = createContext()
export function clickerCostState(){
    return useContext(ClickerUpgradeCostState)
}

const ClickerSetUpgradeCostState = createContext()
export function clickerSetCostState(){
    return useContext(ClickerSetUpgradeCostState)
}

const AutoClickerUpgradeCostState = createContext()
export function autoClickerCostState(){
    return useContext(AutoClickerUpgradeCostState)
}



const AutoClickerSetUpgradeCostState = createContext()
export function autoClickerSetCostState(){
    return useContext(AutoClickerSetUpgradeCostState)
}



export function UpgradeContextProvider({children}){

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
    
    const [clickerCost, setClickerCost] = useState(5)
    const [autoClickerCost, setAutoClickerCost] = useState(30)

    function setValueFunc(){
        try{
            setClickerCost(data[0].clickerCostVal)
            setAutoClickerCost(data[0].autoClickerCostVal)
            console.log('it worked? - costs')
            console.log('clicker upgrade cost: ' + data[0].clickerCostVal)
            console.log('auto clicker upgrade cost: ' + data[0].autoClickCostVal)
        } catch (e) {
            console.log('didnt work - costs')
        }
        setHasRunFunction(true)
    }

    if (hasRunFunction){

    } else {
        setTimeout(() => {
            setValueFunc()
        }, 2000)
    }


    return(
        <ClickerUpgradeCostState.Provider value={clickerCost}>
            <ClickerSetUpgradeCostState.Provider value={setClickerCost}>

                <AutoClickerUpgradeCostState.Provider value={autoClickerCost}>
                    <AutoClickerSetUpgradeCostState.Provider value={setAutoClickerCost}>
                        {children}
                    </AutoClickerSetUpgradeCostState.Provider>
                </AutoClickerUpgradeCostState.Provider>

            </ClickerSetUpgradeCostState.Provider>
        </ClickerUpgradeCostState.Provider>
    )
}