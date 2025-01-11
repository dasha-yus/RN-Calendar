import { useEffect, useLayoutEffect, useState } from "react";
import { View, Text, StyleSheet } from "react-native";
import { useSelector } from "react-redux";

import EventForm from "../components/Events/EventForm";
import { Event, EventsState } from "../store/reducers/events";

const AddEventScreen = ({ navigation, route }: any) => {
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
    });
  }, [navigation, route]);

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
