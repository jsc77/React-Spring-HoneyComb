package com.example.demo.service;

import java.util.ArrayList;
import java.util.List;

import javax.transaction.Transactional;

import org.springframework.stereotype.Service;

import com.example.demo.dto.MessageDto;
import com.example.demo.model.Member;
import com.example.demo.model.Message;
import com.example.demo.repository.MemberRepository;
import com.example.demo.repository.MessageRepository;

import lombok.RequiredArgsConstructor;

@RequiredArgsConstructor
@Service
public class MessageService {
    private final MessageRepository messageRepository;
    private final MemberRepository memberRepository;

    @Transactional
    public MessageDto write(MessageDto messageDto) {
        System.out.println(messageDto);
        Member receiver = memberRepository.findById(messageDto.getMemberId()).orElseThrow();
        Member sender = memberRepository.findByEmailAndProvider(messageDto.getSenderEmail(),messageDto.getSenderProvider());

        Message message = new Message();
        message.setReceiver(receiver);
        message.setSender(sender);
        message.setBoardId(messageDto.getBoardId());
        message.setTitle(messageDto.getTitle());
        message.setContent(messageDto.getContent());
        message.setDeletedByReceiver(false);
        message.setDeletedBySender(false);
        messageRepository.save(message);

        return MessageDto.toDto(message);
    }


    @Transactional
    public List<MessageDto> receivedMessage(Member member) {
        List<Message> messages = messageRepository.findAllByReceiver(member);
        List<MessageDto> messageDtos = new ArrayList<>();

        for(Message message : messages) {
            if(!message.isDeletedByReceiver()) {
                messageDtos.add(MessageDto.toDto(message));
            }
        }
        return messageDtos;
    }

    @Transactional
    public Object deleteMessageByReceiver(Long id, Member member) {
        Message message = messageRepository.findById(id).orElseThrow(() -> {
            return new IllegalArgumentException("메시지를 찾을 수 없습니다.");
        });

        if(member == message.getReceiver()) {
            message.deleteByReceiver(); 
            if (message.isDeleted()) {
                messageRepository.delete(message);
                return "양쪽 모두 삭제";
            }
            return "한쪽만 삭제";
        } else {
            return new IllegalArgumentException("유저 정보가 일치하지 않습니다.");
        }
    }



    @Transactional
    public List<MessageDto> sentMessage(Member member) {
        List<Message> messages = messageRepository.findAllBySender(member);
        List<MessageDto> messageDtos = new ArrayList<>();

        for(Message message : messages) {
            if(!message.isDeletedBySender()) {
                messageDtos.add(MessageDto.toDto(message));
            }
        }
        return messageDtos;
    }


    @Transactional
    public Object deleteMessageBySender(Long id, Member member) {
        Message message = messageRepository.findById(id).orElseThrow(() -> {
            return new IllegalArgumentException("메시지를 찾을 수 없습니다.");
        });

        if(member == message.getSender()) {
            message.deleteBySender(); 
            if (message.isDeleted()) {
                messageRepository.delete(message);
                return "양쪽 모두 삭제";
            }
            return "한쪽만 삭제";
        } else {
            return new IllegalArgumentException("유저 정보가 일치하지 않습니다.");
        }
    }
}