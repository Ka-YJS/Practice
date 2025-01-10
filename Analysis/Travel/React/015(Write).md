# Write

```JS
import React, { useContext, useState } from "react";
import { TextField, Button } from "@mui/material";
import { useNavigate } from "react-router-dom";
import { ListContext } from "../context/ListContext";
import { UserContext } from "../context/UserContext";
import { Delete } from "@mui/icons-material";
import axios from "axios";
import '../css/Map.css'; //Map.css 파일을 import
import config from "../Apikey";

const Write = () => {
    const {user} = useContext(UserContext)
    const {list} = useContext(ListContext)
    const [postTitle, setPostTitle] = useState("");
    const [postContent, setPostContent] = useState("");
    const [selectedFiles, setSelectedFiles] = useState([]);//사용자가 선택한 파일들
    const [previewUrls, setPreviewUrls] = useState([]);//미리보기 URL들
    const navigate = useNavigate();

    //파일 추가 핸들러
    const handleAddImages = async (e) => {
        const files = Array.from(e.target.files);
        
        //10개 이미지 제한
        if (selectedFiles.length + files.length > 10) {
            alert("최대 10개의 이미지만 업로드 가능합니다.");
            return;
        }

        //파일 정보와 미리보기 URL 설정
        setSelectedFiles((prevFiles) => [...prevFiles, ...files]);
        const newPreviews = files.map((file) => URL.createObjectURL(file));
        setPreviewUrls((prevUrls) => [...prevUrls, ...newPreviews]);
    };

    //이미지 삭제 핸들러
    const handleDeleteImage = (index) => {
        setSelectedFiles((prevFiles) => prevFiles.filter((_, idx) => idx !== index));
        setPreviewUrls((prevUrls) => prevUrls.filter((_, idx) => idx !== index));
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
            alert("허용되지 않은 파일 형식이 포함되어 있음.");
            return;
        }
    
        //FormData 생성 및 전송
        const formData = new FormData();

        formData.append("postTitle", postTitle);
        formData.append("postContent", postContent);
        formData.append("userNickName", user.userNickName);
        formData.append("placeList", list.join(", "));
        selectedFiles.forEach((file) => formData.append("files", file));
    
        try {
            for (let [key, value] of formData.entries()) {
                console.log(key, value);
            }
            console.log(user.token);
            const response = await axios.post(`http://${config.IP_ADD}:9090/travel/write/${user.id}`, formData, {
                headers: { 
                    "Content-Type": "multipart/form-data" ,
                    Authorization: `Bearer ${user.token}`,
                    Accept: '*/*'
            },
                withCredentials: true
            });

            console.log("Response:", response);
            alert("글이 저장되었음!");
            navigate("/PostDetail/" + response.data.postId);
        } catch (error) {
            console.error("Error saving post:", error.response || error.message);
            alert("저장 중 오류가 발생했음.");
            if (error.response) {
                console.log("Response Data:", error.response.data);
                console.log("Response Status:", error.response.status);
            }
        }
    };

   //취소 버튼 핸들러
    const handleCancel = () => {
        setPostTitle("");
        setPostContent("");
        if (window.confirm("글 작성을 취소하시겠습니까?")) {
            alert("글 작성이 취소되었음.");
            navigate("/post");
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
                    value={list.join(" -> ")}
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
                    {previewUrls.map((url, index) => (
                        <div key={index}>
                            <img 
                                src={url} 
                                alt={`preview-${index}`}
                            />
                            <Delete onClick={() => handleDeleteImage(index)} />
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

export default Write;

```

# 코드설명

```JS
const files = Array.from(e.target.files);
```
1. Array.from()
    - 유사 배열 객체(array-like object)나 이터러블 객체를 실제 배열로 변환하는 메서드임
    - e.target.files가 반환하는 FileList 객체는 유사 배열 객체이기 때문에, 배열 메서드를 사용하기 위해서는 실제 배열로 변환이 필요함
    - 변환 후에는 map, filter 등의 배열 메서드를 자유롭게 사용할 수 있음
2. e.target.files
    - input[type="file"] 요소에서 선택된 파일들의 정보를 담고 있는 FileList 객체를 반환
    - 주요 특징 :
        - 읽기 전용 객체임임
        - length 속성을 통해 선택된 파일의 개수를 알 수 있음
        - 인덱스를 통해 개별 File 객체에 접근할 수 있음
        - File 객체는 name, size, type 등의 파일 정보를 포함함