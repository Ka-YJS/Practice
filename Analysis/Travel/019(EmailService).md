# EmailService

```JAVA
package com.korea.travel.service;

import java.util.concurrent.ThreadLocalRandom;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.mail.MailSendException;
import org.springframework.mail.javamail.JavaMailSender;
import org.springframework.stereotype.Service;

import com.korea.travel.dto.EmailAuthResponseDto;

import jakarta.mail.MessagingException;
import jakarta.mail.internet.MimeMessage;
import lombok.RequiredArgsConstructor;

@Service
@RequiredArgsConstructor
public class EmailService {

    @Value("${spring.mail.username}")
    private String senderEmail;

    private final JavaMailSender mailSender;
    private final RedisUtil redisUtil;

    public EmailAuthResponseDto sendEmail(String toEmail) {
        if (redisUtil.existData(toEmail)) {
            redisUtil.deleteData(toEmail);
        }

        try {
            MimeMessage emailForm = createEmailForm(toEmail);
            mailSender.send(emailForm);
            return new EmailAuthResponseDto(true, "인증번호가 메일로 전송되었습니다.");
        } catch (MessagingException | MailSendException e) {
            return new EmailAuthResponseDto(false, "메일 전송 중 오류가 발생하였습니다. 다시 시도해주세요.");
        }
    }

    private MimeMessage createEmailForm(String email) throws MessagingException {

        String authCode = String.valueOf(ThreadLocalRandom.current().nextInt(100000, 1000000));

        MimeMessage message = mailSender.createMimeMessage();
        message.setFrom(senderEmail);
        message.setRecipients(MimeMessage.RecipientType.TO, email);
        message.setSubject("인증코드입니다.");
        message.setText(setContext(authCode), "utf-8", "html");

        redisUtil.setDataExpire(email, authCode, 10 * 60L); // 10분

        return message;
    }

    private String setContext(String authCode) {
        String body = "";
        body += "<h4>" + "인증 코드를 입력하세요." + "</h4>";
        body += "<h2>" + "[" + authCode + "]" + "</h2>";
        return body;
    }

    public EmailAuthResponseDto validateAuthCode(String email, String authCode) {
        String findAuthCode = redisUtil.getData(email);
        if (findAuthCode == null) {
            return new EmailAuthResponseDto(false, "인증번호가 만료되었습니다. 다시 시도해주세요.");
        }

        if (findAuthCode.equals(authCode)) {
            return new EmailAuthResponseDto(true, "인증 성공에 성공했습니다.");

        } else {
            return new EmailAuthResponseDto(false, "인증번호가 일치하지 않습니다.");
        }
    }
}
```

## Annotation

\-

## 코드설명

```JAVA
import org.springframework.mail.javamail.JavaMailSender;
import jakarta.mail.internet.MimeMessage;
```
1. JavaMailSender : 스프링 프레임워크에서 제공하는 이메일 발송 인터페이스
2. MimeMessage : 이메일의 MIME(Multipurpose Internet Mail Extensions) 형식을 지원하는 클래스임
```JAVA
String authCode = String.valueOf(ThreadLocalRandom.current().nextInt(100000, 1000000));
```
1. ThreadLocalRandom : 스레드 안전한 난수 생성기
2. nextInt(100000, 1000000)
    - 100000에서 999999 사이의 난수 생성
    - 최소값은 100000 (6자리 시작)이고, 최대값은 999999 (6자리 끝) -> 6자리 랜덤 인증번호 생성
```JAVA
message.setRecipients(MimeMessage.RecipientType.TO, email);
```
1. message.setRecipients : 이메일수신자 설정
2. RecipientType.TO : 주 수신자 지정
3. email : 수신자의 이메일 주소