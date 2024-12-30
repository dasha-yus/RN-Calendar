import {
  StyleSheet,
  View,
  Text,
  Image,
  Pressable,
  Dimensions,
  KeyboardAvoidingView,
  ScrollView,
} from "react-native";
import { useNavigation } from "@react-navigation/native";

import Colors from "../constants/colors";
import LoadingOverlay from "./UI/LoadingOverlay";

const { width, height } = Dimensions.get("window");

interface AuthContainerProps {
  title: string;
  subtitle: string;
  switchPageName: string;
  loading: boolean;
  loadingMessage: string;
  footerText: string;
  footerLinkText: string;
  children: React.ReactNode;
}

const AuthContainer = ({
  title,
  subtitle,
  switchPageName,
  loading,
  loadingMessage,
  footerText,
  footerLinkText,
  children,
}: AuthContainerProps) => {
  const navigation = useNavigation<any>();

  const switchPageHandler = () => {
    navigation.navigate({ name: switchPageName });
  };

  if (loading) {
    return <LoadingOverlay message={loadingMessage} />;
  }

  return (
    <ScrollView style={styles.root}>
      <KeyboardAvoidingView style={styles.root} behavior="position">
        <View style={styles.screen}>
          <Image
            source={require("../assets/images/auth.jpg")}
            style={styles.image}
          />
          <View style={styles.container}>
            <View>
              <Text style={styles.title}>{title}</Text>
              <Text style={styles.subtitle}>{subtitle}</Text>
            </View>
            {children}
            <View style={styles.flexText}>
              <Text style={styles.subtitle}>{footerText} </Text>
              <Pressable
                style={({ pressed }) => pressed && styles.pressed}
                onPress={switchPageHandler}
              >
                <Text style={styles.link}>{footerLinkText}</Text>
              </Pressable>
            </View>
          </View>
        </View>
      </KeyboardAvoidingView>
    </ScrollView>
  );
};

export default AuthContainer;

const styles = StyleSheet.create({
  root: {
    flex: 1,
    backgroundColor: "#fff",
  },
  screen: {
    flex: 1,
    width: width,
  },
  container: {
    height: height - 280,
    justifyContent: "space-between",
    width: width,
  },
  image: {
    height: 280,
    width: "100%",
    resizeMode: "cover",
  },
  title: {
    color: Colors.primary,
    textAlign: "center",
    fontSize: 36,
    marginTop: 24,
  },
  flexText: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
  },
  subtitle: {
    color: Colors.gray300,
    textAlign: "center",
    fontSize: 18,
  },
  link: {
    color: Colors.primary,
    fontSize: 18,
  },
  pressed: {
    opacity: 0.75,
  },
});
