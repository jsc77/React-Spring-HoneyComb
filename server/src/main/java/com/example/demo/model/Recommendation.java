package com.example.demo.model;
import javax.persistence.*;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Entity
@Getter
@Setter
@NoArgsConstructor
public class Recommendation {
    @Id @GeneratedValue
    private Long id;
    @ManyToOne
    private Board board;
    @ManyToOne
    private Comment comment;
    @ManyToOne
    private Member member;
    
    public Recommendation(Board board, Member member) {
        this.board = board;
        this.member = member;
    }
    public Recommendation(Comment comment, Member member) {
        this.comment = comment;
        this.member = member;
    }
}
