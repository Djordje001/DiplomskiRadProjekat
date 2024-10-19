package napredne.java.tehnologije.njtserver.Services;

import java.util.Date;
import napredne.java.tehnologije.njtserver.DTOs.LoginReturnDto;


import napredne.java.tehnologije.njtserver.Utils.Response;


public interface AuthService {
    Response<String> registerUser(String email,String firstName,String lastName,Date datumRodjenja,String brojTelefona);

    Response<LoginReturnDto> loginUser(String email, String password);
    Response<String> logoutUser(String vrednostTokena);

    Response<String> requestPasswordChange(String email);

    Response<String> setupOrChangePassword(String token, String newPassword);

  

  
}
