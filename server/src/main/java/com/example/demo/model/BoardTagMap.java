package com.example.demo.model;

import javax.persistence.Entity;
import javax.persistence.GeneratedValue;
import javax.persistence.Id;
import javax.persistence.ManyToOne;

import com.example.demo.dto.BaseTimeEntity;

import lombok.AccessLevel;
import lombok.Getter;
import lombok.NoArgsConstructor;

@Getter
@NoArgsConstructor(access = AccessLevel.PROTECTED)
@Entity
public class BoardTagMap extends BaseTimeEntity {

    @Id
    @GeneratedValue
    private Long id;
    private Long count;
    @ManyToOne
    private Board board;
    @ManyToOne
    private Tag tag;

    public BoardTagMap(Board board, Tag tag) {
        this.board = board;
        this.tag = tag;
    }
}