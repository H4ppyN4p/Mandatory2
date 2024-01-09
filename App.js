import { NavigationContainer } from "@react-navigation/native";
import { createNativeStackNavigator } from "@react-navigation/native-stack";

//Contexts
import { ClickContextProvider } from "./contexts/ClickContext";
import { PointsContextProvider } from "./contexts/PointsContext";
import { UpgradeContextProvider } from "./contexts/UpgradeContext";

//Components 
import LandingPage from "./components/LandingPage";
import Click from "./components/Click";
import Upgrades from "./components/Upgrades";
const App = () => {

  const Stack = createNativeStackNavigator()

  return (
    <ClickContextProvider>
      <PointsContextProvider>
        <UpgradeContextProvider>

        <NavigationContainer>
          <Stack.Navigator initialRouteName="LandingPage">

            <Stack.Screen name="LandingPage" component={LandingPage} />
            <Stack.Screen name="Clicks" component={Click} />
            <Stack.Screen name="Upgrades" component={Upgrades} />

          </Stack.Navigator>

        </NavigationContainer>

        </UpgradeContextProvider>
      </PointsContextProvider>
    </ClickContextProvider>

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