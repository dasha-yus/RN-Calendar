import {
  StyleSheet,
  View,
  Text,
  Button,
  ScrollView,
  Pressable,
  SafeAreaView,
  Alert,
  LogBox,
} from "react-native";
import { useCallback, useEffect, useState } from "react";
import { Formik } from "formik";
import { useDispatch } from "react-redux";
import { useNavigation } from "@react-navigation/native";
import DropDownPicker from "react-native-dropdown-picker";
import { Ionicons } from "@expo/vector-icons";

import Colors from "../../constants/colors";
import TextInputField from "../Formik/TextInputField";
import ImagePicker from "../pickers/ImagePicker";
import ColorPicker, { colors } from "../pickers/ColorPicker";
import DatePicker from "../pickers/DatePicker";
import { eventValidationSchema } from "../../validators/EventValidationSchema";
import LoadingOverlay from "../UI/LoadingOverlay";
import {
  addEvent,
  Event,
  Event as EventType,
  updateEvent,
} from "../../store/reducers/events";
import { createEvent, updateEventData } from "../../api/events";
import NotificationPicker, {
  notificationOptions,
} from "../pickers/NotificationPicker";
import { formatMinutes } from "../../utils/general";
import { scheduleEventNotifications } from "../../utils/notifications";
import LocationPicker from "../pickers/LocationPicker";

export const repeats = [
  { label: "None", value: "none" },
  { label: "Daily", value: "daily" },
  { label: "Weekly", value: "weekly" },
  { label: "Monthly", value: "monthly" },
];

interface EventFormProps {
  selectedEvent?: Event;
}

interface EventFormValues {
  title: string;
  note: string;
}

const EventForm: React.FC<EventFormProps> = ({ selectedEvent }) => {
  const dispatch = useDispatch();

  const navigation = useNavigation<any>();

  const now = new Date();
  const nowPlusHour = new Date(now.getTime() + 60 * 60 * 1000);

  const [isSaving, setIsSaving] = useState(false);
  const [selectedImage, setSelectedImage] = useState("");
  const [pickedLocation, setPickedLocation] = useState<any>(null);
  const [colorPickerModalOpen, setColorPickerModalOpen] = useState(false);
  const [selectedColor, setSelectedColor] = useState(colors[colors.length - 2]);
  const [startDate, setStartDate] = useState<any>(now);
  const [endDate, setEndDate] = useState<any>(nowPlusHour);
  const [repeatDropdownOpen, setRepeatDropdownOpen] = useState(false);
  const [repeatOptions, setRepeatOptions] = useState(repeats);
  const [repeat, setRepeat] = useState<"daily" | "weekly" | "monthly" | "none">(
    "none"
  );
  const [notifications, setNotifications] = useState<number[]>([10]);
  const [notificationPickerModalOpen, setNotificationPickerModalOpen] =
    useState(false);

  useEffect(() => {
    LogBox.ignoreLogs(["VirtualizedLists should never be nested"]);
  }, []);

  useEffect(() => {
    if (!selectedEvent) {
      return;
    }

    setStartDate(selectedEvent?.dateStart || now);
    setEndDate(selectedEvent?.dateEnd || nowPlusHour);
    setRepeat(selectedEvent.repeat);
    setSelectedImage(selectedEvent.imageUri || "");
    setPickedLocation(selectedEvent?.location || null);
    setSelectedColor(selectedEvent?.color || colors[colors.length - 2]);
    setNotifications(selectedEvent?.notifications || []);
  }, [selectedEvent]);

  function takeImageHandler(imageUri: string) {
    setSelectedImage(imageUri);
  }

  const pickLocationHandler = useCallback((location: any) => {
    setPickedLocation(location);
  }, []);

  const removeNotificationHandler = (notification: number) => {
    setNotifications((prevState) =>
      prevState.filter((n) => n !== notification)
    );
  };

  const onSubmit = async (values: EventFormValues) => {
    setIsSaving(true);
    try {
      const event: Partial<EventType> = {
        title: values.title,
        dateStart: startDate.toString(),
        dateEnd: endDate.toString(),
        repeat,
        notifications,
        imageUri: selectedImage,
        color: selectedColor,
        location: pickedLocation,
        note: values.note,
      };

      let eventId;
      if (!!selectedEvent) {
        await updateEventData(selectedEvent.id, event);
        eventId = selectedEvent.id;
        dispatch(updateEvent({ id: selectedEvent.id, updatedEvent: event }));
      } else {
        const res: EventType = await createEvent(event);
        eventId = res.id;
        dispatch(addEvent(res));
      }

      if (!!notifications.length) {
        await scheduleEventNotifications({
          ...event,
          id: eventId,
        });
      }

      navigation.navigate("Calendar");
    } catch (error) {
      Alert.alert("Saving failed", "Could not save event data");
    } finally {
      setIsSaving(false);
    }
  };

  if (isSaving) {
    return <LoadingOverlay message="Saving event data..." />;
  }

  return (
    <View>
      <Formik
        initialValues={{
          title: selectedEvent?.title || "",
          note: selectedEvent?.note || "",
        }}
        validationSchema={eventValidationSchema}
        onSubmit={onSubmit}
        enableReinitialize
      >
        {({
          handleChange,
          handleBlur,
          handleSubmit,
          values,
          errors,
          isValid,
        }) => (
          <View style={styles.form}>
            <ScrollView style={styles.scrollView}>
              <TextInputField
                name="title"
                placeholder="Title"
                values={values}
                errors={errors}
                handleChange={handleChange}
                handleBlur={handleBlur}
              />
              <SafeAreaView>
                <DatePicker
                  label="Select dates range"
                  dateStart={new Date(startDate)}
                  onStartDateChange={(date) => setStartDate(date)}
                  dateEnd={new Date(endDate)}
                  onEndDateChange={(date) => setEndDate(date)}
                />
              </SafeAreaView>
              <View style={styles.block}>
                <View style={styles.label}>
                  <Ionicons name="repeat" color={Colors.primary} size={20} />
                  <Text style={styles.labelText}>Repeat</Text>
                </View>
                <DropDownPicker
                  open={repeatDropdownOpen}
                  value={repeat}
                  items={repeatOptions}
                  setOpen={setRepeatDropdownOpen}
                  setValue={setRepeat}
                  setItems={setRepeatOptions}
                />
              </View>
              <View style={styles.block}>
                <View style={styles.header}>
                  <View style={styles.label}>
                    <Ionicons
                      name="notifications"
                      color={Colors.primary}
                      size={20}
                    />
                    <Text style={styles.labelText}>Notifications</Text>
                  </View>
                  {notifications.length !== notificationOptions.length && (
                    <Pressable
                      style={({ pressed }) => [
                        pressed && styles.pressed,
                        styles.icon,
                      ]}
                      onPress={() => setNotificationPickerModalOpen(true)}
                    >
                      <Ionicons name="add" color={Colors.primary} size={20} />
                    </Pressable>
                  )}
                </View>
                <View>
                  {notifications.map((n) => (
                    <View key={n} style={styles.notification}>
                      <Text style={styles.notificationText}>
                        {formatMinutes(n)}
                      </Text>
                      <Pressable
                        style={({ pressed }) => pressed && styles.pressed}
                        onPress={() => removeNotificationHandler(n)}
                      >
                        <Ionicons
                          name="close"
                          color={Colors.primary}
                          size={20}
                        />
                      </Pressable>
                    </View>
                  ))}
                </View>
              </View>
              <ImagePicker
                value={selectedImage}
                onTakeImage={takeImageHandler}
              />
              <LocationPicker onPickLocation={pickLocationHandler} />
              <Pressable
                style={({ pressed }) => pressed && styles.pressed}
                onPress={() => setColorPickerModalOpen(true)}
              >
                <View style={styles.colorBox}>
                  <Text>Selected color</Text>
                  <View
                    style={[styles.color, { backgroundColor: selectedColor }]}
                  />
                </View>
              </Pressable>
              <TextInputField
                name="note"
                placeholder="Notes"
                values={values}
                errors={errors}
                handleChange={handleChange}
                handleBlur={handleBlur}
                numberOfLines={4}
              />
            </ScrollView>
            <View style={styles.actions}>
              <Button
                // @ts-ignore
                onPress={handleSubmit}
                title="Save"
                disabled={!isValid}
                color={Colors.primary}
              />
            </View>
          </View>
        )}
      </Formik>
      <ColorPicker
        modalVisible={colorPickerModalOpen}
        selectedColor={selectedColor}
        onClose={() => setColorPickerModalOpen(false)}
        onColorPicked={setSelectedColor}
      />
      <NotificationPicker
        modalVisible={notificationPickerModalOpen}
        selectedNotifications={notifications}
        onClose={() => setNotificationPickerModalOpen(false)}
        onNotificationPicked={(n) =>
          setNotifications([...notifications, n].sort((a, b) => a - b))
        }
      />
    </View>
  );
};

export default EventForm;

const styles = StyleSheet.create({
  form: {
    height: "87%",
    width: "100%",
    justifyContent: "space-between",
  },
  scrollView: {
    marginBottom: 24,
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
    marginBottom: 10,
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
  actions: {
    marginTop: 10,
  },
  block: {
    marginBottom: 20,
  },
  header: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    marginVertical: 6,
  },
  icon: {
    marginTop: -8,
  },
  label: {
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
    marginBottom: 10,
  },
  labelText: {
    fontSize: 18,
    fontWeight: 500,
    marginTop: -1,
  },
  notification: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 5,
  },
  notificationText: {
    fontSize: 16,
  },
});
