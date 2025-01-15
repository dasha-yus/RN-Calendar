import {
  StyleSheet,
  View,
  Text,
  Button,
  ScrollView,
  SafeAreaView,
  Alert,
  LogBox,
} from "react-native";
import { useEffect, useState } from "react";
import { Formik } from "formik";
import { useDispatch, useSelector } from "react-redux";
import { useNavigation } from "@react-navigation/native";
import DropDownPicker from "react-native-dropdown-picker";
import { Ionicons } from "@expo/vector-icons";

import Colors from "../../constants/colors";
import TextInputField from "../Formik/TextInputField";
import ImagePicker from "../pickers/ImagePicker";
import DatePicker from "../pickers/DatePicker";
import LoadingOverlay from "../UI/LoadingOverlay";
import { repeats } from "../Events/EventForm";
import {
  addNotification,
  Notification,
  updateNotification,
} from "../../store/reducers/notifications";
import { notificationValidationSchema } from "../../validators/NotificationValidationSchema";
import { SettingsState } from "../../store/reducers/settings";
import {
  createNotification,
  updateNotificationData,
} from "../../api/notifications";
import { scheduleNotifications } from "../../utils/notifications";

interface NotificationFormProps {
  selectedNotification?: Notification;
}

interface NotificationFormValues {
  text: string;
}

const NotificationForm: React.FC<NotificationFormProps> = ({
  selectedNotification,
}) => {
  const dispatch = useDispatch();
  const { notificationsDefaultColor } = useSelector(
    (state: { settings: SettingsState }) => state.settings
  );
  const navigation = useNavigation<any>();

  const [isSaving, setIsSaving] = useState(false);
  const [selectedImage, setSelectedImage] = useState("");
  const [date, setDate] = useState<any>(new Date());
  const [repeatDropdownOpen, setRepeatDropdownOpen] = useState(false);
  const [repeatOptions, setRepeatOptions] = useState(repeats);
  const [repeat, setRepeat] = useState<"daily" | "weekly" | "monthly" | "none">(
    "none"
  );

  useEffect(() => {
    LogBox.ignoreLogs(["VirtualizedLists should never be nested"]);
  }, []);

  useEffect(() => {
    if (!selectedNotification) {
      return;
    }

    setDate(selectedNotification?.date || new Date());
    setRepeat(selectedNotification.repeat);
    setSelectedImage(selectedNotification.imageUri || "");
  }, [selectedNotification]);

  function takeImageHandler(imageUri: string) {
    setSelectedImage(imageUri);
  }

  const onSubmit = async (values: NotificationFormValues) => {
    setIsSaving(true);
    try {
      const notification: Partial<Notification> = {
        text: values.text,
        date: date.toString(),
        repeat,
        imageUri: selectedImage,
      };

      let notificationId;
      if (!!selectedNotification) {
        await updateNotificationData(selectedNotification.id, notification);
        notificationId = selectedNotification.id;
        dispatch(
          updateNotification({
            id: selectedNotification.id,
            updatedNotification: notification,
          })
        );
      } else {
        const res: Notification = await createNotification(notification);
        notificationId = res.id;
        dispatch(addNotification(res));
      }

      await scheduleNotifications({
        ...notification,
        id: notificationId,
      });

      navigation.navigate("Calendar");
    } catch (error) {
      Alert.alert("Saving failed", "Could not save notification data");
    } finally {
      setIsSaving(false);
    }
  };

  if (isSaving) {
    return <LoadingOverlay message="Saving notification data..." />;
  }

  return (
    <View>
      <Formik
        initialValues={{
          text: selectedNotification?.text || "",
        }}
        validationSchema={notificationValidationSchema}
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
                name="text"
                placeholder="Text"
                values={values}
                errors={errors}
                handleChange={handleChange}
                handleBlur={handleBlur}
              />
              <SafeAreaView>
                <DatePicker
                  label="Select date"
                  dateStart={new Date(date)}
                  onStartDateChange={(date) => setDate(date)}
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
              <ImagePicker
                value={selectedImage}
                onTakeImage={takeImageHandler}
              />
              <View style={styles.colorBox}>
                <Text>Selected color</Text>
                <View
                  style={[
                    styles.color,
                    { backgroundColor: notificationsDefaultColor },
                  ]}
                />
              </View>
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
    </View>
  );
};

export default NotificationForm;

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
  actions: {
    marginTop: 10,
  },
  block: {
    marginBottom: 20,
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
});
