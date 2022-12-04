package com.example.demo.model;

import com.fasterxml.jackson.annotation.JsonIdentityInfo;
import com.fasterxml.jackson.annotation.ObjectIdGenerators;
import lombok.*;

import javax.persistence.*;
import java.util.ArrayList;
import java.util.List;

@Entity
@Getter
@NoArgsConstructor
public class Category {
    @Id
    @GeneratedValue
    private Long id;
    private String name;
    @ManyToOne
    private Category parent;
    @OneToMany(mappedBy = "category",cascade = CascadeType.ALL , orphanRemoval = true)
    @JsonIdentityInfo(generator = ObjectIdGenerators.IntSequenceGenerator.class)
    private List<Board> boards = new ArrayList<>();
    @OneToMany(mappedBy = "parent",cascade = CascadeType.ALL , orphanRemoval = true)
    @JsonIdentityInfo(generator = ObjectIdGenerators.IntSequenceGenerator.class)
    private List<Category> children = new ArrayList<>();
}