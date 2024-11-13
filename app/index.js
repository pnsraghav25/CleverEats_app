import React, { NavigationContainer } from "@react-navigation/native";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import { View,Text,Pressable,ScrollView } from "react-native";
import Search from "./search";
import ImagePickerExample from "./ImagePickerExample"
import Chatbot from "./chatbot";

const Stack = createNativeStackNavigator();

const HomeScreen = ({ navigation }) => (
            <>
            <ScrollView contentContainerStyle={{ flexGrow: 1 }}>
                <View className='bg-indigo-900  h-48 rounded-b-[75px] items-center justify-end'>
                </View>
                <View className='bg-white rounded-full h-28 w-28 self-center relative -top-16 justify-center items-center'>
                    <Text className='font-semibold text-l'>Welcome</Text>
                </View>
                <View className='px-8 mt-12'>
                    <Pressable className='bg-indigo-300 py-4 text-center justify-center items-center rounded-full' onPress={() => navigation.navigate("Search Page")}>
                        <Text>Try entering Name</Text>
                    </Pressable>
                </View>
                <View className='px-8 mt-12'>
                    <Pressable className='bg-indigo-300 py-4 text-center justify-center items-center rounded-full' onPress={() => navigation.navigate("Chatbot")}>
                        <Text>Try using Chatbot</Text>
                    </Pressable>
                </View>
                <View className='px-8 mt-12'>
                    <Pressable className='bg-indigo-300 py-4 text-center justify-center items-center rounded-full' onPress={() => navigation.navigate("OCR")}>
                        <Text>Try using Scanner</Text>
                    </Pressable>
                </View>
            </ScrollView>
            </>
        )


const App = () => (
    <>
        <NavigationContainer independent={true}>
            <Stack.Navigator>
                <Stack.Screen name="Home" component={HomeScreen} />
                <Stack.Screen name="Search Page" component={Search} />
                <Stack.Screen name="Chatbot" component={Chatbot} />
                <Stack.Screen name="OCR" component={ImagePickerExample} />
            </Stack.Navigator>
        </NavigationContainer>
    </>
);

export default App;
