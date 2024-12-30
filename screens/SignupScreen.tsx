import { StyleSheet, View, Button, Dimensions, Alert } from "react-native";
import { useState } from "react";
import { Formik } from "formik";

import Colors from "../constants/colors";
import { signupValidationSchema } from "../validators/SignupValidationSchema";
import TextInputField from "../components/Formik/TextInputField";
import { createUser } from "../api/auth";
import AuthContainer from "../components/Auth";

const { width, height } = Dimensions.get("window");

interface SignupScreenFormValues {
  email: string;
  password: string;
  confirmPassword: string;
}

const SignupScreen = () => {
  const [isAuthenticating, setIsAuthenticating] = useState(false);

  const onSubmit = async (values: SignupScreenFormValues) => {
    setIsAuthenticating(true);
    try {
      await createUser(values.email, values.password);
    } catch (error) {
      Alert.alert(
        "Authentication failed",
        "Could not create user, please check your input and try again later."
      );
    }
    setIsAuthenticating(false);
  };

  return (
    <AuthContainer
      title="Welcome"
      subtitle="Please enter user details"
      switchPageName="Login"
      loading={isAuthenticating}
      loadingMessage="Creating user..."
      footerText="Already have an account?"
      footerLinkText="Log in"
    >
      <Formik
        initialValues={{ email: "", password: "", confirmPassword: "" }}
        validationSchema={signupValidationSchema}
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
            <TextInputField
              name="email"
              placeholder="Email"
              keyboardType="email-address"
              values={values}
              errors={errors}
              handleChange={handleChange}
              handleBlur={handleBlur}
            />
            <TextInputField
              name="password"
              placeholder="Password"
              keyboardType="default"
              values={values}
              errors={errors}
              handleChange={handleChange}
              handleBlur={handleBlur}
              options={{ secureTextEntry: true }}
            />
            <TextInputField
              name="confirmPassword"
              placeholder="Confirm password"
              keyboardType="default"
              values={values}
              errors={errors}
              handleChange={handleChange}
              handleBlur={handleBlur}
              options={{ secureTextEntry: true }}
            />
            <View style={styles.actions}>
              <Button
                // @ts-ignore
                onPress={handleSubmit}
                title="Sign up"
                disabled={!isValid}
                color={Colors.primary}
              />
            </View>
          </View>
        )}
      </Formik>
    </AuthContainer>
  );
};

export default SignupScreen;

const styles = StyleSheet.create({
  form: {
    padding: 40,
    width: width,
    marginTop: -60,
  },
  actions: {
    marginTop: 10,
  },
});
