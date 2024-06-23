// ActivityHistory.js
import React, { useState, useEffect } from 'react';
import { View, Text, Button, ActivityIndicator } from 'react-native';
import axios from 'axios';
import styles from '../styles/act'

const ActivityHistory = () => {
  const [name, setName] = useState('');
  const [loading, setLoading] = useState(false);

  const fetchName = async () => {
    setLoading(true);
    try {
      const response = await axios.get('https://api.namefake.com/');
      setName(response.data.name);
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchName();
  }, []);

  return (
    <View style={styles.container}>
      {loading ? (
        <ActivityIndicator size="large" color="#0000ff" />
      ) : (
        <Text style={styles.name}>{name}</Text>
      )}
      <Button title="Fetch New Name" onPress={fetchName} />
    </View>
  );
};

export default ActivityHistory;
