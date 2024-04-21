import React, { useState } from 'react';
import { Button, StyleSheet, Text, View, ScrollView, TextInput, Picker } from 'react-native';

const CreateAccountScreen = ({navigation}) => {
    const [name, setName] = useState('');
    const [location, setLocation] = useState('');
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');

    const [openingTimeHour, setOpeningTimeHour] = useState('');
    const [openingTimeMinute, setOpeningTimeMinute] = useState('');
    const [closingTimeHour, setClosingTimeHour] = useState('');
    const [closingTimeMinute, setClosingTimeMinute] = useState('');
    const hours = Array.from(Array(24).keys()).map(hour=> hour.toString().padStart(2, '0'));
    const minutes = Array.from(Array(60).keys()).map(minute => minute.toString().padStart(2, '0'));

    // So the user cannot add a closing time that is before the opening time
    const validateTime = () => {
        // Check if opening time is after closing time
        if (parseInt(openingTimeHour) > parseInt(closingTimeHour) || 
            (parseInt(openingTimeHour) == parseInt(closingTimeHour)) && (parseInt(openingTimeMinute) >= parseInt(closingTimeMinute))) {
            alert('Opening time must be before closing time.');
            return; // Exit if opening time is after closing time
        }

        // If works navigate to next page
        navigation.navigate('Home');
    };

    return(
        <View style={CreateAccountStyles.container}>
            <Text style={CreateAccountStyles.title}>Account Setup</Text> 
            <TextInput
                placeholder="Restaurant Name"
                style={CreateAccountStyles.textInput}
                value={name}
                onChangeText={setName}
            />
            <TextInput
                placeholder="Location"
                style={CreateAccountStyles.textInput}
                value={location}
                onChangeText={setLocation}
            />
            <View style={CreateAccountStyles.timePickerContainer}>
                <Text>Opening Time:</Text>
                <Picker style={CreateAccountStyles.timePicker}
                    selectedValue={openingTimeHour}
                    onValueChange={(itemValue) => setOpeningTimeHour(itemValue)}>
                    {hours.map(hour => (
                        <Picker.Item key={hour} label={hour.toString()} value={hour.toString()} />
                    ))}
                </Picker>
                <Picker style={CreateAccountStyles.timePicker}
                    selectedValue={openingTimeMinute}
                    onValueChange={(itemValue) => setOpeningTimeMinute(itemValue)}>
                    {minutes.map(minute => (
                        <Picker.Item key={minute} label={minute.toString()} value={minute.toString()} />
                    ))}
                </Picker>
            </View>
            <View style={CreateAccountStyles.timePickerContainer}>
                <Text>Closing Time:</Text>
                <Picker style={CreateAccountStyles.timePicker}
                    selectedValue={closingTimeHour}
                    onValueChange={(itemValue) => setClosingTimeHour(itemValue)}>
                    {hours.map(hour => (
                        <Picker.Item key={hour} label={hour.toString()} value={hour.toString()} />
                    ))}
                </Picker>
                <Picker style={CreateAccountStyles.timePicker}
                    selectedValue={closingTimeMinute}
                    onValueChange={(itemValue) => setClosingTimeMinute(itemValue)}>
                    {minutes.map(minute => (
                        <Picker.Item key={minute} label={minute.toString()} value={minute.toString()} />
                    ))}
                </Picker>
            </View>


            <TextInput
                placeholder="Username"
                style={CreateAccountStyles.textInput}
                value={username}
                onChangeText={setUsername}
            />
            <TextInput
                placeholder="Password"
                style={CreateAccountStyles.textInput}
                secureTextEntry={true}
                value={password}
                onChangeText={setPassword}
            />
            <View style={CreateAccountStyles.buttonContainer}>
                <Button
                    title='Create Account'
                    onPress={validateTime}
                    disabled={!username || !password || !name || !location || !openingTimeHour || !openingTimeMinute || !closingTimeHour || !closingTimeMinute}
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
        width: "10%",
    },
    title: {
        fontSize: 26,
        fontWeight: 'bold',
        marginBottom: 20,
    },
});

export default CreateAccountScreen;
