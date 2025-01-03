# UserService

```JAVA
package com.korea.travel.service;

import java.io.File;
import java.time.LocalDateTime;
import java.time.format.DateTimeFormatter;
import java.util.Map;
import java.util.Optional;

import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.client.RestTemplate;
import org.springframework.web.multipart.MultipartFile;

import com.korea.travel.dto.UserDTO;
import com.korea.travel.model.UserEntity;
import com.korea.travel.persistence.UserRepository;
import com.korea.travel.security.TokenProvider;

import io.jsonwebtoken.io.IOException;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;

@Service
@Slf4j
@RequiredArgsConstructor
public class UserService {
	
	private final UserRepository repository;	
	private final PasswordEncoder passwordEncoder;
	private final TokenProvider tokenProvider;
	
	//userId가 있는지 중복체크
	public boolean getUserIds(UserDTO dto) {
		
		//중복 userId가 없으면 true
		if(!repository.existsByUserId(dto.getUserId())) {
			return true;
		}else{
			return false;
		}		
	}	
	
	//회원가입
	public boolean signup(UserDTO dto) {
		
		UserEntity user = UserEntity.builder()
				.userId(dto.getUserId())
				.userName(dto.getUserName())
				.userNickName(dto.getUserNickName())
				.userPhoneNumber(dto.getUserPhoneNumber())
				.userPassword(passwordEncoder.encode(dto.getUserPassword()))
				.userCreatedAt(LocalDateTime.now().format(DateTimeFormatter.ofPattern("yyyy-MM-dd HH:mm")))
				.build();
		//user저장완료시 true;
		if(user != null) {
			repository.save(user);
			return true;
		}else {
			return false;
		}				
	}
	
	//Id찾기
	public UserDTO userFindId(UserDTO dto) {
      
		UserEntity user = repository.findByUserNameAndUserPhoneNumber(dto.getUserName(),dto.getUserPhoneNumber());
		if(user != null) {
			return UserDTO.builder()
               .userId(user.getUserId())
               .build();
		}else {
			throw new IllegalStateException("User not found");
		}
	}
   
	// 비밀번호 찾기 (사용자 정보 확인)
    public UserDTO userFindPassword(UserDTO dto) {
        // 아이디, 이름, 전화번호로 사용자 조회
        UserEntity user = repository.findByUserIdAndUserNameAndUserPhoneNumber(
            dto.getUserId(), 
            dto.getUserName(), 
            dto.getUserPhoneNumber()
        );       
        if (user != null) {
            return UserDTO.builder()
                .userId(user.getUserId())
                .userName(user.getUserName())
                .build();
        }else {
        	return null;
        }        
    }

    // 비밀번호 초기화
    @Transactional
    public boolean userResetPassword(UserDTO dto) {
        // 아이디로 사용자 조회
        UserEntity user = repository.findByUserId(dto.getUserId());
        
        if (user != null) {
            // 새 비밀번호 암호화하여 저장
            user.setUserPassword(passwordEncoder.encode(dto.getUserPassword()));
            repository.save(user);
            return true;
        }
        
        return false;
    }	
	
	//로그인(로그인할때 토큰생성)
	public UserDTO getByCredentials(UserDTO dto) {
		
		UserEntity user = repository.findByUserId(dto.getUserId());		
		
		//user가 존재하면 /DB에 저장된 암호화된 비밀번호와 사용자에게 입력받아 전달된 암호화된 비밀번호를 비교
		if(user != null && passwordEncoder.matches(dto.getUserPassword(),user.getUserPassword())) {
			//토큰생성(180분설정해둠)
			final String token = tokenProvider.create(user);
						
			return UserDTO.builder()
				.id(user.getId())
				.userId(user.getUserId())
				.userName(user.getUserName())
				.userNickName(user.getUserNickName())
				.userPassword(user.getUserPassword())
				.userProfileImage(user.getUserProfileImage())
				.token(token)
				.build();
		}else {
			return null;
		}		
	}	
	
	//구글 로그인정보가져오기
	public UserDTO verifyAndGetUserInfo(String credential) throws Exception {
	    String tokenInfoUrl = "https://oauth2.googleapis.com/tokeninfo?id_token=" + credential;
	    System.out.println("ssssssssssss"+tokenInfoUrl);
	    RestTemplate restTemplate = new RestTemplate();
	    ResponseEntity<Map> response = restTemplate.getForEntity(tokenInfoUrl, Map.class);
	    System.out.println(response);
	    if (response.getStatusCode() != HttpStatus.OK) {
	        throw new Exception("Invalid ID token");
	    }
	    System.out.println("ssssssssssss"+response.getBody());
	    Map<String, Object> tokenInfo = response.getBody();
	    String email = (String) tokenInfo.get("email");
	    String name = (String) tokenInfo.get("name");

	    // Google 정보를 UserDTO에 매핑
	    UserDTO userDTO = UserDTO.builder()
	        .userId(email)                // 이메일을 UserId로 설정
	        .userName(name)               // 이름 설정
	        .build();
	    return userDTO;
	}	
	
	//userPassword 수정하기
	public boolean userPasswordEdit (Long id,UserDTO dto) {
		
		Optional <UserEntity> user = repository.findById(id);
		
		if(user.isPresent()) {	
			//기존 비밀번호맞으면 true
			if(passwordEncoder.matches(dto.getUserPassword(),user.get().getUserPassword())) {				
				//기존 비밀번호랑 변경하려는 비밀번호가 다르면 true
				if(!passwordEncoder.matches(dto.getNewPassword(),user.get().getUserPassword())) {
					UserEntity entity = user.get();
					entity.setUserPassword(passwordEncoder.encode(dto.getNewPassword()));
					repository.save(entity);
					return true;
					
				}else {
					//변경하려는 비밀번호가 기존 비밀번호랑 똑같으면 false
					System.out.println("변경하려는 비밀번호가 기존 비밀번호랑 똑같다");
					return false;
				}
				
			}else {
				//user 비밀번호랑 받아온 비밀번호랑 다르면 false
				System.out.println("비밀번호 틀림");
				return false;
			}			
		} else {
			//user 존재하지않으면 false
			return false;
		}		
	}		
	
	//userNickName 수정하기
    public UserDTO userNickNameEdit(Long id,UserDTO dto) {
    	
    	Optional <UserEntity> user = repository.findById(id);
    	
    	//유저 확인
    	if(user.isPresent() && user.get().getUserNickName() != dto.getUserNickName()) {    		
    		UserEntity entity = user.get();    		
			//변경된 userNickName 저장
			entity.setUserNickName(dto.getUserNickName());
    		repository.save(entity);
    		//변경된 userNickName 반환
    		return UserDTO.builder()
    				.userNickName(entity.getUserNickName())
    				.build();
		} else {
			System.out.println("유저가 존재하지않거나 닉네임이 같다");
			return null;
		}    	   	
    }
       
    //프로필사진 수정
    public UserDTO userProfileImageEdit(Long id, MultipartFile file) {
    	
        try {
            //ID로 사용자 정보 확인 (UserEntity 찾기)
            UserEntity userEntity = repository.findById(id)
                    .orElseThrow(() -> new IllegalArgumentException("User not found"));
            
            //기존 프로필 사진 삭제 처리
            String existingUserProfileImage = userEntity.getUserProfileImage();
            //기존 프로필 파일이 없거나 null이면 true
            if (existingUserProfileImage != null && !existingUserProfileImage.isEmpty()) {
            	//저장된 file 경로로 수정
                String existingFilePath = System.getProperty("user.dir")+existingUserProfileImage;
                File existingFile = new File(existingFilePath);	//객체 생성
                if (existingFile.exists()) {	//해당 파일이있으면 true
                    if (existingFile.delete()) {
                        System.out.println("기존 프로필이미지가 삭제되었습니다: " + existingFilePath);
                    } else {
                        System.err.println("기존 프로필이미지 삭제 실패: " + existingFilePath);
                    }
                }
            }
            
            //파일경로 지정
            String uploadDir = System.getProperty("user.dir") + "/uploads/profilePictures/";
            String fileName = file.getOriginalFilename().replaceAll("[\\s\\(\\)]", "_");
            //filePath - file 저장할 경로
            String filePath = uploadDir + id + "_" + fileName;
            
            File dest = new File(filePath);			//파일객체 생성
            File parentDir = dest.getParentFile();	//부모 디렉토리 경로 추출
            if (!parentDir.exists()) {	//부모 디렉토리가 없으면 true
            	parentDir.mkdirs();		// 디렉토리 생성
            }
            
            
            try {
                file.transferTo(dest);	//파일 저장
                System.out.println("파일저장완료");
            } catch (IOException e) {
                System.err.println("파일 저장 실패: " + e.getMessage());
                e.printStackTrace();  // 스택 트레이스 출력
                throw new RuntimeException("파일 저장 중 오류가 발생했습니다.", e);
            }
            
            //filePath는 파일저장 경로지 불러올때는 fileUrl로 불러와야한다.
            //fileUrl - file불러올 경로 db에 저장
            String fileUrl = "/uploads/profilePictures/" + id + "_" + fileName;
            
            //UserEntity에 프로필 사진 경로 업데이트
            userEntity.setUserProfileImage(fileUrl);
            repository.save(userEntity);  // UserEntity 업데이트 저장
            
            //업데이트된 UserEntity를 UserDTO로 변환하여 반환
            return UserDTO.builder().
            		userProfileImage(userEntity.getUserProfileImage())
            		.build();
            
			} catch (IOException e) {
				//파일 저장 오류 처리
				throw new RuntimeException("프로필이미지 업로드 중 오류가 발생했습니다.", e);
			} catch (Exception e) {
				//다른 예외 처리
				throw new RuntimeException("프로필이미지 수정 중 오류가 발생했습니다.", e);
			}
    }

    
    //프로필사진 삭제
    public boolean userProfileImageDelete (Long id) {
    	
    	UserEntity userEntity = repository.findById(id)
                .orElseThrow(() -> new IllegalArgumentException("User not found"));
        
        //기존 프로필 사진 삭제 처리
        String existingUserProfileImage = userEntity.getUserProfileImage();
        //기존 프로필 파일이 없거나 null이면 true
        if (existingUserProfileImage != null && !existingUserProfileImage.isEmpty()) {
        	//저장된 file 경로로 수정
        	String existingFilePath = System.getProperty("user.dir")+existingUserProfileImage;
            File existingFile = new File(existingFilePath);	//객체 생성
            if (existingFile.exists()) {	//해당 파일이있으면 true
                if (existingFile.delete()) {
                    System.out.println("기존 프로필이미지가 삭제되었습니다: " + existingFilePath);
                } else {
                    System.err.println("기존 프로필이미지 삭제 실패: " + existingFilePath);
                }
            }
            userEntity.setUserProfileImage(null);
            repository.save(userEntity);
            return true;
        }else {
        	throw new IllegalArgumentException("프로필 사진이 없습니다.");
        }        
    }
    
    
    //로그아웃
    public boolean logout (Long id) {
    	Optional<UserEntity> user = repository.findById(id);
    	
    	if(user.isPresent()) {
    		UserDTO.builder()
	    		.id(null)
				.userId(null)
				.userName(null)
				.userNickName(null)
				.userPassword(null)
				.userProfileImage(null)
				.token(null)
				.build();
    		return true;
    	}else {
    		return false;
    	}    	
    }
    
    
    //회원탈퇴
    public boolean userWithdrawal (Long id, UserDTO dto) {
    	
    	Optional<UserEntity> user = repository.findById(id);
    	//유저존재&&비밀번호 맞으면 유저삭제후 true
    	if(user.isPresent() && passwordEncoder.matches(dto.getUserPassword(),user.get().getUserPassword())) {
			UserEntity entity = user.get();
    		repository.delete(entity);
    		return true;    		
    	}else {
			return false;
		}   	
    }    
}

```

## Service란?

- Controller 와 Repository사이에서 동작하며, 비즈니스규칙을 구현하고, 트랜잭션을 관리함
- 여러 Repository를 조합해서 사용할 수 있음
- Controller에서는 클라이언트의 요청을 처리하고, 실질적인 기능은 Service에서 한다고 볼 수 있음


## Annotation

1. @Service
	- 이 클래스가 비즈니스 로직을 처리하는 Service 계층임을 Spring에게 알려줌
	- Spring의 컴포넌트 스캔 대상이 되어 자동으로 Bean으로 등록됨
2. @Slf4j
	- Lombok의 어노테이션으로, 로깅을 위한 Logger를 자동으로 생성
	- log.info(), log.error() 등의 로깅 메서드를 바로 사용 가능
3. @RequiredArgsConstructor
	- Lombok의 어노테이션으로, final로 선언된 필드들에 대한 생성자를 자동으로 생성
	- 생성자 주입 방식의 의존성 주입을 위해 사용됨
	- final이나 @NonNull이 붙은 필드에 대한 생성자를 자동으로 생성해줌
4. @Transactional : 데이터베이스 트랜잭션의 원자성(Atomicity)을 보장하며, 트랜잭션 관리를 위해 매우 중요한 어노테이션임
	- 메서드의 전체 작업을 하나의 트랜잭션으로 관리
	- 메서드 실행 중 예외 발생 시 자동으로 데이터베이스 변경 내용을 RollBack
	- 데이터의 일관성과 무결성 보장

## 코드설명

```JAVA
private final UserRepository repository;
private final PasswordEncoder passwordEncoder;
private final TokenProvider tokenProvider;
```
1. private final UserRepository repository; : UserRepository를 주입받기 위한 필드
2. private final PasswordEncoder passwordEncoder;
	- 비밀번호 암호화를위한 인코더
	- PasswordEncoder는 Spring Security에서 제공하는 인터페이스임
3. private final TokenProvider tokenProvider;
	- JWT 토큰 생성 및 검증을 위한 제공자임
	- 인증토큰 관련된 작업을 처리함
4. final로 선언되어, 한번 주입되면 변경할 수 없음

```JAVA
	//userId가 있는지 중복체크
	public boolean getUserIds(UserDTO dto) {
		//중복 userId가 없으면 true
		if(!repository.existsByUserId(dto.getUserId())) {
			return true;
		}else{
			return false;
		}
	}
```
1. 이 메서드는 userId의 중복여부를 확인하는 용도라 boolean을 사용함
2. if(!repository.existsByUserId(dto.getUserId()))
	- dto.getUserId() : UserDTO에서 가져온 userId값을 가져옴
	- repository.existsByUserId : UserRepository에서 생성한 existsByUserId를 가져옴
```JAVA
//구글 로그인정보가져오기
public UserDTO verifyAndGetUserInfo(String credential) throws Exception {
    String tokenInfoUrl = "https://oauth2.googleapis.com/tokeninfo?id_token=" + credential;
    System.out.println("ssssssssssss"+tokenInfoUrl);
    RestTemplate restTemplate = new RestTemplate();
    ResponseEntity<Map> response = restTemplate.getForEntity(tokenInfoUrl, Map.class);
    System.out.println(response);
    if (response.getStatusCode() != HttpStatus.OK) {
        throw new Exception("Invalid ID token");
    }
    System.out.println("ssssssssssss"+response.getBody());
    Map<String, Object> tokenInfo = response.getBody();
    String email = (String) tokenInfo.get("email");
    String name = (String) tokenInfo.get("name");

	// Google 정보를 UserDTO에 매핑
	UserDTO userDTO = UserDTO.builder()
	    .userId(email)                // 이메일을 UserId로 설정
	    .userName(name)               // 이름 설정
	    .build();
	return userDTO;
}
```
1. public UserDTO verifyAndGetUserInfo(String credential) throws Exception
	- 구글 로그인 ID 토큰(credential)을 받아 사용자 정보를 검증하고 가져오는 메서드
	- 예외발생 가능성이 있어 throw Exception을 선언함
2. RestTemplate restTemplate = new RestTemplate();
	- Spring의 HTTP 요청을 간편하게 처리하는 클래스 생성
	- RESTful 웹 서비스와 통신하기 위해 사용
	<br>*RESTful 웹 서비스란? 
	- Representational State Transfer(REST) 아키텍처 원칙을 따르는 웹 서비스를 의미
	- HTTP 메서드(GET, POST, PUT, DELETE 등)를 통해 해당 자원을 처리
3. ResponseEntity<Map> response = restTemplate.getForEntity(tokenInfoUrl, Map.class);
	- 구글 토큰 정보 엔드포인트로 GET 요청 -> 응답은 Map형태로 받음
	- ResponseEntity : HTTP 응답 전체(상태 코드, 헤더, 본문 등)를 포함함
4. String ?? = (String) tokenInfo.get("??"); : 토큰정보에서 사용자이름 추출

```JAVA
try {
	...
    } catch (IOException e) {
	//파일 저장 오류 처리
	throw new RuntimeException("프로필이미지 업로드 중 오류가 발생했습니다.", e);
	} catch (Exception e) {
	//다른 예외 처리
	throw new RuntimeException("프로필이미지 수정 중 오류가 발생했습니다.", e);
	}
```
1. Exception
	- 모든 예외의 부모 클래스로 컴파일 시점에 확인 가능한 예외
	- 반드시 예외 처리가 필요 (try-catch 또는 throws)
	- 프로그램의 복구가 가능한 예외
2. IOException
	- Exception의 자식 클래스로 주로 입출력(I/O) 작업 중 발생하는 예외를 보여줌
	- 파일, 네트워크, 데이터베이스 등 외부 리소스 관련 예외

```JAVA
UserEntity userEntity = repository.findById(id)
    .orElseThrow(() -> new IllegalArgumentException("User not found"));
```
1. orElseThrow() : Optional 클래스의 메서드로, 값이 존재하지 않을 때 지정된 예외를 던지는 메서드
2. IllegalArgumentException
	- 메서드의 입력 값이 논리적으로 맞지 않을 때 사용하는 중요한 예외 처리 메커니즘
	- 메서드에 잘못된 인자(argument)가 전달될 때 발생하는 런타임 예외
	- 런타임 예외(Unchecked Exception)로 컴파일 시점에 확인되지 않음
	- 명확하고 구체적인 오류 메시지 제공하며, 유효성 검사를 통해 메서드의 안정성을 확보함
```JAVA
Optional<UserEntity> user = repository.findById(id);
Optional<UserEntity> user = repository.findById(id);
```
1. Optional
	- 코드가 보다 안전하고 명시적으로 null을 다룰 수 있도록 하기 위함
	- Null Pointer Exception(NPE) 방지 : Optional을 사용하면 null인지 확인하기 위해 직접 null 체크를 하지 않아도 됨
	- 가독성 증가 : Optional은 null 확인 로직을 명시적으로 작성할 수 있어 가독성이 향상됨 -> null대신 Optional 메서드 (isPresent, orElse, orElseThrow 등)를 활용하여 처리할 수 있음
	- 의도 명시 : 메서드가 null을 반환할 수도 있음을 암묵적으로 표현하는 대신에 Optional를 사용해서 메서드 호출자에게 명확히 알릴 수 있음음