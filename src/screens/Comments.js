import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, FlatList, Alert, TextInput, TouchableOpacity } from 'react-native';
import { api } from '../config/api';

export default function Comments({ route }) {
    const { currentPost } = route.params;
    const [newComment, setNewComment] = useState('');
    const [replies, setReplies] = useState([]);

    const fetchReplies = async () => {
        try {
            const response = await api.get(`/posts/${currentPost.id}/replies`);
            setReplies(response.data);
        } catch (error) {
            console.error('Erro ao buscar respostas:', error);
        }
    };

    useEffect(() => {
        fetchReplies();
    }, []);

    const addReply = async () => {
        if (newComment.trim()) {
            try {
                const response = await api.post(`/posts/${currentPost.id}/replies`, {
                    reply: {
                        message: newComment,
                    },
                });
                const newReply = response.data;
                setReplies([...replies, newReply]);
                setNewComment('');
            } catch (error) {
                console.error('Erro ao adicionar resposta:', error);
                Alert.alert('Erro', 'Não foi possível adicionar a resposta.');
            }
        } else {
            Alert.alert('Aviso', 'O comentário não pode estar vazio.');
        }
    };

    const renderComment = ({ item }) => (
        <View style={styles.commentContainer}>
            <Text style={styles.commentText}>{item.message}</Text>
            <Text style={styles.commentUser}>Comentado por: {item.user_login}</Text>
        </View>
    );

    return (
        <View style={styles.container}>
            {/* Exibe o login do usuário que postou e a mensagem */}
            <Text style={styles.userLogin}>Postado por: {currentPost.user_login}</Text>
            <Text style={styles.postTitle}>{currentPost.message}</Text>

            {/* Renderiza as respostas da postagem */}
            {replies.length > 0 ? (
                <FlatList
                    data={replies}
                    renderItem={renderComment}
                    keyExtractor={(item) => item.id.toString()}
                    contentContainerStyle={styles.commentList}
                />
            ) : (
                <Text style={styles.noComments}>Sem respostas ainda.</Text>
            )}

            {/* Campo de texto para adicionar uma nova resposta */}
            <TextInput
                style={styles.input}
                placeholder="Adicionar uma resposta..."
                value={newComment}
                onChangeText={setNewComment}
            />
            <TouchableOpacity style={styles.button} onPress={addReply}>
                <Text style={styles.buttonText}>Enviar</Text>
            </TouchableOpacity>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#f9f9f9', // Fundo suave
        padding: 16,
        borderRadius: 8,
        elevation: 2,
    },
    userLogin: {
        fontSize: 16,
        fontWeight: 'bold',
        color: '#333',
        marginBottom: 4,
    },
    postTitle: {
        fontSize: 20,
        fontWeight: 'bold',
        marginBottom: 16,
        color: '#0E4C92', // Cor do título
    },
    commentList: {
        paddingBottom: 16,
    },
    commentContainer: {
        marginBottom: 12,
        padding: 14,
        borderRadius: 10,
        backgroundColor: '#ffe0f0', // Rosa claro
        borderColor: '#f06292', // Rosa mais escuro
        borderWidth: 1,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.2,
        shadowRadius: 2,
    },
    commentText: {
        fontSize: 14,
        color: '#333', // Cor do texto das respostas
    },
    commentUser: {
        fontSize: 12,
        color: '#555',
        marginTop: 4,
    },
    input: {
        height: 48,
        borderColor: '#0E4C92',
        borderWidth: 2,
        borderRadius: 8,
        paddingHorizontal: 10,
        marginVertical: 16,
        backgroundColor: '#ffffff', // Fundo do input
    },
    button: {
        backgroundColor: '#0E4C92', // Azul para o botão
        borderRadius: 8,
        paddingVertical: 12,
        alignItems: 'center',
        elevation: 3,
    },
    buttonText: {
        color: '#fff',
        fontWeight: 'bold',
        fontSize: 16,
    },
    noComments: {
        fontSize: 14,
        color: '#888',
        textAlign: 'center', // Centraliza o texto
    },
});
