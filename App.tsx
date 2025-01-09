import React, { useEffect, useState } from "react";
import { StatusBar } from "expo-status-bar";
import { StyleSheet, View } from "react-native";
import {
  DrawerActions,
  NavigationContainer,
  useNavigation,
} from "@react-navigation/native";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import { createDrawerNavigator } from "@react-navigation/drawer";
import { Provider, useDispatch, useSelector } from "react-redux";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { Ionicons, MaterialCommunityIcons } from "@expo/vector-icons";
import AppLoading from "expo-app-loading";
import Toast from "react-native-toast-message";

import Colors from "./constants/colors";
import SettingsScreen from "./screens/SettingsScreen";
import LoginScreen from "./screens/LoginScreen";
import SignupScreen from "./screens/SignupScreen";
import MonthCalendarScreen from "./screens/Calendar/MonthCalendarScreen";
import WeekCalendarScreen from "./screens/Calendar/WeekCalendarScreen";
import ThreeDaysCalendarScreen from "./screens/Calendar/ThreeDaysCalendarScreen";
import DayCalendarScreen from "./screens/Calendar/DayCalendarScreen";
import AddEventScreen from "./screens/AddEvent";
import { AppDispatch, store } from "./store";
import { authenticate, AuthState, logout } from "./store/reducers/auth";
import IconButton from "./components/UI/IconButton";
import { setSettings } from "./store/reducers/settings";
import LoadingOverlay from "./components/UI/LoadingOverlay";
import { getAllSettings } from "./api/settings";
import { getAllEvents } from "./api/events";
import { getAllNotifications } from "./api/notifications";
import { setNotifications } from "./store/reducers/notifications";

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
        drawerActiveTintColor: Colors.secondary800,
        drawerContentContainerStyle: { marginTop: -28 },
        drawerType: "front",
        swipeEnabled: false,
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
        component={WeekCalendarScreen}
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
        component={ThreeDaysCalendarScreen}
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

  const dispatch: AppDispatch = useDispatch();
  // const { refreshToken, expiresIn } = useSelector(
  //   (state: { auth: AuthState }) => state.auth
  // );

  const [isFetching, setIsFetching] = useState(true);

  // useEffect(() => {
  //   if (refreshToken) {
  //     const expirationTime = +expiresIn * 1000; // Convert to milliseconds
  //     const timeout = expirationTime - 60000; // Refresh 1 minute before expiration

  //     const refreshTimeout = setTimeout(() => {
  //       dispatch(refreshAccessToken(refreshToken));
  //     }, timeout);

  //     return () => clearTimeout(refreshTimeout);
  //   }
  // }, [refreshToken, expiresIn, dispatch]);

  useEffect(() => {
    setIsFetching(true);

    const fetchData = async () => {
      try {
        const settings = await getAllSettings();
        dispatch(setSettings({ firstDay: settings.firstDay }));

        // const events = await getAllEvents();
        // dispatch(setEvents(events));

        // const notifications = await getAllNotifications();
        // dispatch(setNotifications({ notifications }));
      } catch (error) {
        // console.error("Error fetching data:", error);
      } finally {
        setIsFetching(false);
      }
    };

    fetchData();
  }, []);

  if (isFetching) {
    return <LoadingOverlay message="Loading application data..." />;
  }

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
        name="AddEvent"
        component={AddEventScreen}
        options={{
          title: "New Event",
          tabBarIcon: ({ color, size }) => (
            <Ionicons name="add-circle" color={color} size={size} />
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

  const dispatch: AppDispatch = useDispatch();

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
          <Toast />
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
