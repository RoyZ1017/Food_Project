// ListingsContainer.js

import React, { useState } from 'react';
import AddListingScreen from './AddListingScreen';
import ShowListings from './ShowListings';

const ListingsContainer = () => {
    const [listings, setListings] = useState([]);

    const createListing = (newListing) => {
        setListings([...listings, newListing]);
    };

    return (
        <>
            <AddListingScreen createListing={createListing} />
            <ShowListings listings={listings} />
        </>
    );
}

export default ListingsContainer;
