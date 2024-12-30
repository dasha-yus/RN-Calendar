import {
  StyleSheet,
  View,
  Text,
  TextInput,
  KeyboardTypeOptions,
} from "react-native";

import Colors from "../../constants/colors";

interface TextInputFieldProps {
  name: string;
  placeholder: string;
  keyboardType: KeyboardTypeOptions;
  values: any;
  errors: any;
  handleChange: (field: string) => any;
  handleBlur: (field: string) => any;
  options?: object;
}

const TextInputField = ({
  name,
  placeholder,
  keyboardType,
  values,
  errors,
  handleChange,
  handleBlur,
  options = {},
}: TextInputFieldProps) => {
  return (
    <View style={styles.container}>
      <TextInput
        onChangeText={handleChange(name)}
        onBlur={handleBlur(name)}
        value={values[name]}
        keyboardType={keyboardType}
        style={styles.textInput}
        autoCorrect={false}
        autoCapitalize="none"
        placeholder={placeholder}
        {...options}
      />
      {errors[name] && <Text style={styles.error}>{errors[name]}</Text>}
    </View>
  );
};

export default TextInputField;

const styles = StyleSheet.create({
  container: {
    marginBottom: 24,
  },
  textInput: {
    height: 40,
    backgroundColor: Colors.gray200,
    borderRadius: 4,
    borderWidth: 1,
    borderColor: Colors.primary,
    padding: 12,
  },
  error: {
    fontSize: 10,
    color: "red",
    paddingTop: 6,
  },
});
