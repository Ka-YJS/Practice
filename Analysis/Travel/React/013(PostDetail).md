# PostDetail

```JS
import React, { useContext, useEffect, useState } from "react";
import { TextField, Button } from "@mui/material";
import { useNavigate, useParams, useLocation } from "react-router-dom";
import { UserContext } from "../context/UserContext";
import axios from "axios";
import TopIcon from "../TopIcon/TopIcon";
import config from "../Apikey";

const PostDetail = () => {
    const { user } = useContext(UserContext);//사용자 정보
    const { id } = useParams();//게시글 IDa
    const [previousPath, setPreviousPath] = useState(null);
    const [post, setPost] = useState({});
    const [imageUrls, setImageUrls] = useState([]);
    const [isLiked, setIsLiked] = useState(false);//좋아요 상태
    const [likeCount, setLikeCount] = useState(0);//좋아요 개수

    const navigate = useNavigate();
    const location = useLocation();//현재 위치 추적

   //게시글 상세 데이터 가져오기
    const getPostDetail = async () => {
        try {
            const response = await axios.get(`http://${config.IP_ADD}:9090/travel/posts/postDetail/${id}`, {
                headers: {
                    Authorization: `Bearer ${user.token}`,
                    Accept: '*/*'
                },
                    withCredentials: true
            });
            const data = response.data.data[0];
            setPost(data);
            setImageUrls(data.imageUrls || []);
            setLikeCount(data.likes || 0);//초기 좋아요 개수 설정
        } catch (error) {
            console.error("Error fetching post details:", error);
            alert("게시글 정보를 불러오는 중 오류가 발생했습니다.");
            navigate(-1);//이전 페이지로 이동
        }
    };

   //좋아요 상태 가져오기
    const getLikeStatus = async () => {
        try {
            const response = await axios.get(`http://${config.IP_ADD}:9090/travel/likes/${id}/isLiked`, {
                headers: { 
                    Authorization: `Bearer ${user.token}` ,
                    Accept: '*/*'
                },
                    withCredentials: true
            });
            setIsLiked(response.data);//좋아요 상태 설정
        } catch (error) {
            console.error("Error fetching like status:", error);
        }
    };

   //좋아요 버튼 클릭
    const likeButtonClick = async () => {
        try {
            console.log("isLiked"+isLiked)
            const url = `http://${config.IP_ADD}:9090/travel/likes/${id}`;
            const method = isLiked ? "delete" : "post";//Toggle between POST and DELETE
    
           //Make the API request to toggle like status
            const response = await axios({
                method,
                url,
                headers: { Authorization: `Bearer ${user.token}` },
            });
    
            setIsLiked(!isLiked);
            if(isLiked){
                setLikeCount(count=>count-1)
            }else{
                setLikeCount(count=>count+1)
            }
        } catch (error) {
            console.error("Error updating like:", error);
            alert("좋아요 처리 중 문제가 발생했습니다.");
        }
    };

   //페이지 이동 전 이전 경로를 저장
    useEffect(() => {
        setPreviousPath(location.state?.from);
    }, [location]);

    useEffect(() => {
        getPostDetail();
        getLikeStatus();//좋아요 상태 가져오기
    }, []);

    if (!post) {
        return (
            <div style={{ textAlign: "center", padding: "20px", }}>
                <h2>잘못된 경로입니다.</h2>
                <Button variant="contained" color="primary" onClick={() => navigate("/Post")}>
                    게시글 목록으로 이동
                </Button>
            </div>
        );
    }

   //목록 버튼 클릭
    const listButtonClick = () => {
        if (previousPath && previousPath.includes(`/mypost/${user.id}`)) {
            navigate(`/mypost/${user.id}`);//이전 경로로 이동
        } else {
            navigate("/post");
        }
    };

   //수정 버튼 클릭
    const toPostEdit = () => {
        navigate(`/postEdit/${id}`, { state: { from: location.state?.from } });
    };

   //삭제 버튼 클릭
    const handleDelete = async () => {
        if (window.confirm("게시글을 삭제하시겠습니까?")) {
            try {
                const response = await axios.delete(`http://${config.IP_ADD}:9090/travel/postDelete/${id}`, {
                    headers: {
                        Authorization: `Bearer ${user.token}`,
                        Accept: '*/*'
                    },
                        withCredentials: true
                });
                if (response.data) {
                    alert("삭제되었습니다.");
                    if (previousPath && previousPath.includes(`/mypost/${user.id}`)) {
                        navigate(`/mypost/${user.id}`);//이전 경로로 이동
                    } else {
                        navigate("/post");
                    }
                } else {
                    alert("삭제에 실패했습니다.");
                }
            } catch (error) {
                console.error("Error deleting post:", error);
                alert("삭제 중 오류가 발생했습니다.");
            }
        }
    };

    return (
        <div>
            <TopIcon text=" 게시글 보기" />
            <div style={{ justifyItems: "center" }}>
                <div
                    style={{
                        position: "relative",
                        marginTop: "150px",
                        zIndex: "-1",
                        minWidth: "90%",
                        
                    }}
                >
                    {/* 제목 */}
                    <TextField
                        style={{ marginBottom: "20px" }}
                        InputProps={{
                            readOnly: true,
                        }}
                        value={post.postTitle || "제목"}
                        fullWidth
                        variant="outlined"
                        label="제목"
                    />
                    {/* 작성자 */}
                    <TextField
                        style={{ marginBottom: "20px" }}//여백 추가
                        InputProps={{
                            readOnly: true,
                        }}
                        label="작성자"
                        fullWidth
                        variant="outlined"
                        value={post.userNickname || "알 수 없는 사용자"}
                    />
                    {/* 여행지 */}
                    <TextField
                        style={{ marginBottom: "20px" }}//여백 추가
                        inputProps={{
                            readOnly: true,
                        }}
                        fullWidth
                        variant="outlined"
                        label="여행지"
                        value={post.placeList?.join(" -> ") || "등록된 여행지가 없습니다."}
                    />
                    {/* 내용 */}
                    <TextField
                        style={{ marginBottom: "20px"}}//여백 추가
                        InputProps={{
                            readOnly: true,
                        }}
                        value={post.postContent || "내용"}
                        fullWidth
                        variant="outlined"
                        label="내용"
                        multiline
                        rows={8}
                    />
                    {/* 이미지 */}
                    <div
                        style={{
                            display: "grid",
                            gridTemplateColumns: "repeat(5, 1fr)",
                            gap: "10px",
                            marginTop: "20px",
                            
                        }}
                    >
                        {imageUrls.map((image, index) => (
                            <div
                                key={index}
                                style={{
                                    display: "flex",
                                    width: "200px",
                                    height: "200px",
                                    justifyContent: "center",
                                    alignItems: "center",
                                    border: "1px solid #ddd",
                                    borderRadius: "5px",
                                    overflow: "hidden",
                                    backgroundColor: "#f9f9f9",
                                   
                                }}
                            >
                                <img
                                    src={`http://${config.IP_ADD}:9090${image}`}
                                    alt={`image-${index}`}
                                    style={{
                                        height: "20vh",
                                        width: "20vw",
                                        padding: 0,
                                        margin: 0,
                                        
                                    }}
                                />
                            </div>
                        ))}
                    </div>
                    
                </div>
                {/* 좋아요 버튼 */}
                <div style={{ marginTop: "20px", display: "flex", alignItems: "center" }}>
                        <Button
                            onClick={likeButtonClick}
                            style={{
                                minWidth: "auto",
                                padding: "0px",
                                margin: "0px",
                                background: "none",
                                border: "none",//테두리 제거
                                outline: "none",//외부 테두리 제거
                                cursor: "pointer",//클릭 커서 스타일
                            }}
                        >
                <span style={{ fontSize: "25px" }}> {/* Increase font size here */}
                    {isLiked ? "❤️" : "🤍"} {/* 좋아요 상태에 따라 하트 색상 변경 */}
                </span>
                </Button>
                <span style={{ fontSize: "25px" }}>
                    {likeCount}
                </span>
                </div>

                {/* 버튼 영역 */}
                <div style={{ display: "flex", justifyContent: "space-between" }}>
                    <Button
                        variant="contained"
                        color="primary"
                        onClick={listButtonClick}
                        style={{ width: "10%" ,backgroundColor :"#45a347",fontFamily: "'GowunDodum-Regular', sans-serif"
                        }}
 
                    >
                        목록
                    </Button>
                    {post.userId === user.id && (
                        <div>
                            <Button
                                variant="outlined"
                                color="error"
                                onClick={toPostEdit}
                                style={{ width: "10%",fontFamily: "'GowunDodum-Regular', sans-serif"}}
                            >
                                수정
                            </Button>
                            <Button
                                variant="outlined"
                                color="error"
                                onClick={handleDelete}
                                style={{ width: "10%",fontFamily: "'GowunDodum-Regular', sans-serif" }}
                            >
                                삭제
                            </Button>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

export default PostDetail;
```

# 코드설명

```JS
const navigate = useNavigate();
const location = useLocation();
```
1. useNavigate기능
    - React Router의 Hook으로, 프로그래밍 방식으로 페이지 이동을 할 수 있게 해줌
    - 여기서 사용된 코드
    ```JS
    navigate(-1)//이전페이지로 이동함
    navigate("/post") 
    navigate(`/mypost/${user.id}`)
    navigate(`/postEdit/${id}`, { state: { from: location.state?.from } })//현재state를 반영해서 이동함
    ```
2. useLocation기능
    - 현재 URL의 정보를 가져오는 Hook임
    - 페이지의 경로, 상태(state), 쿼리 파라미터 등의 정보를 제공함
    - 코드에서는 주로 이전 경로를 추적하는데 사용됨
    ```JS
    useEffect(() => {
        setPreviousPath(location.state?.from);
    }, [location]);
    ```
    - Hook은 함께 사용되어 다음과 같은 기능을 구현함
        1. 게시글 목록으로 돌아갈 때 이전 페이지를 기억함
        2. 수정 페이지로 이동할 때 이전 경로 정보 전달함
        3. 삭제 후 적절한 페이지로 이동함
        4. 오류 발생 시 이전 페이지로 되돌아감
        5. 이 코드에서는 사용자가 마이페이지에서 왔는지 일반 게시글 목록에서 왔는지를 구분하여 적절한 페이지로 이동시키는데 활용되고 있음