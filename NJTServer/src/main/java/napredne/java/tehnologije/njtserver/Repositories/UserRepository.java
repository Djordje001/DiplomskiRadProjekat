package napredne.java.tehnologije.njtserver.Repositories;

import java.util.List;
import org.springframework.data.jpa.repository.JpaRepository;


import java.util.Optional;
import napredne.java.tehnologije.njtserver.Models.User;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

public interface UserRepository extends JpaRepository<User, Long> {
    Optional<User> findByEmail(String email);
    
     @Query("SELECT u FROM User u WHERE u.tipKupca = 'SILVER' AND (SELECT COUNT(p) FROM Porudzbina p WHERE p.kupac = u) > :count")
    List<User> findUsersWithMoreThanOrdersAndSilverType(@Param("count") Long count);
    
       @Query("SELECT u FROM User u WHERE u.tipKupca = 'BRONZE' AND (SELECT COUNT(p) FROM Porudzbina p WHERE p.kupac = u) > :count")
    List<User> findUsersWithMoreThanOrdersAndBronzeType(@Param("count") Long count);
    
   
    
}
