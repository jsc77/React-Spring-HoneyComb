package com.example.demo.repository;

import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;

import com.example.demo.model.Member;
import com.example.demo.model.Message;

public interface MessageRepository extends JpaRepository<Message, Long> {
    List<Message> findAllByReceiver(Member member);
    List<Message> findAllBySender(Member member);
    List<Message> findAllByReceiverAndAlarmReadNull(Member member);
}