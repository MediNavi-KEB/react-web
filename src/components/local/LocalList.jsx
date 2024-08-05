import React, { useEffect, useState } from 'react';
import { useLocation } from 'react-router-dom';
import './MapComponent.css';

const LocalList = () => {
    const location = useLocation();
    const { places, currentPosition } = location.state || { places: [], currentPosition: null };
    const [sortedPlaces, setSortedPlaces] = useState([]);
    const [sortOption, setSortOption] = useState('distance');
    const [favorites, setFavorites] = useState([]);

    useEffect(() => {
        if (sortOption === 'distance') {
        setSortedPlaces([...places].sort((a, b) => a.distance - b.distance));
        } else if (sortOption === 'recommended') {
        setSortedPlaces([...places].sort((a, b) => a.place_name.localeCompare(b.place_name, 'ko-KR')));
        }
    }, [sortOption, places]);

    const toggleFavorite = (placeId) => {
        setFavorites((prevFavorites) => {
        if (prevFavorites.includes(placeId)) {
            return prevFavorites.filter(id => id !== placeId);
        } else {
            return [...prevFavorites, placeId];
        }
        });
    };

    const handleSortChange = (option) => {
        setSortOption(option);
    };

    const getDistanceFromLatLonInKm = (lat1, lon1, lat2, lon2) => {
        function deg2rad(deg) {
        return deg * (Math.PI / 180);
        }
        const R = 6371; // 지구 반경(km)
        const dLat = deg2rad(lat2 - lat1);
        const dLon = deg2rad(lon2 - lon1);
        const a =
        Math.sin(dLat / 2) * Math.sin(dLat / 2) +
        Math.cos(deg2rad(lat1)) * Math.cos(deg2rad(lat2)) *
        Math.sin(dLon / 2) * Math.sin(dLon / 2);
        const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
        const d = R * c; // 거리(km)
        return d;
    };

    useEffect(() => {
        if (currentPosition && places.length > 0) {
        const updatedPlaces = places.map((place) => {
            const distance = getDistanceFromLatLonInKm(
            currentPosition.lat, currentPosition.lng, place.y, place.x
            );
            return { ...place, distance };
        });
        setSortedPlaces(updatedPlaces);
        }
    }, [currentPosition, places]);

    return (
        <div className="map_wrap" style={{ background: '#fff', minHeight: '100vh' }}>
        <div id="menu_wrap" className="bg_white">
            <div className="option">
            <button onClick={() => handleSortChange('distance')}>
                <img src="https://cdn-icons-png.flaticon.com/128/8052/8052172.png" className="local-menu-icon" />
                거리순
            </button>
            <button onClick={() => handleSortChange('recommended')}>
                <img src="https://cdn-icons-png.flaticon.com/128/3820/3820147.png" className="local-menu-icon" />
                가나다순
            </button>
            </div>
            <hr />
            <ul id="placesList">
            {sortedPlaces.map((place, index) => (
                <li key={index} className="item">
                <div className="info">
                    <h5>{place.place_name}</h5>
                    {place.road_address_name ? (
                    <>
                        <span>{place.road_address_name}</span>
                        <span className="jibun gray">{place.address_name}</span>
                    </>
                    ) : (
                    <span>{place.address_name}</span>
                    )}
                    <span className="tel">{place.phone}</span>
                    <span className="distance">거리: {place.distance.toFixed(2)} km</span>
                </div>
                <span
                    className={`favorite ${favorites.includes(place.id) ? 'active' : ''}`}
                    onClick={() => toggleFavorite(place.id)}
                >
                    ★
                </span>
                </li>
            ))}
            </ul>
        </div>
        </div>
    );
};

export default LocalList;
