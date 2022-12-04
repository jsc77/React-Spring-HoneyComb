package com.example.demo.service;

import com.example.demo.dto.Token;
import com.example.demo.model.Member;
import com.example.demo.repository.MemberRepository;
import io.jsonwebtoken.Claims;
import io.jsonwebtoken.Jws;
import io.jsonwebtoken.Jwts;
import io.jsonwebtoken.SignatureAlgorithm;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import javax.annotation.PostConstruct;
import java.util.Base64;
import java.util.Date;

@Service
public class TokenService {
    @Autowired
    private MemberRepository memberRepository;
    private String secretKey = "ationauthenticationauthorizationtionauthenticationauthorizationhenticationauthorizat";

    @PostConstruct
    protected void init() {
        secretKey = Base64.getEncoder().encodeToString(secretKey.getBytes());
    }

    public Token generateToken(String email, String provider, String role) {
        //30분
        long tokenPeriod = 1000L * 60L * 30L;
        Claims claims = Jwts.claims().setSubject(email+"/#"+provider);
        claims.put("role", role);
        Date now = new Date();
        return new Token(
                Jwts.builder()
                        .setClaims(claims)
                        .setIssuedAt(now)
                        .setExpiration(new Date(now.getTime() + tokenPeriod))
                        .signWith(SignatureAlgorithm.HS256, secretKey)
                        .compact());
    }

    public String refreshToken(String token){
            if (token != null && verifyToken(token)) {
                String uid = getUid(token);
                String[] str = uid.split("/#");
                System.out.println("토큰재발행");
                Token newToken = generateToken(str[0],str[1], "USER");
                return newToken.getToken();
            }else{
                return null;
            }
        }

    public boolean verifyToken(String token) {
        try {
            Jws<Claims> claims = Jwts.parser()
                    .setSigningKey(secretKey)
                    .parseClaimsJws(token);
            return claims.getBody()
                    .getExpiration()
                    .after(new Date());
        } catch (Exception e) {
            throw new RuntimeException();
        }
    }
    public Member getMember(String token) {
        String uid = getUid(token);
        String[] str = uid.split("/#");
        return memberRepository.findByEmailAndProvider(str[0],str[1]);
    }
    public String getUid(String token) {
        return Jwts.parser().setSigningKey(secretKey).parseClaimsJws(token).getBody().getSubject();
    }
}