/*
 * Click nbfs://nbhost/SystemFileSystem/Templates/Licenses/license-default.txt to change this license
 * Click nbfs://nbhost/SystemFileSystem/Templates/Classes/Class.java to edit this template
 */
/*
 * Click nbfs://nbhost/SystemFileSystem/Templates/Licenses/license-default.txt to change this license
 * Click nbfs://nbhost/SystemFileSystem/Templates/Classes/Class.java to edit this template
 */
package napredne.java.tehnologije.njtserver.Services.Impl;

/**
 *
 * @author Lenovo
 */
import com.paypal.api.payments.Amount;
import com.paypal.api.payments.DetailedRefund;
import com.paypal.api.payments.Payment;
import com.paypal.api.payments.PaymentExecution;
import com.paypal.api.payments.Payer;
import com.paypal.api.payments.PayerInfo;
import com.paypal.api.payments.RedirectUrls;
import com.paypal.api.payments.Transaction;
import com.paypal.base.rest.APIContext;
import com.paypal.base.rest.PayPalRESTException;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;

import com.paypal.api.payments.Refund;
import com.paypal.api.payments.RefundRequest;
import com.paypal.api.payments.Sale;
import com.paypal.base.rest.PayPalRESTException;

import java.util.HashMap;
import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;

@Service
public class PayPalService {

    @Value("${paypal.client.id}")
    private String clientId;

    @Value("${paypal.client.secret}")
    private String clientSecret;

    @Value("${paypal.mode}")
    private String mode;

    public Payment createPayment(Double total, String currency, String method,
                                 String intent, String description, String cancelUrl, String successUrl) throws PayPalRESTException {
        Amount amount = new Amount();
        amount.setCurrency(currency);
        amount.setTotal(String.format("%.2f", total));

        Transaction transaction = new Transaction();
        transaction.setDescription(description);
        transaction.setAmount(amount);

        List<Transaction> transactions = new ArrayList<>();
        transactions.add(transaction);

        Payer payer = new Payer();
        payer.setPaymentMethod(method);

        Payment payment = new Payment();
        payment.setIntent(intent);
        payment.setPayer(payer);
        payment.setTransactions(transactions);

        RedirectUrls redirectUrls = new RedirectUrls();
        redirectUrls.setCancelUrl(cancelUrl);
        redirectUrls.setReturnUrl(successUrl);
        payment.setRedirectUrls(redirectUrls);

        APIContext apiContext = getAPIContext();
        return payment.create(apiContext);
    }

    public Payment executePayment(String paymentId, String payerId) throws PayPalRESTException {
        Payment payment = new Payment();
        payment.setId(paymentId);
        PaymentExecution paymentExecution = new PaymentExecution();
        paymentExecution.setPayerId(payerId);
        APIContext apiContext = getAPIContext();
        return payment.execute(apiContext, paymentExecution);
    }

   
private APIContext getAPIContext() {
    APIContext apiContext = new APIContext(clientId, clientSecret, mode);
    apiContext.setConfigurationMap(new HashMap<String, String>() {{
        put("mode", mode);
        // Dodajte ostale potrebne konfiguracije ovde
        put("http.ConnectionTimeOut", "5000"); // Timeout za konekciju u milisekundama
        put("http.Retry", "1"); // Broj pokušaja ponovnog povezivanja
        put("http.ReadTimeOut", "30000"); // Timeout za čitanje u milisekundama
        put("http.MaxConnection", "100"); // Maksimalni broj konekcija
       put("service.EndPoint", "https://api.paypal.com"); // Endpoint, zavisno od moda
     //put("service.EndPoint", "https://api.sandbox.paypal.com"); // Sandbox Endpoint
    }});
    return apiContext;
}


public DetailedRefund refundPayment(String transactionId, double amount, String currency) throws PayPalRESTException {
    APIContext apiContext = getAPIContext();
    Sale sale = new Sale();
    sale.setId(transactionId);

    Amount refundAmount = new Amount();
    refundAmount.setCurrency(currency);
    refundAmount.setTotal(String.format("%.2f", amount));

    RefundRequest refundRequest = new RefundRequest();
    refundRequest.setAmount(refundAmount);

    // Refund the sale
    DetailedRefund refund = sale.refund(apiContext, refundRequest);
    return refund;
}
}
