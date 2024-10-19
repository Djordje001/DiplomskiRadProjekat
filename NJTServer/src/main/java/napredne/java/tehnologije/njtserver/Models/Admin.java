/*
 * Click nbfs://nbhost/SystemFileSystem/Templates/Licenses/license-default.txt to change this license
 * Click nbfs://nbhost/SystemFileSystem/Templates/Classes/Class.java to edit this template
 */
package napredne.java.tehnologije.njtserver.Models;

//import javax.persistence.Entity;
import jakarta.persistence.Entity;
import jakarta.persistence.*;
import java.util.Date;


import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;
import napredne.java.tehnologije.njtserver.Enums.TipAdmina;

/**
 *
 * @author Lenovo
 */
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Entity
@DiscriminatorValue("Admin")
public class Admin extends User {

    @Column(name="datum_zaposlenja")
     private Date datumZaposlenja;

   
     @Column(name = "tip_admina")
     @Enumerated(EnumType.STRING)
    private TipAdmina tipAdmina;
}
