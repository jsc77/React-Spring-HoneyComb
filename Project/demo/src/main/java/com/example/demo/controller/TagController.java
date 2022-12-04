package com.example.demo.controller;

import java.util.ArrayList;
import java.util.List;

import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.example.demo.dto.TagDTO;
import com.example.demo.model.Tag;
import com.example.demo.repository.TagRepository;

import lombok.RequiredArgsConstructor;

@RequiredArgsConstructor
@RestController
@RequestMapping("/tag")
public class TagController {
    private final  TagRepository tagRepository;

    @GetMapping("/all")
    public List<TagDTO> allTag(){
        List<Tag> tags = tagRepository.findAll();
        List<TagDTO> tagDTO = new ArrayList<>();
        for (Tag tag : tags) {
            new TagDTO();
            tagDTO.add(TagDTO.builder().label(tag.getName()).value(tag.getName()).build());
        }
        return tagDTO;
    }
}
