package com.example.demo.dto;

import com.example.demo.model.Category;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;

import java.util.List;
import java.util.stream.Collectors;

@Getter
@AllArgsConstructor
@NoArgsConstructor
public class CategoryDTO {
    private Long id;
    private String name;
    private List<CategoryDTO> children;

    public static CategoryDTO of(Category category) {
        return new CategoryDTO(
                category.getId(),
                category.getName(),
                category.getChildren().stream().map(CategoryDTO::of).collect(Collectors.toList())
        );
    }
}