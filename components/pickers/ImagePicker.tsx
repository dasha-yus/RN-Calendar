import { useEffect, useState } from "react";
import { Alert, Image, StyleSheet, Text, View } from "react-native";
import {
  launchCameraAsync,
  launchImageLibraryAsync,
  useCameraPermissions,
  PermissionStatus,
} from "expo-image-picker";
import * as Picker from "expo-image-picker";

import Colors from "../../constants/colors";
import OutlinedButton from "../UI/OutlinedButton";

interface ImagePickerProps {
  value: string;
  onTakeImage: (uri: string) => void;
}

function ImagePicker({ value, onTakeImage }: ImagePickerProps) {
  const [pickedImage, setPickedImage] = useState(value || "");

  useEffect(() => {
    setPickedImage(value || "");
  }, [value]);

  const [cameraPermissionInformation, requestPermission] =
    useCameraPermissions();

  async function verifyPermissions() {
    if (cameraPermissionInformation?.status === PermissionStatus.UNDETERMINED) {
      const permissionResponse = await requestPermission();

      return permissionResponse.granted;
    }

    if (cameraPermissionInformation?.status === PermissionStatus.DENIED) {
      Alert.alert(
        "Insufficient Permissions!",
        "You need to grant camera permissions to use this app."
      );
      return false;
    }

    return true;
  }

  async function pickImage() {
    const hasPermission = await verifyPermissions();

    if (!hasPermission) {
      return;
    }

    const result = await launchImageLibraryAsync({
      mediaTypes: Picker.MediaTypeOptions.Images,
      allowsEditing: true,
      aspect: [16, 9],
      quality: 0.5,
    });

    if (!result.canceled) {
      const imageUri = result.assets[0].uri;
      setPickedImage(imageUri);
      onTakeImage(imageUri);
    }
  }

  async function takePicture() {
    const hasPermission = await verifyPermissions();

    if (!hasPermission) {
      return;
    }

    const result = await launchCameraAsync({
      allowsEditing: true,
      aspect: [16, 9],
      quality: 0.5,
    });

    if (!result.canceled) {
      const imageUri = result.assets[0].uri;
      setPickedImage(imageUri);
      onTakeImage(imageUri);
    }
  }

  let imagePreview = <Text>No image taken yet.</Text>;

  if (pickedImage) {
    imagePreview = <Image style={styles.image} source={{ uri: pickedImage }} />;
  }

  return (
    <View>
      <View style={styles.imagePreview}>{imagePreview}</View>
      <View style={styles.actions}>
        <OutlinedButton icon="camera" onPress={takePicture}>
          Take Picture
        </OutlinedButton>
        <OutlinedButton icon="cloud-upload" onPress={pickImage}>
          Pick Image
        </OutlinedButton>
      </View>
    </View>
  );
}

export default ImagePicker;

const styles = StyleSheet.create({
  imagePreview: {
    width: "100%",
    height: 200,
    marginBottom: 8,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: Colors.secondary100,
    borderRadius: 4,
  },
  image: {
    width: "100%",
    height: "100%",
  },
  actions: {
    flexDirection: "row",
    marginBottom: 10,
  },
});
