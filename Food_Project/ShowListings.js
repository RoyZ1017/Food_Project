import React, { useState, useEffect } from 'react';
import { Button, StyleSheet, Text, View, ScrollView } from 'react-native';
import { Picker } from '@react-native-picker/picker';
import { fireStore } from '/Firebase.js'; 
import { getDocs, collection, query, orderBy, doc, updateDoc } from "firebase/firestore";

const ShowListingsScreen = () => {
    const [listings, setListings] = useState([]);
    const [myOrders, setMyOrders] = useState([]);
    const [selectedFoodType, setSelectedFoodType] = useState('Any');

    useEffect(() => {
        const fetchListings = async () => {
            try {
                const querySnapshot = await getDocs(
                    query(collection(fireStore, "listings"), orderBy("discountedPrice", "desc"))
                );
                
                const listingData = [];
                querySnapshot.forEach((doc) => {
                    listingData.push({ id: doc.id, ...doc.data() });
                });
                setListings(listingData);
            } catch (error) {
                console.error('Error fetching listings from Firestore:', error);
            }
        };

        fetchListings();
    }, [selectedFoodType]);

    const reserveListing = async (listingId, quantityAvailable) => {
        try {
            if (quantityAvailable > 0) {
                const docRef = doc(fireStore, "listings", listingId);
                await updateDoc(docRef, {
                    quantityAvailable: quantityAvailable - 1
                });
                setMyOrders([...myOrders, listingId]);
            }
        } catch (error) {
            console.error('Error reserving listing:', error);
        }
    };

    const getFoodItemName = (orderId) => {
        const orderListing = listings.find(listing => listing.id === orderId);
        return orderListing ? orderListing.foodName : 'Unknown';
    };

    const filteredListings = selectedFoodType === 'Any' ? listings : listings.filter(listing => listing.foodType === selectedFoodType);

    return (
        <ScrollView style={styles.container}>
            <Text style={styles.title}>Available Listings</Text>
            <View style={styles.pickerContainer}>
                <Text style={styles.pickerLabel}>Sort by Food Type:</Text>
                <Picker
                    selectedValue={selectedFoodType}
                    style={styles.picker}
                    onValueChange={(itemValue) => setSelectedFoodType(itemValue)}
                >
                    <Picker.Item label="Any" value="Any" />
                    <Picker.Item label="Prepared Foods" value="Prepared Foods" />
                    <Picker.Item label="Baked Goods" value="Baked Goods" />
                    <Picker.Item label="Surprise Bag" value="Surprise Bag" />
                    <Picker.Item label="Vegetarian" value="Vegetarian" />
                    <Picker.Item label="Snacks" value="Snacks" />
                </Picker>
            </View>
            {filteredListings.map((listing, index) => (
                <View key={index} style={styles.listingItem}>
                    <Text style={styles.listingTitle}>Listing {index + 1}</Text>
                    <Text>Food Item: {listing.foodName}</Text>
                    <Text>Description: {listing.description}</Text>
                    <Text>Original Price: {listing.originalPrice}</Text>
                    <Text>Discounted Price: {listing.discountedPrice}</Text>
                    <Text>Quantity Available: {listing.quantityAvailable}</Text>
                    <Text>Food Type: {listing.foodType}</Text>
                    <View style={styles.buttonContainer}>
                        <Button
                            title="Reserve"
                            disabled={myOrders.includes(listing.id)}
                            onPress={() => reserveListing(listing.id, listing.quantityAvailable)}
                        />
                    </View>
                </View>
            ))}
            <Text style={styles.title}>My Orders</Text>
            {myOrders.map((orderId, index) => (
                <View key={index} style={styles.orderItem}>
                    <Text>Order {index + 1}</Text>
                    <Text>Food Item: {getFoodItemName(orderId)}</Text>
                </View>
            ))}
        </ScrollView>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        padding: 20,
    },
    title: {
        fontSize: 24,
        fontWeight: 'bold',
        marginBottom: 10,
    },
    pickerContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        marginBottom: 20,
    },
    pickerLabel: {
        fontSize: 16,
        marginRight: 10,
    },
    picker: {
        height: 30,
        width: 200, 
    },
    listingItem: {
        marginBottom: 20,
        backgroundColor: '#f0f0f0',
        padding: 10,
        borderRadius: 10,
    },
    listingTitle: {
        fontWeight: 'bold',
        fontSize: 20, 
        marginBottom: 5,
    },
    orderItem: {
        marginBottom: 20,
        backgroundColor: '#f9f9f9',
        padding: 10,
        borderRadius: 10,
    },
    buttonContainer: {
        width: 120,
        alignSelf: 'flex-start',
        paddingTop: 10,
    },
});

export default ShowListingsScreen;