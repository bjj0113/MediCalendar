// 위치 정보를 받아오는 함수
function getCurrentLocation() {
    return new Promise((resolve, reject) => {
        if (navigator.geolocation) {
            navigator.geolocation.getCurrentPosition(
                position => {
                    resolve({
                        lat: position.coords.latitude,
                        lng: position.coords.longitude
                    });
                },
                error => {
                    reject(error);
                }
            );
        } else {
            reject(new Error("Geolocation is not supported by this browser."));
        }
    });
}

// 마커를 클릭하면 장소명을 표출할 인포윈도우 입니다
var infowindow = new kakao.maps.InfoWindow({ zIndex: 1 });
var markers = [];

function initMap(lat, lng) {
    var mapContainer = document.getElementById('map'); // 지도를 표시할 div 
    var mapOption = {
        center: new kakao.maps.LatLng(lat, lng), // 지도의 중심좌표
        level: 4 // 지도의 확대 레벨
    };

    // 지도를 생성합니다    
    var map = new kakao.maps.Map(mapContainer, mapOption);

    // 장소 검색 객체를 생성합니다
    var ps = new kakao.maps.services.Places(map);
    
    // 지도의 중심이 변경될 때마다 함수 실행
    kakao.maps.event.addListener(map, 'center_changed', function () {
        searchPlacesAndDisplayMarkers();
    });

    searchPlacesAndDisplayMarkers();

    // 지도의 중심이 변할 때마다 함수 실행
    function searchPlacesAndDisplayMarkers() {
        // 현재 지도의 중심좌표를 얻습니다
        var center = map.getCenter();

        // 이전 마크 제거
        clearMarkers();

        // 카테고리로 은행을 검색합니다
        ps.categorySearch('PM9', placesSearchCB, {
            location: new kakao.maps.LatLng(center.getLat(), center.getLng()),
            radius: 1000
        });
    }

    // 키워드 검색 완료 시 호출되는 콜백함수 입니다
    function placesSearchCB(data, status, pagination) {
        if (status === kakao.maps.services.Status.OK) {
            for (var i = 0; i < data.length; i++) {
                displayMarker(data[i]);
            }
        }
    }

    // 지도에 마커를 표시하는 함수입니다
    function displayMarker(place) {
        // 로컬 이미지 경로
        var imageSrc = 'hospital.svg';
        // 마커 이미지의 이미지 크기 입니다
        var imageSize = new kakao.maps.Size(31, 35);
        // 마커 이미지를 생성합니다    
        var markerImage = new kakao.maps.MarkerImage(imageSrc, imageSize);

        // 마커를 생성하고 지도에 표시합니다
        var marker = new kakao.maps.Marker({
            map: map,
            position: new kakao.maps.LatLng(place.y, place.x),
            image: markerImage
        });

        markers.push(marker);

        // 마커에 클릭이벤트를 등록합니다
        kakao.maps.event.addListener(marker, 'click', function () {
            // 마커를 클릭하면 장소명이 인포윈도우에 표출됩니다
            infowindow.setContent('<div style="padding:5px;text-align:center;min-width:150px"><span style="font-size:15px">'
                + place.place_name + '</span><br /><span style="font-size:12px">'
                + place.road_address_name + '</span></div>');
            infowindow.open(map, marker);
        });
    }

    // 마커를 모두 제거하는 함수
    function clearMarkers() {
        for (var i = 0; i < markers.length; i++) {
            markers[i].setMap(null);
        }
        markers = [];
    }
}

getCurrentLocation().then(location => {
    initMap(location.lat, location.lng);
}).catch(error => {
    console.error("Error fetching location : ", error);
    initMap(37.566826, 126.9786567);
});