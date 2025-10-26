import { registerRootComponent } from "expo";
import { GestureHandlerRootView } from "react-native-gesture-handler";
import App from "./src/App";
import { ThemeProvider } from "./src/themes";
import { SafeAreaProvider } from "react-native-safe-area-context";

export default function Root() {
  return (
    <SafeAreaProvider>
      <GestureHandlerRootView>
        <ThemeProvider>
          <App />
        </ThemeProvider>
      </GestureHandlerRootView>
    </SafeAreaProvider>
  );
}

// registerRootComponent calls AppRegistry.registerComponent('main', () => App);
// It also ensures that whether you load the app in Expo Go or in a native build,
// the environment is set up appropriately
registerRootComponent(Root);
