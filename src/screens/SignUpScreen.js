import React, { useContext, useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, Alert } from 'react-native';
import axios from 'axios';
import { api } from '../config/api';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { ContextAuth } from '../context/AuthProvider';

export default function SignUpScreen({ navigation }) {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [name, setName] = useState('');
  const { user, setUser } = useContext(ContextAuth);

  const handleLogin = async () => {
    try {
      const response = await api.post('/sessions', {
        login: username,
        password: password,
      });
      await AsyncStorage.setItem("token", response.data.token)
      await AsyncStorage.setItem("user", JSON.stringify(response.data))

      console.log(response.data);
      setUser(response.data)

      if (response.status === 201) {
        navigation.navigate('FeedScreen');
      }
    } catch (error) {
      console.error(error);
    }
  };

  const handleCadastro = async () => {
    try {
      const response = await api.post('/users', {
        user: {
          login: username,
          name: name,
          password: password,
          password_confirmation: password,
        },
      });
      Alert.alert(`Parabéns, ${username}`, `Sua conta foi criada com sucesso`)
      await handleLogin();
    } catch (error) {
      console.error(error);
      alert("Ocorreu um erro ao criar usuário")
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.logo}>Papacapim</Text>
      <TextInput
        style={styles.input}
        placeholder="Nome"
        value={name}
        onChangeText={setName}
      />
      <TextInput
        style={styles.input}
        placeholder="Nome de usuário"
        value={username}
        onChangeText={setUsername}
      />
      <TextInput
        style={styles.input}
        placeholder="Senha"
        value={password}
        onChangeText={setPassword}
        secureTextEntry
      />
      <TouchableOpacity style={styles.button} onPress={handleCadastro}>
        <Text style={styles.buttonText}>Cadastrar</Text>
      </TouchableOpacity>
      <TouchableOpacity onPress={() => navigation.goBack()}>
        <Text style={styles.linkText}>Já tem uma conta? Entre</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'white',
    paddingHorizontal: 20,
  },
  logo: {
    fontSize: 36,
    fontWeight: 'bold',
    color: '#0E4C92',
    marginBottom: 20,
  },
  input: {
    width: '100%',
    height: 50,
    borderColor: '#0E4C92',
    borderWidth: 1,
    borderRadius: 5,
    marginBottom: 15,
    paddingHorizontal: 10,
  },
  button: {
    width: '100%',
    height: 50,
    backgroundColor: '#0E4C92',
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 5,
  },
  buttonText: {
    color: '#fff',
    fontSize: 18,
  },
  linkText: {
    color: '#0E4C92',
    marginTop: 15,
  },
});
