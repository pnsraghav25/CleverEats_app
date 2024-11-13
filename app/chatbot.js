import React, { useReducer, useState } from 'react';
import { View, Text, TextInput, FlatList, KeyboardAvoidingView, Pressable } from 'react-native';

const initialState = {
    messages: [],
};

const reducer = (state, action) => {
    switch (action.type) {
        case 'ADD_USER_MESSAGE':
            return { messages: [...state.messages, { text: action.payload, sender: 'user' }] };
        case 'ADD_BOT_MESSAGE':
            return { messages: [...state.messages, { text: action.payload, sender: 'bot' }] };
        default:
        return state;
    }
};

const Chatbot = () => {
    const [inputText, setInputText] = useState('');
    const [state, dispatch] = useReducer(reducer, initialState);
    const handleSendMessage = () => {
        if (inputText.trim() !== '') {
            dispatch({ type: 'ADD_USER_MESSAGE', payload: inputText });
            fetch('https://api.edamam.com/api/food-database/v2/parser?app_id=5a62c25f&app_key=d3784bbd33ff5dbf82bf4e262240870a&brand='+inputText)
                .then(response => response.json())
                .then(response => {
                    if (response.hints.length === 0) {
                        dispatch({ type: 'ADD_BOT_MESSAGE', payload: <View className="w-fit bg-white shadow-md rounded-xl duration-50005 hover:shadow-xl">
                                                                            <View className="w-fit px-4 py-3">
                                                                                <Text className="text-sm font-bold text-black block capitalize">{`No results found.\nTry something else.`}</Text>
                                                                            </View>
                                                                        </View>});
                    } else {
                        const food = response.hints[0].food;
                        const nutrients = food.nutrients;

                        const newOutputText = 
                            <View className="w-72 bg-white shadow-md  rounded-xl duration-50005 hover:shadow-xl">
                                    <View className="w-72 px-4 py-3">
                                        <Text className="text-lg font-bold text-black block capitalize mb-3">{food.label}</Text>
                                        <Text className="text-sm font-semibold text-gray-600 block capitalize mb-3">{(food.brand)}</Text>
                                        <View className="flex-row items-center justify-between ">
                                            <Text className="text-base font-semibold text-black my-1">Carbohydrates</Text>
                                            <Text className="text-base font-semibold text-black my-1">{Number(food.nutrients.CHOCDF).toFixed(3)}</Text>
                                        </View>
                                        <View className="flex-row items-center justify-between">
                                            <Text className="text-base font-semibold text-black my-1">Calories</Text>
                                            <Text className="text-base font-semibold text-black my-1">{Number(food.nutrients.ENERC_KCAL).toFixed(3)}</Text>
                                        </View>
                                        <View className="flex-row items-center justify-between">
                                            <Text className="text-base font-semibold text-black my-1">Fat</Text>
                                            <Text className="text-base font-semibold text-black my-1">{Number(food.nutrients.FAT).toFixed(3)}</Text>
                                        </View>
                                        <View className="flex-row items-center justify-between">
                                            <Text className="text-base font-semibold text-black my-1">Fiber</Text>
                                            <Text className="text-base font-semibold text-black my-1">{Number(food.nutrients.FIBTG).toFixed(3)}</Text>
                                        </View>
                                </View>
                            </View>
                        ;

                        dispatch({ type: 'ADD_BOT_MESSAGE', payload: newOutputText });
                    }
                })
                .catch(err => {
                    console.error('Error fetching data:', err);
                    dispatch({ type: 'ADD_BOT_MESSAGE', payload: 'Error fetching data. Please try again.' });
                });
                setInputText('');
        }
    };

return (
    <View style={{ flex: 1 }}>
    <FlatList
        data={state.messages}
        renderItem={({ item }) => (
        <View style={{ alignSelf: item.sender === 'bot' ? 'flex-start' : 'flex-end', margin: 5 }}>
            <View 
            style={{
                    backgroundColor: item.sender === 'bot' ? '' : '#7cb342',
                    padding: 10,
                    borderRadius: 8,
                    maxWidth: '70%',
                }}
                >
                <Text style={{ color: item.sender === 'bot' ? '#000' : '#fff' }}>{item.text}</Text>
            </View>
        </View>
        )}
        keyExtractor={(item, index) => index.toString()}
        inverted={false}
    />
    <KeyboardAvoidingView>
        <View style={{ flexDirection: 'row', alignItems: 'center', margin: 10 ,borderWidth: 1, borderColor: '#ccc', borderRadius: 5, padding: 10}}>
        <TextInput
            style={{ flex: 1,  padding: 10 }}
            placeholder="Enter product name..."
            value={inputText}
            onChangeText={(text) => setInputText(text)}
        />
        <Pressable onPress={handleSendMessage} className='px-6 py-2 bg-indigo-800 text-white rounded-lg ml-4' >
                <Text className='text-white font-semibold text-sm text-center'>Send</Text>
            </Pressable>
        </View>
    </KeyboardAvoidingView>
    </View>
);
};

export default Chatbot;
