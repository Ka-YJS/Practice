import React, { useEffect, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import Write from "./Write";

const Map = () => {
    const navigate = useNavigate();
    const mapContainer = useRef(null); // 지도 요소를 참조
    const [address, setAddress] = useState(""); // 선택된 주소를 저장하는 state
    const [searchKeyword, setSearchKeyword] = useState(""); // 주소 검색어 상태
    const [map, setMap] = useState(null); // 지도 객체를 저장할 state
    const [folders, setFolders] = useState([]); // 폴더들을 저장하는 상태
    const [showSearchResults, setShowSearchResults] = useState(false); // 검색결과 표시 상태
    const [searchResults, setSearchResults] = useState([]); // 검색된 주소 결과 목록

    

    useEffect(() => {
        const loadKakaoMapScript = () => {
            return new Promise((resolve, reject) => {
                if (window.kakao && window.kakao.maps) {
                    resolve();
                } else {
                    const script = document.createElement("script");
                    script.src = `https://dapi.kakao.com/v2/maps/sdk.js?appkey=${process.env.REACT_APP_KAKAO_REST_API_KEY}&autoload=false`;
                    script.async = true;

                    script.onload = () => {
                        if (window.kakao && window.kakao.maps) {
                            resolve(); // 스크립트 로드 완료
                        } else {
                            reject(new Error("Kakao Maps SDK could not be loaded"));
                        }
                    };

                    script.onerror = () => reject(new Error("Failed to load Kakao Maps SDK"));
                    document.head.appendChild(script);
                }
            });
        };

        loadKakaoMapScript()
            .then(() => {
                // 카카오맵 SDK 로드 후 지도 초기화
                window.kakao.maps.load(() => {
                    const mapOptions = {
                        center: new window.kakao.maps.LatLng(37.5665, 126.9780), // 서울시청 좌표
                        level: 3, // 줌 레벨
                    };
                    const createdMap = new window.kakao.maps.Map(mapContainer.current, mapOptions); // 지도 생성
                    setMap(createdMap); // map state에 지도 객체 저장
                });
            })
            .catch((error) => {
                console.error(error.message);
            });
    }, []); // 처음 한번만 실행되도록 빈 배열 전달

    const handleSearch = () => {
        // 주소 검색
        const geocoder = new window.kakao.maps.services.Geocoder();
        const ps = new window.kakao.maps.services.Places(); // 카카오 Places API

        // 상세검색을 위해 장소 검색
        ps.keywordSearch(searchKeyword, (data, status) => {
            if (status === window.kakao.maps.services.Status.OK) {
                setShowSearchResults(true); // 검색 결과 표시
                setSearchResults(data); // 검색된 장소 목록 저장
            } else {
                alert("검색된 결과가 없습니다.");
            }
        });
    };

    const handleSelectAddress = (addressName, lat, lng) => {
        setAddress(addressName); // 선택된 주소 저장
        map.panTo(new window.kakao.maps.LatLng(lat, lng)); // 지도 위치 이동
        setShowSearchResults(false); // 검색 결과 창 닫기
    };

    const addFolder = () => {
        // 새로운 폴더를 생성
        setFolders([
            ...folders,
            {
                id: Date.now(), // 고유한 ID
                name: `폴더 ${folders.length + 1}`, // 기본 폴더 이름
                title: "", // 폴더의 타이틀을 저장하는 상태
                checked: false, // 체크박스 상태
            },
        ]);
    };

    const handleTitleChange = (id, newTitle) => {
        // 특정 폴더의 타이틀을 변경
        setFolders(
            folders.map((folder) =>
                folder.id === id ? { ...folder, title: newTitle } : folder
            )
        );
    };

    const handleCheckboxChange = (id,e) => {
        e.stopPropagation();
        // 체크박스를 클릭하여 선택된 폴더들 상태 변경
        setFolders(
            folders.map((folder) =>
                folder.id === id ? { ...folder, checked: !folder.checked } : folder
            )
        );
    };

    const deleteSelectedFolders = () => {
        // 선택된 폴더 삭제
        setFolders(folders.filter((folder) => !folder.checked));
    };

    const handleFolderClick = (e) => {
        if (e.target.type === "checkbox") {
            return;
        }
        navigate("/PhotoDetail")
    }

    return (
        <div
            style={{
                textAlign: "center",
                display: "flex",
                width: "100vw",
                minHeight: "100vh", // 화면의 높이에 맞게 최소 높이를 설정
            }}
        >
            <div
                style={{
                    flex: 1,
                    backgroundColor: "#f0f0f0",
                }}
            >
                {/* 주소검색 입력폼 및 검색버튼 */}
                <div>
                    <input
                        type="text"
                        placeholder="주소를 입력하세요"
                        value={searchKeyword}
                        onChange={(e) => setSearchKeyword(e.target.value)}
                    />
                    <button onClick={handleSearch}>검색</button>
                </div>

                {/* 상세검색 결과 */}
                {showSearchResults && (
                    <div
                        style={{
                            position: "absolute",
                            top: "60px", // 검색창 바로 아래에 표시되도록
                            left: "10px",
                            width: "300px",
                            backgroundColor: "#fff",
                            border: "1px solid #ccc",
                            borderRadius: "5px",
                            padding: "10px",
                            maxHeight: "300px",
                            overflowY: "scroll",
                            boxShadow: "0px 0px 10px rgba(0,0,0,0.1)",
                            zIndex: 10,
                        }}
                    >
                        {searchResults.map((place) => (
                            <div
                                key={place.id}
                                onClick={() => handleSelectAddress(place.place_name, place.y, place.x)}
                                style={{
                                    cursor: "pointer",
                                    padding: "5px",
                                    borderBottom: "1px solid #ccc",
                                }}
                            >
                                {place.place_name}
                            </div>
                            
                        ))}
                    </div>
                )}

                {/* 지도 div */}
                <div
                    ref={mapContainer}
                    style={{ width: "100%", height: "400px" }}
                ></div>

                {/* 선택된 주소 출력 */}
                <div>
                    <h3>선택된 주소:</h3>
                    <p>{address || "주소를 클릭하거나 검색해주세요."}</p>
                </div>
            </div>

            {/* 장소에 대한 일정 및 사진 div */}
            <div style={{flex:1}}>
                <Write/>
            </div>
        </div>
    );
};

export default Map;
