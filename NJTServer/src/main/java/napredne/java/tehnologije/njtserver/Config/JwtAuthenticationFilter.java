/*
 * Click nbfs://nbhost/SystemFileSystem/Templates/Licenses/license-default.txt to change this license
 * Click nbfs://nbhost/SystemFileSystem/Templates/Classes/Class.java to edit this template
 */
package napredne.java.tehnologije.njtserver.Config;

/**
 *
 * @author Lenovo
 */


import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.web.filter.OncePerRequestFilter;
import org.springframework.security.core.Authentication;
import jakarta.servlet.FilterChain;
import jakarta.servlet.ServletException;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import java.io.IOException;
import lombok.RequiredArgsConstructor;
import napredne.java.tehnologije.njtserver.Services.TokenService;
import org.springframework.stereotype.Component;

@RequiredArgsConstructor
@Component
public class JwtAuthenticationFilter extends OncePerRequestFilter {

    private final TokenService tokenService;  // Servis za validaciju JWT tokena

  

    @Override
    protected void doFilterInternal(HttpServletRequest request, HttpServletResponse response, FilterChain filterChain) throws ServletException, IOException {
        String requestURI = request.getRequestURI();
        if (requestURI.startsWith("/api/auth/login") || requestURI.startsWith("/api/auth/register") || requestURI.startsWith("/api/auth/request-password-change") || requestURI.startsWith("/api/auth/change-password") || requestURI.startsWith("/api/auth/validate-token") ||  requestURI.startsWith("/api/public"))
                {
        // Nastavi dalje bez validacije tokena za ove rute
        filterChain.doFilter(request, response);
        return;
    }
        String token = request.getHeader("Authorization");
         
      System.out.println("heheh");
      System.out.println(token);
        // Proveri da li token postoji i da li počinje sa "Bearer "
        if (token != null && token.startsWith("Bearer ")) {
            String jwt = token.substring(7);  // Ukloni "Bearer " deo iz 
            System.out.println("odma ispod");
            System.out.println(jwt);
            if (tokenService.validateToken(jwt)) {
                Authentication authentication = tokenService.getAuthentication(jwt);
                System.out.println(authentication);
                SecurityContextHolder.getContext().setAuthentication(authentication);  // Postavi autentifikaciju u kontekst
            }
                else {
                System.out.println("Nevalidan token");
            SecurityContextHolder.clearContext();
            response.setStatus(HttpServletResponse.SC_UNAUTHORIZED); 
            return;
        }
        }
            else {
        // Ako nema tokena, zahtev je neautentifikovan
        System.out.println("Token nije unet");
        SecurityContextHolder.clearContext();
        response.setStatus(HttpServletResponse.SC_UNAUTHORIZED);  // Vrati 401 Unauthorized
        return;
    }
                
    
            
        

        filterChain.doFilter(request, response);  // Nastavi dalje kroz lanac filtera
    }
}