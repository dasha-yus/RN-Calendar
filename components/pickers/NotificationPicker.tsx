import { Modal, View, Text, StyleSheet, Pressable, Button } from "react-native";

import Colors from "../../constants/colors";
import { formatMinutes } from "../../utils/general";

export const notificationOptions = [
  { label: formatMinutes(5), value: 5 },
  { label: formatMinutes(10), value: 10 },
  { label: formatMinutes(15), value: 15 },
  { label: formatMinutes(30), value: 30 },
  { label: formatMinutes(60), value: 60 },
  { label: formatMinutes(60 * 24), value: 60 * 24 },
];

interface NotificationPickerProps {
  modalVisible: boolean;
  selectedNotifications: number[];
  onNotificationPicked: (notification: number) => void;
  onClose: () => void;
}

const NotificationPicker = ({
  modalVisible,
  selectedNotifications,
  onNotificationPicked,
  onClose,
}: NotificationPickerProps) => {
  const onNotificationSelected = (notification: number) => {
    onNotificationPicked(notification);
    onClose();
  };

  return (
    <Modal
      animationType="slide"
      transparent={true}
      visible={modalVisible}
      onRequestClose={onClose}
    >
      <View style={styles.centeredView}>
        <View style={styles.modalView}>
          <Text style={styles.modalText}>Select notification</Text>
          <View style={styles.notifications}>
            {notificationOptions
              .filter((option) => !selectedNotifications.includes(option.value))
              .map((option) => (
                <Pressable
                  key={option.value}
                  style={({ pressed }) => pressed && styles.pressed}
                  onPress={() => onNotificationSelected(option.value)}
                >
                  <View style={styles.wrapper}>
                    <View style={styles.circle} />
                    <Text style={styles.text}>{option.label}</Text>
                  </View>
                </Pressable>
              ))}
          </View>
          <Button title="Close" color={Colors.primary} onPress={onClose} />
        </View>
      </View>
    </Modal>
  );
};

export default NotificationPicker;

const styles = StyleSheet.create({
  centeredView: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  modalView: {
    margin: 20,
    backgroundColor: "white",
    borderRadius: 4,
    padding: 35,
    alignItems: "center",
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 4,
    elevation: 5,
  },
  modalText: {
    textAlign: "center",
  },
  pressed: {
    opacity: 0.75,
  },
  notifications: {
    marginVertical: 20,
  },
  wrapper: {
    flexDirection: "row",
    alignItems: "center",
    gap: 10,
    marginVertical: 6,
  },
  circle: {
    width: 16,
    height: 16,
    borderRadius: "50%",
    borderColor: Colors.primary,
    borderWidth: 2,
  },
  text: {
    fontSize: 16,
  },
});
