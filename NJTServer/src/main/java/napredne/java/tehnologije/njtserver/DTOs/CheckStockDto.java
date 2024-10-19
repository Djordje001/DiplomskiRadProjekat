/*
 * Click nbfs://nbhost/SystemFileSystem/Templates/Licenses/license-default.txt to change this license
 * Click nbfs://nbhost/SystemFileSystem/Templates/Classes/Class.java to edit this template
 */
package napredne.java.tehnologije.njtserver.DTOs;

/**
 *
 * @author Lenovo
 */
public class CheckStockDto {
    private String message;
    private Boolean indikator;

    public CheckStockDto() {
    }

    public CheckStockDto(String message, Boolean indikator) {
        this.message = message;
        this.indikator = indikator;
    }

    public String getMessage() {
        return message;
    }

    public void setMessage(String message) {
        this.message = message;
    }

    public Boolean getIndikator() {
        return indikator;
    }

    public void setIndikator(Boolean indikator) {
        this.indikator = indikator;
    }
    
    
    
}
