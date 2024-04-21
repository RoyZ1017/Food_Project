import React, { useState } from 'react';
import { Button, StyleSheet, Text, View, Image, ScrollView, TextInput } from 'react-native';

const CreateAccountScreen = ({navigation}) => {
    const [name, setName] = useState('');
    const [location, setLocation] = useState('');
    const [openingTime, setOpeningTime] = useState('');
    const [closingTime, setClosingTime] = useState('');
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    return(
        <View style={CreateAccountStyles.container}>
            <Text style = {CreateAccountStyles.title}>Account Setup</Text> 
            <TextInput
                placeholder="Restaurant Name"
                style = {CreateAccountStyles.textInput}
                value = {name}
                onChangeText={setName}
            />
            <TextInput
                placeholder="Location"
                style = {CreateAccountStyles.textInput}
                value = {location}
                onChangeText={setLocation}
            />
            <TextInput
                placeholder="Opening Time"
                style = {CreateAccountStyles.textInput}
                value = {openingTime}
                onChangeText={setOpeningTime}
            />
            <TextInput
                placeholder="Closing Time"
                style = {CreateAccountStyles.textInput}
                value = {closingTime}
                onChangeText={setClosingTime}
            />
            <TextInput
                placeholder="Usernane"
                style = {CreateAccountStyles.textInput}
                value = {username}
                onChangeText={setUsername}
            />
            <TextInput
                placeholder="Password"
                style = {CreateAccountStyles.textInput}
                secureTextEntry={true}
                value = {password}
                onChangeText={setPassword}
            />
            <View style={CreateAccountStyles.buttonContainer}>
                <Button
                    title = 'Create Account'
                    onPress={() => navigation.navigate('Home')}
                    disabled={!username || !password || !name || !location || !openingTime || !closingTime}
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
        height: "5%",
        padding: 5,
    },

    buttonContainer: {
        margin: 5,
        width: "10%",
    },
    title: {
        fontSize: 26,
        fontWeight: 'bold',
        marginBottom: "2%"
      },

});

export default CreateAccountScreen