import { StyleSheet, View, Button } from "react-native";
import { Formik } from "formik";

import Colors from "../../constants/colors";
import TextInputField from "../Formik/TextInputField";
import ImagePicker from "../common/ImagePicker";

interface EventFormValues {
  title: string;
}

const EventForm = () => {
  //   const dispatch = useDispatch();

  const onSubmit = async (values: EventFormValues) => {
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
            <View>
              <TextInputField
                name="title"
                placeholder="Title"
                values={values}
                errors={errors}
                handleChange={handleChange}
                handleBlur={handleBlur}
              />
              <ImagePicker />
            </View>
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

export default EventForm;

const styles = StyleSheet.create({
  form: {
    height: "96%",
    width: "100%",
    justifyContent: "space-between",
  },
  actions: {
    marginTop: 10,
  },
});
