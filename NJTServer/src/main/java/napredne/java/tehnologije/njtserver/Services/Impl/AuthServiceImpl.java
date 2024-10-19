package napredne.java.tehnologije.njtserver.Services.Impl;

import jakarta.transaction.Transactional;

import java.util.Date;
import java.util.Optional;
import lombok.RequiredArgsConstructor;
import napredne.java.tehnologije.njtserver.DTOs.LoginReturnDto;

import napredne.java.tehnologije.njtserver.Enums.ResponseStatus;
import napredne.java.tehnologije.njtserver.Enums.TipKupca;
import napredne.java.tehnologije.njtserver.Enums.TipTokena;
import napredne.java.tehnologije.njtserver.Models.Admin;

import napredne.java.tehnologije.njtserver.Models.Kupac;
import napredne.java.tehnologije.njtserver.Models.Password;

import napredne.java.tehnologije.njtserver.Models.Token;
import napredne.java.tehnologije.njtserver.Models.User;
import napredne.java.tehnologije.njtserver.Repositories.PasswordRepository;

import napredne.java.tehnologije.njtserver.Repositories.TokenRepository;
import napredne.java.tehnologije.njtserver.Repositories.UserRepository;
import napredne.java.tehnologije.njtserver.Services.AuthService;


import napredne.java.tehnologije.njtserver.Services.TokenService;
import napredne.java.tehnologije.njtserver.Services.UserService;
import napredne.java.tehnologije.njtserver.Utils.PasswordUtil;
import napredne.java.tehnologije.njtserver.Utils.Response;


import org.springframework.stereotype.Service;





@RequiredArgsConstructor
@Service
public class AuthServiceImpl implements AuthService {

    private final UserService userService;
    
    private final TokenService tokenService;
    private final EmailService emailService;
    private final UserRepository userRepository;
    private final PasswordRepository passwordRepository;
    private final TokenRepository tokenRepository;
    private final HashPasswordService hashPasswordService;
    

    @Override
    public Response<String> registerUser(String email,String firstName,String lastName,Date datumRodjenja,String brojTelefona) {
        if (email == null || firstName==null || lastName==null || datumRodjenja==null  || brojTelefona==null || brojTelefona.equals("")) {
            return new Response<>(ResponseStatus.BadRequest, "Invalid parameteres");
        }
        if(datumRodjenja.after(new Date())){
            return new Response<>(ResponseStatus.BadRequest, "Date of birth need to be in past");
        }

        Response<User> response = userService.findUserByEmail(email);
       
        if (response.getStatus() == ResponseStatus.Ok ) {
           
            return new Response<>(ResponseStatus.Conflict, "User with email " + email + " already exists");
        } 
        
        
    
      Kupac kupac=new Kupac(TipKupca.BRONZE, datumRodjenja);
      kupac.setFirstName(firstName);
      kupac.setLastName(lastName);
      kupac.setEmail(email);
      kupac.setBrojTelefona(brojTelefona);
        userRepository.save(kupac);
        
       /*  String tempPassword = PasswordUtil.generateTempPassword();
        
        String hashedPassword=hashPasswordService.hashPassword(tempPassword);
        tempPasswordService.saveTempPassword(kupac, hashedPassword);
        emailService.sendTempPassword(email, tempPassword);*/
       
        Token token = tokenService.createPasswordSetupOrChangeToken(kupac,1);
        String tokenString = token.getVrednostTokena();

        
        emailService.sendPasswordSetupLink(email, tokenString);

        return new Response<>(ResponseStatus.Ok, "Password setup link sent successfully to "+email);
       
 
    }

    

   @Override
    public Response<LoginReturnDto> loginUser(String email, String password) {
        
        LoginReturnDto dto=new LoginReturnDto();
        
        if (email == null | password == null || email.equals("") || password.equals("")) {
            dto.setPoruka("Invalid email address or password");
            return new Response<>(ResponseStatus.BadRequest, dto);
        }
        
        Optional<User> pronadjen=userRepository.findByEmail(email);
        if(!pronadjen.isEmpty()){
            User x=pronadjen.get();
           
          
                      Response<User> existingUserResponse = userService.findUserByCredentials(email, password);

                  if (existingUserResponse.getStatus() == ResponseStatus.NotFound) {
                   dto.setPoruka("User with email:"+email+" doesnt exist in the system");
                     return new Response<>(ResponseStatus.NotFound, dto);
                 }
         
                 if (existingUserResponse.getStatus() == ResponseStatus.Unauthorized) {
                  dto.setPoruka("Wrong password");
                 return new Response<>(ResponseStatus.Unauthorized, dto);
                 }
        
                Optional<Token> postoji=tokenRepository.findByUser(existingUserResponse.getData());
                if(!postoji.isEmpty()){
                tokenRepository.delete(postoji.get());
                 }
 
                   User existingUser = existingUserResponse.getData();
                   
                  String token = tokenService.generateJwtToken(existingUser);
                dto.setToken(token);
                  dto.setUser(existingUser);
                dto.setPoruka("You are succesfully logged in");
                  return new Response<>(ResponseStatus.Ok, dto);
                   
                
           
        }
       
        else{
            dto.setPoruka("User with email:"+email+" doesnt exist in the system");
            return new Response<>(ResponseStatus.NotFound, dto);
        }
        
        
       
        
    }
    
    @Override
    @Transactional
    public Response<String> logoutUser(String vrednostTokena){
          
        if (vrednostTokena==null) {
            return new Response<>(ResponseStatus.BadRequest, "Invalid token");
        }
        Optional<Token> token=tokenRepository.findByVrednostTokena(vrednostTokena);
        
        if(!token.isEmpty()){
            
            
            tokenRepository.deleteByVrednostTokena(vrednostTokena);
        return new Response<>(ResponseStatus.Ok, "Succesfully logged out");
        }
        
       
        
        return new Response<>(ResponseStatus.Unauthorized, "Invalid token");
        
        
    }

    @Override
    public Response<String> requestPasswordChange(String email) {
        if (email == null || email.equals("")) {
            return new Response<>(ResponseStatus.BadRequest, "Invalid email");
        }
       
       
       Optional<User> currentUserResponse=userRepository.findByEmail(email);
        
        if ((currentUserResponse.isEmpty())) {
            return new Response<>(ResponseStatus.NotFound, "User with provided email does not exist");
        }
        

       
        Optional<Token> postoji=tokenRepository.findByUser(currentUserResponse.get());
        if(!postoji.isEmpty()){
              tokenRepository.delete(postoji.get());
        }
        

        Token token = tokenService.createPasswordSetupOrChangeToken(currentUserResponse.get(),2);
        String tokenString = token.getVrednostTokena();

        
        emailService.sendPasswordChangeLink(email, tokenString);

        return new Response<>(ResponseStatus.Ok, "Password change link sent successfully to "+currentUserResponse.get().getEmail());
    }

    @Transactional
    @Override
    public Response<String> setupOrChangePassword(String token, String newPassword) {
        if (token == null || newPassword == null) {
            return new Response<>(ResponseStatus.BadRequest, "Invalid parameters");
        }
        Response<User> userResponse = userService.findUserByToken(token);
        /// Optional<Token> postojeci=tokenRepository.findByVrednostTokena(token);
        if (!(userResponse.getStatus() == ResponseStatus.Ok) || !tokenService.validateTokenForResetPassword(token)) {
            return new Response<>(ResponseStatus.Unauthorized, "User with this token does not exist");
        }
       
       
        
        
        tokenService.deleteToken(token);
        Password password = new Password();
        password.setUser(userResponse.getData());
        String hashedPassword=hashPasswordService.hashPassword(newPassword);
        password.setPasswordHash(hashedPassword);
        Optional<Password> postojeca=passwordRepository.findByUserId(userResponse.getData().getId());
        if(postojeca.isEmpty()){
            passwordRepository.save(password);
        }
        else{
            password.setId(postojeca.get().getId());
            passwordRepository.save(password);
        }
        
       
        
        return new Response<>(ResponseStatus.Ok, "Password successfully changed");
    }

   

   
    
   
}
