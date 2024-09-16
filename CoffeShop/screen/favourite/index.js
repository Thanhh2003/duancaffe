import React, { useEffect, useState, useCallback } from "react";
import {
  View,
  Text,
  StyleSheet,
  Image,
  TouchableOpacity,
  ScrollView,
  Alert,
  RefreshControl,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { useNavigation, useFocusEffect } from "@react-navigation/native";

const url_api = "http://192.168.30.102:3000/products?";

const Favorite = () => {
  const [favoriteItems, setFavoriteItems] = useState([]);
  const [refreshing, setRefreshing] = useState(false);
  const navigation = useNavigation();

  const onRefresh = useCallback(() => {
    setRefreshing(true);
    getFavoritesfromAPI().then(() => setRefreshing(false));
  }, []);

  const getFavoritesfromAPI = async () => {
    try {
      let res = await fetch(url_api);
      let data = await res.json();
      setFavoriteItems(data.filter((item) => item.isFavorite));
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    getFavoritesfromAPI();
  }, []);

  useFocusEffect(
    useCallback(() => {
      getFavoritesfromAPI();
    }, [])
  );

  const handleRemoveFavorite = async (id) => {
    try {
      const res = await fetch(`http://192.168.30.102:3000/products/${id}`);
      const data = await res.json();
      const updatedProduct = { ...data, isFavorite: false };

      const updateRes = await fetch(
        `http://192.168.30.102:3000/products/${id}`,
        {
          method: "PUT",
          headers: {
            Accept: "application/json",
            "Content-Type": "application/json",
          },
          body: JSON.stringify(updatedProduct),
        }
      );

      if (updateRes.status === 200) {
        Alert.alert("Notification", "Successfully removed from favorites");
        setFavoriteItems(favoriteItems.filter((item) => item.id !== id)); // Update state directly
      }
    } catch (error) {
      console.log(error);
    }
  };

  const handleFavoriteItemPress = (item) => {
    navigation.navigate("aaa", {
      data: item.image,
      namePro: item.nameProduct,
      withwhere: item.description,
      money: item.price,
      favorite: item.isFavorite,
      id: item.id,
      category: item.category,
      onUpdateFavorite: getFavoritesfromAPI, // Pass the update function
    });
  };

  return (
    <ScrollView
      style={styles.container}
      refreshControl={
        <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
      }
    >
      <Text style={styles.title}> List Favorite</Text>

      {favoriteItems.map((item) => (
        <TouchableOpacity
          key={item.id}
          style={styles.favoriteItem}
          onPress={() => handleFavoriteItemPress(item)}
        >
          <Image
            style={styles.favoriteItemImage}
            source={{ uri: item.image }}
          />
          <View style={styles.favoriteItemInfo}>
            <Text style={styles.favoriteItemName}>{item.nameProduct}</Text>
            <Text style={styles.favoriteItemDescription}>
              {item.description}
            </Text>
            <Text style={styles.favoriteItemPrice}>$ {item.price}</Text>
          </View>
          <TouchableOpacity
            style={styles.favoriteItemRemoveButton}
            onPress={() => handleRemoveFavorite(item.id)}
          >
            <Ionicons name="trash-outline" size={24} color="red" />
          </TouchableOpacity>
        </TouchableOpacity>
      ))}
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
    padding: 20,
  },
  title: {
    fontSize: 25,
    fontWeight: "bold",
    marginBottom: 20,
    marginTop: 40,
  },
  favoriteItem: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 20,
  },
  favoriteItemImage: {
    width: 80,
    height: 80,
    borderRadius: 10,
  },
  favoriteItemInfo: {
    flex: 1,
    marginHorizontal: 15,
  },
  favoriteItemName: {
    fontSize: 18,
    fontWeight: "bold",
  },
  favoriteItemDescription: {
    fontSize: 14,
    color: "#555",
  },
  favoriteItemPrice: {
    fontSize: 16,
    fontWeight: "bold",
    color: "#055E38",
    marginTop: 5,
  },
  favoriteItemRemoveButton: {
    padding: 10,
    borderRadius: 5,
  },
});

export default Favorite;
