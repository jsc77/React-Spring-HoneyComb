package com.example.demo.controller;

import java.util.ArrayList;
import java.util.List;
import java.util.stream.Collectors;

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestHeader;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import com.example.demo.model.Board;
import com.example.demo.model.Member;
import com.example.demo.service.BoardService;
import com.example.demo.service.TagService;
import com.example.demo.service.TokenService;

import lombok.RequiredArgsConstructor;

@RequiredArgsConstructor
@RestController
@RequestMapping("/board")
public class BoardController {
    private final TokenService tokenService;
    private final BoardService boardService;
    private final TagService tagService;

    @GetMapping("/{id}")
    ResponseEntity<List<Board>> readBoard(@PathVariable Long id){
        return boardService.readBoard(id);
    }

    @GetMapping("/tag")
    List<Board> readTagBoard(@RequestParam("tags[]") List<String> tags){
        List<Board> boardList = new ArrayList<Board>();
        tags.stream().map(i-> boardList.addAll(tagService.getBoardFromTag(i))).collect(Collectors.toList());
        return boardList;
    }

    @GetMapping("/get/{id}")
    ResponseEntity<Board> readOneBoard(@PathVariable Long id){
        return boardService.readOneBoard(id);
    }

    @PostMapping("/{id}")
    ResponseEntity<Long> createBoard(
            @RequestHeader(value = "Auth") String token,
            @RequestParam("title") String title,
            @RequestParam("text") String text,
            @PathVariable Long id,
            @RequestParam("tags[]") List<String> tags
            )throws Exception {
        Member member = tokenService.getMember(token);
        return boardService.createBoard(title,text,member,id, tags);
    }

    @DeleteMapping("/{id}/delete")
    public ResponseEntity<String> deleteBoard(@PathVariable Long id) {
        boardService.deleteBoard(id);
        return ResponseEntity.ok("삭제");
    }
}
