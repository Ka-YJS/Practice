# UserController

```JAVA
package com.korea.travel.controller;

import java.util.Collections;
import java.util.Map;

import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.PatchMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.multipart.MultipartFile;

import com.korea.travel.dto.ResponseDTO;
import com.korea.travel.dto.UserDTO;
import com.korea.travel.service.UserService;

import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;

@Slf4j
@RestController
@RequestMapping("/travel")
@RequiredArgsConstructor
public class UserController {

	private final UserService service;
	
	
    //회원가입
    @PostMapping("/signup")
    public boolean signup(@RequestBody UserDTO dto) {
    	//저장 성공시 true
    	if(service.signup(dto)) {
    		return true;
    	}else {
    		return false;
    	}
    }
    
    //userId가 있는지 중복체크
    @PostMapping("/userIdCheck")
    public boolean userIdCheck (@RequestBody UserDTO dto) {
    	System.out.println(dto.getUserId());
    	//중복 userId가 없으면 true
    	if(service.getUserIds(dto)) {
    		return true;
    	}else {
    		return false;
    	}
    }
    
    //로그인
    @PostMapping("/login")
    public ResponseEntity<?> authenticate(@RequestBody UserDTO dto) {
    	
        UserDTO userDTO = service.getByCredentials(dto);
                
        if(userDTO != null) {
        	return ResponseEntity.ok().body(userDTO);
        }else {
        	ResponseDTO responseDTO = ResponseDTO.builder()
        			.error("로그인 실패")
        			.build();
        	return ResponseEntity.badRequest().body(responseDTO);
        }
    }
    
    //구글로그인
    @PostMapping("/oauth2/google/callback")
    public ResponseEntity<?> handleGoogleCallback(@RequestBody Map<String, String> payload) {
        try {
            String credential = payload.get("credential");
            System.out.println("aaa0"+credential);
            if (credential == null || credential.isEmpty()) {
                return ResponseEntity.badRequest().body(Collections.singletonMap("error", "Credential is missing or empty"));
            }

            // Google 정보 검증 및 UserDTO 생성
            UserDTO userDTO = service.verifyAndGetUserInfo(credential);

            return ResponseEntity.ok(userDTO);

        } catch (Exception e) {
            log.error("Unexpected error: ", e);
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                                 .body(Collections.singletonMap("error", e.getMessage()));
        }
    }
    
    //Id찾기
    @PostMapping("/userFindId")
    public ResponseEntity<?> userFindId(@RequestBody UserDTO dto){
    	
       UserDTO user = service.userFindId(dto);
       
       if(user != null) {
          return ResponseEntity.ok().body(user);
       }else {
           ResponseDTO responseDTO = ResponseDTO.builder()
                 .error("ID를 찾을수없습니다.")
                 .build();
           return ResponseEntity.badRequest().body(responseDTO);
        }
    }
    
    // 비밀번호 찾기 (사용자 정보 확인)
    @PostMapping("/userFindPassword")
    public ResponseEntity<?> findPassword(@RequestBody UserDTO dto) {
    	System.out.println(dto);
        UserDTO foundUser = service.userFindPassword(dto);
        
        if (foundUser != null) {
            return ResponseEntity.ok().body(foundUser);
        } else {
            ResponseDTO responseDTO = ResponseDTO.builder()
                    .error("일치하는 사용자를 찾을 수 없습니다.")
                    .build();
            return ResponseEntity.badRequest().body(responseDTO);
        }
    }

    //비밀번호 초기화
    @PostMapping("/userResetPassword")
    public ResponseEntity<?> resetPassword(@RequestBody UserDTO dto) {
        boolean isReset = service.userResetPassword(dto);
        
        if (isReset) {
            return ResponseEntity.ok().body(true);
        } else {
            ResponseDTO responseDTO = ResponseDTO.builder()
                    .error("비밀번호 재설정에 실패했습니다.")
                    .build();
            return ResponseEntity.badRequest().body(responseDTO);
        }
    }
    
    //userPassword 수정하기
    @PatchMapping("/userPasswordEdit/{id}")
    
    public boolean userPasswordEdit(@PathVariable Long id,@RequestBody UserDTO dto){
    	
        System.out.println("User ID: " + id);
        System.out.println("dto : " + dto);
        
        //변경완료 true
    	if(service.userPasswordEdit(id,dto)) {
    		return true;
    	}else {
    		return false;
    	}
    }
    
    //userNickName 수정하기
    @PatchMapping("/userNickNameEdit/{id}")
    public ResponseEntity<?> userNickNameEdit(@PathVariable Long id,@RequestBody UserDTO dto){
    	
    	UserDTO userDTO = service.userNickNameEdit(id,dto);
    	
    	if(userDTO != null) {
        	return ResponseEntity.ok().body(userDTO);
        }else {
        	ResponseDTO responseDTO = ResponseDTO.builder()
        			.error("닉네임 변경 실패")
        			.build();
        	return ResponseEntity.badRequest().body(responseDTO);
        }
    } 
    
    //프로필사진 수정
    @PatchMapping("/userProfileImageEdit/{id}")
    public ResponseEntity<?> userProfileImageEdit(@PathVariable Long id, @RequestParam("file") MultipartFile file) {
    	
    	System.out.println("file: " +file);
        try {
            // 서비스 호출하여 프로필 사진을 수정하고 결과를 반환
            UserDTO updatedUserDTO = service.userProfileImageEdit(id, file);
            System.out.println("updateDTO : " +updatedUserDTO);
            return ResponseEntity.ok().body(updatedUserDTO);  // 성공적으로 수정된 UserDTO 반환

        } catch (RuntimeException e) {
            // 예외 처리: 사용자 정보가 없거나, 파일 업로드 중 에러가 발생한 경우
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                                 .body("Error occurred during profile update: " + e.getMessage());
        }      
    }   

    //프로필사진 삭제
    @PatchMapping("/userProfileImageDelete/{id}")
    public boolean userProfileImageDelete(@PathVariable Long id) {
    	
    	//정상 삭제되었으면 true
    	if(service.userProfileImageDelete(id)) {
        	return true;
        }else {
        	return false;
        }    	
    }
    
    //로그아웃
    @PostMapping("/logout/{id}")
    public boolean logout(@PathVariable Long id) {
    	
    	if(service.logout(id)) {
    		return true;
    	}else {
    		return false;
    	}
    }    

    //회원탈퇴
    @DeleteMapping("/withdraw/{id}")
    public boolean userWithdrawal(@PathVariable Long id,@RequestBody UserDTO dto){
    	//유저정보 삭제완료되었으면 true
    	if(service.userWithdrawal(id,dto)) {
    		return true;
    	}else {
    		return false;
    	}
    }
}


```
# Controller란?

- 클라이언트의 요청을 받아 처리하고 응답을 돌려주는 엔드포인트 역할을 함
- 모든 클라이언트 요청을 컨트롤러에서 일관되게 처리할 수 있음
- 데이터 바인딩, 유효성 검사 등의 기능을 손쉽게 구현할 수 있으며, 다양한 어노테이션으로 쉽게 요청처리할 수 있음

## Annotation

1. @RestController
    - @Controller + @ResponseBody를 결합한 어노테이션
    - 모든 메서드의 반환값을 HTTP Response Body에 직접 쓰여지게 하며, 주로 RESTful 웹 서비스를 개발할 때 사용됨
    - JSON/XML 형태의 데이터를 반환하는 API 개발에 적합함
2. @RequestMapping("/travel")
    - 특정 URL 패턴의 요청을 처리하는 핸들러를 매핑함
    - 클래스 레벨에서 사용하면 해당 클래스의 모든 핸들러 메서드의 기본 URL 경로가 됨
    - HTTP 메서드를 지정하지 않으면 모든 HTTP 메서드(GET, POST, PUT 등)에 응답함
3. @RequiredArgsConstructor
    - Lombok에서 제공하는 어노테이션으로 final 필드나 @NonNull이 붙은 필드에 대한 생성자를 자동으로 생성함
    - 의존성 주입(DI)을 위한 생성자를 자동으로 만들어줌
4. @PatchMapping
    - @RequestMapping(method = RequestMethod.PATCH)의 축약형
    - HTTP PATCH 요청을 처리하는 핸들러 메서드를 지정함
    - 리소스의 부분 업데이트를 수행할 때 사용됨

## 코드설명

```JAVA
//구글로그인
@PostMapping("/oauth2/google/callback")
public ResponseEntity<?> handleGoogleCallback(@RequestBody Map<String, String> payload) {
    try {
        String credential = payload.get("credential");
        System.out.println("aaa0"+credential);
        if (credential == null || credential.isEmpty()) {
            return ResponseEntity.badRequest().body(Collections.singletonMap("error", "Credential is missing or empty"));
        }

        // Google 정보 검증 및 UserDTO 생성
        UserDTO userDTO = service.verifyAndGetUserInfo(credential);

        return ResponseEntity.ok(userDTO);
    } catch (Exception e) {
        log.error("Unexpected error: ", e);
        return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                                .body(Collections.singletonMap("error", e.getMessage()));
    }
}
```

1. ResponseEntity<?> : 
2. @RequestBody Map<String, String> payload
3. .body(Collections.singletonMap())
4. .status(HttpStatus.INTERNAL_SERVER_ERROR)

```JAVA
//프로필사진 수정
@PatchMapping("/userProfileImageEdit/{id}")
public ResponseEntity<?> userProfileImageEdit(@PathVariable Long id, @RequestParam("file") MultipartFile file) {
    
    System.out.println("file: " +file);
    try {
        // 서비스 호출하여 프로필 사진을 수정하고 결과를 반환
        UserDTO updatedUserDTO = service.userProfileImageEdit(id, file);
        System.out.println("updateDTO : " +updatedUserDTO);
        return ResponseEntity.ok().body(updatedUserDTO);  // 성공적으로 수정된 UserDTO 반환

    } catch (RuntimeException e) {
        // 예외 처리: 사용자 정보가 없거나, 파일 업로드 중 에러가 발생한 경우
        return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                                .body("Error occurred during profile update: " + e.getMessage());
    }
}
```

1. @PathVariable Long id, @RequestParam("file") MultipartFile file
