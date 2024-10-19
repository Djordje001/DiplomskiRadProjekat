package napredne.java.tehnologije.njtserver.Services.Impl;

import napredne.java.tehnologije.njtserver.Models.Password;
import napredne.java.tehnologije.njtserver.Repositories.PasswordRepository;
import napredne.java.tehnologije.njtserver.Services.PasswordService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;


@Service
public class PasswordServiceImpl implements PasswordService {

    @Autowired
    PasswordRepository passwordRepository;

    @Override
    public void savePassword(Password password) {
        passwordRepository.save(password);
    }

    @Override
    public void updatePassword(Password password) {
        if (password == null) {
            return;
        }

        passwordRepository.updatePasswordByUserId(password.getPasswordHash(), password.getUser().getId());

    }
}
