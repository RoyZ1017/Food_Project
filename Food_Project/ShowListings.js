import React, { useState, useEffect } from 'react';
import { Button, StyleSheet, Text, View, TouchableOpacity, Linking, Alert, FlatList } from 'react-native';
import ModalDropdown from 'react-native-modal-dropdown';
import { fireStore } from './Firebase.js'; 
import { getDocs, collection, query, orderBy, doc, updateDoc, deleteDoc, addDoc } from "firebase/firestore";
import { ScrollView } from 'react-native-virtualized-view'


/**
 * ShowListingsScreen Component
 * 
 * @param {Object} route - The route object from React Navigation
 * @returns {JSX.Element} - The rendered ShowListingsScreen component
 */
const ShowListingsScreen = ({ route }) => {

    // State hooks to manage listings, orders, selected district, and user email    
    const [listings, setListings] = useState([]);
    const [myOrders, setMyOrders] = useState([]);
    const [selectedDistrict, setSelectedDistrict] = useState('Any');
    const { email } = route.params;

    // List of districts to be used in the dropdown
    const districts = ['Any', 'Etobicoke-York', 'North York', 'Toronto & East', 'Scarborough'];

    /**
     * Fetches listings from Firestore and updates state
     * 
     * @returns {void}
     */
    const fetchListings = async () => {
        console.log("fetching Now");
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
    
    // Fetch listing once component mounts
    useEffect(() => {
        fetchListings();
    }, []);

     /**
     * Reserves a listing and updates Firestore
     * 
     * @param {string} listingId - The ID of the listing to reserve
     * @param {Object} listing - The listing object
     * @returns {void}
     */
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

    /**
     * Removes an order and updates Firestore accordingly
     * 
     * @param {string} orderId - The ID of the order to remove
     * @param {Object} order - The order object
     * @returns {void}
     */
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

    /**
     * Opens Google Maps with the given address
     * 
     * @param {string} address - The address to open in Google Maps
     * @returns {void}
     */
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
                <View style={styles.pickerWrapper}>
                    <ModalDropdown
                        options={districts}
                        defaultValue={selectedDistrict}
                        onSelect={(index, value) => setSelectedDistrict(value)}
                        textStyle={styles.pickerText}
                        dropdownTextStyle={styles.dropdownText}
                        dropdownStyle={styles.dropdown}
                    />
                </View>
            </View>
            {filteredListings.length === 0 ? (
                <Text style={styles.noListingsText}>
                    There are no listings of {selectedDistrict} available.
                </Text>
            ) : (
                <FlatList
                    data={filteredListings}
                    keyExtractor={(item) => item.id}
                    initialScrollIndex={0}
                    renderItem={({ item, index }) => (
                        <View key={index} style={styles.listingItem}>
                            <Text style={styles.listingTitle}>LISTING {index + 1}</Text>
                            <Text style={styles.listItemText}>Rest. Name: {item.restaurantName}</Text>
                            <Text style={styles.listItemText}>Food Item: {item.foodName}</Text>
                            <Text style={styles.listItemText}>Description: {item.description}</Text>
                            <View style={{ marginBottom: 20 }} />
                            <TouchableOpacity onPress={() => openMaps(item.address)}>
                                <Text style={styles.listItemText}>
                                    <Text>Address: </Text>
                                    <Text style={{ color: 'blue' }}>{item.address}</Text>
                                </Text>
                            </TouchableOpacity>
                            <Text style={styles.listItemText}>District: {item.district}</Text>
                            <View style={styles.priceContainer}>
                                <Text style={styles.listItemText}>Original Price: {item.originalPrice}  |  Discounted Price: {item.discountedPrice}</Text>
                            </View>
                            <View style={styles.reserveContainer}>
                                <Text style={styles.listItemText}>Quantity Available: {item.quantityAvailable}</Text>
                                <Button
                                    title="Reserve"
                                    disabled={item.quantityAvailable <= 0}
                                    onPress={() => reserveListing(item.id, item)}
                                />
                            </View>
                        </View>
                    )}
                />

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
                            <View style={styles.textContainer}>
                                <Text style={styles.listItemText}>Rest. Name: {order.restaurantName}</Text>
                                <Text style={styles.listItemText}>Food Item: {order.foodName}</Text>
                                <TouchableOpacity onPress={() => openMaps(order.address)}>
                                    <Text style={styles.listItemText}>
                                        <Text>Address: </Text>
                                        <Text style={{ color: 'blue' }}>{order.address}</Text>
                                    </Text>
                                </TouchableOpacity>
                            </View>
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

// Styles for the ShowListingsScreen component
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
    pickerWrapper: {
        flex: 1,
        borderWidth: 1,
        borderColor: '#ccc',
        borderRadius: 5,
    },
    pickerText: {
        fontSize: 16,
        color: 'black',
        marginVertical: 5,
    },
    dropdownText: {
        fontSize: 16,
        color: 'black',
    },
    dropdown: {
        width: '80%',
    },
    noListingsText: {
        fontSize: 16,
        fontStyle: 'italic',
        textAlign: 'center',
        marginBottom: 40, marginTop: 10,
    },
    listingItem: {
        borderWidth: 1,
        borderColor: '#ccc',
        borderRadius: 5,
        padding: 15,
        marginBottom: 20,
    },
    listingTitle: {
        fontSize: 18,
        fontWeight: 'bold',
        marginBottom: 10,
    },
    listItemText: {
        fontSize: 16,
    },
    priceContainer: {
        marginVertical: 10,
    },
    reserveContainer: {
        marginVertical: 10,
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
    },
    textContainer: {
        flex: 1,
    },
    noOrdersText: {
        fontSize: 16,
        fontStyle: 'italic',
        textAlign: 'center',
    },
});

export default ShowListingsScreen;
