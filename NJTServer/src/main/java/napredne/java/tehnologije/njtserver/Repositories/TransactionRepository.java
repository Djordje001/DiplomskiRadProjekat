/*
 * Click nbfs://nbhost/SystemFileSystem/Templates/Licenses/license-default.txt to change this license
 * Click nbfs://nbhost/SystemFileSystem/Templates/Classes/Class.java to edit this template
 */
package napredne.java.tehnologije.njtserver.Repositories;

import java.util.Optional;
import napredne.java.tehnologije.njtserver.Models.Porudzbina;
import napredne.java.tehnologije.njtserver.Models.Transaction;
import org.springframework.data.jpa.repository.JpaRepository;

/**
 *
 * @author Lenovo
 */
public interface TransactionRepository extends JpaRepository<Transaction, Long>{
      Optional<Transaction> findByOrder(Porudzbina order);
}
