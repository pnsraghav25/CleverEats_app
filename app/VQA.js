import React, { useState,useEffect } from 'react'
import { View,Text,TextInput,Pressable,ScrollView,Modal } from 'react-native'

const VQA = (props) => {
    const [display, setdisplay] = useState(true)
    const [name, setName] = useState('');
    const [status,setStatus] = useState('')
    const [results, setResults] = useState([]);
    const [selectedFoodId, setSelectedFoodId] = useState(null);
    const [showModal, setShowModal] = useState(false);
    const [finalResponse, setfinalResponse] = useState([])
    const [loading, setLoading] = useState(false);
    const handleViewDetail = (foodId) => {
        if (loading) return;
        setSelectedFoodId(foodId);
        setLoading(true);
        setTimeout(() => {
            setShowModal(true);
            details();
            setLoading(false);
        }, 100);
    };
    const closeModal = () => {
        setShowModal(false);
        setSelectedFoodId(null);
        setfinalResponse([])
    };
    function replace(e){
        e = e.toLowerCase()
        e = e[0].toUpperCase() + e.slice(1)
        return e.replaceAll("_"," ")
    }
    call = () =>{
        setName(props.brand)
        if(name){
            setStatus("Getting results please wait a minute...")
            fetch('https://api.edamam.com/api/food-database/v2/parser?app_id=5a62c25f&app_key=d3784bbd33ff5dbf82bf4e262240870a&brand='+name)
            .then(response => response.json())
            .then(response=>response.hints)
            .then(response => {
                setResults([])
                if(response.length == 0){
                    setStatus('No results Found \n Try something like Oreo')
                    return
                }
                setStatus(`Results for ${name}`)
                setResults(response.hints);
                setResults(response.map((e,i) => (
                    <View className="w-72 bg-white shadow-md rounded-xl duration-50005 hover:shadow-xl" food_id={e.food.foodId} key={i}>
                        <View className="w-72 px-4 py-3">
                            <Text className="text-lg  font-bold text-black block capitalize mb-3">{e.food.label}</Text>
                            <Text className="text-sm font-semibold text-gray-600 block capitalize mb-3">{(e.food.brand).toLowerCase()}</Text>
                            <View className="flex-row items-center justify-between ">
                                <Text className="text-base font-semibold text-black my-1">Carbohydrates</Text>
                                <Text className="text-base font-semibold text-black my-1">{Number(e.food.nutrients.CHOCDF).toFixed(3)}</Text>
                            </View>
                            <View className="flex-row items-center justify-between">
                                <Text className="text-base font-semibold text-black my-1">Calories</Text>
                                <Text className="text-base font-semibold text-black my-1">{Number(e.food.nutrients.ENERC_KCAL).toFixed(3)}</Text>
                            </View>
                            <View className="flex-row items-center justify-between">
                                <Text className="text-base font-semibold text-black my-1">Fat</Text>
                                <Text className="text-base font-semibold text-black my-1">{Number(e.food.nutrients.FAT).toFixed(3)}</Text>
                            </View>
                            <View className="flex-row items-center justify-between">
                                <Text className="text-base font-semibold text-black my-1">Fiber</Text>
                                <Text className="text-base font-semibold text-black my-1">{Number(e.food.nutrients.FIBTG).toFixed(3)}</Text>
                            </View>
                            <View className='items-center my-2 self-end'>
                                <Pressable className='bg-indigo-500 shadow-lg shadow-indigo-500/50 py-2 text-center justify-center items-center rounded-lg w-fit px-4' onPress={() => handleViewDetail(e.food.foodId)}>
                                    <Text className='font-semibold text-sm text-white'>View in detail</Text>
                                </Pressable>
                            </View>
                    </View>
                </View>
                )));
            })
            .catch(err => {
                setStatus("No data Found")
                console.log(err);
            });
        }
    }
    details = async () =>{
        const url = 'https://api.edamam.com/api/food-database/v2/nutrients?app_id=5a62c25f&app_key=d3784bbd33ff5dbf82bf4e262240870a';
        const data = `{
            "ingredients": [
                {
                "quantity": 1,
                "measureURI": "http://www.edamam.com/ontologies/edamam.owl#Measure_serving",
                "foodId": "${selectedFoodId}"
                }
            ]
        }`;
        await fetch(url, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Accept': 'application/json',
            },
            body: data,
        })
        .then(response => response.json())
        .then(response =>{
            setfinalResponse(
                <View className='justify-start items-start'>
                    <Text className="text-left text-lg font-semibold">{response.ingredients[0]["parsed"][0].food}</Text>
                    <View className="flex-col items-center justify-between px-4 mt-4">
                        <Text className="text-left text-base font-bold underline">Caution Labels</Text>
                        <View className="flex-col gap-2 justify-start mb-2">
                            {response.cautions.map((e,i)=>(
                                <Text className="text-base font-semibold text-red-500" key={i}>{replace(e)}</Text>
                            ))}
                        </View>
                    </View>
                    <View className="flex-col items-center justify-between px-4 mt-4">
                        <Text className="text-left text-base font-bold underline">Nutrition Claims</Text>
                        <View className="flex-col gap-2 justify-start mb-2 ml-4">
                                {response.healthLabels.map((e,i)=>(
                                    <Text className="text-base font-semibold text-green-500" key={i}>{replace(e)}</Text>
                                ))}
                        </View>
                    </View>
                </View>
            )
        setLoading(false);
        })
        .catch(err => {
            console.error('There was a problem with the fetch operation:', error);
            setLoading(false);
    })
    }
    useEffect(() => {
        if (selectedFoodId !== null) {
            setLoading(true);
            setTimeout(details, 2000);
        }
    }, [selectedFoodId]);
    return (
        <>
            {display && <View className='items-center mt-12'>
                <Pressable className='bg-indigo-700 text-white border border-indigo-700 py-2 text-center justify-center items-center rounded-lg w-fit px-10' onPress={call}>
                    <Text className='font-semibold text-sm text-white'>Search</Text>
                </Pressable>
            </View>}
            <View>
                <Text className='my-8 text-center font-semibold text-lg'>{status}</Text>
            </View>
            <View className='flex-col justify-center items-center my-12 gap-4'>{results}</View>
            <Modal animationType="slide" transparent={true} visible={showModal} onRequestClose={closeModal}>
                <View className='flex-1 justify-center items-center bg-black/50 px-5'>
                    <View className='bg-white p-6 rounded-lg w-80'>
                    <Text className='text-xl font-bold mb-4'>Detailed Analysis</Text>
                    <ScrollView className='max-h-80 h-fit'>
                        <View>{finalResponse}</View>
                    </ScrollView>
                    <Pressable className='' onPress={closeModal}>
                        <Text className='bg-indigo-100 px-4 py-2 border border-black/50 rounded-lg text-indigo-500 mt-4 self-end'>Close</Text>
                    </Pressable>
                </View>
                </View>
            </Modal>
        </>
    )
}

export default VQA