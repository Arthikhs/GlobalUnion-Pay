package com.globalunion.pay.controller;

import com.cloudinary.Cloudinary;
import com.cloudinary.utils.ObjectUtils;
import com.globalunion.pay.repository.AccountRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.util.Map;

@RestController
@RequestMapping("/api/upload")
public class UploadController {

    @Autowired Cloudinary cloudinary;
    @Autowired AccountRepository accountRepo;

    @PostMapping("/profile/{accountId}")
    public ResponseEntity<?> uploadProfile(
            @PathVariable Long accountId,
            @RequestParam("file") MultipartFile file) {
        return accountRepo.findById(accountId).map(account -> {
            try {
                Map<?, ?> result = cloudinary.uploader().upload(
                    file.getBytes(),
                    ObjectUtils.asMap("folder", "globalunion/profiles")
                );
                String url = result.get("secure_url").toString();
                account.setProfilePicture(url);
                accountRepo.save(account);
                return ResponseEntity.ok(Map.of("url", url));
            } catch (Exception e) {
                return ResponseEntity.internalServerError()
                    .body(Map.of("error", "Upload failed: " + e.getMessage()));
            }
        }).orElse(ResponseEntity.notFound().build());
    }
}
