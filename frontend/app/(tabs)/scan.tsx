import { useCallback, useEffect, useRef, useState } from "react";
import ReportDisplay from "@/components/ReportDisplay";
import { reportData } from "@/constants/reportData";
import { useFocusEffect } from "@react-navigation/native";


import {
  View,
  Text,
  TouchableOpacity,
  Image,
  ActivityIndicator,
  Alert,
  StyleSheet,
} from "react-native";
import { CameraView, CameraType, useCameraPermissions } from "expo-camera";
import * as ImagePicker from "expo-image-picker";
import * as DocumentPicker from "expo-document-picker";
import { MaterialIcons } from "@expo/vector-icons";

const Scan = () => {
  const [permission, requestPermission] = useCameraPermissions();
  const [facing, setFacing] = useState<CameraType>("back");
  const cameraRef = useRef<CameraView | null>(null);
  const [reportDisplay, setReportDisplay] = useState<typeof reportData | null>(
    null
  );

  const [capturedImage, setCapturedImage] = useState<string | null>(null);
  const [parsedText, setParsedText] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [isCameraActive, setIsCameraActive] = useState(false);

//   useEffect(() => {
//     if (permission && !permission.granted && permission.canAskAgain) {
//       requestPermission();
//     }
//   }, [permission]);

useEffect(() => {
  if (permission?.status !== "granted") {
    requestPermission();
  }
}, [permission]);
  

useFocusEffect(
  useCallback(() => {
    setIsCameraActive(true);

    return () => {
      setIsCameraActive(false);
    };
  }, [])
);
useEffect(() => {
  return () => {
    setIsCameraActive(false);
  };
}, []);

  const takePicture = async () => {
    if (cameraRef.current) {
      try {
        const photo = await cameraRef.current.takePictureAsync({
          quality: 0.8,
          base64: true,
        });
        if (photo) {
          setCapturedImage(photo.uri);
        }
      } catch (error) {
        console.error("Error taking picture:", error);
        Alert.alert("Error", "Failed to take picture");
      }
    }
  };

  const pickFromGallery = async () => {
    try {
      const { status } =
        await ImagePicker.requestMediaLibraryPermissionsAsync();
      if (status !== "granted") {
        Alert.alert(
          "Permission needed",
          "Please grant permission to access your photo library"
        );
        return;
      }

      const result = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ImagePicker.MediaTypeOptions.Images,
        allowsEditing: true,
        aspect: [4, 3],
        quality: 0.8,
        base64: true,
      });

      if (!result.canceled && result.assets && result.assets[0]) {
        setCapturedImage(result.assets[0].uri);
      }
    } catch (error) {
      console.error("Error picking image:", error);
      Alert.alert("Error", "Failed to pick image from gallery");
    }
  };

  const pickPDF = async () => {
    try {
      const result = await DocumentPicker.getDocumentAsync({
        type: "application/pdf",
        copyToCacheDirectory: true,
      });

      if (!result.canceled && result.assets && result.assets[0]) {
        const file = {
          uri: result.assets[0].uri,
          name: result.assets[0].name,
          type: "application/pdf",
        };
        sendToBackend(file);
      }
    } catch (error) {
      console.error("Error picking PDF:", error);
      Alert.alert("Error", "Failed to pick PDF file");
    }
  };

  const sendToBackend = async (file: {
    uri: string;
    name: string;
    type: string;
  }) => {
    try {
      setLoading(true);
      setTimeout(() => {
        setLoading(false);
        setReportDisplay(reportData);
      }, 2000); 
    } catch (error) {
      setLoading(false);
      Alert.alert("Error", "Mock failed");
    }
  };

  const handleOK = () => {
    if (!capturedImage) return;
    const file = {
      uri: capturedImage,
      name: "photo.jpg",
      type: "image/jpeg",
    };
    sendToBackend(file);
  };

  const resetView = () => {
    setCapturedImage(null);
    setParsedText(null);
    setReportDisplay(null);
    setLoading(false);
    setIsCameraActive(true); 
  };

  if (!permission) {
    return <View style={styles.container} />;
  }

  if (!permission.granted) {
    return (
      <View style={styles.container}>
        <Text style={styles.message}>
          We need your permission to show the camera
        </Text>
        <TouchableOpacity onPress={requestPermission} style={styles.button}>
          <Text style={styles.buttonText}>Grant Permission</Text>
        </TouchableOpacity>
      </View>
    );
  }

//show report
  if (reportDisplay && !loading) {
    return <ReportDisplay report={reportDisplay} onBack={resetView} />;
  }

  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#007AFF" />
        <Text style={styles.loadingText}>Processing...</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      {capturedImage ? (
        <View style={styles.container}>
          <Image source={{ uri: capturedImage }} style={styles.previewImage} />
          <View style={styles.previewControls}>
            <TouchableOpacity onPress={resetView} style={styles.cancelButton}>
              <Text style={styles.buttonText}>Cancel</Text>
            </TouchableOpacity>
            <TouchableOpacity onPress={handleOK} style={styles.okButton}>
              <Text style={styles.buttonText}>Process</Text>
            </TouchableOpacity>
          </View>
        </View>
      ) : (
        <>
          {isCameraActive && (
            <CameraView style={styles.camera} facing={facing} ref={cameraRef} />
          )}
          <View style={styles.cameraControls}>
            <TouchableOpacity
              onPress={pickFromGallery}
              style={styles.controlButton}
            >
              <MaterialIcons name="photo-library" size={24} color="white" />
            </TouchableOpacity>
            <TouchableOpacity
              onPress={takePicture}
              style={styles.captureButton}
            >
              <MaterialIcons name="camera-alt" size={28} color="black" />
            </TouchableOpacity>
            <TouchableOpacity onPress={pickPDF} style={styles.controlButton}>
              <MaterialIcons name="picture-as-pdf" size={24} color="white" />
            </TouchableOpacity>
          </View>
        </>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#000",
  },
  camera: {
    flex: 1,
  },
  message: {
    textAlign: "center",
    paddingBottom: 10,
    color: "#fff",
    fontSize: 16,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#000",
  },
  loadingText: {
    color: "#fff",
    marginTop: 10,
    fontSize: 16,
  },
  resultContainer: {
    flex: 1,
    padding: 16,
    backgroundColor: "white",
  },
  resultTitle: {
    fontSize: 18,
    fontWeight: "bold",
    marginBottom: 10,
    color: "#000",
  },
  resultText: {
    fontSize: 14,
    lineHeight: 20,
    color: "#333",
    flex: 1,
  },
  previewImage: {
    flex: 1,
    resizeMode: "cover",
  },
  previewControls: {
    position: "absolute",
    bottom: 30,
    width: "100%",
    flexDirection: "row",
    justifyContent: "space-evenly",
    alignItems: "center",
  },
  cameraControls: {
    position: "absolute",
    bottom: 30,
    width: "100%",
    flexDirection: "row",
    justifyContent: "space-evenly",
    alignItems: "center",
  },
  controlButton: {
    padding: 15,
  },
  controlIcon: {
    color: "white",
    fontSize: 20,
  },
  captureButton: {
    width: 70,
    height: 70,
    borderRadius: 35,
    backgroundColor: "white",
    alignItems: "center",
    justifyContent: "center",
  },
  captureIcon: {
    fontSize: 24,
  },
  button: {
    backgroundColor: "#007AFF",
    padding: 15,
    borderRadius: 8,
    margin: 10,
    alignItems: "center",
  },
  buttonText: {
    color: "#fff",
    fontWeight: "bold",
    fontSize: 16,
  },
  cancelButton: {
    backgroundColor: "rgba(76, 83, 94,0.8)",
    borderWidth: 0.7,
    borderColor: "#bcc4f9",
    paddingVertical: 8,
    paddingHorizontal: 18,
    borderRadius: 5,
    color: "#bcc4f5",
  },
  okButton: {
    backgroundColor: "rgba(76, 83, 94,0.8)",
    borderWidth: 0.7,
    borderColor: "#bcc4f9",
    paddingVertical: 8,
    paddingHorizontal: 18,
    borderRadius: 5,
    color: "#bcc4f5",
  },
});

export default Scan;
