import { View, Text, StyleSheet } from "react-native";

import EventForm from "../components/Events/EventForm";

const AddEventScreen = () => {
  return (
    <View style={styles.container}>
      <Text style={styles.title}>Add event</Text>
      <EventForm />
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
