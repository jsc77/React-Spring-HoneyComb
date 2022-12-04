package com.example.demo.controller;

import java.util.List;

import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.example.demo.dto.CategoryDTO;
import com.example.demo.model.Category;
import com.example.demo.repository.CategoryRepository;
import com.example.demo.service.CategoryService;

import lombok.RequiredArgsConstructor;

@RequiredArgsConstructor
@RestController
@RequestMapping("/category")
public class CategoryController {
    private final CategoryRepository categoryRepository;
    private final CategoryService categoryService;

    @GetMapping
    List<CategoryDTO> createCategory(){
        return categoryService.getCategoryList();
    }

    @GetMapping("/{id}")
    String findCategoryName(
        @PathVariable Long id
    ){
        Category category= categoryRepository.findById(id).orElseThrow();
        return category.getName();
    }
}
