import React, { useState } from 'react';
import { Button, StyleSheet, Text, View, TextInput, ScrollView } from 'react-native';

// Todo -> Add feature to delete listing

const ShowListingsScreen = ({ listings }) => {
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
