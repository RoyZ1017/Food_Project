import React, { useState, useEffect } from 'react';
import { Button, StyleSheet, Text, View, TextInput, ScrollView } from 'react-native';
import { fireStore } from '/Firebase.js'; 
import { addDoc, collection, getDocs, query, orderBy} from "firebase/firestore";

// Todo -> Add feature to delete listing

const ShowListingsScreen = () => {
    const [listings, setListings] = useState([]);
    
    const fetchListing = async () => {
        try {
            const querySnapshot = await getDocs(
                query(collection(fireStore, "listings"), orderBy("discountedPrice", "desc"))
              );
            
            console.log(querySnapshot)
            const listingData = []
            querySnapshot.forEach((doc) => {
                listingData.push(doc.data());
                console.log(doc.data())
            });
            setListings(listingData)
        } catch (error) {
          console.error('Error fetching comments from Firestore:', error);
        }
      };
    fetchListing();
    return (
        <ScrollView style={styles.container}>
            {listings.map((listing, index) => (
                <View key={index} style={styles.listingItem}>
                    <Text>Food Name: {listing.foodName}</Text>
                    <Text>Description: {listing.description}</Text>
                    <Text>Original Price: {listing.originalPrice}</Text>
                    <Text>Discounted Price: {listing.discountedPrice}</Text>
                    <Text>Quantity Available: {listing.quantityAvailable}</Text>
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
    listingItem: {
        marginBottom: 20,
        backgroundColor: '#f0f0f0',
        padding: 10,
        borderRadius: 10,
    },
});

export default ShowListingsScreen;
