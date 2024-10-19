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
public class LoginReturnDto {
    private User user;
    private String token;
    private String poruka;

    public LoginReturnDto() {
    }

    public LoginReturnDto(User user, String token, String poruka) {
        this.user = user;
        this.token = token;
        this.poruka = poruka;
    }

    public User getUser() {
        return user;
    }

    public void setUser(User user) {
        this.user = user;
    }

    public String getToken() {
        return token;
    }

    public void setToken(String token) {
        this.token = token;
    }

    public String getPoruka() {
        return poruka;
    }

    public void setPoruka(String poruka) {
        this.poruka = poruka;
    }
    
    
}
