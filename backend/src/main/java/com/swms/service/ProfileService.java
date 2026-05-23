package com.swms.service;

import com.swms.dto.Dtos;
import com.swms.exception.BadRequestException;
import com.swms.model.User;
import com.swms.repository.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
public class ProfileService {

    private static final int MAX_AVATAR_CHARS = 2_000_000;

    @Autowired private UserRepository userRepo;

    @Transactional(readOnly = true)
    public Dtos.UserProfileResponse getProfile(User user) {
        return toProfile(user);
    }

    @Transactional
    public Dtos.UserProfileResponse updateProfile(User currentUser, Dtos.UpdateProfileRequest req) {
        currentUser.setName(req.getName().trim());
        currentUser.setPhone(trimOrNull(req.getPhone()));
        currentUser.setBio(trimOrNull(req.getBio()));
        currentUser.setWebsite(trimOrNull(req.getWebsite()));
        currentUser.setLinkedinUrl(trimOrNull(req.getLinkedinUrl()));
        currentUser.setGithubUrl(trimOrNull(req.getGithubUrl()));
        return toProfile(userRepo.save(currentUser));
    }

    @Transactional
    public Dtos.UserProfileResponse updateAvatar(User currentUser, Dtos.AvatarUploadRequest req) {
        String data = req.getImageData().trim();
        if (!data.startsWith("data:image/")) {
            throw new BadRequestException("Invalid image format. Upload a JPEG, PNG, or WebP file.");
        }
        if (data.length() > MAX_AVATAR_CHARS) {
            throw new BadRequestException("Image is too large. Please use a file under 2MB.");
        }
        currentUser.setProfileImageUrl(data);
        return toProfile(userRepo.save(currentUser));
    }

    @Transactional
    public Dtos.UserProfileResponse removeAvatar(User currentUser) {
        currentUser.setProfileImageUrl(null);
        return toProfile(userRepo.save(currentUser));
    }

    public Dtos.UserProfileResponse toProfile(User user) {
        var dto = new Dtos.UserProfileResponse();
        dto.setId(user.getId());
        dto.setName(user.getName());
        dto.setEmail(user.getEmail());
        dto.setRole(user.getRole().name());
        dto.setPhone(user.getPhone());
        dto.setBio(user.getBio());
        dto.setProfileImageUrl(user.getProfileImageUrl());
        dto.setWebsite(user.getWebsite());
        dto.setLinkedinUrl(user.getLinkedinUrl());
        dto.setGithubUrl(user.getGithubUrl());
        dto.setCreatedAt(user.getCreatedAt());
        return dto;
    }

    private String trimOrNull(String value) {
        if (value == null) return null;
        String trimmed = value.trim();
        return trimmed.isEmpty() ? null : trimmed;
    }
}
