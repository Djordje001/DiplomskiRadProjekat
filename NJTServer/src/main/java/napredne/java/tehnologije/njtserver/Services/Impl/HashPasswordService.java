package napredne.java.tehnologije.njtserver.Services.Impl;



import org.mindrot.jbcrypt.BCrypt;
import org.springframework.stereotype.Service;

@Service
public class HashPasswordService {

    public String hashPassword(String plainPassword) {
        return BCrypt.hashpw(plainPassword, BCrypt.gensalt());
    }

    public boolean checkPassword(String plainPassword, String hashedPassword) {
        return BCrypt.checkpw(plainPassword, hashedPassword);
    }
}