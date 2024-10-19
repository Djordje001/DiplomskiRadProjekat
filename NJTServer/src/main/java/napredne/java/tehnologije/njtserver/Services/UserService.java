package napredne.java.tehnologije.njtserver.Services;



import java.util.Date;
import java.util.List;
import napredne.java.tehnologije.njtserver.DTOs.UpdateUserReturnDto;
import napredne.java.tehnologije.njtserver.Enums.TipKupca;
import napredne.java.tehnologije.njtserver.Enums.TipUsera;
import napredne.java.tehnologije.njtserver.Models.User;
import napredne.java.tehnologije.njtserver.Utils.Response;

public interface UserService {

    Response<List<User>> getAllUsers();
    Response<List<User>> getAllUsersWhoNeedPromotionToSilver();
    Response<List<User>> getAllUsersWhoNeedPromotionToGold();

    Response<User> findUserById(Long id);

    Response<User> findUserByEmail(String email);

    Response<User> findUserByCredentials(String email, String password);

    Response<User> createNewUser(User user);

    Response<User> updateExistingUser(User user);

    Response<User> deleteExistingUser(Long id);
    
    Response<User> findUserByToken(String token);
    
    boolean hasPassword(User user);
   
    
    
    Response<String> promote(String token,Long id,TipKupca tipKupca);
    
     public Response<UpdateUserReturnDto> changeUserData(String token,String firstName, String lastName,Date datumRodjenja,String brojTelefona,TipUsera tipUsera);
    
}
