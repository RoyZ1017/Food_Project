import React, { useState } from 'react';
import { Button, StyleSheet, Text, View, TextInput, Alert, ScrollView, TouchableWithoutFeedback, Keyboard } from 'react-native';
import ModalDropdown from 'react-native-modal-dropdown';
import { firebaseAuth } from './Firebase.js';
import { createUserWithEmailAndPassword } from 'firebase/auth';

/**
 * CreateAccountScreen Component
 * 
 * @param {Object} navigation - The navigation object from React Navigation
 * @returns {JSX.Element} - The rendered CreateAccountScreen component
 */
const CreateAccountScreen = ({ navigation }) => {
    
    // State hooks to manage inputs and potential authentication errors
    const [name, setName] = useState('');
    const [location, setLocation] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [openingTimeHour, setOpeningTimeHour] = useState('');
    const [openingTimeMinute, setOpeningTimeMinute] = useState('');
    const [closingTimeHour, setClosingTimeHour] = useState('');
    const [closingTimeMinute, setClosingTimeMinute] = useState('');
    const [authError, setAuthError] = useState(null);
    const auth = firebaseAuth;

    /**
     * Handles user sign-up with Firebase Authentication 
     * @returns {void}
     */
    const signUp = async () => {
        try {
            if (!validateTime()) {
                console.log("Invalid Time")
                return false;
            }
            const response = await createUserWithEmailAndPassword(auth, email, password);
            Alert.alert('Success', 'Sign in Success');
            console.log("Sign In Successful");
            navigation.navigate('Restaurant Login');
        } catch (error) {
            setAuthError(error.message);
            console.log(error.message);
            console.log(email, password);
        }
    }

    // Generated options for the minutes and hours dropdowns 
    const hours = Array.from(Array(24).keys()).map(hour => hour.toString().padStart(2, '0'));
    const minutes = Array.from(Array(60).keys()).map(minute => minute.toString().padStart(2, '0'));

    /**
     * Validates that the opening time is before the closing time
     * 
     * @returns {boolean} - True if the opening time is before the closing time, otherwise false
     */
    const validateTime = () => {
        if (parseInt(openingTimeHour) > parseInt(closingTimeHour) ||
            (parseInt(openingTimeHour) === parseInt(closingTimeHour) && parseInt(openingTimeMinute) >= parseInt(closingTimeMinute))) {
            Alert.alert('Error', 'Opening time must be before closing time.');
            return false;
        }
        return true;
    };

    return (
        <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
            <ScrollView contentContainerStyle={CreateAccountStyles.container}>
                <Text style={CreateAccountStyles.title}>Account Setup</Text>
                <Text style={CreateAccountStyles.subtitle}>Enter all the information needed for your restaurant. Make sure your 
                added location is a valid location on Google Maps.</Text>
                <TextInput
                    placeholder="Restaurant Name"
                    style={CreateAccountStyles.textInput}
                    value={name}
                    onChangeText={(text) => setName(text)}
                />
                <TextInput
                    placeholder="Location"
                    style={CreateAccountStyles.textInput}
                    value={location}
                    onChangeText={(text) => setLocation(text)}
                />
                <View style={CreateAccountStyles.timePickerContainer}>
                    <Text style = {{fontWeight: 'bold', fontSize: 15}}>Opening Time:</Text>
                    <ModalDropdown
                        options={hours}
                        defaultValue="HH"
                        onSelect={(index, value) => setOpeningTimeHour(value)}
                        textStyle={CreateAccountStyles.pickerText}
                        dropdownTextStyle={CreateAccountStyles.dropdownText}
                        dropdownStyle={CreateAccountStyles.dropdown}
                    />
                    <ModalDropdown
                        options={minutes}
                        defaultValue="MM"
                        onSelect={(index, value) => setOpeningTimeMinute(value)}
                        textStyle={CreateAccountStyles.pickerText}
                        dropdownTextStyle={CreateAccountStyles.dropdownText}
                        dropdownStyle={CreateAccountStyles.dropdown}
                    />
                </View>
                <View style={CreateAccountStyles.timePickerContainer}>
                    <Text style = {{fontWeight: 'bold', fontSize: 15}}>Closing Time:</Text>
                    <ModalDropdown
                        options={hours}
                        defaultValue="HH"
                        onSelect={(index, value) => setClosingTimeHour(value)}
                        textStyle={CreateAccountStyles.pickerText}
                        dropdownTextStyle={CreateAccountStyles.dropdownText}
                        dropdownStyle={CreateAccountStyles.dropdown}
                    />
                    <ModalDropdown
                        options={minutes}
                        defaultValue="MM"
                        onSelect={(index, value) => setClosingTimeMinute(value)}
                        textStyle={CreateAccountStyles.pickerText}
                        dropdownTextStyle={CreateAccountStyles.dropdownText}
                        dropdownStyle={CreateAccountStyles.dropdown}
                    />
                </View>
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
                        disabled={!email || !password || !name || !location || !openingTimeHour || !closingTimeHour}
                    />
                </View>
                {authError && <Text style={CreateAccountStyles.errorText}>{authError}</Text>}
            </ScrollView>
        </TouchableWithoutFeedback>
    );
}

// Styles for the CreateAccountScreen component
const CreateAccountStyles = StyleSheet.create({
    container: {
        flex: 1,
        alignItems: 'center',
        justifyContent: 'center',
        paddingHorizontal: 20,
    },
    title: {
        fontSize: 26,
        fontWeight: 'bold',
        marginBottom: 20,
    },
    subtitle: {
        fontSize: 16,
        marginBottom: 50,
    },
    textInput: {
        marginBottom: 25,
        backgroundColor: "#d3d3d3",
        borderRadius: 20,
        height: 40,
        padding: 10,
        width: '80%',
    },
    timePickerContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        marginBottom: 20,
    },
    pickerText: {
        fontSize: 16,
        color: 'black',
        width: 80,
        textAlign: 'center',
    },
    dropdownText: {
        fontSize: 16,
        color: 'black',
    },
    dropdown: {
        width: 100,
        height: 200,
    },
    buttonContainer: {
        margin: 5,
        width: "45%",
    },
    errorText: {
        color: 'red',
        marginTop: 10,
    },
});

export default CreateAccountScreen;
