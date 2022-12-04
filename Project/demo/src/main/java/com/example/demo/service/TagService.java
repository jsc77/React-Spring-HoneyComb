package com.example.demo.service;

import java.util.List;
import java.util.Optional;
import java.util.stream.Collectors;

import org.springframework.stereotype.Service;

import com.example.demo.model.Board;
import com.example.demo.model.Tag;
import com.example.demo.repository.TagRepository;

import lombok.RequiredArgsConstructor;

@Service
@RequiredArgsConstructor
public class TagService {
    private final TagRepository tagRepository;
    public List<Tag> saveTag(List<Tag> tagList){
        return tagRepository.saveAll(tagList);
    }

    public List<Board> getBoardFromTag(String tagId){
        Tag tag = tagRepository.findById(Long.parseLong(tagId)).orElseThrow();
        return tag.getBoardTagMaps().stream().map(i-> i.getBoard()).collect(Collectors.toList());
    }
}
