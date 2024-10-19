/*
 * Click nbfs://nbhost/SystemFileSystem/Templates/Licenses/license-default.txt to change this license
 * Click nbfs://nbhost/SystemFileSystem/Templates/Classes/Class.java to edit this template
 */
package napredne.java.tehnologije.njtserver.DTOs;

import napredne.java.tehnologije.njtserver.Models.User;

/**
 *
 * @author Lenovo
 */
public class UpdateUserReturnDto {
    private String token;
    private String message;

    public UpdateUserReturnDto() {
    }

    public UpdateUserReturnDto(String token, String message) {
        this.token = token;
        this.message = message;
    }
    
    public String getToken() {
        return token;
    }

    public void setToken(String token) {
        this.token = token;
    }

    public String getMessage() {
        return message;
    }

    public void setMessage(String message) {
        this.message = message;
    }

    
    
    
    
}
