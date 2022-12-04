package com.example.demo.model;

import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;

import javax.persistence.CascadeType;
import javax.persistence.ElementCollection;
import javax.persistence.Entity;
import javax.persistence.GeneratedValue;
import javax.persistence.Id;
import javax.persistence.OneToMany;

import com.example.demo.dto.BaseTimeEntity;
import com.fasterxml.jackson.annotation.JsonIdentityInfo;
import com.fasterxml.jackson.annotation.ObjectIdGenerators;
import com.fasterxml.jackson.annotation.ObjectIdGenerators.IntSequenceGenerator;

import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Entity
@NoArgsConstructor
@Getter
@Setter
public class Member extends BaseTimeEntity{
    @Id @GeneratedValue
    Long id;
    private String email;
    private String name;
    private String picture;
    private String provider;
    private LocalDateTime lastLogIn;
    @ElementCollection(targetClass=String.class)
    private List<String> mainLanguage = new ArrayList<>();
    @OneToMany(mappedBy = "member",cascade = CascadeType.ALL , orphanRemoval = true)
    @JsonIdentityInfo(generator = ObjectIdGenerators.IntSequenceGenerator.class)
    private List<Board> boards = new ArrayList<>();
    @OneToMany(mappedBy = "member",cascade = CascadeType.ALL , orphanRemoval = true)
    @JsonIdentityInfo(generator = IntSequenceGenerator.class)
    private List<Comment> comments = new ArrayList<>();
    @OneToMany(mappedBy = "member",cascade = CascadeType.ALL , orphanRemoval = true)
    @JsonIdentityInfo(generator = ObjectIdGenerators.IntSequenceGenerator.class)
    private List<Recommendation> recommendations = new ArrayList<>();

    @Builder
    public Member(String email, String name, String picture,String provider, LocalDateTime lastLogIn) {
        this.email = email;
        this.name = name;
        this.picture = picture;
        this.provider = provider;
        this.lastLogIn = lastLogIn;
    }
}
