package napredne.java.tehnologije.njtserver.Repositories;

import jakarta.transaction.Transactional;
import org.springframework.data.jpa.repository.JpaRepository;


import java.util.Optional;
import napredne.java.tehnologije.njtserver.Models.Password;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

public interface PasswordRepository extends JpaRepository<Password, Long> {
    Optional<Password> findByUserId(Long userId);
    
    @Modifying
    @Transactional
    @Query("UPDATE Password p SET p.passwordHash = :passwordHash WHERE p.user.id = :userId")
    void updatePasswordByUserId(@Param("passwordHash") String passwordHash, @Param("userId") Long userId);
}