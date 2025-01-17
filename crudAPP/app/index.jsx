import {
  View,
  Text,
  Pressable,
  StyleSheet,
  TouchableOpacity,
  FlatList,
} from "react-native";

import React, { useState, useEffect } from "react";
import { SafeAreaView } from "react-native-safe-area-context";
import { data } from "@/data/todos";
import { TextInput } from "react-native-paper";
import MaterialCommunityIcons from "@expo/vector-icons/MaterialCommunityIcons";
import MaterialIcons from "@expo/vector-icons/MaterialIcons";
import { Inter_500Medium, useFonts } from "@expo-google-fonts/inter";
import { Switch } from "react-native";
import Animated, { LinearTransition } from "react-native-reanimated";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { StatusBar } from "expo-status-bar";
import { useRouter } from "expo-router";

//Main function for Index page
const Index = () => {
  // Usestate variables for different takes in todo app
  const [todo, settodo] = useState([]);
  const [text, settext] = useState("");
  const [toggle, setoggle] = useState(true);
  const [loaded, error] = useFonts({ Inter_500Medium });

  //Varible for expo router
  const router = useRouter();
  //Object have different shades of dark and light color
  const colors = {
    dark: "black",
    dark1: "#292B36",
    dark2: "#272B33",
    light: "#FFF",
    light1: "#F1F1F1",
    light2: "#F7F7F7",
  };
  //Function that return color on basis of user toggle
  const getcolor = (dark, light) => (toggle ? dark : light);
  //Use effect for aysnc storage
  useEffect(() => {
    const fetchdata = async () => {
      try {
        const jsonvalue = await AsyncStorage.getItem("TodoApp");
        const storage = jsonvalue != null ? JSON.parse(jsonvalue) : null;
        if (storage && storage.lenght) {
          settodo(storage.sort((a, b) => a.id - b.id));
        }
      } catch (e) {
        console.log(e);
      }
    };
    fetchdata();
  }, [data]);

  //use effect for async storage
  useEffect(() => {
    const storedata = async () => {
      try {
        const jsonvalue = JSON.stringify(todo);
        await AsyncStorage.setItem("TodoApp", jsonvalue);
      } catch (e) {}
    };
    storedata();
  }, [todo]);

  if (!loaded && !error) {
    return null;
  }

  // Takes the user entered text creates a unique id and then add it to the useState
  const addtodo = () => {
    if (text.trim()) {
      const newid = todo.length > 0 ? todo[0].id + 1 : 1;
      settodo([{ id: newid, title: text, completed: false }, ...todo]);
      settext("");
    }
  };
};
// Changes the completed status of a todo when called
const toggletodo = (id) => {
  settodo(
    todo.map((todo) =>
      todo.id === id ? { ...todo, completed: !todo.completed } : todo
  )
);
};
// Only stores the todo whose id don't match the id we want to delete
const removetodo = (id) => {
  settodo(todo.filter((todo) => todo.id != id));
};
//Navigate user to different directory when called
const handlepress = (id) => {
  router.push(`/todo/${id}`);

  //Renders Item on for each todo including the button 
  const renderitem = ({ item }) => {
    return (
      <View
        style={[
          style.todoitem,
          {
            backgroundColor: item.completed
              ? "lightgreen"
              : getcolor(colors.dark, colors.light),
          },
        ]}
      >
        <Pressable onPress={() => handlepress(item.id)}>
          <Text
            style={[
              style.todotext,
              { color: getcolor(colors.light, colors.dark) },
              item.completed && style.completedtext,
            ]}
          >
            {item.title}
          </Text>
        </Pressable>
        <View style={style.btn_cont}>
          <TouchableOpacity
            onPress={() => removetodo(item.id)}
            style={[
              style.delete,
              { backgroundColor: getcolor(colors.dark, colors.light) },
            ]}
          >
            <MaterialCommunityIcons
              name="delete-circle"
              size={24}
              color={getcolor(colors.light, colors.dark)}
              selectable={undefined}
            />
          </TouchableOpacity>
          <TouchableOpacity
            onPress={() => toggletodo(item.id)}
            style={[
              style.delete,
              { backgroundColor: getcolor(colors.dark, colors.light) },
            ]}
          >
            <MaterialIcons
              name="done"
              size={24}
              color={getcolor(colors.light, colors.dark)}
            />
          </TouchableOpacity>
        </View>
      </View>
    );
  };

  //Return statement of the main function 
  return (
    <SafeAreaView
      style={{
        backgroundColor: getcolor(colors.dark, colors.light),
        height: "100%",
      }}
    >
      <Switch
        value={toggle}
        onValueChange={() => setoggle(!toggle)}
        thumbColor={getcolor(colors.light, colors.dark)}
        trackColor={{ true: colors.light, false: colors.dark }}
        style={{ alignSelf: "center" }}
      />
      <View style={{ flexDirection: "row" }}>
        <TextInput
          label={"Enter to do"}
          mode="outlined"
          placeholder='"Read a Book"'
          style={style.txt_inpt}
          onChangeText={(t) => settext(t)}
          value={text}
        />
        <TouchableOpacity style={style.tblo} onPress={addtodo}>
          <Text style={[{ color: getcolor(colors.light, colors.dark) }]}>
            Add
          </Text>
        </TouchableOpacity>
      </View>
      {todo.length > 0 ? (
        <Animated.FlatList
          style={{ flex: 1 }}
          data={todo}
          keyExtractor={(todos) => todos.id.toString()}
          renderItem={renderitem}
          itemLayoutAnimation={LinearTransition}
          keyboardDismissMode={"on-drag"}
        />
      ) : (
        <View style={style.emptyState}>
          <Text
            style={{
              color: getcolor(colors.light, colors.dark),
              fontSize: 18,
              textAlign: "center",
            }}
          >
            Add your first task and make progress today! 🚀
          </Text>
        </View>
      )}
      <StatusBar style={getcolor(colors.light, colors.dark)} />
    </SafeAreaView>
  );
};
const style = StyleSheet.create({
  txt_inpt: {
    width: "77%",
    marginHorizontal: "10",
    marginVertical: "10",
    fontFamily: "Inter_500Medium",
  },
  tblo: {
    backgroundColor: "blue",
    borderRadius: 10,
    paddingVertical: 8,
    paddingHorizontal: 17,
    marginTop: 20,
    marginBottom: 20,
    marginLeft: 10,
  },
  todoitem: {
    wodth: "90%",
    maxWidth: 900,
    margin: 10,
    borderWidth: 2,
    borderColor: "blue",
    borderRadius: 10,
    height: 50,
    flex: 1,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    // backgroundColor:
  },
  todotext: {
    fontSize: 20,
    marginHorizontal: 10,
    color: "black",
    fontFamily: "Inter_500Medium",
  },
  completedtext: {
    textDecorationLine: "line-through",
  },
  completedtextVW: {
    backgroundColor: "lightgreen",
  },
  delete: {
    padding: 5,
    marginHorizontal: 5,
    backgroundColor: "white",
    borderRadius: 50,
  },
  btn_cont: {
    flexDirection: "row",
  },
  emptyState: {
    flex: 1,
    justifyContent: "center",
  },
});

export default Index;
