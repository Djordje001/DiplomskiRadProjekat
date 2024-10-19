/*
 * Click nbfs://nbhost/SystemFileSystem/Templates/Licenses/license-default.txt to change this license
 * Click nbfs://nbhost/SystemFileSystem/Templates/Classes/Class.java to edit this template
 */
package napredne.java.tehnologije.njtserver.Models;

import jakarta.persistence.*;
import java.util.Date;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;
import napredne.java.tehnologije.njtserver.Enums.TipKupca;

/**
 *
 * @author Lenovo
 */
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Entity
@DiscriminatorValue("Kupac")
public class Kupac extends User{
   
     @Column(name = "tip_kupca")
     @Enumerated(EnumType.STRING)
    private TipKupca tipKupca;
     
     @Column(name="datum_rodjenja")
     private Date datumRodjenja;

    @Override
    public String toString() {
        return super.toString()+"Kupac{" + "tipKupca=" + tipKupca + ", datumRodjenja=" + datumRodjenja + '}';
    }

    
     
     
     
     
}
