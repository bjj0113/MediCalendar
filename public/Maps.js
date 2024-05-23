// 위치 정보를 받아오는 함수
function getCurrentLocation() {
    return new Promise((resolve, reject) => {
        if (navigator.geolocation){
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

// 네이버 지도를 초기화하는 함수
function initializeMap(lat, lng) {
    console.log('지도 위도:'+lat+',경도:'+lng);
    let mapDiv = document.getElementById('map');

    let mapOptions = {
        center: new naver.maps.LatLng(lat, lng),
        zoom: 15
    };
    let map = new naver.maps.Map(mapDiv,mapOptions);
    /* let marker = new naver.maps.Marker({     // 마커 표시
        position: new naver.maps.LatLng(lat, lng),
        map: map
    }); */
}

// 약국 정보를 검색하여 지도에 마커로 표시하는 함수
function searchPharmacies(lat, lng) {
    naver.maps.Service.geocode({
        query: "약국",
        coordinate: `${lng},${lat}`,
    }, function(status, response){
        if(status === naver.maps.Service.Status.ERROR){
            return alert("Error");
        }
        console.log(response);
    });
}

// 위치 정보를  받아서 지도를 초기화하는 함수
async function showMap() {
    try {
        const location = await getCurrentLocation();
        initializeMap(location.lat, location.lng);
        searchPharmacies(location.lat, location.lng);
    } catch (error) {
        console.error("Error getting location: ", error);
    }
}

// 네이버 지도 API를 동적으로 로드하는 함수
function loadNaverMapScript() {
    const script = document.createElement('script');
    script.src = "https://openapi.map.naver.com/openapi/v3/maps.js?ncpClientId=4p1l06c97z&submodules=geocoder";
    script.async = true;
    script.onload = () => {
        showMap();
    };
    document.head.appendChild(script);
}

// 페이지 로드 시 지도를 표시
document.addEventListener("DOMContentLoaded", loadNaverMapScript);
