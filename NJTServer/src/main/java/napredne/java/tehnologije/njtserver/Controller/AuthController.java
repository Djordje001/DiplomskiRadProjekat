package napredne.java.tehnologije.njtserver.Controller;


import java.util.Map;
import lombok.RequiredArgsConstructor;
import napredne.java.tehnologije.njtserver.DTOs.ChangePasswordDto;
import napredne.java.tehnologije.njtserver.DTOs.LoginReturnDto;
import napredne.java.tehnologije.njtserver.DTOs.LoginUserDto;
import napredne.java.tehnologije.njtserver.DTOs.LogoutUserDto;
import napredne.java.tehnologije.njtserver.DTOs.RegisterUserDto;
import napredne.java.tehnologije.njtserver.DTOs.RequestPasswordChangeDto;

import napredne.java.tehnologije.njtserver.Services.AuthService;
import napredne.java.tehnologije.njtserver.Services.TokenService;
import napredne.java.tehnologije.njtserver.Utils.Response;
import napredne.java.tehnologije.njtserver.Utils.ResponseConverter;
import org.springframework.http.HttpStatus;

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;


@RequiredArgsConstructor
@RestController
@RequestMapping("/api/auth")
@CrossOrigin(origins = "*")
public class AuthController {

    private final AuthService authService;
    private final ResponseConverter<String> converter;
    private final ResponseConverter<LoginReturnDto> loginconverter;
    private final TokenService tokenService;
    

    @PostMapping("/register")
    public ResponseEntity<String> registerUser(@RequestBody RegisterUserDto dto) {
        System.out.println(String.valueOf(dto.datumRodjenja()));
        Response<String> response = authService.registerUser(dto.email(),dto.firstName(),dto.lastName(),dto.datumRodjenja(),dto.brojTelefona());
        return converter.toResponseEntity(response);
    }
    
   

    @PostMapping("/login")
    public ResponseEntity<LoginReturnDto> loginUser(@RequestBody LoginUserDto dto) {
        Response<LoginReturnDto> response = authService.loginUser(dto.email(), dto.password());
        return loginconverter.toResponseEntity(response);
    }
    
    @PostMapping("/logout")
    public ResponseEntity<String> logoutUser(@RequestBody LogoutUserDto dto) {
        Response<String> response = authService.logoutUser(dto.vrednostTokena());
        return converter.toResponseEntity(response);
    }

    @PostMapping("/request-password-change")
    public ResponseEntity<String> requestPasswordChange(@RequestBody RequestPasswordChangeDto dto) {
        
        Response<String> response = authService.requestPasswordChange(dto.email());
        return converter.toResponseEntity(response);
    }

    @PostMapping("/change-password")
    public ResponseEntity<String> setupOrChangePassword(@RequestBody ChangePasswordDto dto) {
        Response<String> response = authService.setupOrChangePassword(dto.token(), dto.newPassword());
        return converter.toResponseEntity(response);
    }
    
    @PostMapping("/validate-token")
    public ResponseEntity<?> validateToken(@RequestBody Map<String, String> request) {
        String token = request.get("token");

        // Logika za validaciju tokena
        boolean isValid = tokenService.validateTokenForResetPassword(token);
        System.out.println(isValid);

        if (isValid) {
            return ResponseEntity.ok().body("Token is valid");
        } else {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body("Invalid or expired token");
        }
    }
    
    
   
    
  
}

