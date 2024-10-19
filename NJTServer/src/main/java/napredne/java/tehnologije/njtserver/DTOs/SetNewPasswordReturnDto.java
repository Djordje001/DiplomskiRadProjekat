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
public class SetNewPasswordReturnDto {
    private User user;
    private String poruka;
    

    public SetNewPasswordReturnDto() {
    }

    public SetNewPasswordReturnDto(User user, String poruka) {
        this.user = user;
        this.poruka = poruka;
    }

    public String getPoruka() {
        return poruka;
    }

    public void setPoruka(String poruka) {
        this.poruka = poruka;
    }

    public User getUser() {
        return user;
    }

    public void setUser(User user) {
        this.user = user;
    }
    
    
    
    
    
    
}
