# PostEdit

```JS
import React, { useContext, useState, useEffect } from "react";
import { TextField, Button } from "@mui/material";
import { useLocation, useNavigate, useParams } from "react-router-dom";
import axios from "axios";
import { UserContext } from "../context/UserContext";
import { Delete } from "@mui/icons-material";
import { CopyListContext } from "../context/CopyListContext";
import { CopyPlaceListContext } from "../context/CopyPlaceListContext";
import config from "../Apikey";


const PostEdit = () => {
    const { user } = useContext(UserContext);
    const { copyList, setCopyList } = useContext(CopyListContext);
    const {copyPlaceList, setCopyPlaceList} = useContext(CopyPlaceListContext);
    const [postTitle, setPostTitle] = useState("");
    const [postContent, setPostContent] = useState("");
    const [selectedFiles, setSelectedFiles] = useState([]); 
    const [previewUrls, setPreviewUrls] = useState([]); 
    const [existingImageUrls, setExistingImageUrls] = useState([]);
    const [previousPath, setPreviousPath] = React.useState(null);

    const location = useLocation();//현재 위치 추적
    const navigate = useNavigate();
    const { id } = useParams();//URL에서 게시글 ID 가져오기

   //게시글 데이터 불러오기
    useEffect(() => {
        const fetchPostDetails = async () => {
            try {
                const response = await axios.get(`http://${config.IP_ADD}:9090/travel/posts/postDetail/${id}`, {
                    headers: { 
                        'Authorization': `Bearer ${user.token}`, 
                        'Accept': '*/*'
                    },
                        withCredentials: true
                });
                const postData = response.data.data[0];
                setPostTitle(postData.postTitle);
                setPostContent(postData.postContent);
                setExistingImageUrls(postData.imageUrls || []);
                
               //여행지 리스트 설정
                setCopyPlaceList(postData.placeList);
                setCopyList(postData.placeList)
                console.log(postData.placeList)
            } catch (error) {
                console.error("게시글 정보 불러오기 실패:", error);
                alert("게시글 정보를 불러오는 중 오류가 발생했습니다.");
            }
        };

        fetchPostDetails();
    }, [id, user.token, setCopyList]);

   //페이지 이동 전 이전 경로를 저장
    useEffect(() => {
        setPreviousPath(location.state?.from);
    }, [location]);

   //파일 추가 핸들러
    const handleAddImages = (e) => {
        const files = Array.from(e.target.files);
        
       //10개 이미지 제한 (기존 이미지 + 새 이미지)
        if (existingImageUrls.length + selectedFiles.length + files.length > 10) {
            alert("최대 10개의 이미지만 업로드 가능합니다.");
            return;
        }

       //파일 정보와 미리보기 URL 설정
        setSelectedFiles((prevFiles) => [...prevFiles, ...files]);
        const newPreviews = files.map((file) => URL.createObjectURL(file));
        setPreviewUrls((prevUrls) => [...prevUrls, ...newPreviews]);
    };

   //이미지 삭제 핸들러
    const handleDeleteImage = (index, isExisting = false) => {
        if (isExisting) {
           //기존 이미지 삭제
            setExistingImageUrls((prevUrls) => 
                prevUrls.filter((_, idx) => idx !== index)
            );
        } else {
           //새로 추가된 이미지 삭제
            setSelectedFiles((prevFiles) => 
                prevFiles.filter((_, idx) => idx !== index)
            );
            setPreviewUrls((prevUrls) => 
                prevUrls.filter((_, idx) => idx !== index)
            );
        }
    };

   //저장 버튼 핸들러
    const handleSave = async () => {
        if (!postTitle || !postContent) {
            alert("제목과 내용을 모두 입력해주세요.");
            return;
        }

       //허용된 파일 확장자 검사
        const allowedExtensions = ["png", "jpg", "jpeg", "gif"];
        const invalidFiles = selectedFiles.filter(
            (file) => !allowedExtensions.includes(file.name.split('.').pop().toLowerCase())
        );

        if (invalidFiles.length > 0) {
            alert("허용되지 않은 파일 형식이 포함되어 있습니다.");
            return;
        }

       //FormData 생성 및 전송
        const formData = new FormData();
        
        formData.append("postTitle", postTitle);
        formData.append("postContent", postContent);
        formData.append("userNickName", user.userNickName);
        formData.append("placeList", copyList?.join(", "));        
        formData.append("existingImageUrls", JSON.stringify(existingImageUrls));

       //새 파일 추가
        selectedFiles.forEach((file) => formData.append("files", file));

       //FormData 디버깅
        for (let [key, value] of formData.entries()) {
            console.log(`${key}:`, value);
        }

        try {
            const response = await axios.put(`http://${config.IP_ADD}:9090/travel/posts/postEdit/${id}`, formData, {
                headers: { 
                    "Content-Type": "multipart/form-data",
                    'Authorization': `Bearer ${user.token}`,
                    'Accept': '*/*'
                },
                    withCredentials: true
            });

            alert("글이 수정되었습니다!");

            navigate(`/postdetail/${id}`, { state: { from: location.state?.from } }); //이전 경로로 이동

        } catch (error) {
            console.error("Error updating post:", error.response?.data || error.message);
            alert(
                `수정 중 오류가 발생했습니다: ${
                error.response?.data?.message || "서버와의 통신에 실패했습니다."
                }`
            )
        };
    }

   //취소 버튼 핸들러
    const handleCancel = () => {
        if (window.confirm("수정을 취소하시겠습니까?")) {
            alert("수정이 취소되었습니다.");
            navigate(`/postdetail/${id}`, { state: { from: location.state?.from } });
        }
    };

    return (
        <div className="write">
            {/* 제목 입력 */}
            <div>
                <TextField
                    fullWidth
                    variant="outlined"
                    label="제목"
                    value={postTitle}
                    onChange={(e) => {setPostTitle(e.target.value)}}
                    placeholder="제목을 입력하세요."
                />
            </div>

            {/* 작성자 표시 */}
            <div>
                <TextField
                    InputProps={{ readOnly: true }}
                    label="작성자"
                    fullWidth
                    variant="outlined"
                    value={user.userNickName || "알 수 없는 사용자"}
                />
            </div>

            {/* 여행지 표시 */}
            <div>
                <TextField
                    inputProps={{readOnly: true}}
                    fullWidth
                    variant="outlined"
                    label="여행지"
                    value={copyList.join(" -> ")}
                    multiline
                    rows={2}
                />
            </div>

            {/* 내용 입력 */}
            <div>
                <TextField
                    fullWidth
                    variant="outlined"
                    label="내용"
                    value={postContent}
                    onChange={(e) => {setPostContent(e.target.value)}}
                    placeholder="내용을 입력하세요."
                    multiline
                    rows={7}
                />
            </div>

            {/* 이미지 업로드 */}
            <div className="photo_style">
                <label htmlFor="input-file" className="input-file-label">
                    사진추가
                </label>
                <input 
                    type="file" 
                    accept=".png, .jpg, .jpeg, .gif" 
                    id="input-file" 
                    multiple 
                    onChange={handleAddImages} 
                />
                {/* 저장해둔 이미지들을 순회하면서 화면에 이미지 출력 */}
                <div className="image-grid">
                    {existingImageUrls.map((url, index) => (
                        <div key={`existing-${index}`}>
                            <img 
                                src={`http://${config.IP_ADD}:9090${url}`} 
                                alt={`existing-${index}`}
                            />
                            <Delete onClick={() => handleDeleteImage(index,true)} />
                        </div>
                    ))}
                    {previewUrls.map((url, index) => (
                        <div key={index}>
                            <img 
                                src={url} 
                                alt={`preview-${index}`}
                            />
                            <Delete onClick={() => handleDeleteImage(index,false)} />
                        </div>
                    ))}
                </div>
            </div>

            {/* 저장/취소 버튼 */}
            <div className="write-buttons">
                <Button
                    variant="contained"
                    color="primary"
                    onClick={handleSave}
                >
                    저 장
                </Button>
                <Button
                    variant="outlined"
                    color="error"
                    onClick={handleCancel}
                >
                    취 소
                </Button>
            </div>
        </div>
    );
};

export default PostEdit;
```

# 코드설명

```JS
const { id } = useParams();
```
1. useParams
    - React Router의 훅으로, URL의 동적 매개변수를 가져옴
    - 예를들어 /postEdit/123 URL에서 id 값 "123"을 추출함
```JS
useEffect(() => {
    const fetchPostDetails = async () => {
        try {
            const response = await axios.get(`http://${config.IP_ADD}:9090/travel/posts/postDetail/${id}`, {
                headers: { 
                    'Authorization': `Bearer ${user.token}`, 
                    'Accept': '*/*'
                },
                    withCredentials: true
            });
            const postData = response.data.data[0];
            setPostTitle(postData.postTitle);
            setPostContent(postData.postContent);
            setExistingImageUrls(postData.imageUrls || []);
            
            setCopyPlaceList(postData.placeList);
            setCopyList(postData.placeList)
            console.log(postData.placeList)
        } catch (error) {
            console.error("게시글 정보 불러오기 실패:", error);
            alert("게시글 정보를 불러오는 중 오류가 발생했습니다.");
        }
    };
    fetchPostDetails();
}, [id, user.token, setCopyList]);
```
1. async : 비동기 함수를 정의할 때 사용합니다. 이를 통해 `await` 키워드를 사용하여 비동기 작업(예: API 호출)의 완료를 기다릴 수 있음음
2. 'Accept': '*/*' : HTTP 요청 헤더로, 서버가 반환하는 모든 타입의 데이터를 수락하겠다는 의미임
3. withCredentials: true -> 쿠키나 인증 헤더와 같은 자격 증명을 포함하여 교차 출처 요청을 할 수 있게 함
4. const postData = response.data.data[0];
    - 서버 응답에서 첫 번째 데이터 객체를 추출함
    - 서버가 `{ data: [...] }` 형식으로 응답을 보냄
5. setExistingImageUrls(postData.imageUrls || []);
    - 게시글의 이미지 URL들을 상태에 저장함
    - || []은 imageUrls가 없을경우 빈 배열을 사용하는 폴백(fallback) 처리임
```JS
const handleDeleteImage = (index, isExisting = false) => {
    if (isExisting) {
        setExistingImageUrls((prevUrls) => 
            prevUrls.filter((_, idx) => idx !== index)
        );
    } else {
        setSelectedFiles((prevFiles) => 
            prevFiles.filter((_, idx) => idx !== index)
        );
        setPreviewUrls((prevUrls) => 
            prevUrls.filter((_, idx) => idx !== index)
        );
    }
};
```
1. 어떻게 진행되는건지?
    1. if문 부분 : isExisting이 true일 때 기존 이미지를 삭제함함
    2. else문 부분 : isExisting이 false일 때 새로 추가된 이미지를 삭제함
2. index, isExisting = false
    1. index: 삭제할 이미지의 인덱스
    2. isExisting = false: 기본값이 false인 매개변수로, 기존 이미지인지 새로 추가된 이미지인지 구분함
3. prevUrls/prevFiles.filter((_, idx) => idx !== index)
    - _ : 사용하지 않는 첫 번째 매개변수(배열의 각 요소)를 표시
    - idx : 현재 처리 중인 요소의 인덱스
    - idx !== index : 삭제하려는 인덱스와 다른 모든 요소를 유지