/*
 * Click nbfs://nbhost/SystemFileSystem/Templates/Licenses/license-default.txt to change this license
 * Click nbfs://nbhost/SystemFileSystem/Templates/Classes/Class.java to edit this template
 */
package napredne.java.tehnologije.njtserver.DTOs;

import napredne.java.tehnologije.njtserver.Models.Proizvod;

/**
 *
 * @author Lenovo
 */
public class UpdateProizvodReturnDto {
     private String message;
    private Proizvod product;

    public UpdateProizvodReturnDto() {
    }

    public UpdateProizvodReturnDto(String message, Proizvod product) {
        this.message = message;
        this.product = product;
    }

    public String getMessage() {
        return message;
    }

    public void setMessage(String message) {
        this.message = message;
    }

    public Proizvod getProduct() {
        return product;
    }

    public void setProduct(Proizvod product) {
        this.product = product;
    }
}
