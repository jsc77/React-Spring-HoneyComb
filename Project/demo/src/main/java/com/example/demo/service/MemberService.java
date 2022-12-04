package com.example.demo.service;

import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.stream.Collectors;

import org.springframework.stereotype.Service;

import com.example.demo.model.Comment;
import com.example.demo.model.Member;
import com.example.demo.repository.MemberRepository;

import lombok.RequiredArgsConstructor;

@Service
@RequiredArgsConstructor

public class MemberService {
    private final MemberRepository memberRepository;

    public void setMainLanguage(Member member){
        List<Comment> comments =member.getComments();
        List<String> list = new ArrayList<String>();
        for (Comment comment : comments) {
            String categoryName = comment.getBoard().getCategory().getName();
            list.add(categoryName);
        }
        Map<String, Integer> result = new HashMap<>();
        for(String s : list){
            if(result.containsKey(s)){
                result.put(s, result.get(s)+1);
            }else{
                result.put(s, 1);
            }
        }
        List<String> keys = result.entrySet().stream()
                                                .sorted(Map.Entry.<String, Integer>comparingByValue().reversed())
                                                .limit(3).map(Map.Entry::getKey).collect(Collectors.toList());
        member.setMainLanguage(keys);
        memberRepository.save(member);
    }
}
