import React, { useEffect, useState } from 'react';
import { Button, Form, InputGroup, Modal } from 'react-bootstrap';
import { useLocation, useNavigate } from 'react-router-dom';
import { BsList } from "react-icons/bs";
import axios from 'axios';

const Locals = () => {
    const navigate = useNavigate();
    const location = useLocation();
    const query = new URLSearchParams(location.search).get('query');
    const [map, setMap] = useState(null);
    const [places, setPlaces] = useState([]);
    const [keyword, setKeyword] = useState(query || '병원');
    const [currentPosition, setCurrentPosition] = useState(null);
    const RADIUS = 2000; // 반경 2km
    const [markers, setMarkers] = useState([]); // 마커 상태 추가
    const [selectedPlace, setSelectedPlace] = useState(null); // 선택된 장소 상태 추가
    const [selectedOverlay, setSelectedOverlay] = useState(null); // 선택된 오버레이 상태 추가
    const [showModal, setShowModal] = useState(false); // 모달 창 상태 추가
    const [favorites, setFavorites] = useState([]); // 즐겨찾기 상태 추가

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

        // Kakao Maps API가 로드되었는지 확인
        if (!kakao || !kakao.maps || !kakao.maps.services) {
            console.error("Kakao Maps API가 로드되지 않았습니다.");
            return;
        }

        // 현재 위치를 가져오기 위한 Geolocation API 호출
        if (navigator.geolocation) {
            navigator.geolocation.getCurrentPosition((position) => {
                const { latitude, longitude } = position.coords;
                setCurrentPosition({ lat: latitude, lng: longitude });

                // 지도 생성 및 중심 설정
                const container = document.getElementById('map');
                const options = {
                    center: new kakao.maps.LatLng(latitude, longitude),
                    level: 5,
                };
                const mapInstance = new kakao.maps.Map(container, options);
                setMap(mapInstance);

                // 현재 위치에 큰 빨간색 점 추가
                const content = '<div class="local-custom-overlay"></div>';
                const positionOverlay = new kakao.maps.LatLng(latitude, longitude);

                const customOverlay = new kakao.maps.CustomOverlay({
                    position: positionOverlay,
                    content: content,
                });

                customOverlay.setMap(mapInstance);

                // 장소 검색 객체 생성
                const ps = new kakao.maps.services.Places();
                const infowindow = new kakao.maps.InfoWindow({ zIndex: 1 });

                // 키워드로 장소 검색
                const searchPlaces = () => {
                    if (!keyword.replace(/^\s+|\s+$/g, '')) {
                        alert('키워드를 입력해주세요!');
                        return;
                    }
                    ps.keywordSearch(keyword, placesSearchCB, {
                        location: new kakao.maps.LatLng(latitude, longitude),
                        radius: RADIUS,
                    });
                };

                // 장소 검색 결과 콜백 함수
                const placesSearchCB = (data, status) => {
                    if (status === kakao.maps.services.Status.OK) {
                        setPlaces(data);
                        displayMarkers(data); // 마커 표시 함수 호출
                    } else if (status === kakao.maps.services.Status.ZERO_RESULT) {
                        alert('검색 결과가 존재하지 않습니다.');
                    } else if (status === kakao.maps.services.Status.ERROR) {
                        alert('검색 결과 중 오류가 발생했습니다.');
                    }
                };

                // 마커 표시 함수
                const displayMarkers = (places) => {
                    // 이전 마커 제거
                    markers.forEach(marker => marker.setMap(null));
                    setMarkers([]);

                    const newMarkers = places.map((place, index) => {
                        const marker = new kakao.maps.Marker({
                            map: mapInstance,
                            position: new kakao.maps.LatLng(place.y, place.x),
                        });

                        // 마커 클릭 이벤트 설정
                        kakao.maps.event.addListener(marker, 'click', () => {
                            setSelectedPlace(place);
                            setShowModal(true); // 모달 창 표시

                            // 기존 선택된 오버레이 제거
                            if (selectedOverlay) {
                                selectedOverlay.setMap(null);
                            }

                            // 새로운 선택된 오버레이 생성
                            const overlayContent = '<div style="color: red; font-size: 24px; text-align: center;">▼</div>';
                            const newOverlay = new kakao.maps.CustomOverlay({
                                position: new kakao.maps.LatLng(place.y, place.x),
                                content: overlayContent,
                                yAnchor: 1
                            });
                            newOverlay.setMap(mapInstance);
                            setSelectedOverlay(newOverlay);

                            // 클릭한 마커의 위치로 지도 중심 이동
                            mapInstance.setCenter(new kakao.maps.LatLng(place.y, place.x));
                        });

                        return marker;
                    });

                    setMarkers(newMarkers);
                };

                searchPlaces();
            }, (error) => {
                console.error("현재 위치를 가져오는데 실패했습니다.", error);
            },{
                enableHighAccuracy: true,
                timeout: 5000,
                maximumAge: 0
            });
        } else {
            alert('Geolocation을 지원하지 않는 브라우저입니다.');
        }
    }, [keyword]);

    const handleSubmit = (e) => {
        e.preventDefault();
        setKeyword(e.target.keyword.value);
    };

    const handleListButtonClick = () => {
        navigate('/local/list', { state: { places, currentPosition } });
    };

    const handleCloseModal = () => {
        setShowModal(false);
        if (selectedOverlay) {
            selectedOverlay.setMap(null); // 선택된 오버레이 제거
            setSelectedOverlay(null); // 상태 초기화
        }
    };

    const toggleFavorite = async (place) => {
        const isFavorite = favorites.includes(place.place_name); // ensure this matches the data structure
        try {
            if (isFavorite) {
                await axios.delete(`/favorite/delete/${userId}/${encodeURIComponent(place.place_name)}`);
                setFavorites(favorites.filter(fav => fav !== place.place_name)); // ensure this matches the data structure
            } else {
                await axios.post('/favorite/create', {
                    user_id: userId,
                    hospital_name: place.place_name, // ensure this matches the data structure
                    hospital_address: place.road_address_name || place.address_name,
                    hospital_phone: place.phone,
                });
                setFavorites([...favorites, place.place_name]); // ensure this matches the data structure
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
                    height: '100vh', // 전체 화면
                    position: 'relative',
                    overflow: 'hidden',
                }}
            ></div>

            <div className="local-menu_wrap">
                <Form className="local-menu-option" onSubmit={handleSubmit}>
                    <InputGroup className="local-input-group-custom">
                        <Form.Control name="keyword" placeholder='ex.병원' defaultValue={query || '병원'} />
                        <Button type="submit">검색</Button>
                    </InputGroup>
                </Form>
            </div>

            <div className='local-list-button-wrap'>
                <button className='local-list-button' onClick={handleListButtonClick}><BsList/> 목록보기</button>
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
                                <p>{selectedPlace.phone}</p>
                                
                            </div>
                            <span
                                className={`locallist-favorite ${favorites.includes(selectedPlace.place_name) ? 'active' : ''}`} // ensure this matches the data structure
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
