import React, { useState, useEffect } from 'react';
import { Button, StyleSheet, Text, View, ScrollView, TouchableOpacity, Linking, Alert } from 'react-native';
import { Picker } from '@react-native-picker/picker';
import { fireStore } from './Firebase.js'; 
import { getDocs, collection, query, orderBy, doc, updateDoc, deleteDoc, addDoc } from "firebase/firestore";

const ShowListingsScreen = ({ route }) => {
    const [listings, setListings] = useState([]);
    const [myOrders, setMyOrders] = useState([]);
    const [selectedDistrict, setSelectedDistrict] = useState('Any');
    const { email } = route.params;

    const fetchListings = async () => {
        console.log("fetching Now")
        try {
            const querySnapshot = await getDocs(
                query(collection(fireStore, "listings"), orderBy("discountedPrice", "desc"))
            );
            
            const listingData = [];
            querySnapshot.forEach((doc) => {
                if (doc.data().quantityAvailable > 0 && (!doc.data().reserved || !doc.data().reserved.includes(email)) && !doc.data().user) {
                    listingData.push({ id: doc.id, ...doc.data() });
                }
            });
            setListings(listingData);

            const userOrders = [];
            querySnapshot.forEach((doc) => {
                if (doc.data().user === email) {
                    userOrders.push({ id: doc.id, ...doc.data() });
                }
            });
            setMyOrders(userOrders);
        } catch (error) {
            console.error('Error fetching listings from Firestore:', error);
        }
    };
    
    useEffect(() => {
        fetchListings();
    }, []);

    const reserveListing = async (listingId, listing) => {
        try {
            if (listing.quantityAvailable > 1) {
                const docRef = doc(fireStore, "listings", listingId);
                await updateDoc(docRef, {
                    quantityAvailable: listing.quantityAvailable - 1,
                    reserved: [...listing.reserved, email]
                });
            } else {
                const docRef = doc(fireStore, "listings", listingId);
                await deleteDoc(docRef);
            }

            await addDoc(collection(fireStore, "listings"), {
                restaurantName: listing.restaurantName,
                foodName: listing.foodName,
                description: listing.description,
                originalPrice: listing.originalPrice,
                discountedPrice: listing.discountedPrice,
                quantityAvailable: 1,
                district: listing.district,
                address: listing.address,
                user: email
            });

            Alert.alert('Success', 'Order Placed!');
            fetchListings();
        } catch (error) {
            console.error('Error reserving listing:', error);
        }
    };

    const removeOrder = async (orderId, order) => {
        try {
            const docRef = doc(fireStore, "listings", orderId);
            await deleteDoc(docRef);

            const originalListing = listings.find(listing => listing.foodName === order.foodName && listing.restaurantName === order.restaurantName);
            if (originalListing) {
                const originalDocRef = doc(fireStore, "listings", originalListing.id);
                await updateDoc(originalDocRef, {
                    quantityAvailable: originalListing.quantityAvailable + 1
                });
            } else {
                await addDoc(collection(fireStore, "listings"), {
                    restaurantName: order.restaurantName,
                    foodName: order.foodName,
                    description: order.description,
                    originalPrice: order.originalPrice,
                    discountedPrice: order.discountedPrice,
                    quantityAvailable: 1,
                    district: order.district,
                    address: order.address
                });
            }

            Alert.alert('Success', 'Order Removed!');
            fetchListings();
        } catch (error) {
            console.error('Error removing order:', error);
        }
    };

    const openMaps = (address) => {
        const mapsUrl = `https://maps.google.com/?q=${encodeURIComponent(address)}`;
        Linking.openURL(mapsUrl);
    };

    const filteredListings = selectedDistrict === 'Any' ? listings : listings.filter(listing => listing.district === selectedDistrict);

    return (
        <ScrollView style={styles.container}>
            <Text style={styles.title}>Available Listings</Text>
            <Text style={styles.subtitle}>Below is a list of FoodForAll listings created by local resataurants. These include information about the 
            food item, the prices, the quantity available, and the location (which can be opened in Google Maps). Each listing can only be reserved once.</Text>
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
            {filteredListings.length === 0 ? (
                <Text style={styles.noListingsText}>
                    There are no listings of {selectedDistrict} available.
                </Text>
            ) : (
                filteredListings.map((listing, index) => (
                    <View key={index} style={styles.listingItem}>
                        <Text style={styles.listingTitle}>LISTING {index + 1}</Text>
                        <Text style={styles.listItemText}>Rest. Name: {listing.restaurantName}</Text>
                        <Text style={styles.listItemText}>Food Item: {listing.foodName}</Text>
                        <Text style={styles.listItemText}>Description: {listing.description}</Text>
                        <View style={{ marginBottom: 20 }} />
                        <TouchableOpacity onPress={() => openMaps(listing.address)}>
                            <Text style={styles.listItemText}>
                                <Text>Address: </Text>
                                <Text style={{ color: 'blue' }}>{listing.address}</Text>
                            </Text>
                        </TouchableOpacity>
                        <Text style={styles.listItemText}>District: {listing.district}</Text>
                        <View style={styles.priceContainer}>
                            <Text style={styles.listItemText}>Original Price: {listing.originalPrice}  |  Discounted Price: {listing.discountedPrice}</Text>
                        </View>
                        <View style={styles.reserveContainer}>
                            <Text style={styles.listItemText}>Quantity Available: {listing.quantityAvailable}</Text>
                            <Button
                                title="Reserve"
                                disabled={listing.quantityAvailable <= 0}
                                onPress={() => reserveListing(listing.id, listing)}
                            />
                        </View>
                    </View>
                ))
            )}
            <Text style={styles.title}>My Orders</Text>
            <Text style={styles.subtitle}>Below is a list of your reserved orders. You can click the remove button if you wish to 
            cancel your reservation.</Text>
            <View style={{ marginBottom: 10 }} />
            {myOrders.length === 0 ? (
                <Text style={styles.noOrdersText}>You have no orders.</Text>
            ) : (
                myOrders.map((order, index) => (
            <View key={index} style={styles.listingItem}>
                <Text style={styles.listingTitle}>ORDER {index + 1}</Text>
                <View style={styles.reserveContainer}>
                    <Text style={styles.listItemText}>Food Item: {order.foodName}</Text>
                    <Button
                        title="Remove"
                        color="red"
                        onPress={() => removeOrder(order.id, order)}
                    />
                </View>
            </View>
    ))
            )}
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
        marginBottom: 20,
    },
    subtitle: {
        fontSize: 16,
        marginBottom: 30,
    },
    pickerContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        marginBottom: 20,
    },
    pickerLabel: {
        fontSize: 16,
        marginRight: 10,
        fontWeight: 'bold',
    },
    picker: {
        height: 30,
        width: 200, 
    },
    listingItem: {
        marginBottom: 50, 
        backgroundColor: '#fffdfa', 
        padding: 15,
        borderRadius: 10,
        borderWidth: 3,
        borderColor: '#d0d0d0',
    },
    listingTitle: {
        fontWeight: 'bold',
        fontSize: 22, 
        marginBottom: 20,
        textAlign: 'center',
    },
    listItemText: {
        fontSize: 16, 
    },
    priceContainer: {
        marginTop: 20,
    },
    reserveContainer: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginTop: 20,
    },
    orderItem: {
        marginBottom: 20,
        backgroundColor: '#f9f9f9',
        padding: 15,
        borderRadius: 10,
        borderWidth: 1,
        borderColor: '#e0e0e0',
    },
    buttonContainer: {
        width: 120,
        alignSelf: 'flex-start',
        paddingTop: 10,
    },
    noListingsText: {
        fontSize: 16,
        textAlign: 'center',
        marginTop: 20,
    },
    noOrdersText: {
        fontSize: 16,
        textAlign: 'center',
        marginTop: 20,
    },
});

export default ShowListingsScreen;
