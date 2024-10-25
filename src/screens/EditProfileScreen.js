import React, { useContext, useState, useEffect } from 'react';
import { View, Text, Alert, StyleSheet } from 'react-native';
import { TextInput, Button, Avatar } from 'react-native-paper';
import { ContextAuth } from '../context/AuthProvider';
import { api } from '../config/api';

export default function EditProfileScreen({ navigation }) {
  const { logout, user } = useContext(ContextAuth);
  const [newUsername, setNewUsername] = useState('');
  const [newName, setNewName] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [loading, setLoading] = useState(false); // Estado de loading

  useEffect(() => {
    if (user) {
      setNewUsername(user.user_login);
      setNewName(user.name || '');
    }
  }, [user]);

  const handleUpdate = async () => {
    if (!newUsername || !newName || !newPassword) {
      Alert.alert('Erro', 'Por favor, preencha todos os campos.');
      return;
    }

    setLoading(true); // Ativa o loading
    try {
      const response = await api.patch(`/users/${user.id}`, {
        user: {
          login: newUsername,
          name: newName,
          password: newPassword,
          password_confirmation: newPassword,
        },
      });
      logout();
      Alert.alert('Usuário atualizado', 'Crie uma nova sessão');
    } catch (error) {
      console.error(error);
      Alert.alert('Erro', 'Não foi possível atualizar os dados.');
    } finally {
      setLoading(false); // Desativa o loading
    }
  };

  const handleDelete = async () => {
    try {
      await api.delete(`/users/${user.id}`);
      logout();
      Alert.alert('Conta excluída', 'Sua conta foi excluída com sucesso');
    } catch (error) {
      console.error(error);
      Alert.alert('Erro', 'Não foi possível excluir a conta.');
    }
  };

  const handleCancel = () => {
    navigation.goBack();
  };

  return (
    <View style={styles.container}>
      <View style={styles.avatarContainer}>
        <Avatar.Text size={60} label={user.user_login.charAt(0).toUpperCase()} />
        <Text style={styles.title}>{user?.user_login ? user?.user_login : "Minha conta"}</Text>
      </View>
      <Text style={styles.title}>Editar Perfil</Text>
      <TextInput
        label="Nome de Usuário"
        value={newUsername}
        onChangeText={setNewUsername}
        style={styles.input}
        mode="outlined"
      />
      <TextInput
        label="Nome"
        value={newName}
        onChangeText={setNewName}
        style={styles.input}
        mode="outlined"
      />
      <TextInput
        label="Nova Senha"
        value={newPassword}
        onChangeText={setNewPassword}
        secureTextEntry
        style={styles.input}
        mode="outlined"
      />
      <Button
        mode="contained"
        onPress={handleUpdate}
        loading={loading} // Ativa o loading no botão
        style={styles.button}
      >
        Salvar Alterações
      </Button>
      <Button
        mode="outlined"
        onPress={handleCancel}
        style={styles.cancelButton}
      >
        Cancelar
      </Button>
      <Button
        mode="contained"
        onPress={handleDelete}
        style={[styles.cancelButton, { backgroundColor: 'red' }]}
      >
        Excluir Conta
      </Button>
      <Button
        mode="outlined"
        onPress={() => logout()}
        style={styles.cancelButton}
      >
        Sair da conta
      </Button>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: 'white',
    paddingHorizontal: 20,
    justifyContent: 'center',
  },
  avatarContainer: {
    alignItems: 'center',
    marginBottom: 20,
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#0E4C92',
    marginBottom: 20,
    textAlign: 'center',
  },
  input: {
    marginBottom: 15,
  },
  button: {
    marginBottom: 10,
  },
  cancelButton: {
    marginBottom: 10,
  },
});
