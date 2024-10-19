package napredne.java.tehnologije.njtserver.Services.Impl;

import io.jsonwebtoken.Claims;
import io.jsonwebtoken.ExpiredJwtException;
import io.jsonwebtoken.Jws;
import io.jsonwebtoken.JwtException;
import java.util.Date;

import lombok.RequiredArgsConstructor;
import org.apache.commons.lang3.RandomStringUtils;

import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import io.jsonwebtoken.Jwts;
import io.jsonwebtoken.SignatureAlgorithm;
import io.jsonwebtoken.security.Keys;
import java.security.NoSuchAlgorithmException;
import java.util.Base64;
import java.util.Collections;
import java.util.Optional;
import javax.crypto.KeyGenerator;
import javax.crypto.SecretKey;
import napredne.java.tehnologije.njtserver.Enums.ResponseStatus;
import napredne.java.tehnologije.njtserver.Enums.TipAdmina;

import napredne.java.tehnologije.njtserver.Enums.TipTokena;
import napredne.java.tehnologije.njtserver.Models.Admin;
import napredne.java.tehnologije.njtserver.Models.Kupac;
import napredne.java.tehnologije.njtserver.Models.Token;
import napredne.java.tehnologije.njtserver.Models.User;
import napredne.java.tehnologije.njtserver.Repositories.TokenRepository;
import napredne.java.tehnologije.njtserver.Services.TokenService;
import napredne.java.tehnologije.njtserver.Utils.Response;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.authority.SimpleGrantedAuthority;


@Service
@RequiredArgsConstructor
public class TokenServiceImpl implements TokenService {
    
    private final TokenRepository tokenRepository;

      
    @Override
    @Transactional
public String generateJwtToken(User user) {
    String subject = String.valueOf(user.getId());
    String issuer = String.valueOf(user.getEmail());
    Date now = new Date();
    Date expiration = new Date(now.getTime() + 86400000);

    String token=null;
            /*Jwts.builder()
            .setSubject(subject)
            .setIssuer(issuer)
            .setIssuedAt(now)
            .setExpiration(expiration)
            .claim("firstName", user.getFirstName())
            .claim("lastName", user.getLastName())
            .claim("brojTelefona", user.getBrojTelefona())
            .claim("email", user.getEmail())
            .claim("type", user.getClass().getSimpleName()) 
            .signWith(key)
            .compact();*/

    if (user instanceof Kupac) {
        Kupac kupac = (Kupac) user;
        token = Jwts.builder()
                .setSubject(subject)
                .setIssuer(issuer)
                .setIssuedAt(now)
                .setExpiration(expiration)
                .claim("id",kupac.getId())
                .claim("firstName", kupac.getFirstName())
                .claim("lastName", kupac.getLastName())
                .claim("brojTelefona", kupac.getBrojTelefona())
                .claim("type", "Kupac")
                .claim("tipKupca", kupac.getTipKupca().name())
                .claim("datumRodjenja", kupac.getDatumRodjenja().toString())
                .claim("role","KUPAC")
                .signWith(key)
                .compact();
    }

    
    if (user instanceof Admin) {
        Admin admin = (Admin) user;
        String role="";
        if(admin.getTipAdmina()==TipAdmina.HIGHADMIN){
            role="HIGHADMIN";
        }
        if(admin.getTipAdmina()==TipAdmina.LOWADMIN){
            role="LOWADMIN";
        }
        token = Jwts.builder()
                .setSubject(subject)
                .setIssuer(issuer)
                .setIssuedAt(now)
                .setExpiration(expiration)
                .claim("id",admin.getId())
                .claim("firstName", admin.getFirstName())
                .claim("lastName", admin.getLastName())
                .claim("brojTelefona", admin.getBrojTelefona())
                .claim("type", "Admin")
                .claim("tipAdmina", admin.getTipAdmina().name())
                .claim("datumZaposlenja", admin.getDatumZaposlenja().toString())
                .claim("role", role)
                .signWith(key)
                .compact();
    }

    
    Token tokenEntity = new Token();
    tokenEntity.setCreatedAt(new Date());
    tokenEntity.setExpiresAt(expiration);
    tokenEntity.setVrednostTokena(token);
    tokenEntity.setTipTokena(TipTokena.JWT);
    tokenEntity.setUser(user);
    tokenRepository.deleteByUser(user);
    tokenRepository.save(tokenEntity);

    return token;
}


    @Override
    public Token createPasswordSetupOrChangeToken(User user,int indikator) {
        Token token = new Token();
        token.setUser(user);
        token.setCreatedAt(new Date());
        token.setExpiresAt(new Date(System.currentTimeMillis() + 1000*60*60));
        if(indikator==1){
        token.setTipTokena(TipTokena.PasswordSetup);
        }
        if(indikator==2){
            token.setTipTokena(TipTokena.PasswordReset);
        }
        
        String tokenString = RandomStringUtils.randomAlphanumeric(10);
        token.setVrednostTokena(tokenString);
        
        tokenRepository.save(token);
        
        return token;
    }

   /* @Override
    @Scheduled(fixedRate = 2700000)
    @Transactional
    public void deleteExpiredTokens() {
        Date now = new Date();
        List<Token> expiredTokens = tokenRepository.findByExpiresAtBefore(now);
        if (!expiredTokens.isEmpty()) {
            tokenRepository.deleteAll(expiredTokens);
        }
    }*/

    @Override
    public void deleteToken(String vrednostTokena) {
         tokenRepository.deleteByVrednostTokena(vrednostTokena);
    }

    @Override
    public boolean validateTokenForResetPassword(String token) {
        if(token==null || token.equals("")){
            return false;
        }
        Optional<Token> optionalToken=tokenRepository.findByVrednostTokena(token);
        if(optionalToken.isEmpty()){
            return false;
        }
        if(optionalToken.get().getExpiresAt().before(new Date())){
            return false;
        }
        if(optionalToken.get().getTipTokena()!=TipTokena.PasswordReset && optionalToken.get().getTipTokena()!=TipTokena.PasswordSetup){
            return false;
        }
        return true;
    }
    
    
    
     
     
     private static final String SECRET_KEY_BASE64 = generateBase64SecretKey();
private static final SecretKey key = Keys.hmacShaKeyFor(Base64.getDecoder().decode(SECRET_KEY_BASE64));


    public Claims extractValidClaims(String token) {
    if (token == null || token.isEmpty()) {
        System.out.println("Token is missing or empty");
        throw new JwtException("Missing or empty token");
    }
    if (token != null && token.startsWith("Bearer ")) {
        token=token.substring(7);
    }
    
    try {
        return Jwts.parserBuilder()
            .setSigningKey(key)
            .build()
            .parseClaimsJws(token)
            .getBody();
    } catch (ExpiredJwtException e) {
        System.out.println("Token is expired");
        throw new JwtException("Token expired");
    } catch (JwtException e) {
        System.out.println("Token validation failed: " + e.getMessage());
        throw new JwtException("Token validation failed");
    }
}

   
    
    public String extractToken(String bearerToken) {
    if (bearerToken != null && bearerToken.startsWith("Bearer ")) {
        return bearerToken.substring(7);
    }
    return null;
}

   

    
    
    
    public static String generateBase64SecretKey() {
        try {
            // Kreiraj KeyGenerator za algoritam HMAC-SHA256
            KeyGenerator keyGen = KeyGenerator.getInstance("HmacSHA256");
            keyGen.init(256); // Inicijalizuj KeyGenerator sa 256-bitnom dužinom ključa
            
            // Generiši tajni ključ
            SecretKey secretKey = keyGen.generateKey();
            
            // Kodiraj tajni ključ u Base64 da bi se lako mogao sačuvati ili koristiti kao string
            return Base64.getEncoder().encodeToString(secretKey.getEncoded());
        } catch (NoSuchAlgorithmException e) {
            throw new RuntimeException("Unable to generate secret key", e);
        }
    }
    
     @Override
    public boolean validateToken(String token)  {
        if (token != null && token.startsWith("Bearer ")) {
        token=token.substring(7);
    }
        System.out.println(token);
        try {
           Claims claims=Jwts.parserBuilder()
                .setSigningKey(key)
                .build()
                .parseClaimsJws(token).getBody();
            
            
            Optional<Token> optionalToken=tokenRepository.findByVrednostTokena(token);
            if(optionalToken.isEmpty()){
                return false;
            }
            if(optionalToken.get().getExpiresAt().before(new Date())){
                return false;
            }
            return true;
        } catch (JwtException e) {
            System.out.println("sta je ovo");
            System.out.println("Token validation failed: " + e.getMessage());
            return false;
        }
    }
    
    /*public boolean hasRole(String token, String requiredRole) {
        try{
             Claims claims = extractValidClaims(token);
             return requiredRole.equals(claims.get("role", String.class));
        }catch(Exception e){
            return false;
        }
   
    
}*/
    
    @Override
    public Authentication getAuthentication(String token) {
        // Ekstraktuj podatke iz JWT tokena (claims)
        Claims claims = extractValidClaims(token);

        // Uzmi korisničko ime iz JWT tokena
        String username = claims.getIssuer();

        // Ekstraktuj uloge iz tokena (ako su setovane u tokenu)
        String role = claims.get("role", String.class);

        // Kreiraj listu uloga (ako je potrebno)
        SimpleGrantedAuthority authority = new SimpleGrantedAuthority(role != null ? role : role);

        // Vrati UsernamePasswordAuthenticationToken sa korisničkim imenom i ulogama
        return new UsernamePasswordAuthenticationToken(username, null, Collections.singletonList(authority));
    }

     

}
