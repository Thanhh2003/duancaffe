import React, { useState } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  Image,
  StyleSheet,
  FlatList,
  RefreshControl,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { useFocusEffect } from "@react-navigation/native";
import QuantitySelector from "../quantitySelector";

const url_cart = "http://192.168.30.102:3000/carts";

const Cart = ({ navigation }) => {
  const [products, setProducts] = useState([]);
  const [total, setTotal] = useState(0);
  const [totalItems, setTotalItems] = useState(0);
  const [refreshing, setRefreshing] = useState(false);

  useFocusEffect(
    React.useCallback(() => {
      getProductFromAPI();
    }, [])
  );

  const getProductFromAPI = () => {
    setRefreshing(true);
    fetch(url_cart)
      .then((res) => res.json())
      .then((data) => {
        setProducts(data);
        calculateTotal(data);
        setTotalItems(data.length);
        setRefreshing(false);
      })
      .catch((error) => {
        console.error("Error fetching products: ", error);
        setRefreshing(false);
      });
  };

  const calculateTotal = (data) => {
    let totalAmount = 0;
    data.forEach((item) => {
      totalAmount += item.price * item.quantity;
    });
    setTotal(totalAmount);
  };

  const handleQuantityChange = (newQuantity, index) => {
    const updatedProducts = [...products];
    updatedProducts[index].quantity = newQuantity;
    setProducts(updatedProducts);
    calculateTotal(updatedProducts);
  };

  const handleRemoveCart = (id) => {
    let url_del = `${url_cart}/${id}`;
    fetch(url_del, {
      method: "DELETE",
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json",
      },
    })
      .then((res) => {
        if (res.status === 200) {
          const updatedProducts = products.filter(
            (product) => product.id !== id
          );
          setProducts(updatedProducts);
          calculateTotal(updatedProducts);
          setTotalItems(updatedProducts.length);
        }
      })
      .catch((error) => console.log("Error deleting product: ", error));
  };

  const renderProductItem = ({ item, index }) => (
    <View>
      <View style={styles.itemContainer}>
        <Image style={styles.productImage} source={{ uri: item.image }} />
        <View style={styles.infoItem}>
          <Text style={styles.titleSmall}>{item.nameProduct}</Text>
          <Text>{item.description}</Text>
          <Text style={styles.price}>$ {item.price}</Text>
          <QuantitySelector
            initialValue={item.quantity}
            onQuantityChange={(newQuantity) =>
              handleQuantityChange(newQuantity, index)
            }
          />
        </View>
        <TouchableOpacity
          style={styles.removeButton}
          onPress={() => handleRemoveCart(item.id)}
        >
          <Ionicons name="trash" size={30} color="#055E38" />
        </TouchableOpacity>
      </View>
      <View style={styles.line}></View>
    </View>
  );

  const handleRefresh = () => {
    getProductFromAPI();
  };

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity
          style={styles.backIcon}
          onPress={() => navigation.goBack()}
        >
          <Ionicons name="arrow-back" size={30} />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>My Cart</Text>
      </View>
      <View style={styles.boxText}>
        <Ionicons
          name="bag-check"
          size={20}
          color="#FF7B33"
          style={styles.cartIcons}
        />
        <Text style={styles.cartText}>
          Có {totalItems} sản phẩm trong giỏ hàng
        </Text>
      </View>
      <FlatList
        style={{ marginBottom: 20 }}
        data={products}
        renderItem={renderProductItem}
        keyExtractor={(item, index) => index.toString()}
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={handleRefresh} />
        }
      />
      <View style={styles.total}>
        <View style={styles.flexRowTotal}>
          <Text style={styles.textDescription}>Tổng</Text>
          <Text style={styles.textMoney}>$ {total}</Text>
        </View>
        <TouchableOpacity
          onPress={() =>
            navigation.navigate("Payments", { money: total, data: products })
          }
          style={styles.btnPay}
        >
          <Text style={styles.btnPayText}>Thanh Toán</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "white",
  },
  header: {
    flexDirection: "row",
    marginTop: 65,
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 30,
  },
  backIcon: {
    position: "absolute",
    left: 15,
  },
  headerTitle: {
    fontSize: 30,
    fontWeight: "bold",
    textAlign: "center",
  },
  boxText: {
    marginTop: 10,
    alignSelf: "center",
    flexDirection: "row",
    height: 50,
    width: "80%",
    backgroundColor: "#FFF4EE",
    justifyContent: "center",
    alignItems: "center",
    borderRadius: 20,
  },
  cartIcons: {
    marginRight: 10,
  },
  cartText: {
    color: "gray",
    fontSize: 16,
    fontWeight: "500",
  },
  itemContainer: {
    flex: 1,
    flexDirection: "row",
    marginStart: 25,
    marginTop: 30,
  },
  productImage: {
    height: 120,
    width: 120,
    borderRadius: 20,
  },
  infoItem: {
    marginStart: 20,
    width: "50%",
  },
  titleSmall: {
    fontSize: 20,
    fontWeight: "bold",
    marginBottom: 10,
  },
  price: {
    fontSize: 16,
    fontWeight: "bold",
    color: "red",
    marginTop: 15,
  },
  line: {
    width: "90%",
    height: 1,
    borderWidth: 0.5,
    alignSelf: "center",
    marginTop: 25,
    borderColor: "#E5E5E5",
  },
  removeButton: {
    alignSelf: "flex-end",
  },
  total: {
    marginTop: 20,
    bottom: 30,
    width: "100%",
    height: 90,
  },
  flexRowTotal: {
    flex: 1,
    flexDirection: "row",
    marginHorizontal: 25,
    justifyContent: "space-between",
  },
  textDescription: {
    color: "#B3B5B5",
    fontSize: 17,
  },
  textMoney: {
    fontSize: 17,
    color: "red",
  },
  btnPay: {
    backgroundColor: "#1F1F1F",
    height: 40,
    width: "70%",
    justifyContent: "center",
    alignItems: "center",
    borderRadius: 20,
    alignSelf: "center",
  },
  btnPayText: {
    color: "white",
    fontWeight: "bold",
    fontSize: 17,
  },
});

export default Cart;
