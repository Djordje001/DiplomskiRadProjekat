/*
 * Click nbfs://nbhost/SystemFileSystem/Templates/Licenses/license-default.txt to change this license
 * Click nbfs://nbhost/SystemFileSystem/Templates/Classes/Class.java to edit this template
 */
package napredne.java.tehnologije.njtserver.Controller;

/**
 *
 * @author Lenovo
 */
import com.paypal.api.payments.DetailedRefund;
import com.paypal.api.payments.Payment;
import com.paypal.base.rest.PayPalRESTException;

import napredne.java.tehnologije.njtserver.Utils.PaymentResponse;
import napredne.java.tehnologije.njtserver.DTOs.OrderDetailsDTO;
import napredne.java.tehnologije.njtserver.Services.Impl.PayPalService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestHeader;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

@RestController
@CrossOrigin(origins = "*")
public class PaymentController {

    @Autowired
    private PayPalService payPalService;

   /* //OVU METODU ZAPRAVON NE KORISTIM
    @PostMapping("/create-payment")
public PaymentResponse createPayment(@RequestParam("total") double total,
                                     @RequestParam("currency") String currency) {
    System.out.println("createpayment");
    try {
        String cancelUrl = "https://localhost:8080/cancel";
        String successUrl = "https://localhost:8080/success";
        Payment payment = payPalService.createPayment(total, currency, "paypal",
            "sale", "Description for the payment.", cancelUrl, successUrl);
        PaymentResponse response = new PaymentResponse();
        if (payment != null) {
            response.setStatus("success");
            payment.getLinks().stream()
                    .filter(link -> "approval_url".equals(link.getRel()))
                    .findAny()
                    .ifPresent(link -> response.setApprovalUrl(link.getHref()));
        } else {
            response.setStatus("failure");
        }
        return response;
    } catch (PayPalRESTException e) {
        e.printStackTrace();
        PaymentResponse response = new PaymentResponse();
        response.setStatus("error");
        return response;
    }
}
 //OVU METODU ZAPRAVON NE KORISTIM
     @PostMapping("/execute-payment")
    public Payment executePayment(@RequestParam("paymentId") String paymentId,
                                  @RequestParam("payerId") String payerId) {
         System.out.print("execute-payment");
        try {
            return payPalService.executePayment(paymentId, payerId);
        } catch (PayPalRESTException e) {
            e.printStackTrace();
            return null;
        }
    }
    
     //OVU METODU ZAPRAVON NE KORISTIM
    @GetMapping("/success")
    public String confirmPayment(@RequestParam("paymentId") String paymentId,
                                 @RequestParam("PayerID") String payerId) {
         System.out.print("success");
        try {
            Payment payment = payPalService.executePayment(paymentId, payerId);
            return "Payment confirmed: " + payment.toJSON();
        } catch (PayPalRESTException e) {
            return "Failed to confirm payment: " + e.getMessage();
        }
    }
     //OVU METODU ZAPRAVON NE KORISTIM
    
     @GetMapping("/cancel")
    public String cancelPayment() {
        System.out.print("cancel");
        return "Payment cancelled by user.";
    }
    
    
     //JEDINO OVU KORISTIM ,MENI REACT KOMUNICIRA SA PAYPAL I ONDA TEK KAD MU PAYPAL JAVI DA JE KORISNIK UPLATIO ONDA REACT ZOVE MOJ SPRING BOOT I UBACUJEMO PORUDZBINU
     @PostMapping("/refund-payment")
public ResponseEntity<?> refundPayment(@RequestParam("transactionId") String transactionId,
                                       @RequestParam("amount") double amount,
                                       @RequestParam("currency") String currency) {
    System.out.println("refund payment");
    try {
        DetailedRefund refund = payPalService.refundPayment(transactionId, amount, currency);
        if ("completed".equals(refund.getState())) {
            return ResponseEntity.ok("Refund successful: " + refund.toJSON());
        } else {
            System.out.println("x");
            return ResponseEntity.badRequest().body("Refund failed with state: " + refund.getState());
        }
        
    } catch (PayPalRESTException e) {
        return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body("Failed to process refund: " + e.getMessage());
    }
}*/
    
    
    
}