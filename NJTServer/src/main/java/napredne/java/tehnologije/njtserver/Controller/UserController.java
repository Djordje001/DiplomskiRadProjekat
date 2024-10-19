/*
 * Click nbfs://nbhost/SystemFileSystem/Templates/Licenses/license-default.txt to change this license
 * Click nbfs://nbhost/SystemFileSystem/Templates/Classes/Class.java to edit this template
 */
package napredne.java.tehnologije.njtserver.Controller;

import io.jsonwebtoken.Claims;
import java.util.Date;
import java.util.List;
import java.util.logging.Level;
import java.util.logging.Logger;
import lombok.RequiredArgsConstructor;
import napredne.java.tehnologije.njtserver.DTOs.UpdateUserReturnDto;
import napredne.java.tehnologije.njtserver.Enums.TipKupca;
import napredne.java.tehnologije.njtserver.Enums.TipUsera;

import napredne.java.tehnologije.njtserver.Models.User;
import napredne.java.tehnologije.njtserver.Services.TokenService;

import napredne.java.tehnologije.njtserver.Services.UserService;
import napredne.java.tehnologije.njtserver.Utils.Response;
import napredne.java.tehnologije.njtserver.Utils.ResponseConverter;
import org.springframework.format.annotation.DateTimeFormat;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestHeader;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

/**
 *
 * @author Lenovo
 */

@RequiredArgsConstructor
@RestController
@RequestMapping("/api/users")
//@CrossOrigin(origins = "http://localhost:3000")
@CrossOrigin(origins = "*")
public class UserController {
      private final ResponseConverter<User> converter;
      private final ResponseConverter<String> converterS;
      private final UserService userService;
        private final ResponseConverter<UpdateUserReturnDto> converterUDto;
        
      
       /* @GetMapping("/silver")
    public ResponseEntity<List<User>> getAllUsersWhoNeedPromotionToSilver() {
        Response<List<User>> users = (Response<List<User>>) userService.getAllUsersWhoNeedPromotionToSilver();
        return converter.toListResponseEntity(users);
    }
    
    
     @GetMapping("/gold")
    public ResponseEntity<List<User>> getAllUsersWhoNeedPromotionToGold() {
        Response<List<User>> users = (Response<List<User>>) userService.getAllUsersWhoNeedPromotionToGold();
        return converter.toListResponseEntity(users);
    }
    
     @PutMapping("/promote/{id}")
    public ResponseEntity<String> promote( @RequestHeader(value = "Authorization", required = true) String token,
               @PathVariable Long id,
                       @RequestParam("tipKupca") TipKupca tipKupca
) 
    {
        Response<String> response = (Response<String>) userService.promote(token,id,tipKupca);
        return converterS.toResponseEntity(response);
    }*/
    
    
    @PutMapping("/change-user-data")
public ResponseEntity<UpdateUserReturnDto> changeUserData(
        @RequestHeader(value = "Authorization", required = true) String token,
    //    @RequestParam("id") Long id,
        @RequestParam("firstName") String firstName,
        @RequestParam("lastName") String lastName,
        @RequestParam(value="datumRodjenja", required = false) 
        @DateTimeFormat(pattern = "yyyy-MM-dd") Date datumRodjenja,
        @RequestParam(value="brojTelefona") String brojTelefona) {
    
    
    Response<UpdateUserReturnDto> response;
    if(datumRodjenja != null) {
        response = userService.changeUserData(token, firstName, lastName, datumRodjenja, brojTelefona, TipUsera.KUPAC);
    } else {
        response = userService.changeUserData(token, firstName, lastName, null, brojTelefona, TipUsera.ADMIN);
    }
    return converterUDto.toResponseEntity(response);
}
     
    
    
}
