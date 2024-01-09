import { View, Text, Button, StyleSheet } from "react-native"

//context
import { useClicks, useAutoClicks } from "../contexts/ClickContext";
import { usePointsState, useSetPointState } from "../contexts/PointsContext";
import { useEffect } from "react";


const Click = ({navigation}) => {

    const clickMultiplier = useClicks()
    const autoClickMultiplier = useAutoClicks()

    const points = usePointsState()
    const setPoints = useSetPointState()

    useEffect(() => {
        const interval = setInterval(() => {
            setPoints(points + (1 * autoClickMultiplier))
        }, 1000);

        return () => clearInterval(interval)
    })

    function updateClicks() {
        setPoints(points + (1 * clickMultiplier))
    }

    return (
        <View style={styles.container}>
        <Button 
          title='click me'
          onPress={updateClicks}
        />
        <Text>You have {points} points</Text>
        
        <Text></Text>
        

        <Text></Text>
        <Button 
          title='Go to upgrades'
          onPress={() => navigation.navigate('Upgrades')}

        />
    
       
    </View>
    )
}

export default Click;

const styles = StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: '#fff',
      alignItems: 'center',
      justifyContent: 'center',
    },
});