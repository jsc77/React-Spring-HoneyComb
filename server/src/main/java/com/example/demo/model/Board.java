package com.example.demo.model;
import java.util.ArrayList;
import java.util.List;

import javax.persistence.CascadeType;
import javax.persistence.Column;
import javax.persistence.Entity;
import javax.persistence.GeneratedValue;
import javax.persistence.Id;
import javax.persistence.ManyToOne;
import javax.persistence.OneToMany;

import com.example.demo.dto.BaseTimeEntity;
import com.fasterxml.jackson.annotation.JsonIdentityInfo;
import com.fasterxml.jackson.annotation.JsonIgnoreProperties;
import com.fasterxml.jackson.annotation.JsonManagedReference;
import com.fasterxml.jackson.annotation.ObjectIdGenerators;

import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Entity
@Getter
@Setter
@NoArgsConstructor
public class Board  extends BaseTimeEntity{
    @Id
    @GeneratedValue
    private Long id;
    private String title;
    @Column(columnDefinition = "text")
    private String text;
    @JsonManagedReference
    @ManyToOne
    private Member member;
    @ManyToOne
    private Category category;

    @OneToMany(mappedBy = "board",cascade = CascadeType.ALL , orphanRemoval = true)
    @JsonIgnoreProperties("board")
    private List<Comment> comments = new ArrayList<>();

    @OneToMany(mappedBy = "board",cascade = CascadeType.ALL , orphanRemoval = true)
    @JsonIdentityInfo(generator = ObjectIdGenerators.IntSequenceGenerator.class)
    private List<Recommendation> recommendations = new ArrayList<>();

    @OneToMany(mappedBy = "board",cascade = CascadeType.ALL , orphanRemoval = true)
    @JsonIgnoreProperties("board")
    private List<BoardTagMap> boardTagMaps = new ArrayList<>();

    public Board(String title, String text, Member member, Category category) {
        this.title = title;
        this.text = text;
        this.member = member;
        this.category = category;
    }
}
