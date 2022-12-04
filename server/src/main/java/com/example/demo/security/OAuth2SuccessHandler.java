package com.example.demo.security;

import com.example.demo.dto.Token;
import com.example.demo.model.Member;
import com.example.demo.repository.MemberRepository;
import com.example.demo.service.TokenService;
import lombok.RequiredArgsConstructor;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.core.Authentication;
import org.springframework.security.oauth2.core.user.OAuth2User;
import org.springframework.security.web.authentication.AuthenticationSuccessHandler;
import org.springframework.stereotype.Component;

import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;
import java.io.IOException;
import java.time.LocalDateTime;
import java.time.format.DateTimeFormatter;

@RequiredArgsConstructor
@Component
public class OAuth2SuccessHandler implements AuthenticationSuccessHandler {
    private final TokenService tokenService;
    @Autowired
    private final MemberRepository memberRepository;

    @Override
    public void onAuthenticationSuccess(HttpServletRequest request, HttpServletResponse response, Authentication authentication) throws IOException {
        OAuth2User oAuth2User = (OAuth2User)authentication.getPrincipal();
        var attributes = oAuth2User.getAttributes();
        Member member = memberRepository.findByEmailAndProvider(attributes.get("email").toString(),attributes.get("provider").toString());

        if (member == null){
            Member newMember = Member.builder()
                    .email((String)attributes.get("email"))
                    .name((String)attributes.get("name"))
                    .picture((String)attributes.get("picture"))
                    .provider((String)attributes.get("provider"))
                    .lastLogIn(LocalDateTime.now())
                    .build();
            memberRepository.save(newMember);
            Token token = tokenService.generateToken(newMember.getEmail(), newMember.getProvider(), "USER");
            String url = "http://localhost:3000/signin/?Auth="+token.getToken();
            response.sendRedirect(url);
        }else{
            Token token = tokenService.generateToken(member.getEmail(), member.getProvider(), "USER");
            member.setLastLogIn(LocalDateTime.now());
            memberRepository.save(member);
            String url = "http://localhost:3000/signin/?Auth="+token.getToken();
            response.sendRedirect(url);
        }
    }
}