import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Button, StyleSheet, View, Text, Pressable } from "react-native";
import DropDownPicker from "react-native-dropdown-picker";
import Toast from "react-native-toast-message";

import { setSettings, SettingsState } from "../store/reducers/settings";
import { updateSettings } from "../api/settings";
import { AppDispatch } from "../store";
import Colors from "../constants/colors";
import ColorPicker from "../components/pickers/ColorPicker";

const days = [
  { label: "Monday", value: 0 },
  { label: "Tuesday", value: 1 },
  { label: "Wednesday", value: 2 },
  { label: "Thursday", value: 3 },
  { label: "Friday", value: 4 },
  { label: "Saturday", value: 5 },
  { label: "Sunday", value: 6 },
];

const SettingsScreen = () => {
  const { firstDay, notificationsDefaultColor } = useSelector(
    (state: { settings: SettingsState }) => state.settings
  );
  const dispatch: AppDispatch = useDispatch();

  const [open, setOpen] = useState(false);
  const [firstDayValue, setFirstDayValue] = useState(0);
  const [items, setItems] = useState(days);
  const [isSaving, setIsSaving] = useState(false);
  const [colorPickerModalOpen, setColorPickerModalOpen] = useState(false);
  const [selectedColor, setSelectedColor] = useState(notificationsDefaultColor);

  useEffect(() => {
    setFirstDayValue(firstDay);
  }, [firstDay]);

  const onSave = async () => {
    try {
      setIsSaving(true);
      await updateSettings({
        firstDay: firstDayValue,
        notificationsDefaultColor: selectedColor,
      });
      dispatch(
        setSettings({
          firstDay: firstDayValue,
          notificationsDefaultColor: selectedColor,
        })
      );
      Toast.show({
        type: "success",
        text1: "Settings updated successfully",
        autoHide: true,
        visibilityTime: 5000,
        topOffset: 50,
      });
      setIsSaving(false);
    } catch (error) {
      setIsSaving(false);
    }
  };

  return (
    <View style={styles.container}>
      <View>
        <View>
          <Text style={styles.label}>First day of the week</Text>
          <DropDownPicker
            open={open}
            value={firstDayValue}
            items={items}
            setOpen={setOpen}
            setValue={setFirstDayValue}
            setItems={setItems}
            placeholder="Select first day of the week"
          />
        </View>
        <Pressable
          style={({ pressed }) => pressed && styles.pressed}
          onPress={() => setColorPickerModalOpen(true)}
        >
          <View style={styles.colorBox}>
            <Text>Default notifications color</Text>
            <View style={[styles.color, { backgroundColor: selectedColor }]} />
          </View>
        </Pressable>
        <ColorPicker
          modalVisible={colorPickerModalOpen}
          selectedColor={selectedColor}
          onClose={() => setColorPickerModalOpen(false)}
          onColorPicked={setSelectedColor}
        />
      </View>
      <View>
        <Button
          onPress={onSave}
          title="Save"
          disabled={isSaving}
          color={Colors.primary}
        />
      </View>
    </View>
  );
};

export default SettingsScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
    padding: 16,
    justifyContent: "space-between",
  },
  label: {
    marginBottom: 5,
  },
  colorBox: {
    borderWidth: 1,
    borderColor: Colors.primary,
    paddingVertical: 8,
    paddingHorizontal: 12,
    borderRadius: 4,
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginTop: 20,
  },
  color: {
    width: 20,
    height: 20,
    borderRadius: "50%",
    borderWidth: 1,
    borderColor: Colors.primary,
  },
  pressed: {
    opacity: 0.75,
  },
});
