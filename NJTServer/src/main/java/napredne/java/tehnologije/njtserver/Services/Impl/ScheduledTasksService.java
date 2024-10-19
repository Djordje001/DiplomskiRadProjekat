package napredne.java.tehnologije.njtserver.Services.Impl;

import java.util.Date;
import lombok.RequiredArgsConstructor;

import napredne.java.tehnologije.njtserver.Repositories.TokenRepository;
import org.springframework.scheduling.annotation.Scheduled;
import org.springframework.stereotype.Service;

@RequiredArgsConstructor
@Service
public class ScheduledTasksService {
    private final TokenRepository tokenRepository;
    

   @Scheduled(cron = "0 0 5 * * *") // Svaki dan u 5:00 ujutru
   //@Scheduled(fixedRate = 15000) // Svakih 15 sekundi (15000 milisekundi)
    public void performDailyTask() {
        tokenRepository.deleteByExpiresAtBefore(new Date());
       
    }
}