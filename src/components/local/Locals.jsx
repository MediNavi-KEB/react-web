import React, { useEffect, useState } from 'react';
import { Button, Form, InputGroup } from 'react-bootstrap';

const Locals = () => {
    const [map, setMap] = useState(null);
    const [places, setPlaces] = useState([]);
    const [pagination, setPagination] = useState(null);
    const [keyword, setKeyword] = useState('병원');
    const [favorites, setFavorites] = useState([]);
    const [currentPosition, setCurrentPosition] = useState(null);
    const RADIUS = 2000; // 반경 2km
    const [markers, setMarkers] = useState([]); // 마커 상태 추가

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
            const placesSearchCB = (data, status, pagination) => {
            if (status === kakao.maps.services.Status.OK) {
                setPlaces(data);
                setPagination(pagination);
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
                infowindow.setContent(`
                    <div style="padding:5px;z-index:1;">
                    ${place.place_name}<br>
                    ${place.road_address_name || place.address_name}<br>
                    ${place.phone}
                    </div>
                `);
                infowindow.open(mapInstance, marker);
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

    // 즐겨찾기 토글 함수
    const toggleFavorite = (placeId) => {
        setFavorites((prevFavorites) => {
        if (prevFavorites.includes(placeId)) {
            return prevFavorites.filter(id => id !== placeId);
        } else {
            return [...prevFavorites, placeId];
        }
        });
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        setKeyword(e.target.keyword.value);
    };

    return (
        <div className="map_wrap">
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
                <InputGroup className="input-group-custom">
                    <Form.Control name="keyword" placeholder='ex.병원' />
                    <Button type="submit">검색</Button>
                </InputGroup>
            </Form>

            {/* <hr /> */}
            {/* <ul id="placesList">
            {places.map((place, index) => (
                <li key={index} className="item">
                <span className={`markerbg marker_${index + 1}`}></span>
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
                </div>
                <span
                    className={`favorite ${favorites.includes(place.id) ? 'active' : ''}`}
                    onClick={() => toggleFavorite(place.id)}
                >
                    ★
                </span>
                </li>
            ))}
            </ul> */}
            {/* <div id="pagination">
            {pagination &&
                new Array(pagination.last).fill().map((_, i) => (
                <a
                    href="#"
                    key={i}
                    className={pagination.current === i + 1 ? 'on' : ''}
                    onClick={() => pagination.gotoPage(i + 1)}
                >
                    {i + 1}
                </a>
                ))}
            </div> */}
        </div>
        </div>
    );
};

export default Locals;
