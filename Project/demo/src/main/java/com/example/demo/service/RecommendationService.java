package com.example.demo.service;

import com.example.demo.model.Board;
import com.example.demo.model.Comment;
import com.example.demo.model.Member;
import com.example.demo.model.Recommendation;
import com.example.demo.repository.RecommendationRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Service;

import java.util.Optional;

@Service
@RequiredArgsConstructor
public class RecommendationService {
    private final RecommendationRepository recommendationRepository;
    public ResponseEntity<String> commentRecommendation(Comment comment, Member member){
        Optional<Recommendation> recommendation = recommendationRepository.findByMemberIdAndCommentId(member.getId(),comment.getId());
        if (recommendation.isEmpty()){
            Recommendation newRecommendation = new Recommendation(comment,member);
            recommendationRepository.save(newRecommendation);
            return new ResponseEntity<>("추천하셨습니다", HttpStatus.OK);
        }else {
            recommendationRepository.delete(recommendation.get());
            return new ResponseEntity<>("추천을 취소했습니다.", HttpStatus.OK);
        }
    }
}
