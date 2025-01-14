import { useEffect, useLayoutEffect, useState } from "react";
import { View, Text, StyleSheet, Alert } from "react-native";
import { useDispatch, useSelector } from "react-redux";

import EventForm from "../components/Events/EventForm";
import { Event, EventsState, removeEvent } from "../store/reducers/events";
import IconButton from "../components/UI/IconButton";
import { deleteEvent } from "../api/events";

const AddEventScreen = ({ navigation, route }: any) => {
  const dispatch = useDispatch();
  const { events } = useSelector(
    (state: { events: EventsState }) => state.events
  );

  const [selectedEvent, setSelectedEvent] = useState<Event>();

  useLayoutEffect(() => {
    navigation.getParent().setOptions({
      headerRight: () => null,
    });
  }, [navigation]);

  useEffect(() => {
    const eventId = route.params?.eventId;
    if (!eventId) {
      navigation.getParent().setOptions({
        title: "New Event",
      });
      return;
    }

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
  }, [navigation, route]);

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

  return (
    <View style={styles.container}>
      <Text style={styles.title}>
        {route.params?.eventId ? "Update event" : "Add event"}
      </Text>
      <EventForm selectedEvent={selectedEvent} />
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
});
