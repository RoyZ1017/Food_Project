import { StatusBar } from 'expo-status-bar';
import { Button, StyleSheet, Text, View, Image, ScrollView } from 'react-native';
import {NavigationContainer} from '@react-navigation/native' 
import {createStackNavigator} from '@react-navigation/stack';

const Stack = createStackNavigator();

const HomeScreen = ({navigation}) => {
  return (
    <View style={styles.container}>
      <Text style = {styles.title}>Welcome to Food Project</Text> 
      <Image
        source = {{uri:'https://png.pngtree.com/png-vector/20230906/ourmid/pngtree-paper-bag-vector-png-image_10015259.png'}}
        style = {{width:125, height:125}}
      />
      <Text style = {styles.subtitle}>Login as:</Text>
      <Button
        title = 'Restaurant/Store'
        onPress={() => navigation.navigate('Login')}
      />
      <View style = {styles.footer}>
        <Text style = {styles.subtitle}>This app was made by{'\n'}Praneeth Suryadevara and Roy Zhang!</Text>
      </View>
      <StatusBar style="auto"/>
    </View>
  );
}

const LoginScreen = ({navigation}) => {
  return(
    <Text>Hello</Text>
  )
}


export default function App() {  
  return (
    <NavigationContainer>
      <Stack.Navigator initialRouteName='Home'>
        <Stack.Screen name="Home" component={HomeScreen} />
        <Stack.Screen name="Login" component={LoginScreen} />
      </Stack.Navigator>
    </NavigationContainer>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#ffefd6',
    alignItems: 'center',
    justifyContent: 'center',
  },
  title: {
    fontSize: 26,
    fontWeight: 'bold',
    marginBottom: 60
  },
  footer: {
    position: 'absolute',
    bottom: 10,
  },
  subtitle: {
    fontSize: 13,
    marginTop: 40,
    marginBottom: 25,
    textAlign: 'center'
  },
});