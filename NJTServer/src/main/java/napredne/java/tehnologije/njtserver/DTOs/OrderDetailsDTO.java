/*
 * Click nbfs://nbhost/SystemFileSystem/Templates/Licenses/license-default.txt to change this license
 * Click nbfs://nbhost/SystemFileSystem/Templates/Classes/Class.java to edit this template
 */
package napredne.java.tehnologije.njtserver.DTOs;

/**
 *
 * @author Lenovo
 */
public class OrderDetailsDTO {
    private String paymentId;
    private String transactionId;
    private double amount;
    private String currency;
    private String transactionStatus;
    private String payerId;
    private String fullName;
    private String email;
    private String address;
    private String phoneNumber;
    private String stavkePorudzbineJson;
   

    // Getters and setters
    public String getPaymentId() {
        return paymentId;
    }

    public void setPaymentId(String paymentId) {
        this.paymentId = paymentId;
    }

    public double getAmount() {
        return amount;
    }

    public void setAmount(double amount) {
        this.amount = amount;
    }

    public String getCurrency() {
        return currency;
    }

    public void setCurrency(String currency) {
        this.currency = currency;
    }

    public String getTransactionStatus() {
        return transactionStatus;
    }

    public void setTransactionStatus(String transactionStatus) {
        this.transactionStatus = transactionStatus;
    }

    public String getPayerId() {
        return payerId;
    }

    public void setPayerId(String payerId) {
        this.payerId = payerId;
    }

    public String getFullName() {
        return fullName;
    }

    public void setFullName(String fullName) {
        this.fullName = fullName;
    }

    public String getEmail() {
        return email;
    }

    public void setEmail(String email) {
        this.email = email;
    }

    public String getAddress() {
        return address;
    }

    public void setAddress(String address) {
        this.address = address;
    }

    

    public String getStavkePorudzbineJson() {
        return stavkePorudzbineJson;
    }

    public void setStavkePorudzbineJson(String stavkePorudzbineJson) {
        this.stavkePorudzbineJson = stavkePorudzbineJson;
    }

   public String getPhoneNumber() {
        return phoneNumber;
    }

    public void setPhoneNumber(String phoneNumber) {
        this.phoneNumber = phoneNumber;
    }

   

    public String getTransactionId() {
        return transactionId;
    }

    public void setTransactionId(String transactionId) {
        this.transactionId = transactionId;
    }

    @Override
    public String toString() {
        return "PaymentDetailsDTO{" + "paymentId=" + paymentId + ", transactionId=" + transactionId + ", amount=" + amount + ", currency=" + currency + ", transactionStatus=" + transactionStatus + ", payerId=" + payerId + ", fullName=" + fullName + ", email=" + email + ", address=" + address +  ", stavkePorudzbineJson=" + stavkePorudzbineJson + '}';
    }

    
    
   
    
    

    
    
    
    
    
}
