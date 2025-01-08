import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Button, StyleSheet, View } from "react-native";
import DropDownPicker from "react-native-dropdown-picker";
import Toast from "react-native-toast-message";

import { setSettings, SettingsState } from "../store/reducers/settings";
import { updateSettings } from "../api/settings";
import Colors from "../constants/colors";

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
  const { firstDay } = useSelector(
    (state: { settings: SettingsState }) => state.settings
  );
  const dispatch: any = useDispatch();

  const [open, setOpen] = useState(false);
  const [firstDayValue, setFirstDayValue] = useState(0);
  const [items, setItems] = useState(days);
  const [isSaving, setIsSaving] = useState(false);

  useEffect(() => {
    setFirstDayValue(firstDay);
  }, [firstDay]);

  const onSave = async () => {
    try {
      setIsSaving(true);
      await updateSettings({ firstDay: firstDayValue });
      dispatch(setSettings({ firstDay: firstDayValue }));
      Toast.show({
        type: "success",
        text1: `First day of the week set to ${
          days.find((day) => day.value === firstDayValue)?.label
        }`,
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
      <DropDownPicker
        open={open}
        value={firstDayValue}
        items={items}
        setOpen={setOpen}
        setValue={setFirstDayValue}
        setItems={setItems}
        placeholder="Select first day of the week"
      />
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
});
