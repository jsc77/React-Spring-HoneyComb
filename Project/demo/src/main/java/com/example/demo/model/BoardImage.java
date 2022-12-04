package com.example.demo.model;

import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

import javax.persistence.Entity;
import javax.persistence.GeneratedValue;
import javax.persistence.Id;
import javax.persistence.Lob;
@Entity
@Getter
@Setter
@NoArgsConstructor
public class BoardImage {
    @Id
    @GeneratedValue
    private Long id;
    private String name;
    @Lob
    private byte[] imageData;

    public BoardImage(String name, byte[] imageData) {
        this.name = name;
        this.imageData = imageData;
    }
}
