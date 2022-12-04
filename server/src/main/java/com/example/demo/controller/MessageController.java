package com.example.demo.controller;

import java.util.List;

import org.springframework.http.HttpStatus;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestHeader;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.ResponseStatus;
import org.springframework.web.bind.annotation.RestController;

import com.example.demo.dto.MessageDto;
import com.example.demo.model.Member;
import com.example.demo.model.Message;
import com.example.demo.repository.MessageRepository;
import com.example.demo.service.MessageService;
import com.example.demo.service.TokenService;

import lombok.RequiredArgsConstructor;

@RequiredArgsConstructor
@RestController
@RequestMapping("/messages")
public class MessageController {

    private final MessageService messageService;
    private final TokenService tokenService;
    private final MessageRepository messageRepository;

    @ResponseStatus(HttpStatus.CREATED)
    @PostMapping
    public Response sendMessage(MessageDto messageDto, @RequestHeader(value = "Auth") String token) {
        Member member = tokenService.getMember(token);
        messageDto.setSenderEmail(member.getEmail());
        messageDto.setSenderProvider(member.getProvider());
        return new Response("성공", "메세지를 보냈습니다.", messageService.write(messageDto));
    }

    @ResponseStatus(HttpStatus.OK)
    @GetMapping("/received")
    public Response getReceivedMessage(@RequestHeader(value = "Auth") String token) {
        Member member = tokenService.getMember(token);
        return new Response("성공", "받은 쪽지를 불러왔습니다.", messageService.receivedMessage(member));
    }

    @ResponseStatus(HttpStatus.OK)
    @DeleteMapping("/received/{id}")
    public Response deleteReceivedMessage(@PathVariable("id") Long id, @RequestHeader(value = "Auth") String token) {
        Member member = tokenService.getMember(token);
        return new Response("삭제", "메세지를 삭제했습니다.", messageService.deleteMessageByReceiver(id, member));
    }

    @ResponseStatus(HttpStatus.OK)
    @GetMapping("/sent")
    public Response getSentMessage(@RequestHeader(value = "Auth") String token) {
        Member member = tokenService.getMember(token);
        return new Response("성공", "보낸 쪽지를 불러왔습니다.", messageService.sentMessage(member));
    }

    @ResponseStatus(HttpStatus.OK)
    @DeleteMapping("/sent/{id}")
    public Response deleteSentMessage(@PathVariable("id") Long id, @RequestHeader(value = "Auth") String token) {
        Member member = tokenService.getMember(token);
        return new Response("삭제 성공", "보낸 쪽지를 삭제했습니다.", messageService.deleteMessageBySender(id, member));
    }

    @GetMapping("/read")
    List<Message> readMessage(@RequestHeader(value = "Auth") String token){
        Member member = tokenService.getMember(token);
        return messageRepository.findAllByReceiverAndAlarmReadNull(member);
    }

    @PutMapping("/alarm/{messageId}")
	public void alarm(@PathVariable Long messageId) {
		Message message = messageRepository.findById(messageId).orElseThrow();
        message.setAlarmRead(true);
        messageRepository.save(message);
	}

}