package com.insurance.system.service;

import com.insurance.system.dto.InsuranceDtos;
import com.insurance.system.model.Notification;
import com.insurance.system.model.User;
import com.insurance.system.repository.NotificationRepository;
import com.insurance.system.repository.UserRepository;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class NotificationService {

    private final NotificationRepository notificationRepository;
    private final UserRepository userRepository;

    public NotificationService(NotificationRepository notificationRepository, UserRepository userRepository) {
        this.notificationRepository = notificationRepository;
        this.userRepository = userRepository;
    }

    public void create(User user, String title, String message) {
        Notification notification = new Notification();
        notification.setUser(user);
        notification.setTitle(title);
        notification.setMessage(message);
        notification.setReadStatus(false);
        notificationRepository.save(notification);
    }

    public List<InsuranceDtos.NotificationResponse> getUserNotificationsByEmail(String email) {
        Long userId = userRepository.findByEmail(email).orElseThrow().getId();
        return notificationRepository.findByUserIdOrderByCreatedAtDesc(userId).stream()
                .map(item -> new InsuranceDtos.NotificationResponse(item.getId(), item.getTitle(), item.getMessage(), item.isReadStatus(), item.getCreatedAt().toString()))
                .toList();
    }
}
