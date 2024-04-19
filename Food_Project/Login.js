import { Button, StyleSheet, Text, View, Image, ScrollView, TextInput } from 'react-native';

const LoginScreen = ({navigation}) => {
    return(
        <View style={LoginStyles.container}>
            <Image
                source = {require('./assets/profile.png')}
                style = {LoginStyles.image}
            />
            <TextInput
                placeholder="Username"
                style = {LoginStyles.Textinput}
            />
            <TextInput
                placeholder="Password"
            />
            <Button
                title = 'Login'
                onPress={() => navigation.navigate('Home')}            />
        </View>
    )
  }

const LoginStyles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#ffefd6',
        alignItems: 'center',
    },
    image: {
        width: 250, 
        height: 250,
        position: 'relative',
        top: "10%",
        marginBottom: 50,
    },
    Textinput: {
        marginTop: 10,
    }

});

export default LoginScreen