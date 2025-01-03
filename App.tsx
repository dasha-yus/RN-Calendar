import React, { useEffect, useState } from "react";
import { StatusBar } from "expo-status-bar";
import { StyleSheet, View } from "react-native";
import { DrawerActions, NavigationContainer, useNavigation } from "@react-navigation/native";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import { createDrawerNavigator } from "@react-navigation/drawer";
import { Provider, useDispatch, useSelector } from "react-redux";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { Ionicons, MaterialCommunityIcons } from "@expo/vector-icons";
import AppLoading from "expo-app-loading";

import Colors from "./constants/colors";
import SettingsScreen from "./screens/SettingsScreen";
import LoginScreen from "./screens/LoginScreen";
import SignupScreen from "./screens/SignupScreen";
import MonthCalendarScreen from "./screens/Calendar/MonthCalendarScreen";
import DayCalendarScreen from "./screens/Calendar/DayCalendarScreen";
import { store } from "./store";
import {
  authenticate,
  AuthState,
  logout,
  refreshAccessToken,
} from "./store/reducers/auth";
import IconButton from "./components/UI/IconButton";

const BottomTab = createBottomTabNavigator();
const Stack = createNativeStackNavigator();
const Drawer = createDrawerNavigator();

function AuthStack() {
  return (
    <Stack.Navigator
      screenOptions={{
        headerShown: false,
      }}
    >
      <Stack.Screen name="Login" component={LoginScreen} />
      <Stack.Screen name="Signup" component={SignupScreen} />
    </Stack.Navigator>
  );
}

function CalendarDrawer() {
  return (
    <Drawer.Navigator
      screenOptions={{
        headerShown: false,
      }}
    >
      <Drawer.Screen
        name="Month"
        component={MonthCalendarScreen}
        options={{
          title: "Month",
          drawerIcon: ({ color, size }) => (
            <MaterialCommunityIcons
              name="calendar-month"
              color={color}
              size={size}
            />
          ),
        }}
      />
      <Drawer.Screen
        name="Week"
        component={MonthCalendarScreen}
        options={{
          title: "Week",
          drawerIcon: ({ color, size }) => (
            <MaterialCommunityIcons
              name="calendar-week"
              color={color}
              size={size}
            />
          ),
        }}
      />
      <Drawer.Screen
        name="ThreeDays"
        component={MonthCalendarScreen}
        options={{
          title: "3 days",
          drawerIcon: ({ color, size }) => (
            <MaterialCommunityIcons
              name="calendar-range"
              color={color}
              size={size}
            />
          ),
        }}
      />
      <Drawer.Screen
        name="Day"
        component={DayCalendarScreen}
        options={{
          title: "Day",
          drawerIcon: ({ color, size }) => (
            <MaterialCommunityIcons name="calendar" color={color} size={size} />
          ),
        }}
      />
    </Drawer.Navigator>
  );
}

function AuthenticatedStack() {
  const navigation = useNavigation<any>();
  const dispatch: any = useDispatch();
  const { refreshToken, expiresIn } = useSelector(
    (state: { auth: AuthState }) => state.auth
  );

  useEffect(() => {
    if (refreshToken) {
      const expirationTime = +expiresIn * 1000; // Convert to milliseconds
      const timeout = expirationTime - 60000; // Refresh 1 minute before expiration

      const refreshTimeout = setTimeout(() => {
        dispatch(refreshAccessToken(refreshToken));
      }, timeout);

      return () => clearTimeout(refreshTimeout);
    }
  }, [refreshToken, expiresIn, dispatch]);

  return (
    <BottomTab.Navigator
      screenOptions={{
        headerStyle: { backgroundColor: Colors.primary },
        headerTintColor: "white",
        tabBarActiveTintColor: Colors.primary,
        headerRight: ({ tintColor }) => (
          <IconButton
            icon="exit-outline"
            color={tintColor}
            onPress={() => dispatch(logout())}
            style={{ paddingRight: 16 }}
          />
        ),
      }}
    >
      <BottomTab.Screen
        name="Calendar"
        component={CalendarDrawer}
        options={{
          tabBarIcon: ({ color, size }) => (
            <Ionicons name="calendar" color={color} size={size} />
          ),
          headerLeft: ({ tintColor }) => (
            <IconButton
              icon="menu"
              color={tintColor}
              onPress={() => navigation.dispatch(DrawerActions.toggleDrawer())}
              style={{ paddingLeft: 16, marginRight: 10, marginTop: 3 }}
            />
          ),
        }}
      />
      <BottomTab.Screen
        name="Settings"
        component={SettingsScreen}
        options={{
          tabBarIcon: ({ color, size }) => (
            <Ionicons name="settings" color={color} size={size} />
          ),
        }}
      />
    </BottomTab.Navigator>
  );
}

function Navigation() {
  const isAuthenticated = useSelector(
    (state: { auth: AuthState }) => state.auth.isAuthenticated
  );

  return (
    <NavigationContainer>
      {isAuthenticated ? <AuthenticatedStack /> : <AuthStack />}
    </NavigationContainer>
  );
}

function Root() {
  const [isTryingLogin, setIsTryingLogin] = useState(true);

  const dispatch = useDispatch();

  useEffect(() => {
    async function fetchToken() {
      const storedToken = await AsyncStorage.getItem("token");
      const storedRefreshToken = await AsyncStorage.getItem("refreshToken");
      const expiresIn = await AsyncStorage.getItem("expiresIn");

      if (storedToken) {
        dispatch(
          authenticate({
            token: storedToken,
            refreshToken: storedRefreshToken || "",
            expiresIn: expiresIn || "",
          })
        );
      }

      setIsTryingLogin(false);
    }

    fetchToken();
  }, []);

  if (isTryingLogin) {
    return <AppLoading />;
  }

  return <Navigation />;
}

export default function App() {
  return (
    <>
      <StatusBar style="light" />
      <Provider store={store}>
        <View style={styles.container}>
          <Root />
        </View>
      </Provider>
    </>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
});
