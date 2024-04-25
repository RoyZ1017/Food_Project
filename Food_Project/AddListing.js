import React, { useState } from 'react';
import { Button, StyleSheet, Text, View, TextInput, ScrollView } from 'react-native';

// Todo -> Add feature to delete listing

const AddListingScreen = ({navigation}) => {

    const [foodName, setFoodName] = useState('');
    const [description, setDescription] = useState('');
    const [originalPrice, setOriginalPrice] = useState('');
    const [discountedPrice, setDiscountedPrice] = useState('');
    const [quantityAvailable, setQuantityAvailable] = useState('');

    const [listings, setListings] = useState([]);
    const [listingCounter, setListingCounter] = useState(0);

    // Ensure only numbers are inputted in numeric text boxes
    const handleNumericInputChange = (value, setter) => {
        const numericValue = value.replace(/[^0-9.]/g, '');
        setter(numericValue);
    };

    // Function to handle creation of a new listing
    const createListing = () => {
        // Create a new listing object
        const newListing = {foodName, description,originalPrice,discountedPrice,quantityAvailable};

        // Increment the listing counter
        setListingCounter(listingCounter + 1);

        // Add the new listing to the listings array
        setListings([...listings, newListing]);

        // Clear the input fields
        setFoodName(''); setDescription(''); setOriginalPrice(''); setDiscountedPrice(''); setQuantityAvailable('');
    };

    return (
        <View style={ListingStyles.container}>
            <Text style={ListingStyles.title}>Add a food listing!</Text>
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
            <View style={ListingStyles.buttonContainer}>
                <Button
                    title='Create Listing'
                    onPress={createListing}
                    disabled={!foodName || !description || !originalPrice || !discountedPrice || !quantityAvailable}
                />
            </View>
            <ScrollView style={ListingStyles.listingsContainer}>
                {listings.map((listing, index) => (
                    <View key={index} style={ListingStyles.listingItem}>
                        <Text style={ListingStyles.listingTitle}>Listing {index + 1}</Text>
                        <Text>Food Name: {listing.foodName}</Text>
                        <Text>Description: {listing.description}</Text>
                        <Text>Original Price: ${parseFloat(listing.originalPrice).toFixed(2)}</Text>
                        <Text>Discounted Price: ${parseFloat(listing.discountedPrice).toFixed(2)}</Text>
                        <Text>Quantity Available: {listing.quantityAvailable}</Text>
                    </View>
                ))}
            </ScrollView>
        </View>
    );
}

const ListingStyles = StyleSheet.create({
    container: {
        flex: 1,
        alignItems: 'center',
        paddingHorizontal: 20,
    },
    title: {
        marginBottom: 20,
        marginTop: 30,
        fontSize: 20,
        fontWeight: 'bold',
    },
    textInput: {
        marginBottom: 10,
        backgroundColor: '#d3d3d3',
        borderRadius: 10,
        width: 200,
        paddingHorizontal: 10,
    },
    textInputDescription: {
        height: 90,
        textAlignVertical: 'top',
    },
    numericInput: {
        marginBottom: 10,
    },
    buttonContainer: {
        margin: 5,
        width: 200,
    },
    listingsContainer: {
        marginTop: 20,
        maxHeight: '50%',
        width:'30%'
    },
    listingItem: {
        marginBottom: 10,
        backgroundColor: '#f0f0f0',
        padding: 10,
        borderRadius: 10,
    },
    listingTitle: {
        fontWeight: 'bold',
        fontSize: 16,
        marginBottom: 5,
    },
});

export default AddListingScreen;
