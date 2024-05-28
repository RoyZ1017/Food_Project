import React, { useState, useEffect } from 'react';
import { Button, StyleSheet, Text, View, ScrollView, TouchableOpacity, Linking, Alert} from 'react-native';
import { Picker } from '@react-native-picker/picker';
import { fireStore } from './Firebase.js'; 
import { getDocs, collection, query, orderBy, doc, updateDoc, deleteDoc} from "firebase/firestore";

const ShowListingsScreen = () => {
    const [listings, setListings] = useState([]);
    const [myOrders, setMyOrders] = useState([]);
    const [selectedDistrict, setSelectedDistrict] = useState('Any');

    useEffect(() => {
        const fetchListings = async () => {
            try {
                const querySnapshot = await getDocs(
                    query(collection(fireStore, "listings"), orderBy("discountedPrice", "desc"))
                );
                
                const listingData = [];
                querySnapshot.forEach((doc) => {
                    if (doc.data().quantityAvailable > 0) {
                        listingData.push({ id: doc.id, ...doc.data() });
                    }
                });
                setListings(listingData);
            } catch (error) {
                console.error('Error fetching listings from Firestore:', error);
            }
        };

        fetchListings();
    }, [setListings]);

    const reserveListing = async (listingId, quantityAvailable) => {
        try {
            if (quantityAvailable > 0) {
                const docRef = doc(fireStore, "listings", listingId);
                await updateDoc(docRef, {
                    quantityAvailable: quantityAvailable - 1
                });
                Alert.alert('Success', 'Order Placed')
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

    const openMaps = (address) => {
        const mapsUrl = `https://maps.google.com/?q=${encodeURIComponent(address)}`;
        console.log(mapsUrl)
        Linking.openURL(mapsUrl);
    };

    const filteredListings = selectedDistrict === 'Any' ? listings : listings.filter(listing => listing.district === selectedDistrict);

    return (
        <ScrollView style={styles.container}>
            <Text style={styles.title}>Available Listings</Text>
            <View style={styles.pickerContainer}>
                <Text style={styles.pickerLabel}>Sort by Food Type:</Text>
                <Picker
                    selectedValue={selectedDistrict}
                    style={styles.picker}
                    onValueChange={(itemValue) => setSelectedDistrict(itemValue)}
                >
                    <Picker.Item label="Any" value="Any" />
                    <Picker.Item label="Etobicoke-York" value="Etobicoke-York" />
                    <Picker.Item label="North York" value="North York" />
                    <Picker.Item label="Toronto & East" value="Toronto & East" />
                    <Picker.Item label="Scarborough" value="Scarborough" />
                </Picker>
            </View>
            {filteredListings.map((listing, index) => (
                <View key={index} style={styles.listingItem}>
                    <Text style={styles.listingTitle}>Listing {index + 1}</Text>
                    <Text>Restaurant Name: {listing.restaurantName}</Text>
                    <Text>Food Item: {listing.foodName}</Text>
                    <Text>Description: {listing.description}</Text>
                    <TouchableOpacity onPress={() => openMaps(listing.address)}>
                        <Text style={{ flexDirection: 'row' }}>
                            <Text>Address: </Text>
                            <Text style={{ color: 'blue' }}>{listing.address}</Text>
                        </Text>
                        </TouchableOpacity>
                    <Text>District: {listing.district}</Text>
                    <Text>Original Price: {listing.originalPrice}</Text>
                    <Text>Discounted Price: {listing.discountedPrice}</Text>
                    <Text>Quantity Available: {listing.quantityAvailable}</Text>
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