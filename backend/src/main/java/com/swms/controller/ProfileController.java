package com.swms.controller;

import com.swms.dto.Dtos;
import com.swms.service.AuthService;
import com.swms.service.ProfileService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.validation.Valid;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.security.Principal;

@RestController
@RequestMapping("/api/profile")
@Tag(name = "Profile")
public class ProfileController {

    @Autowired private ProfileService profileService;
    @Autowired private AuthService authService;

    @GetMapping("/me")
    @Operation(summary = "Get current user profile")
    public ResponseEntity<Dtos.UserProfileResponse> getMyProfile(Principal principal) {
        var user = authService.getCurrentUser(principal.getName());
        return ResponseEntity.ok(profileService.getProfile(user));
    }

    @PutMapping("/me")
    @Operation(summary = "Update current user profile")
    public ResponseEntity<Dtos.UserProfileResponse> updateMyProfile(
            @Valid @RequestBody Dtos.UpdateProfileRequest req,
            Principal principal) {
        var user = authService.getCurrentUser(principal.getName());
        return ResponseEntity.ok(profileService.updateProfile(user, req));
    }

    @PutMapping("/me/avatar")
    @Operation(summary = "Upload profile picture (base64 data URL)")
    public ResponseEntity<Dtos.UserProfileResponse> uploadAvatar(
            @Valid @RequestBody Dtos.AvatarUploadRequest req,
            Principal principal) {
        var user = authService.getCurrentUser(principal.getName());
        return ResponseEntity.ok(profileService.updateAvatar(user, req));
    }

    @DeleteMapping("/me/avatar")
    @Operation(summary = "Remove profile picture")
    public ResponseEntity<Dtos.UserProfileResponse> removeAvatar(Principal principal) {
        var user = authService.getCurrentUser(principal.getName());
        return ResponseEntity.ok(profileService.removeAvatar(user));
    }
}
