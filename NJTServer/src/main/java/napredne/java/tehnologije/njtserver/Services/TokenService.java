package napredne.java.tehnologije.njtserver.Services;

import io.jsonwebtoken.Claims;
import napredne.java.tehnologije.njtserver.Models.Token;
import napredne.java.tehnologije.njtserver.Models.User;
import org.springframework.security.core.Authentication;


public interface TokenService {

    String generateJwtToken(User user);
    Token createPasswordSetupOrChangeToken(User user,int indikator);
     
   // void deleteExpiredTokens();
    void deleteToken(String vrednostTokena);
    
    
    public boolean validateToken(String token);

   

   public String extractToken(String bearerToken);
   
   public Claims extractValidClaims(String token);

    public boolean validateTokenForResetPassword(String token);
    
    
    public Authentication getAuthentication(String token);
    
    
}
