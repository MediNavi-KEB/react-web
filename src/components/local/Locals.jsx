import React, { useEffect, useState } from 'react';
import { Button, Form, InputGroup, Modal } from 'react-bootstrap';
import { useLocation, useNavigate } from 'react-router-dom';
import { BsList } from "react-icons/bs";
import { AiOutlineReload } from "react-icons/ai";
import axios from 'axios';

const Locals = () => {
    const navigate = useNavigate();
    const location = useLocation();
    const query = new URLSearchParams(location.search);
    const placeNameQuery = query.get('query');
    const lat = query.get('lat');
    const lng = query.get('lng');
    const [map, setMap] = useState(null);
    const [places, setPlaces] = useState([]);
    const [keyword, setKeyword] = useState(placeNameQuery || '병원');
    const [currentPosition, setCurrentPosition] = useState(null);
    const RADIUS = 10000; // 반경 10km
    const [markers, setMarkers] = useState([]);
    const [selectedPlace, setSelectedPlace] = useState(null);
    const [selectedOverlay, setSelectedOverlay] = useState(null);
    const [showModal, setShowModal] = useState(false);
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

    useEffect(() => {
        const kakao = window.kakao;

        if (!kakao || !kakao.maps || !kakao.maps.services) {
            console.error("Kakao Maps API가 로드되지 않았습니다.");
            return;
        }

        const initializeMap = (latitude, longitude) => {
            setCurrentPosition({ lat: latitude, lng: longitude });

            const container = document.getElementById('map');
            const options = {
                center: new kakao.maps.LatLng(latitude, longitude),
                level: 5,
            };
            const mapInstance = new kakao.maps.Map(container, options);
            setMap(mapInstance);

            // 현재 위치를 표시하는 마커
            new kakao.maps.Marker({
                position: new kakao.maps.LatLng(latitude, longitude),
                map: mapInstance,
                image: new kakao.maps.MarkerImage(
                    'https://cdn-icons-png.flaticon.com/128/727/727636.png',
                    new kakao.maps.Size(24, 35)
                )
            });

            const ps = new kakao.maps.services.Places();
            const searchPlaces = (mapCenter) => {
                ps.keywordSearch(keyword, (data, status) => {
                    if (status === kakao.maps.services.Status.OK) {
                        setPlaces(data);
                        markers.forEach(marker => marker.setMap(null)); // 기존 마커 제거
                        setMarkers([]);

                        const newMarkers = data.map((place) => {
                            const isFavorite = favorites.includes(place.place_name);
                            const marker = new kakao.maps.Marker({
                                map: mapInstance,
                                position: new kakao.maps.LatLng(place.y, place.x),
                                image: new kakao.maps.MarkerImage(
                                    isFavorite 
                                    ? 'http://t1.daumcdn.net/localimg/localimages/07/mapapidoc/markerStar.png'
                                    : 'https://cdn-icons-png.flaticon.com/128/684/684908.png',
                                    new kakao.maps.Size(24, 35)
                                )
                            });

                            // 마커 클릭 이벤트
                            kakao.maps.event.addListener(marker, 'click', () => {
                                setSelectedPlace(place);
                                setShowModal(true);

                                if (selectedOverlay) {
                                    selectedOverlay.setMap(null);
                                }

                                const overlayContent = '<div style="color: blue; font-size: 24px; text-align: center;">▼</div>';
                                const newOverlay = new kakao.maps.CustomOverlay({
                                    position: new kakao.maps.LatLng(place.y, place.x),
                                    content: overlayContent,
                                    yAnchor: 1
                                });
                                newOverlay.setMap(mapInstance);
                                setSelectedOverlay(newOverlay);
                            });

                            return marker;
                        });

                        setMarkers(newMarkers);

                    } else if (status === kakao.maps.services.Status.ZERO_RESULT) {
                        alert('검색 결과가 존재하지 않습니다.');
                    } else if (status === kakao.maps.services.Status.ERROR) {
                        alert('검색 결과 중 오류가 발생했습니다.');
                    }
                }, {
                    location: mapCenter,
                    radius: RADIUS,
                });
            };

            if (lat && lng) {
                searchPlaces(new kakao.maps.LatLng(latitude, longitude));
            } else {
                searchPlaces(new kakao.maps.LatLng(latitude, longitude));
            }

            // 지도 이동 후 장소를 다시 검색
            kakao.maps.event.addListener(mapInstance, 'idle', () => {
                const mapCenter = mapInstance.getCenter();
                searchPlaces(mapCenter);
            });
        };

        // 처음 지도를 로드할 때 내 현재 위치로 설정하거나 Saved에서 넘겨받은 위치로 설정
        if (lat && lng) {
            initializeMap(parseFloat(lat), parseFloat(lng));
        } else if (navigator.geolocation) {
            navigator.geolocation.getCurrentPosition((position) => {
                initializeMap(position.coords.latitude, position.coords.longitude);
            }, (error) => {
                console.error("현재 위치를 가져오는데 실패했습니다.", error);
            }, {
                enableHighAccuracy: true,
                timeout: 5000,
                maximumAge: 0
            });
        } else {
            alert('Geolocation을 지원하지 않는 브라우저입니다.');
        }
    }, [keyword, favorites, lat, lng]);

    const handleSubmit = (e) => {
        e.preventDefault();
        setKeyword(e.target.keyword.value);

        // 검색어를 사용해 현재 위치에서 다시 검색
        if (map && currentPosition) {
            const kakao = window.kakao;
            const ps = new kakao.maps.services.Places();
            ps.keywordSearch(keyword, (data, status) => {
                if (status === kakao.maps.services.Status.OK) {
                    setPlaces(data);
                    markers.forEach(marker => marker.setMap(null)); // 기존 마커 제거
                    setMarkers([]);

                    const newMarkers = data.map((place) => {
                        const isFavorite = favorites.includes(place.place_name);
                        const marker = new kakao.maps.Marker({
                            map: map,
                            position: new kakao.maps.LatLng(place.y, place.x),
                            image: new kakao.maps.MarkerImage(
                                isFavorite 
                                ? 'http://t1.daumcdn.net/localimg/localimages/07/mapapidoc/markerStar.png'
                                : 'https://cdn-icons-png.flaticon.com/128/684/684908.png',
                                new kakao.maps.Size(24, 35)
                            )
                        });

                        // 마커 클릭 이벤트
                        kakao.maps.event.addListener(marker, 'click', () => {
                            setSelectedPlace(place);
                            setShowModal(true);

                            if (selectedOverlay) {
                                selectedOverlay.setMap(null);
                            }

                            const overlayContent = '<div style="color: blue; font-size: 24px; text-align: center;">▼</div>';
                            const newOverlay = new kakao.maps.CustomOverlay({
                                position: new kakao.maps.LatLng(place.y, place.x),
                                content: overlayContent,
                                yAnchor: 1
                            });
                            newOverlay.setMap(map);
                            setSelectedOverlay(newOverlay);
                        });

                        return marker;
                    });

                    setMarkers(newMarkers);

                } else if (status === kakao.maps.services.Status.ZERO_RESULT) {
                    alert('검색 결과가 존재하지 않습니다.');
                } else if (status === kakao.maps.services.Status.ERROR) {
                    alert('검색 결과 중 오류가 발생했습니다.');
                }
            }, {
                location: new kakao.maps.LatLng(currentPosition.lat, currentPosition.lng),
                radius: RADIUS,
            });
        }
    };

    const handleLocationButtonClick = () => {
        if (navigator.geolocation) {
            navigator.geolocation.getCurrentPosition((position) => {
                if (map) {
                    const moveLatLon = new window.kakao.maps.LatLng(position.coords.latitude, position.coords.longitude);
                    map.setCenter(moveLatLon);
                    setCurrentPosition({ lat: position.coords.latitude, lng: position.coords.longitude });
                }
            }, (error) => {
                console.error("현재 위치를 가져오는데 실패했습니다.", error);
            }, {
                enableHighAccuracy: true,
                timeout: 5000,
                maximumAge: 0
            });
        } else {
            alert('Geolocation을 지원하지 않는 브라우저입니다.');
        }
    };

    const handleListButtonClick = () => {
        navigate('/local/list', { state: { places, currentPosition } });
    };

    const handleCloseModal = () => {
        setShowModal(false);
        if (selectedOverlay) {
            selectedOverlay.setMap(null);
            setSelectedOverlay(null);
        }
    };

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
                    longitude: place.x
                });
                setFavorites([...favorites, place.place_name]);
            }
        } catch (error) {
            console.error('Error toggling favorite', error);
        }
    
        // 즐겨찾기 버튼을 눌러도 지도의 중심이 이동하지 않도록 함
        if (selectedOverlay) {
            selectedOverlay.setMap(null);  // 이전에 선택된 오버레이 제거
            setSelectedOverlay(null);      // 상태를 초기화
        }
    };

    return (
        <div className="local-map_wrap">
            <div
                id="map"
                style={{
                    width: '100%',
                    height: '100vh',
                    position: 'relative',
                    overflow: 'hidden',
                }}
            ></div>

            <div className="local-menu_wrap">
                <Form className="local-search-form" onSubmit={handleSubmit}>
                    <InputGroup style={{ position: 'relative' }}>
                        <Form.Control
                            name="keyword"
                            placeholder="ex.병원"
                            defaultValue={keyword}
                            className="local-search-input"
                            style={{ borderRadius: '20px', boxShadow: 'none', paddingRight: '40px' }} 
                        />
                        <AiOutlineReload
                            size={20}
                            style={{
                                color: 'gray',
                                position: 'absolute',
                                right: '10px',
                                top: '50%',
                                transform: 'translateY(-50%)',
                                cursor: 'pointer'
                            }}
                            onClick={handleLocationButtonClick}
                        />
                    </InputGroup>
                </Form>
            </div>

            <div className='local-list-button-wrap'>
                <button className='local-list-button' onClick={handleListButtonClick}><BsList /> 목록보기</button>
            </div>

            <Modal show={showModal} onHide={handleCloseModal} className="local-custom-modal">
                <Modal.Header closeButton>
                    <Modal.Title>장소 정보</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    {selectedPlace && (
                        <div className="local-place-info">
                            <div className="local-place-details">
                                <h5>{selectedPlace.place_name}</h5>
                                <p>{selectedPlace.road_address_name || selectedPlace.address_name}</p>
                                <p>카테고리 : {selectedPlace.category_name ? selectedPlace.category_name.split('>').pop().trim() : 'N/A'}</p>
                                <p>{selectedPlace.phone || '전화번호 없음'}</p>
                            </div>
                            <span
                                className={`locallist-favorite ${favorites.includes(selectedPlace.place_name) ? 'active' : ''}`}
                                onClick={() => toggleFavorite(selectedPlace)}
                            >
                                ★
                            </span>
                        </div>
                    )}
                </Modal.Body>
                <Modal.Footer>
                    <Button variant="secondary" onClick={handleCloseModal}>
                        닫기
                    </Button>
                </Modal.Footer>
            </Modal>
        </div>
    );
};

export default Locals;

