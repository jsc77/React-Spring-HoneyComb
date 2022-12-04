package com.example.demo.service;

import java.util.List;
import java.util.Optional;

import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Service;

import com.example.demo.model.Board;
import com.example.demo.model.Comment;
import com.example.demo.model.Member;
import com.example.demo.repository.BoardRepository;
import com.example.demo.repository.CommentRepository;

import lombok.RequiredArgsConstructor;

@Service
@RequiredArgsConstructor
public class CommentService {
    private final CommentRepository commentRepository;
    private final BoardRepository boardRepository;

    public ResponseEntity<Long> createComment(String text,Member member, Long boardId){
        Optional<Board> board = boardRepository.findById(boardId);
        Comment comment = new Comment(text,member,board.get());
        commentRepository.save(comment);
        return ResponseEntity.ok(boardId);
    }
    public ResponseEntity<List<Comment>> readComment(Long boardId){
        List<Comment> comment = commentRepository.findAllByBoardId(boardId);
        return ResponseEntity.ok(comment);
    }
    public void deleteComment(Long commentId){
        commentRepository.deleteById(commentId);
    }
}
