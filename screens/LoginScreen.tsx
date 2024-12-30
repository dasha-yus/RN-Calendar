import { StyleSheet, View, Button, Dimensions, Alert } from "react-native";
import { useState } from "react";
import { Formik } from "formik";

import Colors from "../constants/colors";
import { loginValidationSchema } from "../validators/LoginValidationSchema";
import TextInputField from "../components/Formik/TextInputField";
import AuthContainer from "../components/Auth";
import { login } from "../api/auth";

const { width, height } = Dimensions.get("window");

interface LoginScreenFormValues {
  email: string;
  password: string;
}

const LoginScreen = () => {
  const [isAuthenticating, setIsAuthenticating] = useState(false);

  const onSubmit = async (values: LoginScreenFormValues) => {
    setIsAuthenticating(true);
    try {
      await login(values.email, values.password);
    } catch (error) {
      Alert.alert(
        "Authentication failed",
        "Could not log you in. Please check your credentials or try again later"
      );
    }
    setIsAuthenticating(false);
  };

  return (
    <AuthContainer
      title="Welcome back"
      subtitle="Login to your account"
      switchPageName="Signup"
      loading={isAuthenticating}
      loadingMessage="Logging you in..."
      footerText="Don't have an account?"
      footerLinkText="Sign up"
    >
      <Formik
        initialValues={{ email: "", password: "" }}
        validationSchema={loginValidationSchema}
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
            <View style={styles.actions}>
              <Button
                // @ts-ignore
                onPress={handleSubmit}
                title="Login"
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

export default LoginScreen;

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
