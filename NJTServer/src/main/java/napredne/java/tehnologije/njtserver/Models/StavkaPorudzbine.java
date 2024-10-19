/*
 * Click nbfs://nbhost/SystemFileSystem/Templates/Licenses/license-default.txt to change this license
 * Click nbfs://nbhost/SystemFileSystem/Templates/Classes/Class.java to edit this template
 */
package napredne.java.tehnologije.njtserver.Models;

import com.fasterxml.jackson.annotation.JsonIgnore;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;
import org.hibernate.annotations.OnDelete;
import org.hibernate.annotations.OnDeleteAction;

/**
 *
 * @author Lenovo
 */


@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Entity
@Table(name="stavkaporudzbine")
public class StavkaPorudzbine {
     @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;
     
     
    @JsonIgnore
    @ManyToOne
    @JoinColumn(name = "porudzbina_id", referencedColumnName = "id")
    private Porudzbina porudzbina;
    
   
      
    private int kolicina;
    private double cena;
    
     
    @ManyToOne
    @JoinColumn(name = "proizvod_id", referencedColumnName = "id",nullable = true)
    @OnDelete(action = OnDeleteAction.SET_NULL)
    private Proizvod proizvod;
    
    
   
         
         
   
}
