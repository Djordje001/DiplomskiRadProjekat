/*
 * Click nbfs://nbhost/SystemFileSystem/Templates/Licenses/license-default.txt to change this license
 * Click nbfs://nbhost/SystemFileSystem/Templates/Classes/Class.java to edit this template
 */
package napredne.java.tehnologije.njtserver.DTOs;

import org.springframework.web.multipart.MultipartFile;

/**
 *
 * @author Lenovo
 */
public record UploadProizvodDto(double cena,String naziv,MultipartFile file) {
    
}
