package com.example.demo.controller;

import com.example.demo.model.BoardImage;
import com.example.demo.repository.BoardImageRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.util.StringUtils;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;

@RequiredArgsConstructor
@RestController
@RequestMapping("/boardImage")
public class BoardImageController {
    private final BoardImageRepository boardImageRepository;
    @GetMapping("/{id}")
    public byte[] getFile(@PathVariable Long id) {
        BoardImage boardImage = boardImageRepository.findById(id).orElseThrow();
        return boardImage.getImageData();
    }
    @PostMapping
    public Long uploadImage(@RequestParam MultipartFile file) throws IOException {
        String fileName = StringUtils.cleanPath(file.getOriginalFilename());
        BoardImage boardImage = new BoardImage(fileName, file.getBytes());
        boardImageRepository.save(boardImage);
        return boardImage.getId();
    }
}
