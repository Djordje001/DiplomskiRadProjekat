/*
 * Click nbfs://nbhost/SystemFileSystem/Templates/Licenses/license-default.txt to change this license
 * Click nbfs://nbhost/SystemFileSystem/Templates/Classes/Class.java to edit this template
 */
package napredne.java.tehnologije.njtserver.DTOs;

import napredne.java.tehnologije.njtserver.Models.Porudzbina;

/**
 *
 * @author Lenovo
 */
public class CreatePorudzbinaReturnDto {
    private Porudzbina order;
    private String message;

    public CreatePorudzbinaReturnDto() {
    }

    public CreatePorudzbinaReturnDto(Porudzbina order, String message) {
        this.order = order;
        this.message = message;
    }

    public Porudzbina getOrder() {
        return order;
    }

    public void setOrder(Porudzbina order) {
        this.order = order;
    }

    public String getMessage() {
        return message;
    }

    public void setMessage(String message) {
        this.message = message;
    }
    
    
    
}
