import React, { useState } from 'react';
import { Text, View, TextInput, Button, StyleSheet } from 'react-native';
import { Storage } from 'expo-storage'
export default function SetupScreen({ navigation }) {
  const [apiKey, setApiKey] = useState('');

  const handleSave = () => {
    // Save the API key to local storage or database
    Storage.setItem({
        key: `API_KEY`,
        value: apiKey
      })
    navigation.goBack();
  }

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Enter your API Key:</Text>
      <TextInput
        style={styles.input}
        onChangeText={text => setApiKey(text)}
        value={apiKey}
        placeholder="API Key"
        placeholderTextColor="#666"
      />
      <Button
        title="Save"
        onPress={handleSave}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#fff',
  },
  title: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 20,
  },
  input: {
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 5,
    padding: 10,
    width: '80%',
    marginBottom: 20,
  },
});
