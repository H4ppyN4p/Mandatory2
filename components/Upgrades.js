import { View, Text, Button } from "react-native"


const Upgrades = ({navigation}) => {

    return (
        <View>
            <Text>This is the Upgrades section</Text>
            <Button 
            title='Go to clicks'
            onPress={() => navigation.navigate('Clicks')}

            />
        </View>
    )
}

export default Upgrades;