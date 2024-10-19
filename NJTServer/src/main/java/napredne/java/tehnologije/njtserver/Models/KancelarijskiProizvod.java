/*
 * Click nbfs://nbhost/SystemFileSystem/Templates/Licenses/license-default.txt to change this license
 * Click nbfs://nbhost/SystemFileSystem/Templates/Classes/Class.java to edit this template
 */
package napredne.java.tehnologije.njtserver.Models;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;
import napredne.java.tehnologije.njtserver.Enums.VrstaKancelarijskogProizvoda;

/**
 *
 * @author Lenovo
 */

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Entity
@DiscriminatorValue("KancelarijskiProizvod")
public class KancelarijskiProizvod extends Proizvod{
    
    
      @Column(name = "vrsta_kancelarijskog_proizvoda")
     @Enumerated(EnumType.STRING)
    private VrstaKancelarijskogProizvoda vrstaKancelarijskogProizvoda;
      
      
     private String proizvodjac;
     private double visina;
     private double sirina;
     private double duzina;
     
     
    
}
