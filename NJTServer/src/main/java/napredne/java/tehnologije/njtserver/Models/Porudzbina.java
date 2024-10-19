/*
 * Click nbfs://nbhost/SystemFileSystem/Templates/Licenses/license-default.txt to change this license
 * Click nbfs://nbhost/SystemFileSystem/Templates/Classes/Class.java to edit this template
 */
package napredne.java.tehnologije.njtserver.Models;

import java.util.Date;
import java.util.List;
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
@Table(name="porudzbina")
public class Porudzbina {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;
    
    
     @Column(name = "datum_vreme")
    private Date datumVreme;
     
     private String email;
     
     @Column(name = "full_name")
     private String fullName;
     
     @Column(name="phone_number")
     private String phoneNumber;
     
   /*  @Column(name = "datum_isporuke")
    private Date datumIsporuke;*/
      
  //  private String grad;
    private String adresa;
    
    
    private double cena;
    private double popust;
     @Column(name = "konacna_cena")
    private double konacnaCena;
     
    @ManyToOne
@JoinColumn(name = "approver_id", referencedColumnName = "id")
private Admin approver;
    
   
         
         
    @ManyToOne
    @JoinColumn(name = "kupac_id", referencedColumnName = "id")
    private Kupac kupac;
    
    
    private boolean prihvacena;
    
    
    private boolean obradjena;
    
    @Column(name="rejection_message")
    private String rejectionMessage;
    
    
    @OneToMany(mappedBy="porudzbina",fetch = FetchType.EAGER, cascade = CascadeType.ALL, orphanRemoval = true)
    private List<StavkaPorudzbine> stavkePorudzbine;
    
    
}
