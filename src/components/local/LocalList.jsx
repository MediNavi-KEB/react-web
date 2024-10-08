import React, { useEffect, useState } from 'react';
import { useLocation } from 'react-router-dom';
import axios from 'axios';
import Header from '../basis/Header';

const LocalList = () => {
    const location = useLocation();
    const { places, currentPosition } = location.state || { places: [], currentPosition: null };
    const [sortedPlaces, setSortedPlaces] = useState([]);
    const [sortOption, setSortOption] = useState('locallist-distance');
    const [favorites, setFavorites] = useState([]);
    
    const userId = localStorage.getItem('user_id');

    // 사용자 즐겨찾기 정보 가져오기
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

    // 현재 위치와 장소 목록이 변경될 때마다 거리 기준으로 재정렬
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

    // 정렬 옵션 변경 시 목록 재정렬
    useEffect(() => {
        if (sortOption === 'locallist-distance') {
            setSortedPlaces((prevPlaces) => [...prevPlaces].sort((a, b) => a.distance - b.distance));
        } else if (sortOption === 'locallist-recommended') {
            setSortedPlaces((prevPlaces) => [...prevPlaces].sort((a, b) => a.place_name.localeCompare(b.place_name, 'ko-KR')));
        }
    }, [sortOption]);

    // 즐겨찾기 토글 (등록 or 삭제)
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
                    latitude: place.y,
                    longitude: place.x,
                    category: place.category_name ? place.category_name.split('>').pop().trim() : 'N/A'
                    
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
        <div className="locallist-map_wrap">
            <div id="locallist-menu_wrap" className="locallist-bg_white">
                <div className="locallist-option">
                    <Header/>
                    <button onClick={() => handleSortChange('locallist-distance')} className='locallist-menu-button'>
                        <img src="https://cdn-icons-png.flaticon.com/128/8052/8052172.png" className="locallist-menu-icon" />
                        거리순
                    </button>
                    <button onClick={() => handleSortChange('locallist-recommended')} className='locallist-menu-button'>
                        <img src="https://cdn-icons-png.flaticon.com/128/6537/6537190.png" className="locallist-menu-icon" />
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
                                <div className='local-place-details-category'>카테고리 : {place.category_name ? place.category_name.split('>').pop().trim() : 'N/A'}</div>
                                <span className="locallist-distance">거리: {place.distance ? place.distance.toFixed(2) : '알 수 없음'} km</span>
                            </div>
                            <span
                                className={`locallist-favorite ${favorites.includes(place.place_name) ? 'active' : ''}`} 
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
