# PostService

```JAVA
package com.korea.travel.service;

import java.io.IOException;
import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.Paths;
import java.util.ArrayList;
import java.util.Arrays;
import java.util.List;
import java.util.Optional;
import java.util.UUID;
import java.util.stream.Collectors;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

import com.korea.travel.dto.PostDTO;
import com.korea.travel.model.PostEntity;
import com.korea.travel.model.UserEntity;
import com.korea.travel.persistence.LikeRepository;
import com.korea.travel.persistence.PostRepository;
import com.korea.travel.persistence.UserRepository;

import lombok.RequiredArgsConstructor;

@Service
@RequiredArgsConstructor
public class PostService {

    private final PostRepository postRepository;	
    private final UserRepository userRepository;
    private final LikeRepository likeRepository;
	

    @Value("${file.upload-dir}") // 파일 저장 경로 설정
    private String uploadDir;

    // 게시판 전체 조회
    public List<PostDTO> getAllPosts() {
        return postRepository.findAll().stream()
                .map(this::convertToDTO)
                .collect(Collectors.toList());
    }
    
    // 마이 게시판 조회
    public List<PostDTO> getMyPosts(Long userId) {
    	
       Optional<UserEntity> user = userRepository.findById(userId);
       
       if(user.isPresent()) {
    	   List<PostEntity> posts = postRepository.findByUserEntity(user.get());
       
	       return posts.stream()
	             .map(this::convertToDTO)
	             .collect(Collectors.toList());
        }
       else {
          throw new IllegalArgumentException("User not found");
       }
    }
    
    // 게시글 한 건 조회
    public PostDTO getPostById(Long id) {
        Optional<PostEntity> board = postRepository.findById(id);
        if(board.isPresent()) {
        	return board.map(this::convertToDTO)
                    .orElseThrow(() -> new RuntimeException("게시글을 찾을 수 없습니다."));
        }else {
        	throw new RuntimeException("게시글을 찾을 수 없습니다.");
		}
    }
    
    // 게시글 생성
    public PostDTO createPost(PostDTO postDTO) {
        PostEntity savedEntity = postRepository.save(convertToEntity(postDTO));
        return convertToDTO(savedEntity);
    }

    public List<String> saveFiles(List<MultipartFile> files) {
        List<String> fileUrls = new ArrayList<>();
        for (MultipartFile file : files) {
            try {
                String fileName = UUID.randomUUID() + "_" + file.getOriginalFilename();
                Path filePath = Paths.get("uploads/" + fileName);
                Files.write(filePath, file.getBytes());
                fileUrls.add("/uploads/" + fileName); // 파일 접근 URL
            } catch (IOException e) {
                throw new RuntimeException("파일 저장 중 오류 발생", e);
            }
        }
        return fileUrls;
    }
    
    //게시글 수정
    public PostDTO updatePost(Long id, String postTitle, String postContent, List<String> placeListParsed, 
    		String userNickName,List<MultipartFile> files, List<String> existingImageUrls) {
		
    	
    	PostEntity postEntity = postRepository.findById(id)
		.orElseThrow(() -> new RuntimeException("게시글을 찾을 수 없습니다."));
		
		postEntity.setPostTitle(postTitle);
		postEntity.setPostContent(postContent);
		postEntity.setUserNickname(userNickName);
		
		
		if(placeListParsed != null && !placeListParsed.isEmpty()) {
			postEntity.setPlaceList(new ArrayList<>(placeListParsed));
        }else {
        	postEntity.setPlaceList(null);
        }
		
		List<String> allImageUrls = new ArrayList<>(existingImageUrls);
		
		if (files != null && !files.isEmpty()) {
			List<String> newImageUrls = saveFiles(files);
			allImageUrls.addAll(newImageUrls);
		}
		
		postEntity.setImageUrls(allImageUrls);
		
		PostEntity updatedEntity = postRepository.save(postEntity);
		return convertToDTO(updatedEntity);
	}    
    
    
    // 게시글 삭제
    public boolean deletePost(Long id) {
        if (postRepository.existsById(id)) {
            postRepository.deleteById(id);
            return true;
        }
        return false;
    }
    
    private PostDTO convertToDTO(PostEntity entity) {
        return PostDTO.builder()
                .postId(entity.getPostId())
                .userId(entity.getUserEntity().getId())
                .postTitle(entity.getPostTitle())
                .postContent(entity.getPostContent())
                .userNickname(entity.getUserNickname())
                .placeList(entity.getPlaceList())
                .imageUrls(entity.getImageUrls())
                .likes(likeRepository.countByPostEntity(entity))
                .postCreatedAt(entity.getPostCreatedAt())
                .build();
    }

    private PostEntity convertToEntity(PostDTO dto) {
        return PostEntity.builder()
                .postTitle(dto.getPostTitle())
                .postContent(dto.getPostContent())
                .userNickname(dto.getUserNickname())
                .placeList(dto.getPlaceList())
                .imageUrls(dto.getImageUrls())
                .postCreatedAt(dto.getPostCreatedAt())
                .userEntity(dto.getUserEntity())
                .build();
    }
}
```

## Annotation

1. @Value
    - Spring Framework에서 외부 설정값(properties 또는 yml 파일의 값)을 Java 코드에 주입할 때 사용됨
    - 예를들어, @Value("${file.upload-dir}")라고 쓰이면 application.properties나 application.yml 파일에서 file.upload-dir이라는 키에 해당하는 값을 찾아서 uploadDir 변수에 자동으로 주입함
    - 환경별로 다른 설정값을 쉽게 적용 가능하고, 코드 변경 없이 설정값만 변경 가능하며, 설정값을 한 곳에서 관리 가능하다는 장점이 있음

## 코드설명

```JAVA
// 게시판 전체 조회
public List<PostDTO> getAllPosts() {
    return postRepository.findAll().stream()
            .map(this::convertToDTO)
            .collect(Collectors.toList());
}
```
1. .map(this::convertToDTO)
    - 스트림의 각 요소(PostEntity)를 PostDTO로 변환함
    - this::convertToDTO는 메서드 레퍼런스로, 현재 클래스의 convertToDTO 메서드를 각 요소에 적용함
    - :: : Java 8에서 도입된 메서드 레퍼런스(Method Reference) 연산자로, 메서드 레퍼런스는 이미 정의된 메서드를 람다식으로 간편하게 표현하는 방법임
    ```JAVA
    //일반적인 람다식 표현
    .map(entity -> convertToDTO(entity))

    //메서드 레퍼런스를 사용한 표현
    .map(this::convertToDTO)
    ```
2. .collect(Collectors.toList())
    - 스트림의 결과를 List 형태로 수집함
    - 스트림 처리 결과를 실제 List 객체로 만들어줌

```JAVA
// 게시글 한 건 조회
public PostDTO getPostById(Long id) {
    Optional<PostEntity> board = postRepository.findById(id);
    if(board.isPresent()) {
        return board.map(this::convertToDTO)
                .orElseThrow(() -> new RuntimeException("게시글을 찾을 수 없습니다."));
    }else {
        throw new RuntimeException("게시글을 찾을 수 없습니다.");
    }
}
```
1. .orElseThrow(() -> new RuntimeException("게시글을 찾을 수 없습니다."))
    - .orElseThrow() : Optional 객체가 비어있을 때(값이 없을 때) 예외를 던지는 메서드임
    - Optional이 비어있다면 RuntimeException을 발생
    - () -> new RuntimeException(...) : 예외를 생성하는 람다식
2. board.map(this::convertToDTO)
    - board는 Optional<PostEntity\>타입임
    <br>->Optional<PostEntity\>를 Optional<PostDTO\>로 변환
    - Optional.map()은 Optional 내부 값을 다른 값으로 변환하는 메서드임
    - this::convertToDTO는 메서드 레퍼런스로, convertToDTO 메서드를 지칭함
    - 실행과정
        1. Optional 내부의 PostEntity를 convertToDTO 메서드에 전달
        2. PostEntity가 DTO로 변환됨
        3. 변환된 DTO를 새로운 Optional로 감싸서 반환함
```JAVA
if(placeListParsed != null && !placeListParsed.isEmpty()) {
    postEntity.setPlaceList(new ArrayList<>(placeListParsed));
}else {
    postEntity.setPlaceList(null);
}

List<String> allImageUrls = new ArrayList<>(existingImageUrls);
```
1. new ArrayList<>(placeListParsed)
    - 기존 컬렉션을 이용해 새로운 ArrayList를 생성하는 복사 생성자(copy constructor) 구문임
    - 원본 컬렉션의 모든 요소가 새 ArrayList로 복사되고, 원본과 새 리스트는 서로 독립적임(한쪽 변경이 다른쪽에 영향 없음)
    - 아래코드와 같다고 볼 수 있음음
    ```JAVA
    ArrayList<String> newList = new ArrayList<>();
    newList.addAll(placeListParsed);
    ```
