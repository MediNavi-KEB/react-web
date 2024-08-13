// import React, { useEffect, useState } from 'react';
// import { Button, Form, InputGroup, Modal } from 'react-bootstrap';
// import { useLocation, useNavigate } from 'react-router-dom';
// import { BsList } from "react-icons/bs";
// import { AiOutlineReload } from "react-icons/ai"; // 새로고침 아이콘 추가
// import axios from 'axios';

// const Locals = () => {
//     const navigate = useNavigate();
//     const location = useLocation();
//     const query = new URLSearchParams(location.search).get('query');
//     const [map, setMap] = useState(null);
//     const [places, setPlaces] = useState([]);
//     const [keyword, setKeyword] = useState(query || '병원');
//     const [currentPosition, setCurrentPosition] = useState(null);
//     const RADIUS = 10000; // 반경 10km
//     const [markers, setMarkers] = useState([]);
//     const [selectedPlace, setSelectedPlace] = useState(null);
//     const [selectedOverlay, setSelectedOverlay] = useState(null);
//     const [showModal, setShowModal] = useState(false);
//     const [favorites, setFavorites] = useState([]);
//     const userId = localStorage.getItem('user_id');

//     useEffect(() => {
//         const fetchFavorites = async () => {
//             try {
//                 const response = await axios.get(`/favorite/get/${userId}`);
//                 setFavorites(response.data.map(favorite => favorite.hospital_name));
//             } catch (error) {
//                 console.error('Error fetching favorites', error);
//             }
//         };

//         fetchFavorites();
//     }, [userId]);

//     useEffect(() => {
//         const kakao = window.kakao;

//         if (!kakao || !kakao.maps || !kakao.maps.services) {
//             console.error("Kakao Maps API가 로드되지 않았습니다.");
//             return;
//         }

//         const initializeMap = (latitude, longitude) => {
//             setCurrentPosition({ lat: latitude, lng: longitude });

//             const container = document.getElementById('map');
//             const options = {
//                 center: new kakao.maps.LatLng(latitude, longitude),
//                 level: 5,
//             };
//             const mapInstance = new kakao.maps.Map(container, options);
//             setMap(mapInstance);

//             // 현재 위치를 표시하는 아이콘 마커 생성
//             const currentLocationMarker = new kakao.maps.Marker({
//                 position: new kakao.maps.LatLng(latitude, longitude),
//                 map: mapInstance,
//                 image: new kakao.maps.MarkerImage(
//                     'https://cdn-icons-png.flaticon.com/128/727/727636.png', // 새로운 현재 위치 아이콘 이미지
//                     new kakao.maps.Size(24, 35) // 다른 아이콘과 비슷한 크기로 설정
//                 )
//             });

//             const ps = new kakao.maps.services.Places();
//             const searchPlaces = (mapCenter) => {
//                 if (!keyword.replace(/^\s+|\s+$/g, '')) {
//                     alert('키워드를 입력해주세요!');
//                     return;
//                 }
//                 ps.keywordSearch(keyword, placesSearchCB, {
//                     location: mapCenter,
//                     radius: RADIUS,
//                 });
//             };

//             const placesSearchCB = (data, status) => {
//                 if (status === kakao.maps.services.Status.OK) {
//                     setPlaces(data);
//                     displayMarkers(data);

//                     // 검색된 첫 번째 장소로 지도 이동
//                     if (data.length > 0 && map) {
//                         const firstPlace = data[0];
//                         const moveLatLon = new kakao.maps.LatLng(firstPlace.y, firstPlace.x);
//                         map.setCenter(moveLatLon);
//                     }
//                 } else if (status === kakao.maps.services.Status.ZERO_RESULT) {
//                     alert('검색 결과가 존재하지 않습니다.');
//                 } else if (status === kakao.maps.services.Status.ERROR) {
//                     alert('검색 결과 중 오류가 발생했습니다.');
//                 }
//             };

//             const displayMarkers = (places) => {
//                 markers.forEach(marker => marker.setMap(null));
//                 setMarkers([]);

//                 const newMarkers = places.map((place) => {
//                     const isFavorite = favorites.includes(place.place_name);
//                     const marker = new kakao.maps.Marker({
//                         map: mapInstance,
//                         position: new kakao.maps.LatLng(place.y, place.x),
//                         image: new kakao.maps.MarkerImage(
//                             isFavorite 
//                             ? 'http://t1.daumcdn.net/localimg/localimages/07/mapapidoc/markerStar.png' // 노란 별 마커 이미지
//                             : 'https://cdn-icons-png.flaticon.com/128/684/684908.png', // 파란색 마크 아이콘 (즐겨찾기 아닌 검색된 장소)
//                             new kakao.maps.Size(24, 35) // 다른 아이콘과 동일한 크기로 설정
//                         )
//                     });

//                     // 마커 클릭 시 장소 정보 표시
//                     kakao.maps.event.addListener(marker, 'click', () => {
//                         setSelectedPlace(place);
//                         console.log(place);
//                         setShowModal(true);

//                         if (selectedOverlay) {
//                             selectedOverlay.setMap(null);
//                         }

//                         const overlayContent = '<div style="color: red; font-size: 24px; text-align: center;">▼</div>';
//                         const newOverlay = new kakao.maps.CustomOverlay({
//                             position: new kakao.maps.LatLng(place.y, place.x),
//                             content: overlayContent,
//                             yAnchor: 1
//                         });
//                         newOverlay.setMap(mapInstance);
//                         setSelectedOverlay(newOverlay);

//                         mapInstance.setCenter(new kakao.maps.LatLng(place.y, place.x));
//                     });

//                     return marker;
//                 });

//                 setMarkers(newMarkers);
//             };

//             // 초기에 현재 위치를 중심으로 장소 검색
//             searchPlaces(new kakao.maps.LatLng(latitude, longitude));

//             // 지도 이동 후 idle 이벤트 발생 시 다시 장소 검색
//             kakao.maps.event.addListener(mapInstance, 'idle', () => {
//                 const mapCenter = mapInstance.getCenter();
//                 searchPlaces(mapCenter);
//             });
//         };

//         if (navigator.geolocation) {
//             navigator.geolocation.getCurrentPosition((position) => {
//                 initializeMap(position.coords.latitude, position.coords.longitude);
//             }, (error) => {
//                 console.error("현재 위치를 가져오는데 실패했습니다.", error);
//             }, {
//                 enableHighAccuracy: true,
//                 timeout: 5000,
//                 maximumAge: 0
//             });
//         } else {
//             alert('Geolocation을 지원하지 않는 브라우저입니다.');
//         }
//     }, [keyword, favorites, selectedOverlay]);

//     const handleSubmit = (e) => {
//         e.preventDefault();
//         setKeyword(e.target.keyword.value);
//     };

//     const handleLocationButtonClick = () => {
//         if (navigator.geolocation) {
//             navigator.geolocation.getCurrentPosition((position) => {
//                 if (map) {
//                     const moveLatLon = new window.kakao.maps.LatLng(position.coords.latitude, position.coords.longitude);
//                     map.setCenter(moveLatLon);
//                 }
//             }, (error) => {
//                 console.error("현재 위치를 가져오는데 실패했습니다.", error);
//             }, {
//                 enableHighAccuracy: true,
//                 timeout: 5000,
//                 maximumAge: 0
//             });
//         } else {
//             alert('Geolocation을 지원하지 않는 브라우저입니다.');
//         }
//     };

//     const handleListButtonClick = () => {
//         navigate('/local/list', { state: { places, currentPosition } });
//     };

//     const handleCloseModal = () => {
//         setShowModal(false);
//         if (selectedOverlay) {
//             selectedOverlay.setMap(null);
//             setSelectedOverlay(null);
//         }
//     };

//     const toggleFavorite = async (place) => {
//         const isFavorite = favorites.includes(place.place_name);
//         try {
//             if (isFavorite) {
//                 await axios.delete(`/favorite/delete/${userId}/${encodeURIComponent(place.place_name)}`);
//                 setFavorites(favorites.filter(fav => fav !== place.place_name));
//             } else {
//                 await axios.post('/favorite/create', {
//                     user_id: userId,
//                     hospital_name: place.place_name,
//                     hospital_address: place.road_address_name || place.address_name,
//                     hospital_phone: place.phone,
//                     latitude: place.y,
//                     longitude: place.x

//                 });
//                 setFavorites([...favorites, place.place_name]);
//             }
//         } catch (error) {
//             console.error('Error toggling favorite', error);
//         }
//     };

//     return (
//         <div className="local-map_wrap">
//             <div
//                 id="map"
//                 style={{
//                     width: '100%',
//                     height: '100vh',
//                     position: 'relative',
//                     overflow: 'hidden',
//                 }}
//             ></div>

//             <div className="local-menu_wrap">
//                 <Form className="local-search-form" onSubmit={handleSubmit}>
//                     <InputGroup style={{ position: 'relative' }}>
//                         <Form.Control
//                             name="keyword"
//                             placeholder="ex.병원"
//                             defaultValue={query || '병원'}
//                             className="local-search-input"
//                             style={{ borderRadius: '20px', boxShadow: 'none', paddingRight: '40px' }} 
//                         />
//                         <AiOutlineReload
//                             size={20}
//                             style={{
//                                 color: 'gray',
//                                 position: 'absolute',
//                                 right: '10px',
//                                 top: '50%',
//                                 transform: 'translateY(-50%)',
//                                 cursor: 'pointer'
//                             }}
//                             onClick={handleLocationButtonClick}
//                         />
//                     </InputGroup>
//                 </Form>
//             </div>

//             <div className='local-list-button-wrap'>
//                 <button className='local-list-button' onClick={handleListButtonClick}><BsList /> 목록보기</button>
//             </div>

//             <Modal show={showModal} onHide={handleCloseModal} className="local-custom-modal">
//                 <Modal.Header closeButton>
//                     <Modal.Title>장소 정보</Modal.Title>
//                 </Modal.Header>
//                 <Modal.Body>
//                     {selectedPlace && (
//                          <div className="local-place-info">
//                             <div className="local-place-details">
//                                 <h5>{selectedPlace.place_name}</h5>
//                                 <p>{selectedPlace.road_address_name || selectedPlace.address_name}</p>
//                                 <p>카테고리 : {selectedPlace.category_name.split('>').pop().trim()}
//                                 </p>
//                                 <p>{selectedPlace.phone}</p>
//                             </div>
//                             <span
//                                 className={`locallist-favorite ${favorites.includes(selectedPlace.place_name) ? 'active' : ''}`}
//                                 onClick={() => toggleFavorite(selectedPlace)}
//                             >
//                                 ★
//                             </span>
//                         </div>
                        
//                     )}
//                 </Modal.Body>
//                 <Modal.Footer>
//                     <Button variant="secondary" onClick={handleCloseModal}>
//                         닫기
//                     </Button>
//                 </Modal.Footer>
//             </Modal>
//         </div>
//     );
// };

// export default Locals;


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
    const placeName = query.get('query');
    const placeLat = parseFloat(query.get('lat'));
    const placeLng = parseFloat(query.get('lng'));
    const [map, setMap] = useState(null);
    const [places, setPlaces] = useState([]);
    const [keyword, setKeyword] = useState(query.get('keyword') || '병원');
    const [currentPosition, setCurrentPosition] = useState(null);
    const RADIUS = 10000;
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

            // displayMarkers 함수 정의
            const displayMarkers = (placesToDisplay) => {
                markers.forEach(marker => marker.setMap(null));
                setMarkers([]);

                const newMarkers = placesToDisplay.map((place) => {
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

                    kakao.maps.event.addListener(marker, 'click', () => {
                        setSelectedPlace(place);
                        setShowModal(true);

                        if (selectedOverlay) {
                            selectedOverlay.setMap(null);
                        }

                        const overlayContent = '<div style="color: red; font-size: 24px; text-align: center;">▼</div>';
                        const newOverlay = new kakao.maps.CustomOverlay({
                            position: new kakao.maps.LatLng(place.y, place.x),
                            content: overlayContent,
                            yAnchor: 1
                        });
                        newOverlay.setMap(mapInstance);
                        setSelectedOverlay(newOverlay);

                        mapInstance.setCenter(new kakao.maps.LatLng(place.y, place.x));
                    });

                    return marker;
                });

                setMarkers(newMarkers);
            };

            if (placeLat && placeLng && placeName) {
                const isFavorite = favorites.includes(placeName);
                const marker = new kakao.maps.Marker({
                    map: mapInstance,
                    position: new kakao.maps.LatLng(placeLat, placeLng),
                    image: new kakao.maps.MarkerImage(
                        isFavorite 
                        ? 'http://t1.daumcdn.net/localimg/localimages/07/mapapidoc/markerStar.png'
                        : 'https://cdn-icons-png.flaticon.com/128/684/684908.png',
                        new kakao.maps.Size(24, 35)
                    )
                });

                kakao.maps.event.addListener(marker, 'click', () => {
                    const place = {
                        place_name: placeName,
                        road_address_name: '',
                        address_name: '',
                        phone: '',
                        y: placeLat,
                        x: placeLng
                    };
                    setSelectedPlace(place);
                    setShowModal(true);

                    if (selectedOverlay) {
                        selectedOverlay.setMap(null);
                    }

                    const overlayContent = '<div style="color: red; font-size: 24px; text-align: center;">▼</div>';
                    const newOverlay = new kakao.maps.CustomOverlay({
                        position: new kakao.maps.LatLng(placeLat, placeLng),
                        content: overlayContent,
                        yAnchor: 1
                    });
                    newOverlay.setMap(mapInstance);
                    setSelectedOverlay(newOverlay);

                    mapInstance.setCenter(new kakao.maps.LatLng(placeLat, placeLng));
                });

                setMarkers([marker]);
                mapInstance.setCenter(new kakao.maps.LatLng(placeLat, placeLng));
            } else {
                const currentLocationMarker = new kakao.maps.Marker({
                    position: new kakao.maps.LatLng(latitude, longitude),
                    map: mapInstance,
                    image: new kakao.maps.MarkerImage(
                        'https://cdn-icons-png.flaticon.com/128/727/727636.png',
                        new kakao.maps.Size(24, 35)
                    )
                });

                const ps = new kakao.maps.services.Places();
                
                const placesSearchCB = (data, status) => {
                    if (status === kakao.maps.services.Status.OK) {
                        setPlaces(data);
                        displayMarkers(data);

                        if (data.length > 0 && mapInstance) {
                            const firstPlace = data[0];
                            const moveLatLon = new kakao.maps.LatLng(firstPlace.y, firstPlace.x);
                            mapInstance.setCenter(moveLatLon);
                        }
                    } else if (status === kakao.maps.services.Status.ZERO_RESULT) {
                        alert('검색 결과가 존재하지 않습니다.');
                    } else if (status === kakao.maps.services.Status.ERROR) {
                        alert('검색 결과 중 오류가 발생했습니다.');
                    }
                };

                ps.keywordSearch(keyword, placesSearchCB, {
                    location: new kakao.maps.LatLng(latitude, longitude),
                    radius: RADIUS,
                });

                kakao.maps.event.addListener(mapInstance, 'idle', () => {
                    const mapCenter = mapInstance.getCenter();
                    ps.keywordSearch(keyword, placesSearchCB, {
                        location: mapCenter,
                        radius: RADIUS,
                    });
                });
            }
        };

        if (navigator.geolocation && !(placeLat && placeLng)) {
            navigator.geolocation.getCurrentPosition((position) => {
                initializeMap(position.coords.latitude, position.coords.longitude);
            }, (error) => {
                console.error("현재 위치를 가져오는데 실패했습니다.", error);
                initializeMap(37.5665, 126.9780); // 기본 서울 좌표
            }, {
                enableHighAccuracy: true,
                timeout: 5000,
                maximumAge: 0
            });
        } else {
            initializeMap(placeLat || 37.5665, placeLng || 126.9780);
        }
    }, [keyword, favorites, selectedOverlay]);

    const handleSubmit = (e) => {
        e.preventDefault();
        setKeyword(e.target.keyword.value || '병원');
        setPlaces([]); // 새 검색 시 기존 장소 목록 초기화

        if (currentPosition && map) {
            const kakao = window.kakao;
            const ps = new kakao.maps.services.Places();
            const placesSearchCB = (data, status) => {
                if (status === kakao.maps.services.Status.OK) {
                    setPlaces(data);
                    displayMarkers(data);
                } else if (status === kakao.maps.services.Status.ZERO_RESULT) {
                    alert('검색 결과가 존재하지 않습니다.');
                } else if (status === kakao.maps.services.Status.ERROR) {
                    alert('검색 결과 중 오류가 발생했습니다.');
                }
            };

            ps.keywordSearch(e.target.keyword.value || '병원', placesSearchCB, {
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
                            defaultValue={placeName || '병원'}
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
                                <p>카테고리: {selectedPlace.category_name ? selectedPlace.category_name.split('>').pop().trim() : '정보 없음'}</p>
                                <p>{selectedPlace.phone || '전화번호 정보 없음'}</p>
                                <p>위도: {selectedPlace.y}</p>
                                <p>경도: {selectedPlace.x}</p>
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
