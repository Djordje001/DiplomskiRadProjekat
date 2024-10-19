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

/**
 *
 * @author Lenovo
 */

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Entity
@Inheritance
@DiscriminatorColumn(name = "tip")
@Table(name = "proizvod")
public class Proizvod {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

   
    private double cena;

    
    private String naziv;
    
    private String url;
    
    private int kolicina;


}
