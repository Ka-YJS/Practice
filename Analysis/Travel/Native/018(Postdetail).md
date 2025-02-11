# Postdetail.js

```JS
import React, { useContext, useState, useEffect } from "react";
import axios from "axios";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Image,
  FlatList,
  Modal,
  ScrollView,
  Alert,
} from "react-native";
import { PostContext } from "../contexts/PostContext";
import { UserContext } from "../contexts/UserContext";
import { useNavigation } from "@react-navigation/native";

const PostDetail = ({ route }) => {
  const { id } = route.params;
  const { postList, deletePost } = useContext(PostContext);
  const { user } = useContext(UserContext);
  const post = postList.find((p) => p.postId === id);
  const navigation = useNavigation();

  const [likes, setLikes] = useState(post?.likes || 0);
  const [isLiked, setIsLiked] = useState(false);
  const [selectedImage, setSelectedImage] = useState(null);
  const [modalVisible, setModalVisible] = useState(false);

  //초기 좋아요 상태 확인
  useEffect(() => {
    const checkLikeStatus = async () => {
      try {
        const response = await axios.get(
          `http://백엔드엔드포인트/api/likes/${post.postId}/isLiked`,
          {
            headers: {
              Authorization: `Bearer ${user.token}`,
            },
          }
        );
        setIsLiked(response.data);
      } catch (error) {
        console.error("좋아요 상태 확인 실패:", error);
      }
    };

    checkLikeStatus();
  }, [id]);

  //좋아요 토글 핸들러
  const handleLike = async () => {
    try {
      if (isLiked) {
        //좋아요 취소
        await axios.delete(`http://백엔드엔드포인트/api/likes/${post.postId}`,
          {
            headers: {
              Authorization: `Bearer ${user.token}`,
            }
          });
        setLikes(prev => prev - 1);
      } else {
        //좋아요 추가
        await axios.post(`http://백엔드엔드포인트/api/likes/${post.postId}`,{},
          {
            headers: {
              Authorization: `Bearer ${user.token}`,
            }
          });
        setLikes(prev => prev + 1);
      }
      setIsLiked(!isLiked);
    } catch (error) {
      console.error("좋아요 처리 실패:", error);
      Alert.alert("오류", "좋아요 처리 중 문제가 발생했습니다.");
    }
  };

  if (!post) {
    return (
      <View style={styles.container}>
        <Text style={styles.errorText}>기록을 찾을 수 없습니다.</Text>
      </View>
    );
  }

  const isPostOwner = post.userId === user.id;

  //이미지 렌더링 함수
  const renderImage = ({ item }) => (
    <TouchableOpacity
      onPress={() => {
        setSelectedImage(item);
        setModalVisible(true);
      }}
    >
      <Image
        source={{ uri: `http://백엔드엔드포인트${item}` }}
        style={styles.image}
      />
    </TouchableOpacity>
  );

  return (
    <View style={styles.container}>
      <ScrollView contentContainerStyle={styles.scrollViewContent}>
        {/* 제목 섹션 */}
        <View style={styles.section}>
          <Text style={styles.label}>제목</Text>
          <Text style={styles.title}>{post.postTitle}</Text>
        </View>

        {/* 작성자 섹션 */}
        <View style={styles.section}>
          <Text style={styles.label}>작성자</Text>
          <Text style={styles.text}>{post.userNickname}</Text>
        </View>

        {/* 여행지 섹션 */}
        <View style={styles.section}>
          <Text style={styles.label}>여행지</Text>
          <Text style={styles.text}>
            {post.placeList?.length > 0 ? post.placeList.join(" -> ") : "없음"}
          </Text>
        </View>

        {/* 내용 섹션 */}
        <View style={styles.section}>
          <Text style={styles.label}>기록 내용</Text>
          <Text style={styles.ContentText}>{post.postContent || "내용이 없습니다."}</Text>
        </View>

        {/* 이미지 섹션 */}
        <View style={styles.section}>
          <Text style={styles.label}>이미지</Text>
          {post.imageUrls?.length > 0 ? (
            <FlatList
              data={post.imageUrls}
              renderItem={renderImage}
              keyExtractor={(index) => index.toString()}
              horizontal
              style={styles.imageList}
              showsHorizontalScrollIndicator={true}
            />
          ) : (
            <Text style={styles.noImage}>이미지가 없습니다.</Text>
          )}
        </View>

        {/* 좋아요 섹션 */}
        <View style={styles.likeContainer}>
          <Text style={styles.likeCount}>❤️ 좋아요: {likes}</Text>
          <TouchableOpacity 
            style={[
              styles.likeButton,
              isLiked && styles.likeButtonActive
            ]} 
            onPress={handleLike}
          >
            <Text style={styles.likeButtonText}>
              {isLiked ? "❤️ 좋아요 취소" : "🤍 좋아요"}
            </Text>
          </TouchableOpacity>
          
        </View>

        {/* 게시물 작성자만 표시되는 수정 및 삭제 버튼 */}
        {isPostOwner && (
          <View style={styles.ownerButtons}>
            <TouchableOpacity 
              style={styles.editButton} 
              onPress={() => navigation.navigate("EditPost", post)}
            >
              <Text style={styles.buttonText}>수정</Text>
            </TouchableOpacity>
            <TouchableOpacity 
              style={styles.deleteButton} 
              onPress={() => {
                Alert.alert(
                  "삭제 확인",
                  "정말로 이 기록을 삭제하시겠습니까?",
                  [
                    { text: "취소", style: "cancel" },
                    {
                      text: "삭제",
                      style: "destructive",
                      onPress: () => {
                        deletePost(post.postId);
                        navigation.goBack();
                      },
                    },
                  ]
                );
              }}
            >
              <Text style={styles.buttonText}>삭제</Text>
            </TouchableOpacity>
          </View>
        )}

        {/* 목록으로 버튼 */}
        <TouchableOpacity
          style={styles.button}
          onPress={() => navigation.goBack()}
        >
          <Text style={styles.buttonText}>목록으로</Text>
        </TouchableOpacity>
      </ScrollView>

      {/* 이미지 확대 모달 */}
      <Modal visible={modalVisible} transparent={true} animationType="fade">
        <View style={styles.modalContainer}>
          <TouchableOpacity
            style={styles.modalClose}
            onPress={() => setModalVisible(false)}
          >
            <Text style={styles.modalCloseText}>닫기</Text>
          </TouchableOpacity>
          <Image
            source={{ uri: `http://백엔드엔드포인트${selectedImage}` }}
            style={styles.modalImage}
            resizeMode="contain"
          />
        </View>
      </Modal>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
  },
  scrollViewContent: {
    padding: 20,
    paddingBottom: 80,
  },
  section: {
    marginBottom: 20,
    paddingVertical: 10,
  },
  label: {
    fontSize: 18,
    fontWeight: "600",
    color: "#333",
    marginBottom: 5,
    borderBottomWidth: 1,
    borderBottomColor: "#ddd",
    paddingBottom: 5,
    fontFamily: 'GCB', //추가
  },
  title: {
    fontSize: 22,
    color: "#333",
    marginBottom: 5,
    fontFamily: 'GCB_Bold', //추가
  },
  text: {
    fontSize: 16,
    lineHeight: 24,
    color: "#444",
    fontFamily: 'GCB_Bold', //추가
  },
  ContentText: {
    fontSize: 16,
    lineHeight: 24,
    color: "#444",
    paddingBottom: 10,
    textAlign: "auto"
  },
  imageList: {
    marginVertical: 10,
  },
  image: {
    width: 200,
    height: 200,
    marginRight: 10,
    borderRadius: 8,
    marginBottom: 10,
  },
  noImage: {
    fontSize: 14,
    color: "#999",
    textAlign: "center",
    marginVertical: 10,
  },
  likeContainer: {
    flexDirection: "row",
    alignItems: "center",
    marginTop: 10,
    width: "100%",
    justifyContent: "flex-end",  //버튼을 오른쪽에 배치
  },
  likeButton: {
    paddingVertical: 7,
    paddingHorizontal: 15,
    backgroundColor: "#FF6B81",
    borderRadius: 5,
  },
  likeButtonActive: {
    backgroundColor: "#FF4757",
  },
  likeButtonText: {
    fontSize: 16,
    color: "#fff",
    fontFamily: 'GCB', //추가
  },
  likeCount: {
    fontSize: 18,
    color: "#555",
    textAlign: "left", //좋아요 개수를 왼쪽 정렬
    marginRight: "auto", //왼쪽 정렬을 위한 자동 마진
    marginLeft : 10,
    marginBottom : 10,
    fontFamily: 'GCB_Bold', //추가
  },
  ownerButtons: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginTop: 20,
  },
  editButton: {
    flex: 1,
    marginRight: 10,
    backgroundColor: "#4CAF50",
    padding: 10,
    borderRadius: 5,
  },
  deleteButton: {
    flex: 1,
    marginLeft: 10,
    backgroundColor: "#F44336",
    padding: 10,
    borderRadius: 5,
  },
  button: {
    marginTop: 10,
    paddingVertical: 10,
    paddingHorizontal: 20,
    backgroundColor: "#03B764",
    borderRadius: 5,
    alignItems: "center",
  },
  buttonText: {
    color: "#fff",
    textAlign: "center",
    fontSize: 16,
    fontFamily: 'GCB_Bold', //추가
  },
  errorText: {
    fontSize: 18,
    color: "red",
    textAlign: "center",
  },
  modalContainer: {
    flex: 1,
    justifyContent: "center",
    backgroundColor: "rgba(0,0,0,0.8)",
  },
  modalClose: {
    position: "absolute",
    top: 40,
    right: 20,
    padding: 10,
    backgroundColor: "#FF6B81",
    borderRadius: 5,
  },
  modalCloseText: {
    color: "#fff",
    fontSize: 16,
    fontFamily: 'GCB_Bold', //추가
  },
  modalImage: {
    width: "100%",
    height: "80%",
  },
});

export default PostDetail;
```

# 코드설명

```JS
const { id } = route.params;
const post = postList.find((p) => p.postId === id);
```
1. route.params
  - React Navigation에서 화면 간 데이터를 전달할 때 사용하는 객체임
  - 다른 화면에서 navigation.navigate("PostDetail", { id: someId })와 같이 호출할 때 전달된 파라미터를 받아옴
  - 여기서는 구조분해할당을 사용해 route.params에서 id 값만 추출함
  - 구조분해할당이란? 배열이나 객체의 요소를 쉽게 추출하여 변수에 할당할 수 있게 해주는 기능임
2. postList.find((p) => p.postId === id)
  - postList 배열에서 특정 게시물을 찾는 JavaScript 배열 메서드임
  - find() 메서드는 조건을 만족하는 첫 번째 요소를 반환함
  - 각 게시물 p를 순회하면서 p.postId가 전달받은 id와 일치하는 게시물을 찾으며, 찾은 게시물은 post변수에 저장됨
```JS
Modal visible={modalVisible} transparent={true} animationType="fade"
```
1. visible={modalVisible}
  - 모달의 표시 여부를 제어하는 props임
  - modalVisible 상태값이 true면 모달이 표시되고, false면 숨겨짐
  - useState로 관리되는 상태값으로, 이미지 클릭 시 true로 설정됨
2. transparent={true}
  - 모달의 배경을 투명하게 만드는 props임
  - true로 설정하면 모달 외부가 반투명한 검정색으로 표시됨
  - 이를 통해 사용자는 모달이 떠있는 상태임을 시각적으로 인지할 수 있음
3. animationType="fade"
  - 모달이 나타나고 사라질 때의 애니메이션 효과를 지정함
  - "fade"는 페이드 인/아웃 효과를 적용함
  - 다른 옵션으로는 "slide", "none" 등이 있음