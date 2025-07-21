import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, Alert, ScrollView } from 'react-native';
import { Button, Card, Title, Paragraph, Switch, TextInput, Chip } from 'react-native-paper';
import { Ionicons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import * as Location from 'expo-location';
import AIService from '../services/AIService';

export default function LocationScreen() {
  const [location, setLocation] = useState(null);
  const [address, setAddress] = useState('');
  const [hasLocationPermission, setHasLocationPermission] = useState(null);
  const [isLocationEnabled, setIsLocationEnabled] = useState(false);
  const [automations, setAutomations] = useState([]);
  const [nearbyPOIs, setNearbyPOIs] = useState([]);
  const [isLoadingLocation, setIsLoadingLocation] = useState(false);
  const [locationInsights, setLocationInsights] = useState('');

  const [newAutomation, setNewAutomation] = useState({
    location: '',
    action: '',
    radius: 100,
  });

  useEffect(() => {
    requestLocationPermissions();
    loadAutomations();
  }, []);

  const requestLocationPermissions = async () => {
    try {
      const { status } = await Location.requestForegroundPermissionsAsync();
      setHasLocationPermission(status === 'granted');
      
      if (status === 'granted') {
        getCurrentLocation();
      }
    } catch (error) {
      Alert.alert('Error', 'Failed to get location permissions');
    }
  };

  const getCurrentLocation = async () => {
    if (!hasLocationPermission) return;

    try {
      setIsLoadingLocation(true);
      const currentLocation = await Location.getCurrentPositionAsync({
        accuracy: Location.Accuracy.High,
      });

      setLocation(currentLocation);
      
      // Reverse geocode to get address
      const addressResult = await Location.reverseGeocodeAsync({
        latitude: currentLocation.coords.latitude,
        longitude: currentLocation.coords.longitude,
      });
      
      if (addressResult.length > 0) {
        const addr = addressResult[0];
        const fullAddress = `${addr.street || ''} ${addr.city || ''}, ${addr.region || ''} ${addr.postalCode || ''}`.trim();
        setAddress(fullAddress);
      }

      // Get location insights from AI
      getLocationInsights(currentLocation);
      
      // Get nearby points of interest
      getNearbyPOIs(currentLocation);
      
    } catch (error) {
      Alert.alert('Error', 'Failed to get current location');
    }
    
    setIsLoadingLocation(false);
  };

  const getLocationInsights = async (currentLocation) => {
    try {
      const insights = await AIService.getLocationInsights({
        latitude: currentLocation.coords.latitude,
        longitude: currentLocation.coords.longitude,
        address: address,
      });
      setLocationInsights(insights);
    } catch (error) {
      console.error('Failed to get location insights:', error);
    }
  };

  const getNearbyPOIs = async (currentLocation) => {
    try {
      const pois = await AIService.getNearbyPOIs({
        latitude: currentLocation.coords.latitude,
        longitude: currentLocation.coords.longitude,
      });
      setNearbyPOIs(pois);
    } catch (error) {
      console.error('Failed to get nearby POIs:', error);
    }
  };

  const loadAutomations = () => {
    // Load saved automations from local storage
    // For now, we'll use sample data
    const sampleAutomations = [
      {
        id: 1,
        location: 'Home',
        action: 'Turn on smart lights and set temperature to 72°F',
        radius: 100,
        isActive: true,
      },
      {
        id: 2,
        location: 'Office',
        action: 'Set phone to silent mode and open work apps',
        radius: 200,
        isActive: true,
      },
    ];
    setAutomations(sampleAutomations);
  };

  const addAutomation = () => {
    if (!newAutomation.location || !newAutomation.action) {
      Alert.alert('Error', 'Please fill in all fields');
      return;
    }

    const automation = {
      id: Date.now(),
      ...newAutomation,
      isActive: true,
    };

    setAutomations([...automations, automation]);
    setNewAutomation({ location: '', action: '', radius: 100 });
    
    Alert.alert('Success', 'Location automation added successfully!');
  };

  const toggleAutomation = (id) => {
    setAutomations(automations.map(auto => 
      auto.id === id ? { ...auto, isActive: !auto.isActive } : auto
    ));
  };

  const deleteAutomation = (id) => {
    setAutomations(automations.filter(auto => auto.id !== id));
  };

  const getLocationBasedSuggestions = async () => {
    if (!location) return;

    try {
      const suggestions = await AIService.getLocationBasedSuggestions({
        latitude: location.coords.latitude,
        longitude: location.coords.longitude,
        address: address,
        currentTime: new Date().getHours(),
      });
      
      Alert.alert('Location Suggestions', suggestions);
    } catch (error) {
      Alert.alert('Error', 'Failed to get location-based suggestions');
    }
  };

  if (hasLocationPermission === null) {
    return (
      <View style={styles.container}>
        <Text>Requesting location permissions...</Text>
      </View>
    );
  }

  if (hasLocationPermission === false) {
    return (
      <LinearGradient
        colors={['#6200EE', '#3700B3', '#FFFFFF']}
        style={styles.container}
        start={{ x: 0, y: 0 }}
        end={{ x: 0, y: 1 }}
      >
        <Card style={styles.permissionCard}>
          <Card.Content>
            <Title>Location Permission Required</Title>
            <Paragraph>Please grant location access to use location-based features and automations.</Paragraph>
            <Button mode="contained" onPress={requestLocationPermissions} style={styles.permissionButton}>
              Grant Permission
            </Button>
          </Card.Content>
        </Card>
      </LinearGradient>
    );
  }

  return (
    <LinearGradient
      colors={['#6200EE', '#3700B3', '#FFFFFF']}
      style={styles.container}
      start={{ x: 0, y: 0 }}
      end={{ x: 0, y: 1 }}
    >
      <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
        {/* Current Location */}
        <Card style={styles.locationCard}>
          <Card.Content>
            <View style={styles.locationHeader}>
              <Title>Current Location</Title>
              <Button 
                mode="outlined" 
                onPress={getCurrentLocation}
                loading={isLoadingLocation}
                disabled={isLoadingLocation}
                compact
              >
                Refresh
              </Button>
            </View>
            
            {location ? (
              <View>
                <Paragraph style={styles.address}>{address || 'Address not available'}</Paragraph>
                <Text style={styles.coordinates}>
                  {location.coords.latitude.toFixed(6)}, {location.coords.longitude.toFixed(6)}
                </Text>
                <Text style={styles.accuracy}>
                  Accuracy: {location.coords.accuracy?.toFixed(0)}m
                </Text>
              </View>
            ) : (
              <Paragraph>No location data available</Paragraph>
            )}
          </Card.Content>
        </Card>

        {/* Location Insights */}
        {locationInsights && (
          <Card style={styles.insightsCard}>
            <Card.Content>
              <Title>AI Location Insights</Title>
              <Paragraph>{locationInsights}</Paragraph>
              <Button 
                mode="outlined" 
                onPress={getLocationBasedSuggestions}
                style={styles.suggestionsButton}
                icon="lightbulb-outline"
              >
                Get Suggestions
              </Button>
            </Card.Content>
          </Card>
        )}

        {/* Nearby Points of Interest */}
        {nearbyPOIs.length > 0 && (
          <Card style={styles.poisCard}>
            <Card.Content>
              <Title>Nearby Places</Title>
              <View style={styles.poisContainer}>
                {nearbyPOIs.map((poi, index) => (
                  <Chip key={index} style={styles.poiChip} icon="map-marker">
                    {poi}
                  </Chip>
                ))}
              </View>
            </Card.Content>
          </Card>
        )}

        {/* Location Settings */}
        <Card style={styles.settingsCard}>
          <Card.Content>
            <Title>Location Settings</Title>
            <View style={styles.settingRow}>
              <Text style={styles.settingLabel}>Enable location tracking</Text>
              <Switch value={isLocationEnabled} onValueChange={setIsLocationEnabled} />
            </View>
          </Card.Content>
        </Card>

        {/* Add New Automation */}
        <Card style={styles.automationCard}>
          <Card.Content>
            <Title>Add Location Automation</Title>
            
            <TextInput
              label="Location name"
              value={newAutomation.location}
              onChangeText={(text) => setNewAutomation({...newAutomation, location: text})}
              mode="outlined"
              style={styles.input}
            />
            
            <TextInput
              label="Action to perform"
              value={newAutomation.action}
              onChangeText={(text) => setNewAutomation({...newAutomation, action: text})}
              mode="outlined"
              multiline
              style={styles.input}
            />
            
            <TextInput
              label={`Trigger radius (${newAutomation.radius}m)`}
              value={newAutomation.radius.toString()}
              onChangeText={(text) => setNewAutomation({...newAutomation, radius: parseInt(text) || 100})}
              mode="outlined"
              keyboardType="numeric"
              style={styles.input}
            />
            
            <Button 
              mode="contained" 
              onPress={addAutomation}
              style={styles.addButton}
              icon="plus"
            >
              Add Automation
            </Button>
          </Card.Content>
        </Card>

        {/* Existing Automations */}
        <Card style={styles.automationsListCard}>
          <Card.Content>
            <Title>Active Automations</Title>
            {automations.length === 0 ? (
              <Paragraph>No automations configured</Paragraph>
            ) : (
              automations.map((automation) => (
                <View key={automation.id} style={styles.automationItem}>
                  <View style={styles.automationInfo}>
                    <Text style={styles.automationLocation}>{automation.location}</Text>
                    <Text style={styles.automationAction}>{automation.action}</Text>
                    <Text style={styles.automationRadius}>Radius: {automation.radius}m</Text>
                  </View>
                  
                  <View style={styles.automationControls}>
                    <Switch 
                      value={automation.isActive} 
                      onValueChange={() => toggleAutomation(automation.id)} 
                    />
                    <Button 
                      mode="text" 
                      onPress={() => deleteAutomation(automation.id)}
                      compact
                    >
                      <Ionicons name="trash-outline" size={20} color="#FF5722" />
                    </Button>
                  </View>
                </View>
              ))
            )}
          </Card.Content>
        </Card>
      </ScrollView>
    </LinearGradient>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  content: {
    flex: 1,
    padding: 20,
  },
  locationCard: {
    marginBottom: 15,
  },
  locationHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 10,
  },
  address: {
    fontSize: 16,
    fontWeight: '500',
    marginBottom: 5,
  },
  coordinates: {
    fontSize: 14,
    color: '#666',
    marginBottom: 5,
  },
  accuracy: {
    fontSize: 12,
    color: '#888',
  },
  insightsCard: {
    marginBottom: 15,
  },
  suggestionsButton: {
    marginTop: 10,
  },
  poisCard: {
    marginBottom: 15,
  },
  poisContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    marginTop: 10,
  },
  poiChip: {
    margin: 2,
  },
  settingsCard: {
    marginBottom: 15,
  },
  settingRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  settingLabel: {
    fontSize: 16,
  },
  automationCard: {
    marginBottom: 15,
  },
  input: {
    marginBottom: 10,
  },
  addButton: {
    marginTop: 10,
  },
  automationsListCard: {
    marginBottom: 20,
  },
  automationItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 10,
    borderBottomWidth: 1,
    borderBottomColor: '#eee',
  },
  automationInfo: {
    flex: 1,
  },
  automationLocation: {
    fontSize: 16,
    fontWeight: '500',
    marginBottom: 2,
  },
  automationAction: {
    fontSize: 14,
    color: '#666',
    marginBottom: 2,
  },
  automationRadius: {
    fontSize: 12,
    color: '#888',
  },
  automationControls: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  permissionCard: {
    margin: 20,
  },
  permissionButton: {
    marginTop: 15,
  },
});
