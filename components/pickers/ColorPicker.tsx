import { Modal, View, Text, StyleSheet, Pressable, Button } from "react-native";
import Colors from "../../constants/colors";

interface ColorPickerProps {
  modalVisible: boolean;
  selectedColor: string;
  onColorPicked: (color: string) => void;
  onClose: () => void;
}

export const colors = [
  "#ff3838",
  "#ff8c12",
  "#fad311",
  "#35ad1f",
  "#1ddbdb",
  "#3c44b0",
  "#8616a8",
];

const ColorPicker = ({
  modalVisible,
  selectedColor,
  onColorPicked,
  onClose,
}: ColorPickerProps) => {
  const onColorSelected = (color: string) => {
    onColorPicked(color);
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
          <Text style={styles.modalText}>Select color you want to use</Text>
          <View style={styles.colors}>
            {colors.map((color) => (
              <Pressable
                key={color}
                style={({ pressed }) => pressed && styles.pressed}
                onPress={() => onColorSelected(color)}
              >
                <View
                  style={[
                    styles.color,
                    {
                      backgroundColor: color,
                      borderColor: Colors.primary,
                      borderWidth: selectedColor === color ? 2 : 1,
                    },
                  ]}
                />
              </Pressable>
            ))}
          </View>
          <Button title="Close" color={Colors.primary} onPress={onClose} />
        </View>
      </View>
    </Modal>
  );
};

export default ColorPicker;

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
  colors: {
    flexDirection: "row",
    justifyContent: "space-between",
    width: "100%",
    marginVertical: 30,
  },
  color: {
    width: 28,
    height: 28,
    borderRadius: "50%",
  },
  pressed: {
    opacity: 0.75,
  },
});
