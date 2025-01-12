# Test

```JS
import React,{useState} from 'react'
import {GoogleMap, LoadScript } from '@react-google-maps/api';
import Write from './Write';

let map;
let service;
let infowindow;

function initMap() {
  const sydney = new google.maps.LatLng(-33.867, 151.195);

  infowindow = new google.maps.InfoWindow();
  map = new google.maps.Map(document.getElementById("map"), {
    center: sydney,
    zoom: 15,
  });

  const request = {
    query: "Museum of Contemporary Art Australia",
    fields: ["name", "geometry"],
  };

  service = new google.maps.places.PlacesService(map);
  service.findPlaceFromQuery(request, (results, status) => {
    if (status === google.maps.places.PlacesServiceStatus.OK && results) {
      for (let i = 0; i < results.length; i++) {
        createMarker(results[i]);
      }
      map.setCenter(results[0].geometry.location);
    }
  });
}

function createMarker(place) {
  if (!place.geometry || !place.geometry.location) return;

  const marker = new google.maps.Marker({
    map,
    position: place.geometry.location,
  });

  google.maps.event.addListener(marker, "click", () => {
    infowindow.setContent(place.name || "");
    infowindow.open(map);
  });
}

window.initMap = initMap;

function MapWrite() {

const [searchKeyword, setSearchKeyword] = useState("");//주소 검색어 상태

const containerStyle = {
  width: '700px',
  height: '400px'
};

const center = {
  lat: 14.018000,
  lng: 120.835941
};

  return (
    <div style={{
      flex:1,
      textAlign: "center",
      display: "flex",
      width: "100vw",
      minHeight: "100vh",//화면의 높이에 맞게 최소 높이를 설정
  }}>
    <div>
      <input
            type="text"
            placeholder="주소를 입력하세요"
            value={searchKeyword}
            onChange={(e) => setSearchKeyword(e.target.value)}
            style={{ flex:1}}
        />
          <button onClick={() => {}}>검색</button>
    </div>
      <LoadScript
        googleMapsApiKey="GoogleMapAipKey"
      >
        <GoogleMap
          mapContainerStyle={containerStyle}
          center={center}
          zoom={14}
        >
          <></>
        </GoogleMap>
      </LoadScript>
    </div>
      <div style={{
        display:"flex",
        
      }}>
        <Write/>
      </div>
    </div>
  )
}

export default React.memo(MapWrite)
```

# 코드설명

```JS
let map;
let service;
let infowindow;
```
1. Google Maps API의 핵심 객체들임
  - map : Google 지도 인스턴스를 저장
  - service : Places 서비스 인스턴스를 저장 (장소 검색 기능 제공)
  - infowindow : 마커 클릭 시 표시되는 정보창을 관리
```JS
const sydney = new google.maps.LatLng(-33.867, 151.195);
```
1. 시드니의 위도와 경도를 사용해 초기 지도 중심 위치를 설정한 것 -> 추후에 변경가능
```JS
infowindow = new google.maps.InfoWindow();
```
1. infowindow : 지도 위에 표시되는 팝업창으로 마커를 클릭했을 때 장소 이름 등의 정보를 보여주는 데 사용됨
```JS
service.findPlaceFromQuery(request, (results, status) => {
  if (status === google.maps.places.PlacesServiceStatus.OK && results) {
    for (let i = 0; i < results.length; i++) {
      createMarker(results[i]);
    }
    map.setCenter(results[0].geometry.location);
  }
});
```
1. status === google.maps.places.PlacesServiceStatus.OK && results
  - 장소 검색이 성공적으로 완료되었는지 확인하는 조건문
  - API 호출이 성공하고 결과가 존재하는 경우에만 실행
2. map.setCenter(results[0].geometry.location) : 검색된 첫 번째 결과의 위치로 지도 중심을 이동
3. geometry
  - 장소의 위치 정보를 포함하는 객체
  - location 속성에 위도와 경도 정보가 포함됨
```JS
google.maps.event.addListener(marker, "click", () => {
  infowindow.setContent(place.name || "");
  infowindow.open(map);
});
```
1. google.maps.event.addListener
  - 마커에 클릭 이벤트 리스너를 추가하는 메서드임
  - 사용자가 마커를 클릭했을 때 실행될 콜백 함수를 정의
2. addListener : 이벤트 리스너(Event Listener)를 추가하는 Google Maps API의 메서드임
  - 예시
  ```JS
  google.maps.event.addListener(target, eventName, handler)
  ```
    - target : 이벤트를 감지할 대상 (예: 마커, 지도)
    - eventName : 감지할 이벤트 유형 (예: "click", "mouseover")
    - handler : 이벤트 발생 시 실행될 콜백 함수
  - 웹 개발에서 일반적으로 사용하는 addEventListener와 비슷한 개념이지만, Google Maps API에 특화된 버전이라고 생각하면 됨
3. infowindow.open(map) : 정보창을 지도 위에 표시함
