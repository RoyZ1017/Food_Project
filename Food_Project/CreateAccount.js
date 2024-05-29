import React, { useState } from 'react';
import { Button, StyleSheet, Text, View, TextInput, Alert, Picker, ScrollView, TouchableWithoutFeedback, Keyboard } from 'react-native';
import { firebaseAuth } from './Firebase.js';
import { createUserWithEmailAndPassword } from 'firebase/auth';

const CreateAccountScreen = ({ navigation }) => {
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

    const signUp = async () => {
        try {
            if (!validateTime()) {
                console.log("Invalid Time")
                return false;
            }
            const response = await createUserWithEmailAndPassword(auth, email, password)
            Alert.alert('Success', 'Sign in Success')
            console.log("Sign In Successful")
            navigation.navigate('Restaurant Login')
        } catch (error) {
            setAuthError(error.message);
            console.log(error.message)
            console.log(email, password)
        }
    }

    const hours = Array.from(Array(24).keys()).map(hour => hour.toString().padStart(2, '0'));
    const minutes = Array.from(Array(60).keys()).map(minute => minute.toString().padStart(2, '0'));

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
                    <Text>Opening Time:</Text>
                    <Picker
                        style={CreateAccountStyles.timePicker}
                        selectedValue={openingTimeHour}
                        onValueChange={(itemValue) => setOpeningTimeHour(itemValue)}>
                        {hours.map(hour => (
                            <Picker.Item key={hour} label={hour.toString()} value={hour.toString()} />
                        ))}
                    </Picker>
                    <Picker
                        style={CreateAccountStyles.timePicker}
                        selectedValue={openingTimeMinute}
                        onValueChange={(itemValue) => setOpeningTimeMinute(itemValue)}>
                        {minutes.map(minute => (
                            <Picker.Item key={minute} label={minute.toString()} value={minute.toString()} />
                        ))}
                    </Picker>
                </View>
                <View style={CreateAccountStyles.timePickerContainer}>
                    <Text>Closing Time:</Text>
                    <Picker
                        style={CreateAccountStyles.timePicker}
                        selectedValue={closingTimeHour}
                        onValueChange={(itemValue) => setClosingTimeHour(itemValue)}>
                        {hours.map(hour => (
                            <Picker.Item key={hour} label={hour.toString()} value={hour.toString()} />
                        ))}
                    </Picker>
                    <Picker
                        style={CreateAccountStyles.timePicker}
                        selectedValue={closingTimeMinute}
                        onValueChange={(itemValue) => setClosingTimeMinute(itemValue)}>
                        {minutes.map(minute => (
                            <Picker.Item key={minute} label={minute.toString()} value={minute.toString()} />
                        ))}
                    </Picker>
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
        marginBottom: 30,
    },
    textInput: {
        marginBottom: 20,
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
    timePicker: {
        height: 40,
        width: 80,
        marginLeft: 15,
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
