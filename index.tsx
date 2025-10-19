import { registerRootComponent } from "expo";
import App from "./src/App";
import { ThemeProvider } from "./src/themes";

export default function Root() {
  return (
    <ThemeProvider>
      <App />
    </ThemeProvider>
  );
}

// registerRootComponent calls AppRegistry.registerComponent('main', () => App);
// It also ensures that whether you load the app in Expo Go or in a native build,
// the environment is set up appropriately
registerRootComponent(Root);
