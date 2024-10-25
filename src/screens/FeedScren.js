import React, { useContext, useEffect, useState } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, FlatList, Alert, Modal, Button, Pressable, TextInput } from 'react-native';
import { Avatar, IconButton } from 'react-native-paper';
import { api } from '../config/api';
import AntDesign from '@expo/vector-icons/AntDesign';
import { ContextAuth } from '../context/AuthProvider';

export default function FeedScreen({ navigation }) {
  const [posts, setPosts] = useState([]);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [page, setPage] = useState(0);
  const [loading, setLoading] = useState(false);
  const [hasMore, setHasMore] = useState(true);
  const [modalVisible, setModalVisible] = useState(false);
  const [postToDelete, setPostToDelete] = useState(null);
  const { user } = useContext(ContextAuth)
  const fetchPosts = async (pageNumber) => {
    if (!hasMore) return;

    try {
      setLoading(true);
      const response = await api.get(`/posts?page=${pageNumber}`);
      const itensFiltrados = response.data.filter(item => item.post_id === null); // Filtra posts sem post_id

      const postsWithLikes = await Promise.all(itensFiltrados.map(async (post) => {
        const likesResponse = await api.get(`/posts/${post.id}/likes`);
        const userLiked = likesResponse.data.some(like => like.user_login === user.user_login);
        return { ...post, likes: likesResponse.data, userLiked };
      }));

      if (pageNumber === 0) {
        setPosts(postsWithLikes);
      } else {
        setPosts(prevPosts => [...prevPosts, ...postsWithLikes]);
      }
    } catch (error) {
      console.error(error);
      Alert.alert('Erro', 'Erro ao buscar as postagens');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchPosts(page);
  }, []);

  const handleRefresh = () => {
    setIsRefreshing(true);
    setPosts([]);
    setPage(0);
    setHasMore(true);
    fetchPosts(0).then(() => setIsRefreshing(false));
  };

  const loadMorePosts = () => {
    if (!loading && hasMore) {
      setPage(prevPage => {
        const nextPage = prevPage + 1;
        fetchPosts(nextPage);
        return nextPage;
      });
    }
  };

  const confirmDeletePost = (postId) => {
    setPostToDelete(postId);
    setModalVisible(true);
  };

  const deletePost = async () => {
    try {
      await api.delete(`/posts/${postToDelete}`);
      setPosts(posts.filter(post => post.id !== postToDelete));
      setModalVisible(false);
      setPostToDelete(null);
    } catch (error) {
      console.error(error);
      Alert.alert('Erro', 'Não foi possível excluir a postagem.');
    }
  };

  const handleLike = async (item) => {
    try {
      let newPosts = [...posts];
      const index = newPosts.findIndex((post) => post.id === item.id);

      if (item.userLiked) {
        const likeId = item.likes.find(like => like.user_login === user.user_login).id;
        await api.delete(`/posts/${item.id}/likes/${likeId}`);
        newPosts[index].likes = newPosts[index].likes.filter(like => like.user_login !== user.user_login);
        newPosts[index].userLiked = false;
      } else {
        const response = await api.post(`/posts/${item.id}/likes`, { user_login: user.user_login });
        newPosts[index].likes.push(response.data);
        newPosts[index].userLiked = true;
      }

      setPosts(newPosts);
    } catch (error) {
      console.error(error);
      Alert.alert('Erro', 'Não foi possível curtir/descurtir a postagem.');
    }
  };

  const renderItem = ({ item }) => (
    <View style={styles.postContainer}>
      <Avatar.Text size={40} style={{backgroundColor:"red"}} label={item.user_login.charAt(0).toUpperCase()} />
      <Pressable onPress={() => navigation.navigate("Comments", { currentPost: item })} style={styles.postContent}>
        <Text style={styles.postUser}>{item.user_login}</Text>
        <Text style={styles.postMessage}>{item.message}</Text>
      </Pressable>
      <TouchableOpacity style={styles.threeDots} onPress={() => confirmDeletePost(item.id)}>
        <AntDesign name="ellipsis1" size={24} color="black" />
      </TouchableOpacity>
      <IconButton
        icon={item.userLiked ? "heart" : "heart-outline"}
        iconColor={item.userLiked ? 'red' : 'black'}
        size={22}
        onPress={() => handleLike(item)}
      />
    </View>
  );

  return (
    <View style={styles.container}>
    
      <FlatList
        data={posts}
        renderItem={renderItem}
        keyExtractor={item => item.id.toString()}
        onRefresh={handleRefresh}
        refreshing={isRefreshing}
        onEndReached={loadMorePosts}
        onEndReachedThreshold={0.5}
      />
      {loading && <Text style={styles.loadingText}>Carregando mais postagens...</Text>}

      <TouchableOpacity  onPress={() => navigation.navigate('SearchPosts')} style={styles.postButton2}>
        <AntDesign name="search1" size={24} color="white" />
      </TouchableOpacity>

      <TouchableOpacity style={styles.postButton} onPress={() => navigation.navigate('PostScreen')}>
        <AntDesign name="addfile" size={24} color="white" />
      </TouchableOpacity>

      <Modal transparent={true} visible={modalVisible} animationType="slide">
            <View style={{
                flex: 1,
                justifyContent: 'center',
                alignItems: 'center',
                backgroundColor: 'rgba(0, 0, 0, 0.5)', // Fundo semi-transparente
            }}>
                <View style={{
                    width: '80%',
                    padding: 20,
                    borderRadius: 10,
                    backgroundColor: '#0E4C92', // Cor azul
                    alignItems: 'center',
                    elevation: 5,
                }}>
                    <Text style={{
                        fontSize: 18,
                        color: '#fff', // Texto branco
                        marginBottom: 20,
                        textAlign: 'center',
                    }}>
                        Tem certeza que deseja excluir esta postagem?
                    </Text>
                    <View style={{
                        flexDirection: 'row',
                        justifyContent: 'space-between',
                        width: '100%',
                    }}>
                        <Button title="Excluir" onPress={deletePost} color="red" />
                        <Button title="Cancelar" onPress={() => setModalVisible(false)} color="green" />
                    </View>
                </View>
            </View>
        </Modal>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: 'white',
    paddingHorizontal: 20,
  },
  inputContainer: {
    marginVertical: 10,
    borderRadius: 8,
    overflow: 'hidden',
    backgroundColor: '#fff',
    elevation: 2,
  },
  input: {
    height: 50,
    paddingHorizontal: 10,
    fontSize: 16,
  },
  postButton: {
    backgroundColor: '#0E4C92',
    borderRadius: 100,
    alignItems: 'center',
    justifyContent: "center",
    marginVertical: 10,
    position: "absolute",
    bottom: 12,
    right: 20,
    height: 60,
    width: 60,
  },

  postButton2: {
    backgroundColor: '#003366',
    borderRadius: 100,
    alignItems: 'center',
    justifyContent: "center",
    marginVertical: 10,
    position: "absolute",
    bottom: 85,
    right: 20,
    height: 60,
    width: 60,
  },
  postContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'pink',
    padding: 10,
    borderRadius: 10,
    marginVertical: 5,
  },
  postContent: {
    marginLeft: 10,
    flex: 1,
  },
  postUser: {
    fontWeight: 'bold',
    fontSize: 16,
  },
  postMessage: {
    fontSize: 14,
    color: '#555',
  },
  threeDots: {
    marginLeft: 10,
  },
  loadingText: {
    textAlign: 'center',
    marginVertical: 10,
  },
  modalContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
  },
  modalContent: {
    width: '80%',
    padding: 20,
    backgroundColor: 'white',
    borderRadius: 10,
    alignItems: 'center',
  },
});
