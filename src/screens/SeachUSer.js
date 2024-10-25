import React, { useState } from 'react';
import { View, TextInput, Text, StyleSheet, TouchableOpacity, ToastAndroid, FlatList } from 'react-native';
import { api } from '../config/api';

export default function SearchUsersScreen() {
  const [searchQuery, setSearchQuery] = useState('');
  const [users, setUsers] = useState([]);

  const handleSearch = async (query) => {
    try {
      if (query.trim() === '') {
        setUsers([]);
        return;
      }

      const response = await api.get(`/users?search=${query}`);
      setUsers(response.data);
    } catch (error) {
      console.error(error);
      ToastAndroid.show('Usuário não encontrado!', ToastAndroid.SHORT);
    }
  };

  const renderItem = ({ item }) => (
    <View style={styles.userContainer}>
      <Text style={styles.userText}>Nome: {item.name}</Text>
      <Text style={styles.userText}>Login: {item.login}</Text>
      <TouchableOpacity style={styles.followButton} onPress={() => {
        ToastAndroid.show('Você está seguindo esse usuário!', ToastAndroid.SHORT);
      }}>
        <Text style={styles.followButtonText}>Seguir</Text>
      </TouchableOpacity>
    </View>
  );

  return (
    <View style={styles.container}>
      <TextInput 
        style={styles.input} 
        placeholder="Buscar Usuário" 
        value={searchQuery} 
        onChangeText={text => {
          setSearchQuery(text);
          handleSearch(text);
        }} 
      />
      <FlatList 
        style={styles.list}
        data={users}
        renderItem={renderItem}
        keyExtractor={(item) => item?.id?.toString()}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'flex-start',
    alignItems: 'center',
    backgroundColor: 'white',
    paddingHorizontal: 20,
    paddingTop: 50,
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
  list: {
    width: '100%',
    height: '90%',
  },
  userContainer: {
    backgroundColor: '#f9f9f9',
    padding: 15,
    borderRadius: 5,
    marginTop: 20,
    width: '100%',
  },
  userText: {
    fontSize: 16,
    marginBottom: 5,
  },
  followButton: {
    backgroundColor: '#0E4C92',
    paddingVertical: 10,
    borderRadius: 5,
    alignItems: 'center',
  },
  followButtonText: {
    color: '#fff',
    fontSize: 16,
  },
});
