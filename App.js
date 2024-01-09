import { NavigationContainer } from "@react-navigation/native";
import { createNativeStackNavigator } from "@react-navigation/native-stack";

//Components 
import LandingPage from "./components/LandingPage";
import Clicks from "./components/Click";
import Upgrades from "./components/Upgrades";
const App = () => {

  const Stack = createNativeStackNavigator()

  return (

    <NavigationContainer>
      <Stack.Navigator initialRouteName="LandingPage">

        <Stack.Screen name="LandingPage" component={LandingPage} />
        <Stack.Screen name="Clicks" component={Clicks} />
        <Stack.Screen name="Upgrades" component={Upgrades} />

      </Stack.Navigator>

    </NavigationContainer>

  
  );
}

export default App;

/*

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
  },
});

*/