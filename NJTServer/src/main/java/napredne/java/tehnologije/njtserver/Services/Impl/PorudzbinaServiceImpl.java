/*
 * Click nbfs://nbhost/SystemFileSystem/Templates/Licenses/license-default.txt to change this license
 * Click nbfs://nbhost/SystemFileSystem/Templates/Classes/Class.java to edit this template
 */
package napredne.java.tehnologije.njtserver.Services.Impl;

import com.fasterxml.jackson.core.JsonProcessingException;
import java.util.Date;
import java.util.List;
import java.util.Optional;
import lombok.RequiredArgsConstructor;
import napredne.java.tehnologije.njtserver.Enums.ResponseStatus;
import napredne.java.tehnologije.njtserver.Models.Admin;
import napredne.java.tehnologije.njtserver.Models.Kupac;
import napredne.java.tehnologije.njtserver.Models.Porudzbina;
import napredne.java.tehnologije.njtserver.Models.StavkaPorudzbine;
import napredne.java.tehnologije.njtserver.Models.Token;
import napredne.java.tehnologije.njtserver.Repositories.PorudzbinaRepository;
import napredne.java.tehnologije.njtserver.Repositories.TokenRepository;
import napredne.java.tehnologije.njtserver.Services.PorudzbinaService;
import napredne.java.tehnologije.njtserver.Utils.Response;
import org.springframework.stereotype.Service;

import com.fasterxml.jackson.core.type.TypeReference;
import com.fasterxml.jackson.databind.ObjectMapper;
import com.paypal.api.payments.DetailedRefund;
import com.paypal.base.rest.PayPalRESTException;
import io.jsonwebtoken.Claims;
import java.text.ParseException;
import java.text.SimpleDateFormat;
import java.util.logging.Level;
import java.util.logging.Logger;
//import napredne.java.tehnologije.njtserver.Config.PayPalService;
import napredne.java.tehnologije.njtserver.DTOs.CreatePorudzbinaReturnDto;
import napredne.java.tehnologije.njtserver.DTOs.UpdateUserReturnDto;
import napredne.java.tehnologije.njtserver.Enums.TipKupca;
import napredne.java.tehnologije.njtserver.Models.Proizvod;
import napredne.java.tehnologije.njtserver.Models.Transaction;
import napredne.java.tehnologije.njtserver.Models.User;
import napredne.java.tehnologije.njtserver.Repositories.ProizvodRepository;
import napredne.java.tehnologije.njtserver.Repositories.TransactionRepository;
import napredne.java.tehnologije.njtserver.Repositories.UserRepository;
import napredne.java.tehnologije.njtserver.Services.TokenService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.transaction.annotation.Transactional;


/**
 *
 * @author Lenovo
 */

@RequiredArgsConstructor
@Service
public class PorudzbinaServiceImpl implements PorudzbinaService{
    private final PorudzbinaRepository porudzbinaRepository;
    private final ProizvodRepository proizvodRepository;
    private final TokenRepository tokenRepository;
    private final UserRepository userRepository;
    private final ObjectMapper objectMapper;
     private final EmailService emailService;
    // private final SmsService smsService;
     private final TransactionRepository transactionRepository;
     private final TokenService tokenService;
     
       
    private final PayPalService payPalService;


    
    @Override
    public Response<List<Porudzbina>> getPendingOrders() {
        List<Porudzbina> porudzbine = porudzbinaRepository.findByPrihvacenaFalseAndRejectionMessageIsNull();
       
         
         return new Response<>(ResponseStatus.Ok, porudzbine);
    }
    
    
    
     @Override
    public Response<List<Porudzbina>> getProcessedOrders() {
        List<Porudzbina> porudzbine = porudzbinaRepository.findByObradjenaTrue();
       
         
         return new Response<>(ResponseStatus.Ok, porudzbine);
    }

    @Override
    public Response<List<Porudzbina>> getRejectedOrders() {
        List<Porudzbina> porudzbine = porudzbinaRepository.findByPrihvacenaFalseAndRejectionMessageNotNull();
       
         
         return new Response<>(ResponseStatus.Ok, porudzbine);
    }
    @Override
    public Response<List<Porudzbina>> findAllPorudzbine(String email) {
        List<Porudzbina> porudzbine = porudzbinaRepository.findByEmailContainingIgnoreCase(email);
       
         
         return new Response<>(ResponseStatus.Ok, porudzbine);
    }
        @Override
    public Response<List<Porudzbina>> getAllPorudzbine() {
     
         List<Porudzbina> porudzbine = porudzbinaRepository.findAll();
       
         
         return new Response<>(ResponseStatus.Ok, porudzbine);
    }
    
    
    /* @Override
    public Response<List<Porudzbina>> getUnprocessedOrders() {
        List<Porudzbina> porudzbine = porudzbinaRepository.findByPrihvacenaTrueAndObradjenaFalse();
       
         
         return new Response<>(ResponseStatus.Ok, porudzbine);
    }*/
    
    
    
     @Override
    public Response<CreatePorudzbinaReturnDto> createNewPorudzbina(String token, String adresa,String datumIsporukeString, String grad, Long kupacId, String stavkePorudzbineJson) {
        CreatePorudzbinaReturnDto dto=new CreatePorudzbinaReturnDto();
        
        
    SimpleDateFormat formatter = new SimpleDateFormat("yyyy-MM-dd");
    Date datumIsporuke;
    try {
        datumIsporuke = formatter.parse(datumIsporukeString);
        
    } catch (ParseException e) {
        
        dto.setMessage("Invalid date");
        dto.setOrder(null);
        return new Response<>(ResponseStatus.BadRequest, dto);
    }
        
       
        
        if(adresa==null || datumIsporuke==null || grad==null || kupacId==null || stavkePorudzbineJson==null ||
                adresa.equals("") || datumIsporuke.before(new Date()) || grad.equals("") || kupacId<=0 || stavkePorudzbineJson.equals("")){
           dto.setMessage("Invalid parameters");
           dto.setOrder(null);
            return new Response<>(ResponseStatus.BadRequest, dto);
        }
        if(!dobarTokenZaKupca(token)){
            dto.setMessage("Invalid token");
            dto.setOrder(null);
             return new Response<>(ResponseStatus.Unauthorized, dto);
        }
        
        
         Porudzbina porudzbina=new Porudzbina();
         porudzbina.setAdresa(adresa);
        // porudzbina.setDatumIsporuke(datumIsporuke);
       //  porudzbina.setGrad(grad);
        
         Optional<User> izbaze=userRepository.findById(kupacId);
         Kupac kupac=(Kupac) izbaze.get();
         kupac.setId(kupacId);
         porudzbina.setKupac(kupac);

        List<StavkaPorudzbine> stavkePorudzbine;
        double cenaPorudzbine=0;
        double konacnaCenaPorudzbine=0;
        double popust=0;
        if(kupac.getTipKupca()==TipKupca.BRONZE){
            popust=0;
        }
        if(kupac.getTipKupca()==TipKupca.SILVER){
            popust=10;
        }
        if(kupac.getTipKupca()==TipKupca.GOLD){
            popust=20;
        }
        try {
            stavkePorudzbine = objectMapper.readValue(stavkePorudzbineJson, new TypeReference<List<StavkaPorudzbine>>() {});
            for(StavkaPorudzbine stavka : stavkePorudzbine){
                double cenaStavke=stavka.getProizvod().getCena()*stavka.getKolicina();
                stavka.setCena(cenaStavke);
                cenaPorudzbine+=cenaStavke;
                
                stavka.setPorudzbina(porudzbina);
            }
            porudzbina.setStavkePorudzbine(stavkePorudzbine);
            
            
            konacnaCenaPorudzbine=cenaPorudzbine*((100-popust)/100);
            porudzbina.setKonacnaCena(konacnaCenaPorudzbine);
            porudzbina.setPopust(popust);
            porudzbina.setCena(cenaPorudzbine);
            porudzbina.setPrihvacena(false);
            porudzbina.setObradjena(false);
            porudzbina.setDatumVreme(new Date());
            
        
        
        porudzbinaRepository.save(porudzbina);
       
        //emailService.sendDataForPayment(kupac.getEmail(),porudzbina);
        dto.setMessage("Order successfully created.Pls watch email for more informations!");
        dto.setOrder(porudzbina);
        return new Response<>(ResponseStatus.Created, dto);
        } catch (JsonProcessingException ex) {
            dto.setMessage("Invalid order items");
            dto.setOrder(null);
           return new Response<>(ResponseStatus.BadRequest, dto);
        }
    }
    

    @Override
    public Response<String> acceptOrRejectPorudzbina(String token, Long id, Long admin_id, boolean prihvacena,String poruka) {
       
        if(id==null || admin_id==null || id<=0 || admin_id<=0){
            return new Response<>(ResponseStatus.BadRequest, "Invalid order id or admin id");
        }
        if(!dobarTokenZaAdmina(token, admin_id)){
             return new Response<>(ResponseStatus.Unauthorized,"Invalid token");
        }
         if(prihvacena==false && (poruka==null || poruka.equals("") || poruka.equals("undefined"))){
            return new Response<>(ResponseStatus.BadRequest, "You need to set message if you reject order");
        }
        Optional<Porudzbina> postojeca=porudzbinaRepository.findById(id);
        if(postojeca.isEmpty()){
             return new Response<>(ResponseStatus.NotFound,"Not found order with this id");
        }
        Kupac kupac=postojeca.get().getKupac();
        if(prihvacena==false){
            
            //porudzbinaRepository.delete(postojeca.get());
            Admin admin=new Admin();
        admin.setId(admin_id);
        postojeca.get().setApprover(admin);
        postojeca.get().setPrihvacena(prihvacena);
        postojeca.get().setObradjena(false);
        postojeca.get().setRejectionMessage(poruka);
        porudzbinaRepository.save(postojeca.get());
            
            
               emailService.sendInfoAboutRejecting(kupac.getEmail(),postojeca.get(),poruka);
            return new Response<>(ResponseStatus.Ok,"Sucessfully rejected order");
        }
        Admin admin=new Admin();
        admin.setId(admin_id);
        postojeca.get().setApprover(admin);
        postojeca.get().setPrihvacena(prihvacena);
        postojeca.get().setObradjena(false);
        porudzbinaRepository.save(postojeca.get());
        emailService.sendInfoAboutAccepting(kupac.getEmail(),postojeca.get());
          return new Response<>(ResponseStatus.Ok, "Sucessfully accepted order");
    }
    
     @Override
    public Response<String> processPorudzbina(String token, Long id, Long admin_id) {
          if(id==null || admin_id==null || id<=0 || admin_id<=0){
            return new Response<>(ResponseStatus.BadRequest, "Invalid order id or admin id");
        }
        if(!dobarTokenZaAdmina(token, admin_id)){
             return new Response<>(ResponseStatus.Unauthorized, "Invalid token");
        }
        Optional<Porudzbina> postojeca=porudzbinaRepository.findById(id);
        if(postojeca.isEmpty()){
             return new Response<>(ResponseStatus.NotFound,"Not found order with this id");
        }
        Optional<Token> tokenOptional=tokenRepository.findByVrednostTokena(token.substring(7));
       
        if(tokenOptional.isEmpty()){
              return new Response<>(ResponseStatus.Unauthorized,"Invalid token");
        
        }
        for(StavkaPorudzbine stavka : postojeca.get().getStavkePorudzbine()){
            if(stavka.getProizvod().getKolicina()-stavka.getKolicina()<0){
                return new Response<>(ResponseStatus.BadRequest, "We don't have that quantity of some product in stock");
            }
            stavka.getProizvod().setKolicina(stavka.getProizvod().getKolicina()-stavka.getKolicina());
        }
        
        
        Admin admin=(Admin) tokenOptional.get().getUser();
      //  postojeca.get().setProcessor(admin);
        postojeca.get().setObradjena(true);
        Kupac kupac=postojeca.get().getKupac();
        porudzbinaRepository.save(postojeca.get());
        emailService.sendInfoAboutProcessing(kupac.getEmail(),postojeca.get());
       // smsService.sendSms(kupac.getBrojTelefona(),"ehehehehe");
        return new Response<>(ResponseStatus.Ok, "Sucessfully processed order");
    }
    
    
    private boolean dobarTokenZaAdmina(String token,Long admin_id){
        if(token==null || token.equals("")){
            return false;
        }
        token = token.substring(7);
        Optional<Token> postojeci=tokenRepository.findByVrednostTokena(token);
        if(postojeci.isEmpty()){
            return false;
        }
        if(postojeci.get().getExpiresAt().before(new Date())){
            return false;
        }
        if(!(postojeci.get().getUser() instanceof Admin)){
            return false;
        }
        if(postojeci.get().getUser().getId()!=admin_id){
            return false;
        }
        
        return true;
    }
     private boolean dobarTokenZaKupca(String token){
        if(token==null || token.equals("")){
            
            return false;
        }
        token = token.substring(7);
        Optional<Token> postojeci=tokenRepository.findByVrednostTokena(token);
        if(postojeci.isEmpty()){
            
            return false;
        }
        if(postojeci.get().getExpiresAt().before(new Date())){
            
            return false;
        }
        if(!(postojeci.get().getUser() instanceof Kupac)){
            
            return false;
        }
        
       
        return true;
    }

    @Override
    public Response<String> createOrder(String token, String paymentId, String transactionId,double amount, String currency, String transactionStatus, String payerId, String fullName, String address, String email,String phoneNumber,String stavkePorudzbineJson) {
        
         // Provera da li su stringovi null ili prazni
    if (token == null || token.isEmpty() ||
        paymentId == null || paymentId.isEmpty() ||
        transactionId==null || transactionId.isEmpty() ||
        currency == null || currency.isEmpty() ||
          
        transactionStatus == null || transactionStatus.isEmpty() ||
        payerId == null || payerId.isEmpty() ||
        fullName == null || fullName.isEmpty() ||
        address == null || address.isEmpty() ||
        phoneNumber == null || phoneNumber.isEmpty() ||
        email == null || email.isEmpty() ||
        stavkePorudzbineJson == null || stavkePorudzbineJson.isEmpty()) {
        
           return new Response<>(ResponseStatus.BadRequest, "One or more parameters are empty or null so we rejected order,contact our service for refunding transaction");
        
        
    }

    // Provera da li su numeričke vrednosti negativne
    if (amount < 0) {
        
                  return new Response<>(ResponseStatus.BadRequest, "Amount cannot be negative so we rejected order,contact our service for refunding transaction");
            
        
      
    }

       /* if(!dobarTokenZaKupca(token)){
            
           return new Response<>(ResponseStatus.Unauthorized, "Invalid parameters:Invalid token so we rejected order but error occures while refunding transaction");
        
            
        }*/
        
        
         Porudzbina porudzbina=new Porudzbina();
         porudzbina.setAdresa(address);
         porudzbina.setFullName(fullName);
         porudzbina.setEmail(email);
        porudzbina.setPhoneNumber(phoneNumber);
         
        // porudzbina.setDatumIsporuke(datumIsporuke);
       //  porudzbina.setGrad(grad);
        
         //Optional<User> izbaze=userRepository.findById(kupacId);
         token = token.substring(7);
         Optional<Token> izbazeToken=tokenRepository.findByVrednostTokena(token);
         if(izbazeToken.isEmpty()){
              
           return new Response<>(ResponseStatus.BadRequest, "Bad token so we rejected order.Contact our service for refunding transaction");
        
             
         }
         Kupac kupac=(Kupac) izbazeToken.get().getUser();
        // Kupac kupac=(Kupac) izbaze.get();
      //   kupac.setId(kupacId);
        // porudzbina.setKupac(kupac);
        porudzbina.setKupac(kupac);

        List<StavkaPorudzbine> stavkePorudzbine;
        double cenaPorudzbine=0;
        double konacnaCenaPorudzbine=0;
        double popust=0;
        if(kupac.getTipKupca()==TipKupca.BRONZE){
            popust=0;
        }
        if(kupac.getTipKupca()==TipKupca.SILVER){
            popust=10;
        }
        if(kupac.getTipKupca()==TipKupca.GOLD){
            popust=20;
        }
        try {
            stavkePorudzbine = objectMapper.readValue(stavkePorudzbineJson, new TypeReference<List<StavkaPorudzbine>>() {});
            for(StavkaPorudzbine stavka : stavkePorudzbine){
                double cenaStavke=stavka.getProizvod().getCena()*stavka.getKolicina();
                stavka.setCena(cenaStavke);
                cenaPorudzbine+=cenaStavke;
                
                stavka.setPorudzbina(porudzbina);
                System.out.println(stavka.getProizvod().getKolicina());
                System.out.println(stavka.getKolicina());
               
                System.out.println(stavka.getProizvod().getId());
                
                 Proizvod proizvodIzBaze = proizvodRepository.findById(stavka.getProizvod().getId()).orElseThrow(
        () -> new RuntimeException("Proizvod nije pronađen.")
    );

   /*  if(proizvodIzBaze.getKolicina()-stavka.getKolicina()<0){
         
           return new Response<>(ResponseStatus.Conflict, "Some products do not have the requested quantity available. so we rejected order but error occures while refunding transaction");
        
        

     }*/
    proizvodIzBaze.setKolicina(proizvodIzBaze.getKolicina() - stavka.getKolicina());

   
    proizvodRepository.save(proizvodIzBaze);
           
            }
            porudzbina.setStavkePorudzbine(stavkePorudzbine);
            
            
            konacnaCenaPorudzbine=cenaPorudzbine*((100-popust)/100);
            porudzbina.setKonacnaCena(konacnaCenaPorudzbine);
            porudzbina.setPopust(popust);
            porudzbina.setCena(cenaPorudzbine);
            porudzbina.setPrihvacena(false);
            porudzbina.setObradjena(false);
            porudzbina.setDatumVreme(new Date());
            
            
            Transaction transaction=new Transaction();
            transaction.setAmount(amount);
            transaction.setCurrency(currency);
            transaction.setPayerId(payerId);
            transaction.setPaymentId(paymentId);
            transaction.setTransactionId(transactionId);
            transaction.setTransactionStatus(transactionStatus);
            transaction.setCreatedAt(new Date());
            
            
            
        
        
        porudzbinaRepository.save(porudzbina);
        transaction.setOrder(porudzbina);
        transactionRepository.save(transaction);
       
        emailService.sendInfoAboutReceiving(email,porudzbina);
        
        return new Response<>(ResponseStatus.Created, "Order successfully created.Watch your email!");
        } catch (JsonProcessingException ex) {
           
                   return new Response<>(ResponseStatus.BadRequest, "Invalid order items so we rejected order,contact our service four refunding transaction");
            
          
        } 
          
        
    }

    @Override
    public Response<String> updateOrder(String token, Long id, boolean prihvacena, String poruka) {
         
        
        
        
        
       
        /*if(!tokenService.validateToken(token)){
             return new Response<>(ResponseStatus.Unauthorized, "invalid token");
         }*/
       
        Claims claims;
        try {
            claims = tokenService.extractValidClaims(token);
        } catch (Exception ex) {
            
             
             return new Response<>(ResponseStatus.Unauthorized, "Invalid token");
        }
         Long admin_id=claims.get("id", Long.class);
        
        
        
        if(id==null || admin_id==null || id<=0 || admin_id<=0){
            return new Response<>(ResponseStatus.BadRequest, "Invalid order id or admin id");
        }
      /*  if(!dobarTokenZaAdmina(token, admin_id)){
             return new Response<>(ResponseStatus.Unauthorized,"Invalid token");
        }*/
         if(prihvacena==false && (poruka==null || poruka.equals("") || poruka.equals("undefined"))){
            return new Response<>(ResponseStatus.BadRequest, "You need to set message if you reject order");
        }
        Optional<Porudzbina> postojeca=porudzbinaRepository.findById(id);
        if(postojeca.isEmpty()){
             return new Response<>(ResponseStatus.NotFound,"Not found order with this id");
        }
        Kupac kupac=postojeca.get().getKupac();
        if(prihvacena==false){
            
            //porudzbinaRepository.delete(postojeca.get());
            Admin admin=new Admin();
        admin.setId(admin_id);
        postojeca.get().setApprover(admin);
        postojeca.get().setPrihvacena(prihvacena);
        postojeca.get().setObradjena(false);
        postojeca.get().setRejectionMessage(poruka);
        porudzbinaRepository.save(postojeca.get());
        
        System.out.println("1");
        
        //OVDE TREBA DA REFUNDIRAMO I DA PONISTIMO TRANSAKCIJU
        Optional<Transaction> optionalTransaction=transactionRepository.findByOrder(postojeca.get());
        if(optionalTransaction.isEmpty()){
             return new Response<>(ResponseStatus.BadRequest, "Not found transaction for this order");
        }
        Transaction transaction=optionalTransaction.get();
        System.out.println("2");
        
         try {
        DetailedRefund refund = payPalService.refundPayment(transaction.getTransactionId(), transaction.getAmount(), transaction.getCurrency());
        if ("completed".equals(refund.getState())) {
           // return ResponseEntity.ok("Refund successful: " + refund.toJSON());
           System.out.println("3");
           transaction.setTransactionStatus("refunded");
              transactionRepository.save(transaction);
            
            System.out.println("4");
            
            for(StavkaPorudzbine stavka : postojeca.get().getStavkePorudzbine()){
                Optional<Proizvod> optionalProizvod=proizvodRepository.findById(stavka.getProizvod().getId());
                optionalProizvod.get().setKolicina(optionalProizvod.get().getKolicina()+stavka.getKolicina());
                proizvodRepository.save(optionalProizvod.get());
            }
            
            
            
               emailService.sendInfoAboutRejecting(postojeca.get().getEmail(),postojeca.get(),poruka);
            return new Response<>(ResponseStatus.Ok,"Sucessfully rejected order and refunded transaction");
            
            
        } else {
            System.out.println("x");
           // return ResponseEntity.badRequest().body("Refund failed with state: " + refund.getState());
            return new Response(ResponseStatus.InternalServerError,"Refund failed with state: " + refund.getState());
        }
        
    } catch (PayPalRESTException e) {
        //return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body("Failed to process refund: " + e.getMessage());
        
        System.out.println("6");
        return new Response<>(ResponseStatus.InternalServerError,"Failed to process redund: "+e.getMessage());
    }
        
        
        
        
        
            
        }
        Admin admin=new Admin();
        admin.setId(admin_id);
        postojeca.get().setApprover(admin);
        postojeca.get().setPrihvacena(prihvacena);
        postojeca.get().setObradjena(true);
        porudzbinaRepository.save(postojeca.get());
        
        
        List<Porudzbina> porudzbineKupca=porudzbinaRepository.findByKupacAndObradjenaTrue(kupac);
        if(kupac.getTipKupca()==TipKupca.BRONZE && porudzbineKupca.size()>3){
            kupac.setTipKupca(TipKupca.SILVER);
            userRepository.save(kupac);
        }
        if(kupac.getTipKupca()==TipKupca.SILVER && porudzbineKupca.size()>6){
            kupac.setTipKupca(TipKupca.GOLD);
            userRepository.save(kupac);
        }
        
        
        
        emailService.sendInfoAboutProcessing(postojeca.get().getEmail(),postojeca.get());
          return new Response<>(ResponseStatus.Ok, "Sucessfully processed order");
    }

   
   /* @Transactional
    private boolean refundTransaction(String transactionId,double amount,String currency) throws PayPalRESTException{
        Transaction transaction=new Transaction();
        transaction.setTransactionId(transactionId);
        transaction.setAmount(amount);
        transaction.setCurrency(currency);
           //try {
           transaction.setTransactionStatus("not refunded,but need to be refunded");
            transactionRepository.save(transaction);
        DetailedRefund refund = payPalService.refundPayment(transactionId, amount, currency);
        if ("completed".equals(refund.getState())) {
           // return ResponseEntity.ok("Refund successful: " + refund.toJSON());
           System.out.println("3");
           transaction.setTransactionStatus("refunded");
              transactionRepository.save(transaction);
            
            System.out.println("4");
            
            
            
            
            
              return true;
           // return new Response<>(ResponseStatus.Ok,poruka+" so we rejected order and refunded transaction");
            
            
        } else {
            
            return false;
          //  System.out.println("x");
           // return ResponseEntity.badRequest().body("Refund failed with state: " + refund.getState());
          //  return new Response(ResponseStatus.InternalServerError,poruka+" but refund failed with state: " + refund.getState());
        }
        
   // } catch (PayPalRESTException e) {
        //return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body("Failed to process refund: " + e.getMessage());
        
        //System.out.println("6");
       // return new Response<>(ResponseStatus.InternalServerError,poruka+ " but failed to process redund: "+e.getMessage());
   // }
    }
   

   */



    

   
    
}
