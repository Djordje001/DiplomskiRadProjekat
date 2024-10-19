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

/**
 *
 * @author Lenovo
 */


@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Entity
@Table(name="autor")
public class Autor {
    
    @ManyToOne
    @JoinColumn(name = "knjiga_id", referencedColumnName = "id")
    @JsonIgnore
    private Knjiga knjiga;
    
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;
    
  
    @ManyToOne
    @JoinColumn(name = "pisac_id", referencedColumnName = "id")
    private Pisac pisac;
    
 
}
