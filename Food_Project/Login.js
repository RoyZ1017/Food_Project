import React, { useState } from 'react';
import { Button, StyleSheet, Text, View, Image, ScrollView, TextInput } from 'react-native';

const LoginScreen = ({navigation}) => {
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    return(
        <View style={LoginStyles.container}>
            <Image
                source = {require('./assets/profile.png')}
                style = {LoginStyles.image}
            />
            <TextInput
                placeholder="Usernane"
                style = {LoginStyles.textInput}
                value = {username}
                onChangeText={setUsername}
            />
            <TextInput
                placeholder="Password"
                style = {LoginStyles.textInput}
                secureTextEntry={true}
                value = {password}
                onChangeText={setPassword}
            />
            <View style={LoginStyles.buttonContainer}>
                <Button
                    title = 'Login'
                    onPress={() => navigation.navigate('Home')}
                    disabled={!username || !password}
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