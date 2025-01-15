import { useEffect, useLayoutEffect, useState } from "react";
import { View, Text, StyleSheet, Alert } from "react-native";
import { useDispatch, useSelector } from "react-redux";
import DropDownPicker from "react-native-dropdown-picker";

import EventForm from "../components/Events/EventForm";
import { Event, EventsState, removeEvent } from "../store/reducers/events";
import IconButton from "../components/UI/IconButton";
import { deleteEvent } from "../api/events";
import NotificationForm from "../components/Notifications/NotificationForm";
import {
  Notification,
  NotificationsState,
  removeNotification,
} from "../store/reducers/notifications";
import { deleteNotification } from "../api/notifications";

const AddEventScreen = ({ navigation, route }: any) => {
  const dispatch = useDispatch();
  const { events } = useSelector(
    (state: { events: EventsState }) => state.events
  );
  const { notifications } = useSelector(
    (state: { notifications: NotificationsState }) => state.notifications
  );

  const [open, setOpen] = useState(false);
  const [type, setType] = useState("event");
  const [types, setTypes] = useState([
    { label: "Event", value: "event" },
    { label: "Notification", value: "notification" },
  ]);
  const [selectedEvent, setSelectedEvent] = useState<Event>();
  const [selectedNotification, setSelectedNotification] =
    useState<Notification>();

  useLayoutEffect(() => {
    navigation.getParent().setOptions({
      headerRight: () => null,
    });
  }, [navigation]);

  useEffect(() => {
    const eventId = route.params?.eventId;
    const notificationId = route.params?.notificationId;

    if (!eventId && !notificationId) {
      navigation.getParent().setOptions({
        title: type === "event" ? "New Event" : "New Notification",
      });
      return;
    }

    if (eventId) {
      const event = events.find((e) => e.id === eventId);
      setSelectedEvent(event);

      navigation.getParent().setOptions({
        title: `Update event '${event?.title}'`,
        headerRight: ({ tintColor }: any) => (
          <IconButton
            icon="trash"
            color={tintColor}
            onPress={removeEventHandler}
            style={{ paddingRight: 16, marginTop: 3 }}
          />
        ),
      });
    }

    if (notificationId) {
      const notification = notifications.find((n) => n.id === notificationId);
      setSelectedNotification(notification);
      setType("notification");

      navigation.getParent().setOptions({
        title: "Update notification",
        headerRight: ({ tintColor }: any) => (
          <IconButton
            icon="trash"
            color={tintColor}
            onPress={removeNotificationHandler}
            style={{ paddingRight: 16, marginTop: 3 }}
          />
        ),
      });
    }
  }, [navigation, route, type]);

  const removeEventHandler = () => {
    Alert.alert(
      "Delete event",
      "Are you sure you want to delete event?",
      [
        {
          text: "Cancel",
          style: "cancel",
        },
        {
          text: "Confirm",
          onPress: async () => {
            try {
              const eventId = route.params?.eventId;
              await deleteEvent(eventId);
              dispatch(removeEvent({ id: eventId }));
              navigation.navigate("Calendar");
            } catch (error) {}
          },
        },
      ],
      { cancelable: false }
    );
  };

  const removeNotificationHandler = () => {
    Alert.alert(
      "Delete notification",
      "Are you sure you want to delete notification?",
      [
        {
          text: "Cancel",
          style: "cancel",
        },
        {
          text: "Confirm",
          onPress: async () => {
            try {
              const notificationId = route.params?.notificationId;
              await deleteNotification(notificationId);
              dispatch(removeNotification({ id: notificationId }));
              navigation.navigate("Calendar");
            } catch (error) {}
          },
        },
      ],
      { cancelable: false }
    );
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>
        {route.params?.eventId
          ? "Update event"
          : route.params?.notificationId
          ? "Update notification"
          : type === "event"
          ? "Add event"
          : "Add notification"}
      </Text>
      <View style={styles.type}>
        <Text style={styles.label}>Type</Text>
        <DropDownPicker
          open={open}
          value={type}
          items={types}
          setOpen={setOpen}
          setValue={setType}
          setItems={setTypes}
        />
      </View>
      {type === "event" ? (
        <EventForm selectedEvent={selectedEvent} />
      ) : (
        <NotificationForm selectedNotification={selectedNotification} />
      )}
    </View>
  );
};

export default AddEventScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
    padding: 16,
  },
  title: {
    fontWeight: "bold",
    fontSize: 20,
    textAlign: "center",
    marginBottom: 24,
  },
  type: {
    marginBottom: 20,
  },
  label: {
    marginBottom: 10,
    fontSize: 18,
    fontWeight: 500,
  },
});
