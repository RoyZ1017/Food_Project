import React, { useState } from 'react';
import { Button, StyleSheet, Text, View, Image, ScrollView, TextInput, Alert} from 'react-native';
import { firebaseAuth } from './Firebase';
import {signInWithEmailAndPassword} from 'firebase/auth';


const LoginScreen = ({navigation}) => {
    const [email, setEmail] = useState('')
    const [password, setPassword] = useState('')
    const auth = firebaseAuth
    const signIn = async () => {
        try {
            const response = await signInWithEmailAndPassword(auth, email, password)
            Alert.alert('Success', 'Sign in Success')
            console.log("Sign In Successful")
            navigation.navigate('AddListing', { email: email })
          } catch (error) {
            Alert.alert('Error', error.message)
            console.log("Sign In Failed")
          }
    }
    return(
        <View style={LoginStyles.container}>
            <Image
                source = {require('./assets/profile.png')}
                style = {LoginStyles.image}
            />
            <TextInput
                placeholder="Email"
                style = {LoginStyles.textInput}
                value = {email}
                onChangeText={(text) => setEmail(text)}
            />
            <TextInput
                placeholder="Password"
                style = {LoginStyles.textInput}
                secureTextEntry={true}
                value = {password}
                onChangeText={(text) => setPassword(text)}
            />
            <View style={LoginStyles.buttonContainer}>
                <Button
                    title = 'Login'
                    onPress={signIn}
                    disabled={!email || !password}
                />
                    
            </View>
            <View style={LoginStyles.buttonContainer}>
                <Button
                    title = 'Create Account'
                    onPress={() => navigation.navigate('CreateAccount')}/>
            </View>
        </View>
    )
  }

const LoginStyles = StyleSheet.create({
    container: {
        flex: 1,
        alignItems: 'center',
        paddingHorizontal: 20,
    },
    image: {
        width: 250, 
        height: 250,
        top: "10%",
        marginBottom: "5%",
    },
    textInput: {
        marginBottom: 10,
    },

    buttonContainer: {
        margin: 5,
        width: "10%"
    }

});

export default LoginScreen