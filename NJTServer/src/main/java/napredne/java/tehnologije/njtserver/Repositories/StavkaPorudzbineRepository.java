/*
 * Click nbfs://nbhost/SystemFileSystem/Templates/Licenses/license-default.txt to change this license
 * Click nbfs://nbhost/SystemFileSystem/Templates/Classes/Class.java to edit this template
 */
package napredne.java.tehnologije.njtserver.Repositories;

import java.util.List;
import napredne.java.tehnologije.njtserver.Models.Proizvod;
import napredne.java.tehnologije.njtserver.Models.StavkaPorudzbine;
import org.springframework.data.jpa.repository.JpaRepository;

/**
 *
 * @author Lenovo
 */
public interface StavkaPorudzbineRepository extends JpaRepository<StavkaPorudzbine, Long> {
  
    List<StavkaPorudzbine> findByProizvod(Proizvod proizvod);


}
