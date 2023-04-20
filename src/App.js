import React from "react";
import { Route, Routes } from 'react-router-dom'
import IndexLayout from "./layouts/IndexLayout";
import MyProfileLayout from "./layouts/MyProfileLayout";
import MyPropertiesLayout from "./layouts/MyPropertiesLayout";
import SearchResultsLayout from "./layouts/SearchResultsLayout";
import MyReservationsLayout from "./layouts/MyReservationsLayout";
import PropertyDetailsLayout from "./layouts/PropertyDetailsLayout";


const App = () => {
    return (
        <>
            <Routes>
                <Route path="" element={<IndexLayout />} />
                <Route path="/profile" element={<MyProfileLayout />} />
                <Route path="/my-properties" element={<MyPropertiesLayout />} />
                <Route path="/results" element={<SearchResultsLayout />} />
                <Route path="/property/:propertyId" element={<PropertyDetailsLayout />} />
                <Route path="/my-reservations" element={<MyReservationsLayout />} />
            </Routes>
        </>
    );
}

export default App;
