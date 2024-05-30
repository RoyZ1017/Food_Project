import React, { useState, useEffect } from 'react';
import { Button, StyleSheet, Text, View, TextInput, ScrollView, TouchableOpacity, Linking } from 'react-native';
import { fireStore } from './Firebase.js'; 
import { addDoc, collection, getDocs, query, orderBy } from "firebase/firestore";
import ModalDropdown from 'react-native-modal-dropdown'; // Import dropdown component

/**
 * AddListingScreen Component
 * 
 * @param {Object} route - Route object containing parameters passed to this screen
 * @returns {JSX.Element} - The rendered component
 */
const AddListingScreen = ({ route }) => {
    // State variables to manage user inputs and listings
    const [restaurantName, setRestaurantName] = useState('');
    const [foodName, setFoodName] = useState('');
    const [description, setDescription] = useState('');
    const [originalPrice, setOriginalPrice] = useState('');
    const [discountedPrice, setDiscountedPrice] = useState('');
    const [quantityAvailable, setQuantityAvailable] = useState('');
    const [district, setDistrict] = useState('');
    const [listings, setListings] = useState([]);
    const [newListing, setNewListing] = useState(0);
    const [address, setAddress] = useState('');
    const { email } = route.params; // Get email from route parameters

    /**
     * 
     * Effect to fetch listings from Firestore and update the state.
     */
    useEffect(() => {
        const fetchListing = async () => {
            console.log("fetching")
            try {
                // Query Firestore to get obtain listings ordered by discounted price in a descending order
                const querySnapshot = await getDocs(
                    query(collection(fireStore, "listings"), orderBy("discountedPrice", "desc"))
                );
                const listingData = [];
                querySnapshot.forEach((doc) => {
                    if (doc.data().quantityAvailable > 0 && !doc.data().user && doc.data().creator == email) {
                        listingData.push(doc.data());
                    }
                });
                setListings(listingData);
            } catch (error) {
                console.error('Error fetching comments from Firestore:', error);
            }
        };

        fetchListing();
    }, [newListing]);

    /**
     * 
     * Handle numeric input changes by restricting input to numeric values.
     * @param {string} value - The input value from the text field.
     * @param {function} setter - The state setter function for the corresponding state variable.
     */
    const handleNumericInputChange = (value, setter) => {
        const numericValue = value.replace(/[^0-9.]/g, '');
        setter(numericValue);
    };

    /**
     * 
     * Create a new listing in Firestore and reset the form inputs.
     */
    const createListing = async () => {
        setNewListing(1);
        const ReplyRef = collection(fireStore, "listings");
        await addDoc(ReplyRef, {
            restaurantName: restaurantName,
            foodName: foodName,
            description: description,
            originalPrice: originalPrice,
            discountedPrice: discountedPrice,
            quantityAvailable: quantityAvailable,
            district: district,
            address: address,
            reserved: [],
            creator: email
        });
        setRestaurantName('');
        setFoodName('');
        setDescription('');
        setOriginalPrice('');
        setDiscountedPrice('');
        setQuantityAvailable('');
        setDistrict('');
        setNewListing(0);
        setAddress('');
        setDistrict('');
    };

    /**
     * 
     * Open Google Maps with the provided address.
     * @param {string} address - The address to open in Google Maps.
     */
    const openMaps = (address) => {
        const mapsUrl = `https://maps.google.com/?q=${encodeURIComponent(address)}`;
        console.log(mapsUrl)
        Linking.openURL(mapsUrl);
    };

    return (
        <ScrollView contentContainerStyle={ListingStyles.container}>
            <View style={ListingStyles.inputContainer}>
                <Text style={ListingStyles.title}>Add a food listing!</Text>
                <Text style={ListingStyles.subtitle}>Enter all the information needed for your listing. Make sure your 
                added location is a valid location on Google Maps.</Text>
                <TextInput
                    placeholder="Name of your restaurant"
                    style={ListingStyles.textInput}
                    value={restaurantName}
                    onChangeText={setRestaurantName}
                />
                <TextInput
                    placeholder="Name of your food item"
                    style={ListingStyles.textInput}
                    value={foodName}
                    onChangeText={setFoodName}
                />
                <TextInput
                    placeholder="Description of your product"
                    style={[ListingStyles.textInput, ListingStyles.textInputDescription]}
                    multiline={true}
                    numberOfLines={4}
                    value={description}
                    onChangeText={setDescription}
                />
                <TextInput
                    placeholder="Address"
                    style={ListingStyles.textInput}
                    value={address}
                    onChangeText={setAddress}
                />
                <View style={ListingStyles.pickerContainer}>
                    <ModalDropdown
                        options={['Etobicoke-York', 'North York', 'Toronto & East', 'Scarborough']}
                        defaultValue="Select District"
                        onSelect={(index, value) => setDistrict(value)}
                        textStyle={ListingStyles.pickerText}
                        dropdownTextStyle={ListingStyles.dropdownText}
                        dropdownStyle={ListingStyles.dropdown}
                    />
                </View>
                <TextInput
                    placeholder="Original Price"
                    style={[ListingStyles.textInput, ListingStyles.numericInput]}
                    keyboardType="numeric"
                    value={originalPrice}
                    onChangeText={(value) => handleNumericInputChange(value, setOriginalPrice)}
                />
                <TextInput
                    placeholder="Discounted Price"
                    style={[ListingStyles.textInput, ListingStyles.numericInput]}
                    keyboardType="numeric"
                    value={discountedPrice}
                    onChangeText={(value) => handleNumericInputChange(value, setDiscountedPrice)}
                />
                <TextInput
                    placeholder="Quantity Available"
                    style={[ListingStyles.textInput, ListingStyles.numericInput]}
                    keyboardType="numeric"
                    value={quantityAvailable}
                    onChangeText={(value) => handleNumericInputChange(value, setQuantityAvailable)}
                />
            </View>
            <View style={ListingStyles.buttonContainer}>
                <Button
                    title='Create Listing'
                    onPress={createListing}
                    disabled={!foodName || !description || !originalPrice || !discountedPrice || !quantityAvailable || !district ||!address ||!restaurantName}
                />
            </View>
            <Text style={ListingStyles.title}>View your food listings:</Text>
            <Text style={ListingStyles.subtitle}>See the information of your added listings.</Text>
            <ScrollView contentContainerStyle={ListingStyles.listingsContainer}>
                {listings.map((listing, index) => (
                    <View key={index} style={ListingStyles.listingItem}>
                        <Text style={ListingStyles.listingTitle}>LISTING {index + 1}</Text>
                        <Text>Restaurant Name: {listing.restaurantName}</Text>
                        <Text>Food Name: {listing.foodName}</Text>
                        <Text>Description: {listing.description}</Text>
                        <TouchableOpacity onPress={() => openMaps(listing.address)}>
                        <Text style={{ flexDirection: 'row' }}>
                            <Text>Address: </Text>
                            <Text style={{ color: 'blue' }}>{listing.address}</Text>
                        </Text>
                        </TouchableOpacity>
                        <Text>District: {listing.district}</Text>
                        <Text>Original Price: ${parseFloat(listing.originalPrice).toFixed(2)}</Text>
                        <Text>Discounted Price: ${parseFloat(listing.discountedPrice).toFixed(2)}</Text>
                        <Text>Quantity Available: {listing.quantityAvailable}</Text>
                    </View>
                ))}
            </ScrollView>
        </ScrollView>
    );
}

// Styling for the screen
const ListingStyles = StyleSheet.create({
    container: {
        flexGrow: 1,
        paddingHorizontal: 20,
    },
    inputContainer: {
        width: '100%',
    },
    title: {
        marginBottom: 20,
        marginTop: 30,
        fontSize: 20,
        fontWeight: 'bold',
        textAlign: 'left',
    },
    subtitle: {
        marginBottom: 20,
        fontSize: 16,
        textAlign: 'left',
    },
    textInput: {
        width: '70%',
        padding: 10,
        marginVertical: 10,
        borderWidth: 2,
        borderColor: '#ddd',
        borderRadius: 5,
        backgroundColor: '#f9f9f9',
        alignSelf: 'center'
    },
    textInputDescription: {
        height: 90,
        textAlignVertical: 'top',
    },
    numericInput: {
        marginBottom: 10,
    },
    pickerText: {
        fontSize: 16,
        color: 'black',
        width: '70%',
        textAlign: 'center',
        padding: 10,
        borderWidth: 2,
        borderColor: '#ddd',
        borderRadius: 5,
        backgroundColor: '#f9f9f9',
        alignSelf: 'center',
        marginBottom: 10,
    },
    dropdownText: {
        fontSize: 16,
        color: 'black',
    },
    dropdown: {
        width: '70%',
        height: 150,
        alignSelf: 'center',
    },
    pickerContainer: {
        marginBottom: 10, 
        marginTop: 10,
        alignItems: 'center',
    },
    buttonContainer: {
        marginTop: 15, marginBottom: 25,
        width: '45%',
        alignSelf: 'center',
    },
    listingsContainer: {
        marginTop: 20,
        maxHeight: '100%',
        width: '100%',
    },
    listingItem: {
        marginBottom: 20, 
        backgroundColor: '#fffdfa', 
        padding: 15,
        borderRadius: 10,
        borderWidth: 3,
        borderColor: '#d0d0d0',
    },
    listingTitle: {
        fontWeight: 'bold',
        fontSize: 18,
        marginBottom: 15,
        textAlign: 'center',
    },
});

export default AddListingScreen;
