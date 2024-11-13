import React, { useState } from 'react';
import { View, Pressable, Image, Alert ,Text, ScrollView} from 'react-native';
import * as ImagePicker from 'expo-image-picker';
import { firebase } from '../config';
import * as Filesystem from 'expo-file-system'
import VQA from './VQA';

const ImagePickerExample = () => {
  const [image, setImage] = useState(null);
  const [uploading, setuploading] = useState(null)
  const [response, setresponse] = useState('')
  const [status, setstatus] = useState(null)
  const [data, setdata] = useState('')
  const pickImage = async () =>{
    setdata("")
    setstatus(null)
    let result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes : ImagePicker.MediaTypeOptions.Images,
      allowsEditing: false,
      quality: 1
    });
    if(!result.canceled){
      setImage(result.assets[0].uri)
    }
  };

  // Upload Image
  const uploadMedia = async () =>{
    setdata('Your photo is uploading...')
    setuploading(true);
    setresponse("")
    try{
      const { uri } = await Filesystem.getInfoAsync(image);
      const blob = await new Promise((resolve,reject) =>{
        const xhr = new XMLHttpRequest();
        xhr.onload = () =>{
          resolve(xhr.response);
        };
        xhr.onerror = (e) =>{
          reject(new TypeError('Network request Failed'))
        };
        xhr.responseType  = 'blob'
        xhr.open('GET',uri,true)
        xhr.send(null)
      });

      const filename = image.substring(image.lastIndexOf('/') + 1);
      const ref = firebase.storage().ref().child(filename);
      setImage(null)
      await ref.put(blob);
      const url = await ref.getDownloadURL().catch((err)=>{console.log(err);})
      console.log(url);
      query(url)
      Alert.alert('Press the search button when it appears')
      setImage(null)
    }catch(error){
      console.error(error)
    }
}
async function query(url) {
  setdata("Photo upload successfull image is analysed")
	const response = await fetch(
		"https://api-inference.huggingface.co/models/Salesforce/blip-image-captioning-large",
		{
			headers: { Authorization: "Bearer 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" },
			method: "POST",
			body: url,
		}
	);
	const result = await response.json();
  try{
    setresponse(result[0].generated_text);
    setstatus(true)
    setdata("Click the below button")

  }
  catch(e){
    Alert.alert("Some error occured!! Try again")
    setuploading(false)
  }
}
function findItems(text) {
  const items = ["Oreo", "Lays", "Coca Cola"];
  const itemsLowercase = items.map(item => item.toLowerCase());
  const textLowercase = text.toLowerCase();
  const foundItems = [];
  for (const item of itemsLowercase) {
      if (textLowercase.includes(item)) {
          foundItems.push(item);
      }
  }
  if (foundItems.length) {
    console.log(foundItems[0]);
      return foundItems[0]
  } else {
      console.log("No items found in the text.");
      return
  }
}
    return (
      <>
      <ScrollView contentContainerStyle={{ flexGrow: 1 }}>
          <View className='flex flex-col justify-center items-center'>
            <Pressable className='mt-24 bg-indigo-800/10 border border-indigo-400 py-2 text-center justify-center items-center rounded-lg w-fit px-10' onPress={pickImage}>
              <Text className='font-semibold text-sm'>Pick Image</Text>
            </Pressable>
            <View className='justify-center items-center mt-12'>
              {image && <Image source={{uri : image}} style={{width: 300,height: 300}} className='mb-12' />}
              {image && 
              <Pressable className='mt-12 mb-12 bg-indigo-800/10 border border-indigo-400 py-2 text-center justify-center items-center rounded-lg w-fit px-10' onPress={uploadMedia}>
                <Text className='font-semibold text-sm'>Upload Image</Text>
              </Pressable>}
            </View>
            {uploading && <Text className='px-12 text-sm text-center text-red-500'>{data}</Text>}
            {status && <VQA brand={findItems(response)} />}
          </View>
        </ScrollView>
      </>
  );
};

export default ImagePickerExample;
