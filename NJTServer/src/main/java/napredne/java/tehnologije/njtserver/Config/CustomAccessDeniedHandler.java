/*
 * Click nbfs://nbhost/SystemFileSystem/Templates/Licenses/license-default.txt to change this license
 * Click nbfs://nbhost/SystemFileSystem/Templates/Classes/Class.java to edit this template
 */
package napredne.java.tehnologije.njtserver.Config;

/**
 *
 * @author Lenovo
 */

import org.springframework.security.access.AccessDeniedException;
import org.springframework.security.web.access.AccessDeniedHandler;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import java.io.IOException;
import org.springframework.security.core.context.SecurityContextHolder;

public class CustomAccessDeniedHandler implements AccessDeniedHandler {

    @Override
    public void handle(HttpServletRequest request,
                       HttpServletResponse response,
                       AccessDeniedException accessDeniedException) throws IOException {
        // Logovanje
        System.out.println("Pristup odbijen. Korisnik nema potrebnu rolu.");
        // Pošalji HTTP 403 Forbidden odgovor
        response.setStatus(HttpServletResponse.SC_FORBIDDEN);
        response.getWriter().write("Pristup odbijen. Nemate potrebnu rolu.");
        
        SecurityContextHolder.clearContext();
             
           
    }
}
