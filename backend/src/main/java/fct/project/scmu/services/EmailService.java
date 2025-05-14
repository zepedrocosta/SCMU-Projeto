package fct.project.scmu.services;

import fct.project.scmu.daos.User;
import lombok.RequiredArgsConstructor;
import lombok.SneakyThrows;
import org.springframework.core.io.ClassPathResource;
import org.springframework.mail.javamail.JavaMailSender;
import org.springframework.mail.javamail.MimeMessageHelper;
import org.springframework.scheduling.annotation.Async;
import org.springframework.stereotype.Service;
import org.springframework.util.FileCopyUtils;

import java.io.BufferedReader;
import java.io.IOException;
import java.io.InputStreamReader;
import java.util.regex.Pattern;

@Service
@Async
@RequiredArgsConstructor
public class EmailService {

    private final JavaMailSender javaMailSender;

    @SneakyThrows
    public void sendHashEmail(User user, String template, String subject) {

        var file = new ClassPathResource("/templates/" + template + ".html");

        try (var reader = new BufferedReader(new InputStreamReader(file.getInputStream()))) {
            var body = FileCopyUtils.copyToString(reader)
                    .replaceAll(Pattern.quote("${username}"), user.getNickname())
                    .replaceAll(Pattern.quote("${verifyHash}"), user.getVerifyHash());

            var mimeMessage = javaMailSender.createMimeMessage();
            var helper = new MimeMessageHelper(mimeMessage, "utf-8");
            helper.setSubject(subject);
            helper.setText(body, true);
            helper.setTo(user.getEmail());

            javaMailSender.send(mimeMessage);
        } catch (IOException e) {
            e.printStackTrace();
        }
    }

    @SneakyThrows
    public void sendNotificationEmail(String nickname, String oldEmail, String newEmail, String template, String subject) {

        var file = new ClassPathResource("/templates/" + template + ".html");

        try (var reader = new BufferedReader(new InputStreamReader(file.getInputStream()))) {
            var body = FileCopyUtils.copyToString(reader)
                    .replaceAll(Pattern.quote("${username}"), nickname)
                    .replaceAll(Pattern.quote("${newEmail}"), newEmail);

            var mimeMessage = javaMailSender.createMimeMessage();
            var helper = new MimeMessageHelper(mimeMessage, "utf-8");
            helper.setSubject(subject);
            helper.setText(body, true);
            helper.setTo(oldEmail);

            javaMailSender.send(mimeMessage);
        } catch (IOException e) {
            e.printStackTrace();
        }
    }

}
