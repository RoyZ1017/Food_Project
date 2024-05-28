import React, { useState, useEffect } from 'react';
import { Button, StyleSheet, Text, View, TextInput, ScrollView } from 'react-native';
import { fireStore } from './Firebase.js'; 
import { addDoc, collection, getDocs, query, orderBy } from "firebase/firestore";
import { Picker } from '@react-native-picker/picker';

const AddListingScreen = () => {
    const [foodName, setFoodName] = useState('');
    const [description, setDescription] = useState('');
    const [originalPrice, setOriginalPrice] = useState('');
    const [discountedPrice, setDiscountedPrice] = useState('');
    const [quantityAvailable, setQuantityAvailable] = useState('');
    const [foodType, setFoodType] = useState('');
    const [listings, setListings] = useState([]);
    const [newListing, setNewListing] = useState(0);

    useEffect(() => {
        const fetchListing = async () => {
            try {
                const querySnapshot = await getDocs(
                    query(collection(fireStore, "listings"), orderBy("discountedPrice", "desc"))
                );
                const listingData = [];
                querySnapshot.forEach((doc) => {
                    listingData.push(doc.data());
                });
                setListings(listingData);
            } catch (error) {
                console.error('Error fetching comments from Firestore:', error);
            }
        };

        fetchListing();
    }, [newListing]);

    const handleNumericInputChange = (value, setter) => {
        const numericValue = value.replace(/[^0-9.]/g, '');
        setter(numericValue);
    };

    const createListing = async () => {
        setNewListing(1);
        const ReplyRef = collection(fireStore, "listings");
        await addDoc(ReplyRef, {
            foodName: foodName,
            description: description,
            originalPrice: originalPrice,
            discountedPrice: discountedPrice,
            quantityAvailable: quantityAvailable,
            foodType: foodType,
        });
        setFoodName('');
        setDescription('');
        setOriginalPrice('');
        setDiscountedPrice('');
        setQuantityAvailable('');
        setFoodType('');
        setNewListing(0);
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
            <View style={ListingStyles.pickerContainer}>
                <Picker selectedValue={foodType}
                    onValueChange={(itemValue) => setFoodType(itemValue)}
                    style={ListingStyles.picker}>
                    <Picker.Item label="Select Food Type" value="" />
                    <Picker.Item label="Prepared Foods" value="Prepared Foods" />
                    <Picker.Item label="Baked Goods" value="Baked Goods" />
                    <Picker.Item label="Surprise Bag" value="Surprise Bag" />
                    <Picker.Item label="Vegetarian" value="Vegetarian" />
                    <Picker.Item label="Snacks" value="Snacks" />
                </Picker>
            </View>
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
                    disabled={!foodName || !description || !originalPrice || !discountedPrice || !quantityAvailable || !foodType}
                />
            </View>
            <ScrollView style={ListingStyles.listingsContainer}>
                {listings.map((listing, index) => (
                    <View key={index} style={ListingStyles.listingItem}>
                        <Text style={ListingStyles.listingTitle}>Listing {index + 1}</Text>
                        <Text>Food Name: {listing.foodName}</Text>
                        <Text>Food Type: {listing.foodType}</Text>
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
    pickerContainer: {
        marginBottom: 10,
        backgroundColor: '#d3d3d3',
        borderRadius: 10,
        width: 200,
        paddingHorizontal: 10,
    },
    picker: {
        height: 40,
        width: '100%',
    },
    buttonContainer: {
        margin: 5,
        width: 200,
    },
    listingsContainer: {
        marginTop: 20,
        maxHeight: '50%',
        width: '100%',
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
