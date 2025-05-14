package fct.project.scmu.utils;

import io.jsonwebtoken.Claims;
import io.jsonwebtoken.Jwts;
import io.jsonwebtoken.io.Decoders;
import io.jsonwebtoken.security.Keys;

import javax.crypto.SecretKey;
import java.util.Date;
import java.util.HashMap;
import java.util.Map;

public class AuthUtils {

    // The expiration time is set in MILISECONDS
    public static final long EXPIRATION_TIME = 259200000; // 3 days
    private static final SecretKey key;


    static {
        byte[] bytes = Decoders.BASE64.decode("404E639666556A586E3272357538782F413F4428472B4C6250645367566B5970404E639666556A586E3272357538782F413F4428472B4C6250645367566B5970");
        key = Keys.hmacShaKeyFor(bytes);
    }

    public static Map<String, Object> parse(String token) {
        token = token.substring(7);
        return new HashMap<>(Jwts.parser()
                .verifyWith(key)
                .build()
                .parseSignedClaims(token)
                .getPayload());
    }

    public static String build(Claims claims) {
        return Jwts.builder()
                .claims()
                .issuedAt(new Date(System.currentTimeMillis()))
                .expiration(new Date(System.currentTimeMillis() + EXPIRATION_TIME)).add(claims).and()
                .signWith(key)
                .compact();
    }

    public static String renew(Map<String, Object> claims) {
        return Jwts.builder()
                .claims()
                .add(claims)
                .expiration(new Date(System.currentTimeMillis() + EXPIRATION_TIME)).and()
                .signWith(key)
                .compact();
    }
}
