import React, { useState } from 'react';
import { Button, StyleSheet, Text, View, Image, TextInput, Alert, ScrollView, TouchableWithoutFeedback, Keyboard } from 'react-native';
import { firebaseAuth } from './Firebase.js';
import { createUserWithEmailAndPassword } from 'firebase/auth';

const CreateAccountUserScreen = ({ navigation }) => {
    const [name, setName] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const auth = firebaseAuth;
    
    const signUp = async () => {
        try {
            const response = await createUserWithEmailAndPassword(auth, email, password);
            Alert.alert('Success', 'Account Created Successfully');
            console.log("Account Creation Successful");
            navigation.navigate('User Login');
        } catch (error) {
            Alert.alert('Error', error.message);
            console.log(error.message);
            console.log(email, password);
        }
    }

    return (
        <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
            <ScrollView contentContainerStyle={CreateAccountStyles.container}>
                <Text style={CreateAccountStyles.title}>Account Setup</Text>
                <Image
                    source={require('./assets/profile.png')}
                    style={CreateAccountStyles.image}
                />
                <Text style={CreateAccountStyles.subtitle}>Use the text fields to create an account. Remember your login details!</Text>
                <TextInput
                    placeholder="Name"
                    style={CreateAccountStyles.textInput}
                    value={name}
                    onChangeText={(text) => setName(text)}
                />
                <TextInput
                    placeholder="Email"
                    style={CreateAccountStyles.textInput}
                    value={email}
                    onChangeText={(text) => setEmail(text)}
                />
                <TextInput
                    placeholder="Password"
                    style={CreateAccountStyles.textInput}
                    secureTextEntry={true}
                    value={password}
                    onChangeText={(text) => setPassword(text)}
                />
                <View style={CreateAccountStyles.buttonContainer}>
                    <Button
                        title='Create Account'
                        onPress={signUp}
                        disabled={!email || !password || !name}
                    />
                </View>
            </ScrollView>
        </TouchableWithoutFeedback>
    )
}

const CreateAccountStyles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        paddingHorizontal: 20,
        paddingVertical: 40,
        backgroundColor: '#f5f5f5',
    },
    image: {
        width: 200,
        height: 200,
        marginBottom: 5,
    },
    textInput: {
        width: '80%',
        padding: 10,
        marginVertical: 10,
        borderWidth: 1,
        borderColor: '#ddd',
        borderRadius: 5,
        backgroundColor: '#f9f9f9',
    },
    buttonContainer: {
        width: '45%',
        marginVertical: 40,
    },
    title: {
        fontSize: 26,
        fontWeight: 'bold',
        marginBottom: 20,
    },
    subtitle: {
        fontSize: 16,
        marginBottom: 40,
        textAlign: 'center',
        width: '80%',
    }
});

export default CreateAccountUserScreen;
