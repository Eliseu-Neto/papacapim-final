import { NavigationContainer } from "@react-navigation/native";
import Routes from "./src/routes/Route";
import AuthProvider from "./src/context/AuthProvider";


export default function App() {
  return (
    <NavigationContainer>

      <AuthProvider>
        <Routes />
      </AuthProvider>
    </NavigationContainer>
  );
}
