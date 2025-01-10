import {
  StyleSheet,
  View,
  Text,
  Button,
  ScrollView,
  Pressable,
} from "react-native";
import { useCallback, useState } from "react";
import { Formik } from "formik";

import Colors from "../../constants/colors";
import TextInputField from "../Formik/TextInputField";
import ImagePicker from "../pickers/ImagePicker";
import LocationPicker from "../pickers/LocationPicker";
import ColorPicker, { colors } from "../pickers/ColorPicker";

interface EventFormValues {
  title: string;
}

const EventForm = () => {
  //   const dispatch = useDispatch();
  const [selectedImage, setSelectedImage] = useState("");
  const [pickedLocation, setPickedLocation] = useState(null);
  const [colorPickerModalOpen, setColorPickerModalOpen] = useState(false);
  const [selectedColor, setSelectedColor] = useState(colors[colors.length - 2]);

  function takeImageHandler(imageUri: string) {
    setSelectedImage(imageUri);
  }

  const pickLocationHandler = useCallback((location: any) => {
    setPickedLocation(location);
  }, []);

  const onSubmit = async (values: EventFormValues) => {
    console.log("title", values.title);
    console.log("image", selectedImage);
    console.log("location", pickedLocation);
    console.log("color", selectedColor);
    // setIsAuthenticating(true);
    // try {
    //   const { token, refreshToken, expiresIn } = await login(
    //     values.email,
    //     values.password
    //   );
    //   dispatch(authenticate({ token, refreshToken, expiresIn }));
    // } catch (error) {
    //   Alert.alert(
    //     "Authentication failed",
    //     "Could not log you in. Please check your credentials or try again later"
    //   );
    // } finally {
    //   setIsAuthenticating(false);
    // }
  };

  return (
    <View>
      <Formik
        initialValues={{ title: "" }}
        // validationSchema={loginValidationSchema}
        onSubmit={onSubmit}
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
              <ImagePicker onTakeImage={takeImageHandler} />
              {/* <LocationPicker onPickLocation={pickLocationHandler} /> */}
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
    </View>
  );
};

export default EventForm;

const styles = StyleSheet.create({
  form: {
    height: "96%",
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
});
