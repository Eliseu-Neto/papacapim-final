import React, { useState } from 'react';
import { ActivityIndicator, Pressable, ScrollView, StyleSheet, Text, View, TextInput } from 'react-native';
import { api } from '../config/api';

export default function SearchPosts({ navigation }) {
  const [searchQuery, setSearchQuery] = useState('');
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(false);

  async function searchPosts(search) {
    try {
      setLoading(true);
      const response = await api.get("/posts", {
        params: {
          search: search,
          page: 0,
        }
      });
      setPosts(response.data);
      setLoading(false);
    } catch (error) {
      console.log(error);
      setLoading(false);
    }
  }

  const onChangeSearch = async (search) => {
    setSearchQuery(search);
    if (search.length > 0) {
      searchPosts(search);
    } else {
      setPosts([]);
    }
  };

  return (
    <View style={styles.container}>
      <View style={styles.searchContainer}>
        <TextInput
          style={styles.input}
          placeholder="Pesquisar postagens"
          value={searchQuery}
          onChangeText={onChangeSearch}
          autoCapitalize="none"
          autoCorrect={false}
          clearButtonMode="while-editing"
        />
      </View>

      {loading ? (
        <ActivityIndicator size="large" color="#0E4C92" />
      ) : (
        <ScrollView contentContainerStyle={styles.scrollView}>
          {posts.length > 0 ? (
            posts.map((post) => (
              <Pressable 
                onPress={() => navigation.navigate("Comments", { currentPost: post })}
                android_ripple={{ color: "gray" }} 
                key={post.id} 
                style={styles.postContainer}
              >
                <Text style={styles.postUser}>{post.user_login}</Text>
                <Text style={styles.postMessage}>{post.message}</Text>
              </Pressable>
            ))
          ) : (
            <Text style={styles.noResultsText}>Nenhuma postagem encontrada.</Text> 
          )}
        </ScrollView>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 10,
    backgroundColor: '#f0f4f8', // Fundo claro
  },
  searchContainer: {
    justifyContent: "center",
    alignItems: "center",
    flexDirection: "row",
    padding: 5,
    marginBottom: 10,
  },
  input: {
    width: '100%',
    height: 50,
    borderColor: '#0E4C92',
    borderWidth: 2,
    borderRadius: 5,
    paddingHorizontal: 10,
    backgroundColor: '#ffffff', // Fundo do input
  },
  scrollView: {
    flexGrow: 1,
  },
  postContainer: {
    backgroundColor: "#ffebee", // Rosa claro
    borderWidth: 1,
    borderColor: "#f06292", // Rosa mais escuro
    borderRadius: 10,
    padding: 15,
    marginBottom: 10,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 2,
    elevation: 3,
  },
  postUser: {
    fontWeight: 'bold',
    fontSize: 18,
    color: '#d81b60', // Rosa escuro
  },
  postMessage: {
    fontSize: 16,
    color: '#333',
  },
  noResultsText: {
    textAlign: 'center',
    marginTop: 20,
    fontSize: 16,
    color: '#777',
  },
});
