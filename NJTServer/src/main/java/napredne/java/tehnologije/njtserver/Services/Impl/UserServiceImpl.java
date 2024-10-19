package napredne.java.tehnologije.njtserver.Services.Impl;


import io.jsonwebtoken.Claims;
import java.util.Date;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;
import java.util.logging.Level;
import java.util.logging.Logger;
import napredne.java.tehnologije.njtserver.DTOs.UpdateUserReturnDto;
import napredne.java.tehnologije.njtserver.Enums.ResponseStatus;
import napredne.java.tehnologije.njtserver.Enums.TipAdmina;
import napredne.java.tehnologije.njtserver.Enums.TipKupca;
import napredne.java.tehnologije.njtserver.Enums.TipUsera;
import napredne.java.tehnologije.njtserver.Models.Admin;
import napredne.java.tehnologije.njtserver.Models.Kupac;
import napredne.java.tehnologije.njtserver.Models.Password;

import napredne.java.tehnologije.njtserver.Models.Token;
import napredne.java.tehnologije.njtserver.Models.User;
import napredne.java.tehnologije.njtserver.Repositories.PasswordRepository;

import napredne.java.tehnologije.njtserver.Repositories.TokenRepository;
import napredne.java.tehnologije.njtserver.Repositories.UserRepository;
import napredne.java.tehnologije.njtserver.Services.TokenService;
import napredne.java.tehnologije.njtserver.Services.UserService;
import napredne.java.tehnologije.njtserver.Utils.Response;



@RequiredArgsConstructor
@Service
public class UserServiceImpl implements UserService {

    private final UserRepository userRepository;
    private final PasswordRepository passwordRepository;
   
    private final TokenRepository tokenRepository;
    private final HashPasswordService hashPasswordService;
    private final TokenService tokenService;

    @Override
    public Response<List<User>> getAllUsers() {
        List<User> users = userRepository.findAll();
        return new Response<>(ResponseStatus.Ok, users);
    }

    @Override
    public Response<User> findUserById(Long id) {
        if (id == null || id <= 0) {
            return new Response<>(ResponseStatus.BadRequest);
        }
        Optional<User> user = userRepository.findById(id);

        return user.map(value -> new Response<>(ResponseStatus.Ok, value))
                .orElseGet(() -> new Response<>(ResponseStatus.NotFound));
    }

    @Override
    public Response<User> findUserByEmail(String email) {
        if (email == null || email.isBlank()) {
            return new Response<>(ResponseStatus.BadRequest);
        }

        Optional<User> user = userRepository.findByEmail(email);
        
        if(!user.isEmpty()){
            return new Response<>(ResponseStatus.Ok,user.get());
        }
        return new Response<>(ResponseStatus.NotFound,null);

       
    }

    @Override
    public Response<User> findUserByCredentials(String email, String password) {
        if (email == null || password == null) {
            return new Response<>(ResponseStatus.BadRequest);
        }

        Optional<User> user = userRepository.findByEmail(email);

        if (user.isEmpty()) {
            return new Response<>(ResponseStatus.NotFound);
        }

        Optional<Password> userPassword = passwordRepository.findByUserId(user.get().getId());

        if (userPassword.isEmpty() || !hashPasswordService.checkPassword(password, userPassword.get().getPasswordHash())) {
            return new Response<>(ResponseStatus.Unauthorized);
        }

        return new Response<>(ResponseStatus.Ok, user.get());
    }

    @Override
    public Response<User> createNewUser(User user) {
        if (user == null) {
            return new Response<>(ResponseStatus.BadRequest);
        }

        userRepository.save(user);
        return new Response<>(ResponseStatus.Ok, user);
    }

    @Override
    public Response<User> updateExistingUser(User user) {
        if (user == null || user.getId() == null) {
            return new Response<>(ResponseStatus.BadRequest);
        }

        if (!userRepository.existsById(user.getId())) {
            return new Response<>(ResponseStatus.NotFound);
        }

        userRepository.save(user);
        return new Response<>(ResponseStatus.Ok, user);
    }

    @Override
    public Response<User> deleteExistingUser(Long id) {
        if (id == null || id <= 0) {
            return new Response<>(ResponseStatus.BadRequest);
        }

        if (!userRepository.existsById(id)) {
            return new Response<>(ResponseStatus.NotFound);
        }

        userRepository.deleteById(id);
        return new Response<>(ResponseStatus.NoContent);
    }

    @Override
    public boolean hasPassword(User user) {
        Optional<Password> password = passwordRepository.findByUserId(user.getId());
        if (password.isPresent()) {
            return true;
        }

        return false;
    }
    
   

    @Override
    public Response<User> findUserByToken(String token) {
        if (token == null) {
            return new Response<>(ResponseStatus.BadRequest);
        }
        Optional<Token> tokenResponse = tokenRepository.findByVrednostTokena(token);
        if (!tokenResponse.isPresent()) {
            return new Response<>(ResponseStatus.InternalServerError);
        }

        User user = tokenResponse.get().getUser();

        return new Response<>(ResponseStatus.Ok, user);
    }

    @Override
    public Response<List<User>> getAllUsersWhoNeedPromotionToSilver() {
        List<User> users=userRepository.findUsersWithMoreThanOrdersAndBronzeType(2L);
          return new Response<>(ResponseStatus.Ok, users);
    }
    
     @Override
    public Response<List<User>> getAllUsersWhoNeedPromotionToGold() {
        List<User> users=userRepository.findUsersWithMoreThanOrdersAndSilverType(4L);
          return new Response<>(ResponseStatus.Ok, users);
    }

    @Override
    public Response<String> promote(String token, Long id, TipKupca tipKupca) {
        if(id==null || id<=0 || tipKupca==null){
             return new Response<>(ResponseStatus.BadRequest,"Invalid parameters");
        }
        if(!dobarTokenZaAdmina(token)){
             return new Response<>(ResponseStatus.Unauthorized,"Invalid token");
        }
        
        
        Optional<User> userPostojeci=userRepository.findById(id);
        if(userPostojeci.isEmpty()){
            return new Response<>(ResponseStatus.NotFound,"Not found user with this id");
        }
        Kupac kupac=(Kupac) userPostojeci.get();
        kupac.setTipKupca(tipKupca);
        userRepository.save(kupac);
           return new Response<>(ResponseStatus.Ok,"Successfully promoted user");
    }
    
    
     @Override
    public Response<UpdateUserReturnDto> changeUserData(String token,String firstName, String lastName, Date datumRodjenja,String brojTelefona,TipUsera tipUsera) {
         UpdateUserReturnDto dto=new UpdateUserReturnDto();
         /*if(!tokenService.validateToken(token)){
             return new Response<>(ResponseStatus.Unauthorized, dto);
         }*/
       
        Claims claims;
        try {
            claims = tokenService.extractValidClaims(token);
        } catch (Exception ex) {
            dto.setMessage("invalid token");
             
             return new Response<>(ResponseStatus.Unauthorized, dto);
        }
        
        Long id=claims.get("id", Long.class);
       
        
     
        if(tipUsera==TipUsera.ADMIN && (firstName==null || lastName==null || brojTelefona==null || firstName.equals("") || lastName.equals("") || brojTelefona.equals(""))){
           dto.setMessage("Invalid parameters");
            dto.setToken(null);
           return new Response<>(ResponseStatus.BadRequest, dto);
        }
        if( tipUsera==TipUsera.KUPAC && (firstName==null || lastName==null || datumRodjenja==null || firstName.equals("") || lastName.equals("") )){
             dto.setMessage("Invalid parameteres");
            dto.setToken(null);
           return new Response<>(ResponseStatus.BadRequest, dto);
        }
        Optional<User> postojeci=userRepository.findById(id);
        if(postojeci.isEmpty()){
             dto.setMessage("Not found user with this userId");
            dto.setToken(null);
            return new Response<>(ResponseStatus.NotFound, dto);
        }
         if(!dobarTokenZaOboje(token, id)){
              dto.setMessage("Invalid token");
            dto.setToken(null);
             return new Response<>(ResponseStatus.Unauthorized, dto);
        }
        
         if(tipUsera==TipUsera.KUPAC){
        Kupac kupac=(Kupac) postojeci.get();
        kupac.setFirstName(firstName);
        kupac.setLastName(lastName);
        kupac.setDatumRodjenja(datumRodjenja);
        kupac.setBrojTelefona(brojTelefona);
     
        userRepository.save(kupac);
        String tokenJWT=tokenService.generateJwtToken(kupac);
        dto.setMessage("You have successfully updated your profile");
        dto.setToken(tokenJWT);
         return new Response<>(ResponseStatus.Ok, dto);
         }else{
              Admin admin=(Admin) postojeci.get();
        admin.setFirstName(firstName);
        admin.setLastName(lastName);
        admin.setBrojTelefona(brojTelefona);
        
        userRepository.save(admin);
        
        String tokenJWT=tokenService.generateJwtToken(admin);
        dto.setMessage("You have successfully updated your profile");
        dto.setToken(tokenJWT);
         return new Response<>(ResponseStatus.Ok, dto);
         }
    }
    
    
    
    
    
     private boolean dobarTokenZaAdmina(String token){
        if(token==null || token.equals("")){
            return false;
        }
        token = token.substring(7);
        Optional<Token> postojeci=tokenRepository.findByVrednostTokena(token);
        if(postojeci.isEmpty()){
            return false;
        }
        if(postojeci.get().getExpiresAt().before(new Date())){
            return false;
        }
        if(!(postojeci.get().getUser() instanceof Admin)){
            return false;
        }
        
        
        return true;
    }
      private boolean dobarTokenZaOboje(String token,Long id){
        if(token==null || token.equals("")){
            return false;
        }
        token = token.substring(7);
        Optional<Token> postojeci=tokenRepository.findByVrednostTokena(token);
        if(postojeci.isEmpty()){
            return false;
        }
        if(postojeci.get().getExpiresAt().before(new Date())){
            return false;
        }
        User pomocni=new User();
        pomocni.setId(id);
        Optional<Token> tokencic=tokenRepository.findByUser(pomocni);
        if(tokencic.isEmpty()){
            return false;
        }
        if(!tokencic.get().getVrednostTokena().equals(token)){
            return false;
        }
        
        
        return true;
    }
}
