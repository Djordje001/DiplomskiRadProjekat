package napredne.java.tehnologije.njtserver.Repositories;

import java.util.Date;
import java.util.List;
import java.util.Optional;
import napredne.java.tehnologije.njtserver.Models.Token;
import napredne.java.tehnologije.njtserver.Models.User;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.jpa.repository.Query;

import org.springframework.transaction.annotation.Transactional;


public interface TokenRepository extends JpaRepository<Token, Long> {
    Optional<Token> findByVrednostTokena(String token);
    List<Token> findByExpiresAtBefore(Date now);
    void deleteByVrednostTokena(String vrednostTokena);
    Optional<Token> findByUser(User user);
    
    @Modifying
    @Transactional
    @Query("DELETE FROM Token t WHERE t.expiresAt < :now")
    void deleteByExpiresAtBefore(Date now);

    @Modifying
    @Transactional
    @Query("DELETE FROM Token t WHERE t.user = :user")
    void deleteByUser(User user);
}
