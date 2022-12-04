package com.example.demo.service;

import com.example.demo.dto.CategoryDTO;
import com.example.demo.repository.CategoryRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class CategoryService {
    private final CategoryRepository categoryRepository;

    public List<CategoryDTO> getCategoryList() {
        return categoryRepository.findAllByParentIsNull().stream().map(CategoryDTO::of).collect(Collectors.toList());
    }
}
