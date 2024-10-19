/*
 * Click nbfs://nbhost/SystemFileSystem/Templates/Licenses/license-default.txt to change this license
 * Click nbfs://nbhost/SystemFileSystem/Templates/Classes/Class.java to edit this template
 */
package napredne.java.tehnologije.njtserver.Controller;


import java.util.List;
import lombok.RequiredArgsConstructor;
import napredne.java.tehnologije.njtserver.DTOs.CreatePorudzbinaReturnDto;
import napredne.java.tehnologije.njtserver.DTOs.OrderDetailsDTO;
import napredne.java.tehnologije.njtserver.Models.Porudzbina;
import napredne.java.tehnologije.njtserver.Services.PorudzbinaService;
import napredne.java.tehnologije.njtserver.Utils.Response;
import napredne.java.tehnologije.njtserver.Utils.ResponseConverter;

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestHeader;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

/**
 *
 * @author Lenovo
 */


@RequiredArgsConstructor
@RestController
@RequestMapping("/api")
//@CrossOrigin(origins = "http://localhost:3000")
@CrossOrigin(origins = "*")
public class PorudzbinaController {
    private final PorudzbinaService porudzbinaService;
    private  final ResponseConverter<Porudzbina> converter;
    private final ResponseConverter<String> converterS;
    private final ResponseConverter<CreatePorudzbinaReturnDto> converterCPRD;
      
      
     @GetMapping("/public/porudzbine/all")
    public ResponseEntity<List<Porudzbina>> getOrders() {
        Response<List<Porudzbina>> response = porudzbinaService.getAllPorudzbine();
        return converter.toListResponseEntity(response);
    }
      
       @GetMapping("/public/porudzbine/pending")
    public ResponseEntity<List<Porudzbina>> getPendingOrders() {
        Response<List<Porudzbina>> response = porudzbinaService.getPendingOrders();
        return converter.toListResponseEntity(response);
    }
     @GetMapping("/public/porudzbine/rejected")
    public ResponseEntity<List<Porudzbina>> getRejectedOrders() {
        Response<List<Porudzbina>> response = porudzbinaService.getRejectedOrders();
        return converter.toListResponseEntity(response);
    }
    @GetMapping("/public/porudzbine/processed")
    public ResponseEntity<List<Porudzbina>> getProcessedOrders() {
        Response<List<Porudzbina>> response = porudzbinaService.getProcessedOrders();
        return converter.toListResponseEntity(response);
    }
    
     @GetMapping("/public/porudzbine/find")
    public ResponseEntity<List<Porudzbina>> findAllPorudzbine(@RequestParam(value = "email", required = true) String email) {
       
        Response<List<Porudzbina>> porudzbine = (Response<List<Porudzbina>>) porudzbinaService.findAllPorudzbine(email);
        return converter.toListResponseEntity(porudzbine);
    }
    
    
    
    /* @PostMapping
    public ResponseEntity<CreatePorudzbinaReturnDto> createPorudzbina( 
                @RequestHeader(value = "Authorization", required = true) String token,
            @RequestParam("adresa") String adresa,
            @RequestParam("datumIsporuke") String datumIsporukeString,
            @RequestParam("grad") String grad,
            @RequestParam("kupac_id") Long kupacId,
            @RequestParam("stavkePorudzbine") String stavkePorudzbineJson) {
      
                
        Response<CreatePorudzbinaReturnDto> response = porudzbinaService.createNewPorudzbina(token,adresa,datumIsporukeString,grad,kupacId,stavkePorudzbineJson);
        return converterCPRD.toResponseEntity(response);
    }*/
    
    
    
   /*  @PutMapping("/acceptOrReject/{id}/{admin_id}")
public ResponseEntity<String> acceptOrRejectPorudzbina(
        @RequestHeader(value = "Authorization", required = true) String token,
        @PathVariable Long id,
        @PathVariable Long admin_id,
        @RequestParam("prihvacena") boolean prihvacena,
        @RequestParam(value="poruka",required=false) String poruka) {
    
    Response<String> response = porudzbinaService.acceptOrRejectPorudzbina(token,id,admin_id,prihvacena,poruka);
    return converterS.toResponseEntity(response);
}*/

  /* @PutMapping("/process/{id}/{admin_id}")
public ResponseEntity<String> processPorudzbina(
        @RequestHeader(value = "Authorization", required = true) String token,
        @PathVariable Long id,
        @PathVariable Long admin_id) {
    

    Response<String> response = porudzbinaService.processPorudzbina(token,id,admin_id);
    return converterS.toResponseEntity(response);
}*/

 @PutMapping("/porudzbine/rejectOrProcess/{id}")
public ResponseEntity<String> updateOrder(
        @RequestHeader(value = "Authorization", required = true) String token,
        @PathVariable Long id,
       // @PathVariable Long admin_id,
        @RequestParam("prihvacena") boolean prihvacena,
        @RequestParam(value="poruka",required=false) String poruka) {
    
   
    Response<String> response=porudzbinaService.updateOrder(token, id, prihvacena, poruka);
    return converterS.toResponseEntity(response);
}




 @PostMapping("/porudzbine/add-order-add-transaction")
    public ResponseEntity<String> createOrder( @RequestHeader(value = "Authorization", required = true) String token,@RequestBody OrderDetailsDTO paymentDetails) {
        // Logika za obradu primljenih podataka
        System.out.println("Received payment details: " + paymentDetails);
        System.out.println(token);
        // Ovde možeš implementirati logiku za čuvanje podataka u bazu, slanje emaila, itd.
        // Pretpostavimo da smo uspešno sačuvali podatke
        Response<String> response=porudzbinaService.createOrder(token, paymentDetails.getPaymentId(),paymentDetails.getTransactionId(),paymentDetails.getAmount(), paymentDetails.getCurrency(), paymentDetails.getTransactionStatus(), paymentDetails.getPayerId(), paymentDetails.getFullName(), paymentDetails.getAddress(),  paymentDetails.getEmail(),paymentDetails.getPhoneNumber(), paymentDetails.getStavkePorudzbineJson());
        return converterS.toResponseEntity(response);
    }
    //JP4PZRJA5M5EC


}
