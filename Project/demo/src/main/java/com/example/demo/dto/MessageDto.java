package com.example.demo.dto;

import java.time.LocalDateTime;

import org.springframework.format.annotation.DateTimeFormat;
import org.springframework.lang.Nullable;

import com.example.demo.model.Message;
import com.fasterxml.jackson.annotation.JsonFormat;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class MessageDto {
    private String title;
    private String content;
    private String senderProvider;
    private String senderName;
    private String senderEmail;
    private Long senderId;
    private Long memberId;
    private Long messageId;
    private Boolean alarmRead;
    private Long boardId;
    @DateTimeFormat(pattern = "yyyy-MM-dd  HH:mm:ss")
    @JsonFormat(shape = JsonFormat.Shape.STRING, pattern = "yyyy-MM-dd  HH:mm:ss", timezone = "Asia/Seoul")
    private LocalDateTime createdDate;

    public static MessageDto toDto(Message message) {
        return new MessageDto(
                message.getTitle(),
                message.getContent(),
                message.getSender().getProvider(),
                message.getSender().getName(),
                message.getSender().getEmail(),
                message.getSender().getId(),
                message.getReceiver().getId(),
                message.getId(),
                message.getAlarmRead(),
                message.getBoardId(),
                message.getCreatedDate()
        );
    }
}