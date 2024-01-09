import { View, Text, Button } from "react-native"


const Clicks = ({navigation}) => {

    return (
        <View>
            <Text>This is the Clicks section</Text>
            <Button 
            title='Go to upgrades'
            onPress={() => navigation.navigate('Upgrades')}

            />
        </View>
    )
}

export default Clicks;