# PostController

```JAVA
package com.korea.travel.controller;

import java.time.LocalDateTime;
import java.time.format.DateTimeFormatter;
import java.util.ArrayList;
import java.util.Arrays;
import java.util.List;
import java.util.Optional;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestPart;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.multipart.MultipartFile;

import com.fasterxml.jackson.core.JsonProcessingException;
import com.fasterxml.jackson.core.type.TypeReference;
import com.fasterxml.jackson.databind.ObjectMapper;
import com.korea.travel.dto.PostDTO;
import com.korea.travel.dto.ResponseDTO;
import com.korea.travel.model.PostEntity;
import com.korea.travel.model.UserEntity;
import com.korea.travel.persistence.LikeRepository;
import com.korea.travel.persistence.PostRepository;
import com.korea.travel.persistence.UserRepository;
import com.korea.travel.service.PostService;

import lombok.RequiredArgsConstructor;

@RestController
@RequestMapping("/api")
@CrossOrigin(origins = "http://localhost:3000") //React 앱이 동작하는 주소
@RequiredArgsConstructor
public class PostController {

    private final PostService postService;
	private final UserRepository userRepository;
	private final PostRepository postRepository;

    //게시판 전체 조회
    @GetMapping("/posts")
    public ResponseEntity<?> getAllPosts() {
        List<PostDTO> dtos = postService.getAllPosts();
        ResponseDTO<PostDTO> response = ResponseDTO.<PostDTO>builder().data(dtos).build();
        return ResponseEntity.ok(response);
    }
    
    //마이 게시판 조회
    @GetMapping("/myPosts/{userId}")
    public ResponseEntity<?> getMyPosts(@PathVariable Long userId){
    	List<PostDTO> dtos = postService.getMyPosts(userId);
        ResponseDTO<PostDTO> response = ResponseDTO.<PostDTO>builder().data(dtos).build();
        return ResponseEntity.ok(response);
    }
    
    //게시글 한 건 조회
    @GetMapping("/posts/postDetail/{id}")
    public ResponseEntity<?> getPostById(@PathVariable Long id) {
        List<PostDTO> dtos = List.of(postService.getPostById(id));
        ResponseDTO<PostDTO> response = ResponseDTO.<PostDTO>builder().data(dtos).build();
        return ResponseEntity.ok(response);
    }

    //게시글 작성 + 이미지 업로드
    @PostMapping(value = "/write/{userId}", consumes = MediaType.MULTIPART_FORM_DATA_VALUE)
    public ResponseEntity<?> createPost(
    		@PathVariable Long userId,
            @RequestPart("postTitle") String postTitle,
            @RequestPart("postContent") String postContent,
            @RequestPart(value = "placeList", required = false) String placeList,
            @RequestPart("userNickName") String userNickName,
            @RequestPart(value = "files", required = false) List<MultipartFile> files) {
    	
        //유저 ID를 통해 UserEntity 가져오기
        Optional<UserEntity> userOptional = userRepository.findById(userId);
        if (!userOptional.isPresent()) {
            return new ResponseEntity<>(HttpStatus.BAD_REQUEST);  //유저가 없으면 오류 반환
        }
        UserEntity user = userOptional.get();  //UserEntity 가져오기

        //서비스 호출 및 DTO 빌드
        PostDTO postDTO = new PostDTO();
        postDTO.setPostTitle(postTitle);
        postDTO.setPostContent(postContent);
        if (placeList != null && !placeList.trim().isEmpty()) {
            postDTO.setPlaceList(Arrays.asList(placeList.split(", ")));
        }
        postDTO.setUserNickname(userNickName);
        postDTO.setUserEntity(user);
        postDTO.setPostCreatedAt(LocalDateTime.now().format(DateTimeFormatter.ofPattern("yyyy-MM-dd HH:mm")));
              
        //파일 저장 로직 호출
        if (files != null && !files.isEmpty()) {
        	List<String> imageUrls = postService.saveFiles(files);
            imageUrls = postService.saveFiles(files);
            postDTO.setImageUrls(imageUrls);
        }

        PostDTO createdPost = postService.createPost(postDTO);
        return ResponseEntity.ok(createdPost);
    }
    
    //게시글 수정
    @PutMapping(value = "/posts/postEdit/{id}", consumes = MediaType.MULTIPART_FORM_DATA_VALUE)
    public ResponseEntity<?> updatePost(
            @PathVariable Long id,
            @RequestPart("postTitle") String postTitle,
            @RequestPart("postContent") String postContent,
            @RequestPart("userNickName") String userNickName,
            @RequestPart(value = "placeList", required = false) String placeList,
            @RequestPart(value = "files", required = false) List<MultipartFile> files,
            @RequestPart(value = "existingImageUrls", required = false) String existingImageUrlsJson) {

        //JSON 문자열을 List<String>으로 변환
        ObjectMapper objectMapper = new ObjectMapper();
        List<String> existingImageUrls = new ArrayList<>();
        try {
            if (existingImageUrlsJson != null && !existingImageUrlsJson.isEmpty()) {
                existingImageUrls = objectMapper.readValue(existingImageUrlsJson, new TypeReference<List<String>>() {});
            }
        } catch (JsonProcessingException e) {
            throw new RuntimeException("existingImageUrls JSON 파싱 중 오류 발생", e);
        }
        
        //placeList가 null이거나 비어 있으면 빈 리스트 전달
        List<String> placeListParsed = placeList != null && !placeList.trim().isEmpty()
                ? Arrays.asList(placeList.split(", "))
                : null;
        
        //업데이트 로직 수행
        PostDTO updatedPost = postService.updatePost(
            id,
            postTitle,
            postContent,
            placeListParsed,
            userNickName,
            files,
            existingImageUrls
        );

        return ResponseEntity.ok(updatedPost);
    }

    //게시글 삭제
    @DeleteMapping("/postDelete/{id}")
    public boolean deletePost(@PathVariable Long id) {
        return postService.deletePost(id);
    }
}
```

## Annotation

1. @CrossOrigin
    - CORS(Cross-Origin Resource Sharing) 정책을 설정하는 어노테이션
    - 다른 도메인에서의 HTTP 요청을 허용하게 해주는 보안 메커니즘
    - 이 코드에서는 localhost:3000에서의 API 요청을 허용함
2. @RequestPart
    - Multipart/form-data 요청에서 특정 파트의 데이터를 받을 때 사용하는 어노테이션
    <br>-> Multipart/form-data : HTTP 요청에서 사용되는 특별한 형태의 Content-Type으로 파일 업로드와 일반 데이터를 함께 전송하거나 여러 종류의 데이터를 한 번에 전송할 때 사용됨
    - required 속성을 통해 필수 여부를 지정할 수 있음(예: required = false)
    <br>-> required = false은 선택적인 데이터, required = true는 반드시 필요한 데이터임임

## 코드설명

```JAVA
//서비스 호출 및 DTO 빌드
PostDTO postDTO = new PostDTO();
postDTO.setPostTitle(postTitle);
postDTO.setPostContent(postContent);
if (placeList != null && !placeList.trim().isEmpty()) {
    postDTO.setPlaceList(Arrays.asList(placeList.split(", ")));
}
postDTO.setUserNickname(userNickName);
postDTO.setUserEntity(user);
postDTO.setPostCreatedAt(LocalDateTime.now().format(DateTimeFormatter.ofPattern("yyyy-MM-dd HH:mm")));
```
1. !placeList.trim().isEmpty() : 문자열의 앞뒤 공백을 제거한 후 문자열이 비어있지 않은지 확인함
2. placeList.split(", ")
    - 문자열을 특정 구분자(여기서는 ", ")를 기준으로 나누어 배열로 만듦
    - 예시 : "서울, 부산, 제주" → ["서울", "부산", "제주"]
3. .format(DateTimeFormatter.ofPattern("yyyy-MM-dd HH:mm"))
    - 날짜/시간을 지정된 형식으로 포맷팅한다는 의미임임
    - ofPattern() : "yyyy-MM-dd HH:mm" 패턴으로 날짜를 형식화함 ->예시: "2025-01-01 14:30"
```JAVA
import com.fasterxml.jackson.databind.ObjectMapper;
import com.fasterxml.jackson.core.type.TypeReference;
import com.fasterxml.jackson.core.JsonProcessingException;
```
1. databind.ObjectMapper
    - Jackson 라이브러리의 핵심 클래스로, Java 객체와 JSON 간의 변환을 담당함
    - JSON을 Java 객체로(역직렬화) 또는 Java 객체를 JSON으로(직렬화) 변환할 수 있음
2. type.TypeReference
    - 제네릭 타입 정보를 유지하면서 Jackson이 JSON을 Java 객체로 변환할 때 사용됨
    - 여기서는 JSON 문자열을 List<String\> 타입으로 변환할 때 사용됨
3. JsonProcessingException