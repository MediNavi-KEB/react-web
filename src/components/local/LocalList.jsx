import React, { useEffect, useState } from 'react';
import { useLocation } from 'react-router-dom';
import axios from 'axios';

const LocalList = () => {
    const location = useLocation();
    const { places, currentPosition } = location.state || { places: [], currentPosition: null };
    const [sortedPlaces, setSortedPlaces] = useState([]);
    const [sortOption, setSortOption] = useState('locallist-distance');
    const [favorites, setFavorites] = useState([]);
    
    const userId = localStorage.getItem('user_id');

    useEffect(() => {
        const fetchFavorites = async () => {
            try {
                const response = await axios.get(`/favorite/get/${userId}`);
                setFavorites(response.data.map(favorite => favorite.hospital_name));
            } catch (error) {
                console.error('Error fetching favorites', error);
            }
        };

        fetchFavorites();
    }, [userId]);

    // 거리 계산 함수
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

    useEffect(() => {
        if (sortOption === 'locallist-distance') {
            setSortedPlaces((prevPlaces) => [...prevPlaces].sort((a, b) => a.distance - b.distance));
        } else if (sortOption === 'locallist-recommended') {
            setSortedPlaces((prevPlaces) => [...prevPlaces].sort((a, b) => a.place_name.localeCompare(b.place_name, 'ko-KR')));
        }
    }, [sortOption]);

    const toggleFavorite = async (place) => {
        const isFavorite = favorites.includes(place.place_name);
        try {
            if (isFavorite) {
                await axios.delete(`/favorite/delete/${userId}/${encodeURIComponent(place.place_name)}`);
                setFavorites(favorites.filter(fav => fav !== place.place_name)); 
            } else {
                await axios.post('/favorite/create', {
                    user_id: userId,
                    hospital_name: place.place_name, 
                    hospital_address: place.road_address_name || place.address_name,
                    hospital_phone: place.phone,
                });
                setFavorites([...favorites, place.place_name]); 
            }
        } catch (error) {
            console.error('Error toggling favorite', error);
        }
    };

    const handleSortChange = (option) => {
        setSortOption(option);
    };

    return (
        <div className="locallist-map_wrap" style={{ background: '#fff', minHeight: '100vh' }}>
            <div id="locallist-menu_wrap" className="locallist-bg_white">
                <div className="locallist-option">
                    <button onClick={() => handleSortChange('locallist-distance')}>
                        <img src="https://cdn-icons-png.flaticon.com/128/8052/8052172.png" className="locallist-menu-icon" />
                        거리순
                    </button>
                    <button onClick={() => handleSortChange('locallist-recommended')}>
                        <img src="https://cdn-icons-png.flaticon.com/128/3820/3820147.png" className="locallist-menu-icon" />
                        가나다순
                    </button>
                </div>
                <hr />
                <ul id="locallist-placesList">
                    {sortedPlaces.map((place, index) => (
                        <li key={index} className="locallist-item">
                            <div className="locallist-info">
                                <h5>{place.place_name}</h5>
                                {place.road_address_name ? (
                                    <>
                                        <span>{place.road_address_name}</span>
                                        <span className="locallist-jibun gray">{place.address_name}</span>
                                    </>
                                ) : (
                                    <span>{place.address_name}</span>
                                )}
                                <span className="locallist-tel">{place.phone}</span>
                                <span className="locallist-distance">거리: {place.distance ? place.distance.toFixed(2) : '알 수 없음'} km</span>
                            </div>
                            <span
                                className={`locallist-favorite ${favorites.includes(place.place_name) ? 'active' : ''}`} // ensure this matches the data structure
                                onClick={() => toggleFavorite(place)}
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
