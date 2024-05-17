import React, { useState } from 'react';
import { Button, StyleSheet, Text, View, TextInput, Alert, Picker} from 'react-native';
import {firebaseAuth} from './Firebase.js';
import {createUserWithEmailAndPassword} from 'firebase/auth';


const CreateAccountUserScreen = ({navigation}) => {
    const [name, setName] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const auth = firebaseAuth
    const signUp = async () => {
        try {
            const response = await createUserWithEmailAndPassword(auth, email, password)
            Alert.alert('Success', 'Sign in Success')
            console.log("Sign In Successful")
            navigation.navigate('AddListing')


          } catch (error) {
            Alert.alert('Error', error.message)
            console.log(error.message)
            console.log(email, password)
          }
    }

  
    return(
        <View style={CreateAccountStyles.container}>
            <Text style={CreateAccountStyles.title}>Account Setup</Text> 
            <TextInput
                placeholder="Name"

                style = {CreateAccountStyles.textInput}
                value = {name}
                onChangeText={(text) => setName(text)}
            />
            <TextInput
                placeholder="Email"
                style = {CreateAccountStyles.textInput}
                value = {email}
                onChangeText={(text) => setEmail(text)}
            />
            <TextInput
                placeholder="Password"
                style={CreateAccountStyles.textInput}
                secureTextEntry={true}
                value = {password}
                onChangeText={(text) => setPassword(text)}
            />
            <View style={CreateAccountStyles.buttonContainer}>
                <Button
                    title = 'Create Account'
                    onPress={signUp}
                    disabled={!email || !password || !name}
                />
            </View>
        </View>
    )
}

const CreateAccountStyles = StyleSheet.create({
    container: {
        flex: 1,
        alignItems: 'center',
        justifyContent: 'center',
        paddingHorizontal: 20,
    },
    textInput: {
        marginBottom: 20,
        backgroundColor: "#d3d3d3",
        borderRadius: 20,
        height: 40,
        padding: 10,
    },
    buttonContainer: {
        margin: 5,
        width: "10%",
    },
    title: {
        fontSize: 26,
        fontWeight: 'bold',
        marginBottom: 20,
    },
});


export default CreateAccountUserScreen
