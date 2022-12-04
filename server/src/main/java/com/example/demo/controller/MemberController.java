package com.example.demo.controller;

import java.util.ArrayList;
import java.util.List;
import java.util.stream.Collectors;

import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestHeader;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.example.demo.dto.BoardDTO;
import com.example.demo.dto.MemberDTO;
import com.example.demo.model.Board;
import com.example.demo.model.Member;
import com.example.demo.repository.MemberRepository;
import com.example.demo.service.MemberService;
import com.example.demo.service.TokenService;

import lombok.RequiredArgsConstructor;

@RequiredArgsConstructor
@RestController
@RequestMapping("/member")
public class MemberController {
    private final MemberRepository memberRepository;
    private final MemberService memberService;
    private final TokenService tokenService;

    @GetMapping
    public Member member(@RequestHeader(value = "Auth") String token) {
        if (token != null && tokenService.verifyToken(token)) {
            String uid = tokenService.getUid(token);
            String[] str = uid.split("/#");
            return memberRepository.findByEmailAndProvider(str[0],str[1]);
        }
        return null;
    }

    @GetMapping("/all")
    public List<MemberDTO> allMember(){
        List<Member> allMember = memberRepository.findAll();
        return  allMember.stream().map(i->MemberDTO.builder().label(i.getName()).value(i.getId()).build()).collect(Collectors.toList());
        
    }
    
    @GetMapping("/board/{memberId}")
    public List<BoardDTO> memberBoard(@PathVariable Long memberId){
        Member member = memberRepository.findById(memberId).orElseThrow();
        return member.getBoards().stream().map(i->BoardDTO.builder().label(i.getTitle()).value(i.getId()).build()).collect(Collectors.toList());
    }

    @GetMapping("/{id}")
    public Member profile(@PathVariable("id") Long memberId) {
        Member member = memberRepository.findById(memberId).orElseThrow();
        memberService.setMainLanguage(member);
        return member;
    }
}
