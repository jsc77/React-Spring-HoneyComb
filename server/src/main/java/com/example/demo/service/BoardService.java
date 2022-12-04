package com.example.demo.service;

import java.util.List;
import java.util.Optional;
import java.util.stream.Collectors;

import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Service;

import com.example.demo.model.Board;
import com.example.demo.model.BoardTagMap;
import com.example.demo.model.Category;
import com.example.demo.model.Member;
import com.example.demo.model.Tag;
import com.example.demo.repository.BoardRepository;
import com.example.demo.repository.BoardTagMapRepository;
import com.example.demo.repository.CategoryRepository;
import com.example.demo.repository.TagRepository;

import io.jsonwebtoken.io.IOException;
import lombok.RequiredArgsConstructor;

@Service
@RequiredArgsConstructor
public class BoardService {
    private final BoardRepository boardRepository;
    private final CategoryRepository categoryRepository;
    private final BoardTagMapRepository boardTagMapRepository;
    private final TagRepository tagRepository;

    public ResponseEntity<Long> createBoard(String title, String text, 
    Member member,Long categoryId, List<String> tags) throws IOException{
        Optional<Category> category =categoryRepository.findById(categoryId);
        Board board = new Board(title, text,member,category.get());
        boardRepository.save(board);
            for (String tag : tags) {
                Tag newTag = tagRepository.findByName(tag);
                if(newTag == null) {
                    newTag = new Tag(tag);
                }
                tagRepository.save(newTag);
                BoardTagMap boardTagMap = new BoardTagMap(board, newTag);
                boardTagMapRepository.save(boardTagMap);
            }

        return new ResponseEntity<>(board.getId(), HttpStatus.CREATED);
    }
    public ResponseEntity<List<Board>> readBoard(Long categoryId) {
        List<Board>board = boardRepository.findAllBoardByCategoryId(categoryId);
        return ResponseEntity.ok(board);
    }
    public ResponseEntity<Board> readOneBoard(Long boardId) {
        Optional<Board> board = boardRepository.findById(boardId);
        return board.map(value -> new ResponseEntity<>(value, HttpStatus.OK)).orElseGet(() -> new ResponseEntity<>(null, HttpStatus.NOT_FOUND));
    }
    public void deleteBoard(Long boardId) {
        boardRepository.deleteById(boardId);
    }
}
