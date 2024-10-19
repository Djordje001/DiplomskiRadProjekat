/*
 * Click nbfs://nbhost/SystemFileSystem/Templates/Licenses/license-default.txt to change this license
 * Click nbfs://nbhost/SystemFileSystem/Templates/Classes/Interface.java to edit this template
 */
package napredne.java.tehnologije.njtserver.Repositories;

import java.util.List;

import napredne.java.tehnologije.njtserver.Models.Proizvod;
import org.springframework.data.jpa.repository.JpaRepository;

/**
 *
 * @author Lenovo
 */
public interface ProizvodRepository extends JpaRepository<Proizvod, Long>{
       List<Proizvod> findByNazivContainingIgnoreCase(String naziv);
}
