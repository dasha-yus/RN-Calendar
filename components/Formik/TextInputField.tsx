import {
  StyleSheet,
  View,
  Text,
  TextInput,
  KeyboardTypeOptions,
  Platform,
} from "react-native";

import Colors from "../../constants/colors";

interface TextInputFieldProps {
  name: string;
  placeholder: string;
  keyboardType?: KeyboardTypeOptions;
  values: any;
  errors: any;
  handleChange: (field: string) => any;
  handleBlur: (field: string) => any;
  numberOfLines?: number;
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
  numberOfLines = 1,
  options = {},
}: TextInputFieldProps) => {
  return (
    <View
      style={[
        styles.container,
        {
          minHeight: 24 * numberOfLines,
        },
      ]}
    >
      <TextInput
        onChangeText={handleChange(name)}
        onBlur={handleBlur(name)}
        value={values[name]}
        keyboardType={keyboardType}
        style={[
          styles.textInput,
          {
            minHeight: 24 * numberOfLines,
          },
        ]}
        autoCorrect={false}
        autoCapitalize="none"
        placeholder={placeholder}
        numberOfLines={Platform.OS === "ios" ? undefined : numberOfLines}
        textAlignVertical="top"
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
