import React, { useContext, useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, ImageBackground } from 'react-native';
import { Button } from 'react-native-paper'; // Importa o botão do React Native Paper
import { api } from '../config/api';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { ContextAuth } from '../context/AuthProvider';

export default function LoginScreen({ navigation }) {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false); // Estado para controlar o loading
  const { setUser } = useContext(ContextAuth);

  const handleLogin = async () => {
    setLoading(true); // Ativa o loading
    try {
      const response = await api.post('/sessions', {
        login: username,
        password: password,
      });
      await AsyncStorage.setItem("token", response.data.token);
      await AsyncStorage.setItem("user", JSON.stringify(response.data));

      console.log(response.data);
      setUser(response.data);

      if (response.status === 201) {
        navigation.navigate('FeedScreen');
      }
    } catch (error) {
      alert("Ocorreu um erro interno");
    } finally {
      setLoading(false); // Desativa o loading após a tentativa de login
    }
  };

  return (
    <ImageBackground
      source={{ uri: 'https://s3.amazonaws.com/media.wikiaves.com.br/images/6811/1186696_67d6634710066d257fb52aeae9763435.jpg' }}
      style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}
      resizeMode="cover"
    >
      <View style={{
        width: '90%',
        backgroundColor: 'rgba(255, 255, 255, 0.8)', // Fundo branco semi-transparente
        borderRadius: 10,
        padding: 20,
        alignItems: 'center',
      }}>
        <Text style={{
          fontSize: 36,
          fontWeight: 'bold',
          color: '#0E4C92',
          marginBottom: 20,
        }}>
          Papacapim
        </Text>
        <TextInput
          style={{
            width: '100%',
            height: 50,
            borderColor: '#0E4C92',
            borderWidth: 1,
            borderRadius: 5,
            marginBottom: 15,
            paddingHorizontal: 10,
            backgroundColor: 'white', // Fundo branco para os campos de entrada
          }}
          placeholder="Nome de usuário"
          value={username}
          onChangeText={setUsername}
        />
        <TextInput
          style={{
            width: '100%',
            height: 50,
            borderColor: '#0E4C92',
            borderWidth: 1,
            borderRadius: 5,
            marginBottom: 15,
            paddingHorizontal: 10,
            backgroundColor: 'white', // Fundo branco para os campos de entrada
          }}
          placeholder="Senha"
          value={password}
          onChangeText={setPassword}
          secureTextEntry
        />
        <Button
          mode="contained"
          loading={loading} // Define se o botão está em loading
          onPress={handleLogin}
          style={{
            width: '100%',
            height: 50,
            backgroundColor: '#0E4C92',
            justifyContent: 'center',
            alignItems: 'center',
            borderRadius: 5,
          }}
        >
          {loading ? 'Carregando...' : 'Entrar'} {/* Texto do botão baseado no estado */}
        </Button>
        <TouchableOpacity onPress={() => navigation.navigate('SignUpScreen')}>
          <Text style={{
            color: '#0E4C92',
            marginTop: 15,
          }}>Não tem uma conta? Cadastre-se</Text>
        </TouchableOpacity>
      </View>
    </ImageBackground>
  );
}
