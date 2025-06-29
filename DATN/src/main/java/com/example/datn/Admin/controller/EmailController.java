package com.example.datn.Admin.controller;

import com.example.datn.Library.service.impl.EmailService;
import lombok.AccessLevel;
import lombok.RequiredArgsConstructor;
import lombok.experimental.FieldDefaults;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/email")
@FieldDefaults(level = AccessLevel.PRIVATE, makeFinal = true)
@RequiredArgsConstructor
public class EmailController {
     EmailService emailService;
    @RequestMapping("/send")
    public void sendEmail() {
        emailService.sendEmailToEmp(null, null);
    }
}
