# Common.js

```JS
export const validateEmail = email => {
    const regex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return regex.test(email);
};

export const validatePassword = password => {
    const regex = /^(?=.*[!@#$%^&*(),.?":{}|<>]).{8,}$/;
    return regex.test(password)
}

export const removeWhitespace = text => {
    const regex = /\s/g;//문자열 전체에서 공백을 찾는다.
    return text.replace(regex, '');
};
```

# 코드설명

```JS
const regex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
```
1. ^ : 문자열의 시작
2. [^\s@]+ : 공백과 @ 문자를 제외한 1개 이상의 문자
3. @ : @ 문자 하나
4. [^\s@]+ : 다시 공백과 @ 문자를 제외한 1개 이상의 문자
5. \. : 점(.) 문자 하나
6. [^\s@]+ : 마지막으로 공백과 @ 문자를 제외한 1개 이상의 문자
7. $ : 문자열의 끝
8. 예시: user@example.com -> 유효, user @example.com -> 무효
```JS
const regex = /^(?=.*[!@#$%^&*(),.?":{}|<>]).{8,}$/;
```
1. (?=.*[!@#$%^&*(),.?":{}|<>]) : 최소한 하나의 특수문자를 포함해야 함
2. .{8,} : 모든 문자를 포함하여 최소 8자 이상
3. 예시: password123! -> 유효, password123 -> 무효
```JS
const regex = /\s/g;
```
1. \s : 모든 공백 문자(스페이스, 탭, 줄바꿈 등)와 매치
2. g : global flag로, 문자열 전체에서 모든 공백을 찾음
3. 예시
```JS
removeWhitespace("Hello World  ")// -> "HelloWorld"
removeWhitespace("안녕 하세요")// -> "안녕하세요"
```