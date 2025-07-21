import React, { useState, useEffect, useRef } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Alert, Image } from 'react-native';
import { Camera, CameraType } from 'expo-camera';
import { Button, Card, Title, Paragraph } from 'react-native-paper';
import { Ionicons } from '@expo/vector-icons';
import * as ImagePicker from 'expo-image-picker';
import AIService from '../services/AIService';

export default function CameraScreen() {
  const [hasPermission, setHasPermission] = useState(null);
  const [type, setType] = useState(CameraType.back);
  const [capturedImage, setCapturedImage] = useState(null);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [analysisResult, setAnalysisResult] = useState(null);
  const cameraRef = useRef();

  useEffect(() => {
    (async () => {
      const { status } = await Camera.requestCameraPermissionsAsync();
      setHasPermission(status === 'granted');
    })();
  }, []);

  const takePicture = async () => {
    if (cameraRef.current) {
      try {
        const photo = await cameraRef.current.takePictureAsync({
          quality: 0.8,
          base64: true,
        });
        setCapturedImage(photo);
        analyzeDocument(photo);
      } catch (error) {
        Alert.alert('Error', 'Failed to take picture');
      }
    }
  };

  const pickImage = async () => {
    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      aspect: [4, 3],
      quality: 0.8,
      base64: true,
    });

    if (!result.canceled) {
      setCapturedImage(result.assets[0]);
      analyzeDocument(result.assets[0]);
    }
  };

  const analyzeDocument = async (image) => {
    setIsAnalyzing(true);
    try {
      const analysis = await AIService.analyzeDocument(image.base64);
      setAnalysisResult(analysis);
    } catch (error) {
      Alert.alert('Error', 'Failed to analyze document');
    }
    setIsAnalyzing(false);
  };

  const retakePhoto = () => {
    setCapturedImage(null);
    setAnalysisResult(null);
  };

  if (hasPermission === null) {
    return (
      <View style={styles.container}>
        <Text>Requesting camera permissions...</Text>
      </View>
    );
  }

  if (hasPermission === false) {
    return (
      <View style={styles.container}>
        <Text>No access to camera</Text>
        <Button mode="contained" onPress={() => Camera.requestCameraPermissionsAsync()}>
          Grant Permission
        </Button>
      </View>
    );
  }

  if (capturedImage) {
    return (
      <View style={styles.container}>
        <Image source={{ uri: capturedImage.uri }} style={styles.preview} />
        
        {analysisResult && (
          <Card style={styles.analysisCard}>
            <Card.Content>
              <Title>Document Analysis</Title>
              <Paragraph>{analysisResult}</Paragraph>
            </Card.Content>
          </Card>
        )}
        
        <View style={styles.buttonContainer}>
          <Button 
            mode="contained" 
            onPress={retakePhoto}
            style={styles.button}
            icon="camera-retake"
          >
            Retake
          </Button>
          <Button 
            mode="outlined" 
            onPress={pickImage}
            style={styles.button}
            icon="image"
          >
            Gallery
          </Button>
        </View>
        
        {isAnalyzing && (
          <Text style={styles.analyzingText}>Analyzing document...</Text>
        )}
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <Camera style={styles.camera} type={type} ref={cameraRef}>
        <View style={styles.overlay}>
          <View style={styles.topControls}>
            <TouchableOpacity
              style={styles.flipButton}
              onPress={() => {
                setType(
                  type === CameraType.back ? CameraType.front : CameraType.back
                );
              }}
            >
              <Ionicons name="camera-reverse" size={30} color="white" />
            </TouchableOpacity>
          </View>
          
          <View style={styles.scanFrame} />
          <Text style={styles.instructionText}>
            Position document within the frame
          </Text>
          
          <View style={styles.bottomControls}>
            <TouchableOpacity style={styles.galleryButton} onPress={pickImage}>
              <Ionicons name="images" size={30} color="white" />
            </TouchableOpacity>
            
            <TouchableOpacity style={styles.captureButton} onPress={takePicture}>
              <View style={styles.captureButtonInner} />
            </TouchableOpacity>
            
            <View style={styles.placeholderButton} />
          </View>
        </View>
      </Camera>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: 'black',
  },
  camera: {
    flex: 1,
  },
  overlay: {
    flex: 1,
    backgroundColor: 'transparent',
    justifyContent: 'space-between',
  },
  topControls: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
    padding: 20,
    paddingTop: 60,
  },
  flipButton: {
    backgroundColor: 'rgba(0,0,0,0.5)',
    borderRadius: 25,
    padding: 10,
  },
  scanFrame: {
    alignSelf: 'center',
    width: 300,
    height: 400,
    borderWidth: 2,
    borderColor: '#6200EE',
    borderRadius: 10,
    backgroundColor: 'transparent',
  },
  instructionText: {
    color: 'white',
    textAlign: 'center',
    fontSize: 16,
    marginTop: 20,
    backgroundColor: 'rgba(0,0,0,0.5)',
    padding: 10,
    marginHorizontal: 20,
    borderRadius: 5,
  },
  bottomControls: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 30,
    paddingBottom: 40,
  },
  galleryButton: {
    backgroundColor: 'rgba(0,0,0,0.5)',
    borderRadius: 25,
    padding: 15,
  },
  captureButton: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: 'white',
    justifyContent: 'center',
    alignItems: 'center',
  },
  captureButtonInner: {
    width: 60,
    height: 60,
    borderRadius: 30,
    backgroundColor: '#6200EE',
  },
  placeholderButton: {
    width: 50,
    height: 50,
  },
  preview: {
    flex: 1,
    resizeMode: 'contain',
  },
  analysisCard: {
    margin: 10,
    maxHeight: 200,
  },
  buttonContainer: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    padding: 20,
  },
  button: {
    minWidth: 120,
  },
  analyzingText: {
    textAlign: 'center',
    fontSize: 16,
    color: '#6200EE',
    marginTop: 10,
  },
});
