import { StatusBar } from "expo-status-bar";
import React from "react";
import axios from "axios";
import {
  StyleSheet,
  Text,
  View,
  FlatList,
  ActivityIndicator,
} from "react-native";

export default function App() {
  const baseURl = "https://api.github.com";
  const perPage = 20;

  const [data, setData] = React.useState([]);
  const [loading, setLoading] = React.useState(false);
  const [page, setPage] = React.useState(1);

  React.useEffect(() => {
    loadPayload();
  }, []);

  const loadPayload = async () => {
    if (loading) return; //se ele ja ta carregando não precisa carregar de novo
    setLoading(true);
    const response = await axios.get(
      `${baseURl}/search/repositories?q=react&per_page=${perPage}&page=${page}`
    );

    setData([...data, ...response.data.items]);
    setPage(page + 1);
    setLoading(false);
  };

  const ListItem = ({ data }: any) => {
    // console.log("data.full_name:", data.full_name);
    return (
      <View style={styles.listItem}>
        <Text style={styles.listText}>{data.full_name}</Text>
      </View>
    );
  };

  const Spinner = () => {
    return (
      <View style={styles.loading}>
        <ActivityIndicator size={25} color="#444" />
      </View>
    );
  };
  return (
    <View style={styles.container}>
      <FlatList
        style={{ marginTop: 35 }}
        contentContainerStyle={{ marginHorizontal: 20 }}
        data={data}
        keyExtractor={(item, index) => String(index)}// this option above is correctly, but sometimes the ids is same, so I resolved in this option
        // keyExtractor={(item, index) => String(item.id)}
        renderItem={({ item }) => <ListItem data={item} />}
        onEndReached={loadPayload}
        onEndReachedThreshold={0.1}
        ListFooterComponent={<Spinner load={loading} />}
      />

      <StatusBar style="auto" />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
  },
  listItem: {
    backgroundColor: "#555",
    padding: 20,
    marginTop: 20,
    borderRadius: 10,
  },
  listText: {
    fontSize: 16,
    color: "#fff",
  },
  loading: {
    padding: 10,
  },
});
