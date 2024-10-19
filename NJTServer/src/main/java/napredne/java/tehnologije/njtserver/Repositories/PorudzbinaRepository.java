/*
 * Click nbfs://nbhost/SystemFileSystem/Templates/Licenses/license-default.txt to change this license
 * Click nbfs://nbhost/SystemFileSystem/Templates/Classes/Interface.java to edit this template
 */
package napredne.java.tehnologije.njtserver.Repositories;

import java.util.List;
import napredne.java.tehnologije.njtserver.Models.Kupac;
import napredne.java.tehnologije.njtserver.Models.Porudzbina;
import org.springframework.data.jpa.repository.JpaRepository;

/**
 *
 * @author Lenovo
 */
public interface PorudzbinaRepository extends JpaRepository<Porudzbina, Long>{
    List<Porudzbina> findByPrihvacenaFalseAndRejectionMessageIsNull();
    List<Porudzbina> findByPrihvacenaTrueAndObradjenaFalse();
    List<Porudzbina> findByKupacAndObradjenaTrue(Kupac kupac);

    public List<Porudzbina> findByObradjenaTrue();

    public List<Porudzbina> findByPrihvacenaFalseAndRejectionMessageNotNull();
    public List<Porudzbina> findByEmailContainingIgnoreCase(String email);
}
