import React, { useState } from 'react';
import { View, TextInput, Text, TouchableOpacity, StyleSheet, ScrollView, Alert } from 'react-native';
import { api } from '../config/api';

export default function PostScreen({ navigation }) {
  const [post, setPost] = useState(''); // Post original
  const [comment, setComment] = useState(''); // Comentário atual
  const [comments, setComments] = useState([]); // Lista de comentários

  const handlePost = async () => {
    if (!post.trim()) {
      Alert.alert('Erro', 'Por favor, escreva algo para postar.');
      return;
    }

    try {
      const response = await api.post('/posts', {
        post: {
          message: post,
        },
      });

      if (response.status === 201) {
        Alert.alert('Sucesso', 'Postagem criada com sucesso!');
        setPost('');
      }
    } catch (error) {
      console.error(error);
      Alert.alert('Erro', 'Não foi possível criar a postagem.');
    }
  };

  return (
    <ScrollView style={styles.container}>
      <View>
        <TextInput 
          style={styles.textArea}
          placeholder="Escreva sua postagem..." 
          value={post} 
          onChangeText={setPost} 
          multiline
          numberOfLines={4}
        />
        <TouchableOpacity style={styles.button} onPress={handlePost}>
          <Text style={styles.buttonText}>Postar</Text>
        </TouchableOpacity>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    paddingHorizontal: 20,
  },
  textArea: {
    height: 100,
    borderColor: '#ccc',
    borderWidth: 1,
    borderRadius: 5,
    paddingHorizontal: 10,
    marginBottom: 20,
    textAlignVertical: 'top',
  },
  button: {
    backgroundColor: '#0E4C92',
    paddingVertical: 15,
    borderRadius: 5,
    alignItems: 'center',
    marginVertical: 10,
  },
  buttonText: {
    color: '#fff',
    fontSize: 18,
  },
  commentSection: {
    marginTop: 20,
  },
  sectionTitle: {
    fontSize: 22,
    fontWeight: 'bold',
    marginBottom: 10,
    color: '#0E4C92',
  },
  commentInput: {
    height: 60,
    borderColor: '#ccc',
    borderWidth: 1,
    borderRadius: 5,
    paddingHorizontal: 10,
    marginBottom: 10,
    textAlignVertical: 'top',
  },
  commentsList: {
    marginTop: 10,
  },
  commentContainer: {
    backgroundColor: '#f1f1f1',
    padding: 10,
    borderRadius: 5,
    marginBottom: 10,
  },
  commentText: {
    fontSize: 16,
    color: '#333',
  },
});
