package napredne.java.tehnologije.njtserver.Services;

import napredne.java.tehnologije.njtserver.Models.Password;


public interface PasswordService {

    

    void savePassword(Password password);

    void updatePassword(Password password);
}
