import React, { useState } from 'react';
import { Button, StyleSheet, Text, View, Image, TextInput, Alert, TouchableWithoutFeedback, Keyboard, ScrollView } from 'react-native';
import { firebaseAuth } from './Firebase';
import { signInWithEmailAndPassword } from 'firebase/auth';

/**
 * LoginScreen Component
 * 
 * @param {Object} navigation - The navigation object provided by React Navigation.
 * @returns {JSX.Element} - The rendered LoginScreen component.
 */
const LoginScreen = ({ navigation }) => {

    // State hooks to manage form inputs
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const auth = firebaseAuth;

     /**
     * Handles user sign-in with Firebase Authentication
     * 
     * @returns {void}
     */
    const signIn = async () => {
        try {
            const response = await signInWithEmailAndPassword(auth, email, password);
            Alert.alert('Success', 'Sign in Success');
            console.log("Sign In Successful");
            navigation.navigate('Add Listing', { email: email });
        } catch (error) {
            Alert.alert('Error', error.message);
            console.log("Sign In Failed");
        }
    };

    return (
        <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
            <ScrollView contentContainerStyle={LoginStyles.container}>
                <Image
                    source={require('./assets/profile.png')}
                    style={LoginStyles.image}
                />
                <Text style={LoginStyles.headerText}>Login to your restaurant account here:</Text>
                <TextInput
                    placeholder="Email"
                    style={LoginStyles.textInput}
                    value={email}
                    onChangeText={(text) => setEmail(text)}
                />
                <TextInput
                    placeholder="Password"
                    style={LoginStyles.textInput}
                    secureTextEntry={true}
                    value={password}
                    onChangeText={(text) => setPassword(text)}
                />
                <View style={LoginStyles.buttonContainer}>
                    <Button
                        title='Login'
                        onPress={signIn}
                        disabled={!email || !password}/>
                </View>
                <Text style={LoginStyles.footerText}>New? Create an account here:</Text>
                <View style={LoginStyles.buttonContainer2}>
                    <Button
                        title='Create Account'
                        onPress={() => navigation.navigate('Create Restaurant Account')}
                    />
                </View>
            </ScrollView>
        </TouchableWithoutFeedback>
    );
}

// Styles for the LoginScreen component
const LoginStyles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        paddingHorizontal: 20,
        paddingVertical: 40,
    },
    image: {
        width: 200,
        height: 200,
        marginBottom: 20,
    },
    headerText: {
        fontSize: 18,
        fontWeight: 'bold',
        marginBottom: 20,
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
        marginVertical: 10,
        paddingTop: 30,
    },
    buttonContainer2: {
        width: '45%',
        marginVertical: 10,
    },
    footerText: {
        fontSize: 16,
        fontWeight: 'bold',
        marginVertical: 20,
    },
});

export default LoginScreen;
