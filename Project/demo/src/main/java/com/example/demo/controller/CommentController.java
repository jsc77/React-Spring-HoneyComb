package com.example.demo.controller;

import java.util.List;
import java.util.stream.Collectors;

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestHeader;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import com.example.demo.model.Comment;
import com.example.demo.model.Member;
import com.example.demo.repository.CommentRepository;
import com.example.demo.service.CommentService;
import com.example.demo.service.RecommendationService;
import com.example.demo.service.TokenService;

import lombok.RequiredArgsConstructor;

@RequiredArgsConstructor
@RestController
@RequestMapping("/comment")
public class CommentController {
    private final TokenService tokenService;
    private final RecommendationService recommendationService;
    private final CommentRepository commentRepository;
    private final CommentService commentService;

    @GetMapping("/{id}")
    ResponseEntity<List<Comment>> readComment(@PathVariable("id") Long boardId){
        return commentService.readComment(boardId);
    }
    @GetMapping("/read")
    List<Comment> readMemberComment(@RequestHeader(value = "Auth") String token){
        Member member = tokenService.getMember(token);
        List<Comment> comments = member.getComments();
        List<Long> commentId = member.getComments().stream().map(i->i.getId()).collect(Collectors.toList());
        List<Long> boardId = member.getBoards().stream().map(i->i.getId()).collect(Collectors.toList());
        System.out.println(comments);
        System.out.println(boardId);
        return commentRepository.findAllByIdNotInAndBoardIdInAndAlarmReadNull(commentId,boardId);
    }

    @PostMapping("/{id}")
    ResponseEntity<Long> createComment(
            @RequestHeader(value = "Auth") String token,
            @RequestParam("text") String text,
            @PathVariable("id") Long boardId
            )throws Exception {
        Member member = tokenService.getMember(token);
        return commentService.createComment(text, member,boardId);
    }
    
    @PostMapping("/{commentId}/recommendation")
    public ResponseEntity<String> recommendationComment(@PathVariable Long commentId, @RequestHeader(value = "Auth") String token) {
        Member member = tokenService.getMember(token);
        Comment comment = commentRepository.findById(commentId).orElseThrow();
        return recommendationService.commentRecommendation(comment, member);
    }

    @DeleteMapping("/{commentId}/delete")
    public ResponseEntity<String> deleteBoard(@PathVariable Long commentId) {
        commentService.deleteComment(commentId);
        return ResponseEntity.ok("삭제");
    }

    @PutMapping("/alarm/{commentId}")
	public Long alarm(@PathVariable Long commentId) {
		Comment comment = commentRepository.findById(commentId).orElseThrow();
        comment.setAlarmRead(true);
        commentRepository.save(comment);
		return comment.getBoard().getId();
	}
}
