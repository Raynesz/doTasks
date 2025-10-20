import { registerRootComponent } from "expo";
import App from "./src/App";
import { ThemeProvider } from "./src/themes";
import { SafeAreaProvider } from "react-native-safe-area-context";

export default function Root() {
  return (
    <SafeAreaProvider>
      <ThemeProvider>
        <App />
      </ThemeProvider>
    </SafeAreaProvider>
  );
}

// registerRootComponent calls AppRegistry.registerComponent('main', () => App);
// It also ensures that whether you load the app in Expo Go or in a native build,
// the environment is set up appropriately
registerRootComponent(Root);
