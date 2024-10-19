/*
 * Click nbfs://nbhost/SystemFileSystem/Templates/Licenses/license-default.txt to change this license
 * Click nbfs://nbhost/SystemFileSystem/Templates/Classes/Class.java to edit this template
 */
package napredne.java.tehnologije.njtserver.Utils;

import java.security.SecureRandom;
import org.springframework.stereotype.Component;

/**
 *
 * @author Lenovo
 */
@Component
public class PasswordUtil {
    
     private static final String CHARACTERS = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
    private static final int LENGTH = 10;

    

    public static String generateTempPassword() {
        SecureRandom random = new SecureRandom();
        StringBuilder password = new StringBuilder(LENGTH);

        for (int i = 0; i < LENGTH; i++) {
            int index = random.nextInt(CHARACTERS.length());
            password.append(CHARACTERS.charAt(index));
        }

        return password.toString();
    }
}
