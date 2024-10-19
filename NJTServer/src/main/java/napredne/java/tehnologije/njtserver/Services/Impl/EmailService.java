package napredne.java.tehnologije.njtserver.Services.Impl;

import java.time.LocalDate;
import java.time.format.DateTimeFormatter;
import lombok.RequiredArgsConstructor;
import napredne.java.tehnologije.njtserver.Models.Porudzbina;
import napredne.java.tehnologije.njtserver.Models.StavkaPorudzbine;
import org.springframework.mail.SimpleMailMessage;
import org.springframework.mail.javamail.JavaMailSender;
import org.springframework.scheduling.annotation.Async;
import org.springframework.stereotype.Service;

@RequiredArgsConstructor
@Service
public class EmailService {

    private final JavaMailSender mailSender;

    
    @Async
    public void sendTempPassword(String email, String tempPassword) {
        SimpleMailMessage message = new SimpleMailMessage();

        message.setTo(email);
        message.setFrom("djordjevic.dj01@gmail.com");
        message.setSubject("Temporary password");
        message.setText("Your temporary password is: " + tempPassword);

        mailSender.send(message);
    }

    
   @Async
     public void sendPasswordChangeLink(String email, String token){
        SimpleMailMessage message = new SimpleMailMessage();
        
        message.setTo(email);
        message.setFrom("djordjevic.dj01@gmail.com");
        message.setSubject("Password change");
        message.setText("Click on this link to change your password: " + "http://localhost:3000/change-password?token=" + token);

        mailSender.send(message);
    }
    
     
      
   @Async
     public void sendPasswordSetupLink(String email, String token){
        SimpleMailMessage message = new SimpleMailMessage();
        
        message.setTo(email);
         message.setFrom("djordjevic.dj01@gmail.com");
        message.setSubject("Password setup");
        message.setText("Click on this link to setup your password: " + "http://localhost:3000/setup-password?token=" + token);

        mailSender.send(message);
    }
     
     
     

     @Async
    void sendInfoAboutReceiving(String email,Porudzbina porudzbina) {
         SimpleMailMessage message = new SimpleMailMessage();

        message.setTo(email);
         message.setFrom("djordjevic.dj01@gmail.com");
        message.setSubject("Order Receiving Notification");

       
        StringBuilder sb = new StringBuilder();
        sb.append("Dear Customer,\n\n");
        sb.append("Thank you for your order.\n\n");
        sb.append("Order Details:\n");
        sb.append("Address: ").append(porudzbina.getAdresa()).append("\n");
      sb.append("Phone number:").append(porudzbina.getPhoneNumber()).append("\n");
        sb.append("Full name:").append(porudzbina.getFullName()).append("\n");
       

        sb.append("Items Ordered:\n");
        for (StavkaPorudzbine stavka : porudzbina.getStavkePorudzbine()) {
            sb.append("- ").append(stavka.getProizvod().getNaziv())
              .append(" (").append(stavka.getKolicina()).append(" pieces)\n");
        }
        sb.append("\n");
          if (porudzbina.getPopust() > 0) {
            sb.append("Because you are "+porudzbina.getKupac().getTipKupca()+" type of user u got discount.\n");
            sb.append("Discount Applied: ").append(porudzbina.getPopust()).append(" %\n");
            
            sb.append("Total Amount Before Discount: ").append(porudzbina.getCena()).append(" EUR\n");
            sb.append("Total Amount After Discount: ").append(porudzbina.getKonacnaCena()).append(" EUR\n\n");
        } else {
            sb.append("Total Amount: ").append(porudzbina.getKonacnaCena()).append(" EUR\n\n");
        }
          
            LocalDate today = LocalDate.now();
        DateTimeFormatter formatter = DateTimeFormatter.ofPattern("dd.MM.yyyy");
        String formattedDate = today.format(formatter);
        
        //  sb.append("\nPlease note that your order will only be valid once we receive the payment of the mentioned amount by today, ")
       //   .append(formattedDate).append(".\n\n");
       // sb.append("Payment Details:\n");
        //sb.append("Name: Djordje Djordjevic\n");
        //sb.append("Account: 170-0010577174000-35\n");
        //sb.append("Total Amount: ").append(porudzbina.getKonacnaCena()).append(" EUR\n\n");
        
         sb.append("Our admin team will soon process your order. ");
sb.append("Thank you for your patience!");
        message.setText(sb.toString());

        mailSender.send(message);
    }

    @Async
    void sendInfoAboutRejecting(String email,Porudzbina porudzbina,String poruka) {
        SimpleMailMessage message = new SimpleMailMessage();

        message.setTo(email);
        message.setFrom("djordjevic.dj01@gmail.com");
        message.setSubject("Order Rejection Notification");

       
        StringBuilder sb = new StringBuilder();
        sb.append("Dear Customer,\n\n");
        sb.append("We regret to inform you that your order has been rejected because:"+poruka+".\n\n");
        sb.append("We have refunded all the necessary amounts to your original payment method.\n\n");

        sb.append("**Order Details:**\n");
        sb.append("Order ID: ").append(porudzbina.getId()).append("\n");
        sb.append("Address: ").append(porudzbina.getAdresa()).append("\n");
          sb.append("Phone number:").append(porudzbina.getPhoneNumber()).append("\n");
        sb.append("Full name:").append(porudzbina.getFullName()).append("\n\n");
        sb.append("Total Amount Before Discount: ").append(porudzbina.getCena()).append(" EUR\n");
        sb.append("Total Amount After Discount: ").append(porudzbina.getKonacnaCena()).append(" EUR\n\n");

        sb.append("**Items Ordered:**\n");
        for (StavkaPorudzbine stavka : porudzbina.getStavkePorudzbine()) {
            sb.append("- ").append(stavka.getProizvod().getNaziv())
              .append(" (").append(stavka.getKolicina()).append(" pieces)\n");
        }
        sb.append("\n");

        if (porudzbina.getPopust() > 0) {
            sb.append("**Discount Information:**\n");
            sb.append("As a ").append(porudzbina.getKupac().getTipKupca()).append(" customer, you received a discount.\n");
            sb.append("Discount Applied: ").append(porudzbina.getPopust()).append(" %\n \n");
        }

        sb.append("Please review the above details and take note of the rejection.\n\n");
        sb.append("Thank you for your attention.\n");

        message.setText(sb.toString());

        mailSender.send(message);
    }

    
    @Async
    void sendInfoAboutAccepting(String email,Porudzbina porudzbina) {
         SimpleMailMessage message = new SimpleMailMessage();

        message.setTo(email);
        message.setFrom("djordjevic.dj01@gmail.com");
        message.setSubject("Order Acceptance Notification");

       
        StringBuilder sb = new StringBuilder();
        sb.append("Dear Customer,\n\n");
        sb.append("We are pleased to inform you that your order has been accepted as we have received the payment.\n\n");

        sb.append("**Order Details:**\n");
        sb.append("Order ID: ").append(porudzbina.getId()).append("\n");
        sb.append("Address: ").append(porudzbina.getAdresa()).append("\n");
        sb.append("Total Amount Before Discount: ").append(porudzbina.getCena()).append(" EUR\n");
        sb.append("Total Amount After Discount: ").append(porudzbina.getKonacnaCena()).append(" EUR\n\n");

        sb.append("**Items Ordered:**\n");
        for (StavkaPorudzbine stavka : porudzbina.getStavkePorudzbine()) {
            sb.append("- ").append(stavka.getProizvod().getNaziv())
              .append(" (").append(stavka.getKolicina()).append(" pieces)\n");
        }
        sb.append("\n");

        if (porudzbina.getPopust() > 0) {
            sb.append("**Discount Information:**\n");
            sb.append("As a ").append(porudzbina.getKupac().getTipKupca()).append(" customer, you received a discount.\n");
            sb.append("Discount Applied: ").append(porudzbina.getPopust()).append(" %\n \n");
        }

        sb.append("Please note that your order is now valid and will be processed shortly.\n\n");
        sb.append("Thank you for your prompt payment and for choosing us.\n");

        message.setText(sb.toString());

        mailSender.send(message);
    }

    @Async
    void sendInfoAboutProcessing(String email,Porudzbina porudzbina) {
        SimpleMailMessage message = new SimpleMailMessage();

        message.setTo(email);
        message.setFrom("djordjevic.dj01@gmail.com");
        message.setSubject("Order Processing Notification");

       
        StringBuilder sb = new StringBuilder();
        sb.append("Dear Customer,\n\n");
        sb.append("We are pleased to inform you that your order has been processed and is now awaiting shipment to your desired destination.\n\n");

        sb.append("**Order Details:**\n");
        sb.append("Order ID: ").append(porudzbina.getId()).append("\n");
        sb.append("Address: ").append(porudzbina.getAdresa()).append("\n");
         sb.append("Phone number:").append(porudzbina.getPhoneNumber()).append("\n");
        sb.append("Full name:").append(porudzbina.getFullName()).append("\n\n");
        
        
        sb.append("Total Amount Before Discount: ").append(porudzbina.getCena()).append(" EUR\n");
        sb.append("Total Amount After Discount: ").append(porudzbina.getKonacnaCena()).append(" EUR\n\n");

        sb.append("**Items Ordered:**\n");
        for (StavkaPorudzbine stavka : porudzbina.getStavkePorudzbine()) {
            sb.append("- ").append(stavka.getProizvod().getNaziv())
              .append(" (").append(stavka.getKolicina()).append(" pieces)\n");
        }
        sb.append("\n");

        if (porudzbina.getPopust() > 0) {
            sb.append("**Discount Information:**\n");
            sb.append("As a ").append(porudzbina.getKupac().getTipKupca()).append(" customer, you received a discount.\n");
            sb.append("Discount Applied: ").append(porudzbina.getPopust()).append(" %\n \n");
        }

        sb.append("Your order is now in the processing stage and we will notify you once it is out for delivery.\n\n");
        sb.append("Thank you for your patience and for choosing us.\n");

        message.setText(sb.toString());

        mailSender.send(message);
    }
}
