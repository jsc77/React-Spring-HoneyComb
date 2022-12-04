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
import com.fasterxml.jackson.annotation.JsonIgnoreProperties;

import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Entity
@Getter
@Setter
@NoArgsConstructor
public class Comment extends BaseTimeEntity{
    @Id
    @GeneratedValue
    private Long id;
    @Column(columnDefinition = "LONGTEXT")
    private String text;
    @ManyToOne
    private Board board;
    @ManyToOne
    private Member member;
    private Boolean alarmRead;
    @OneToMany(mappedBy = "comment",cascade = CascadeType.ALL , orphanRemoval = true)
    // @JsonIdentityInfo(generator = ObjectIdGenerators.IntSequenceGenerator.class)
    @JsonIgnoreProperties("comment")
    private List<Recommendation> recommendations = new ArrayList<>();
    
    public Comment(String text, Member member,Board board) {
        this.text = text;
        this.board = board;
        this.member = member;
    }
}
