/*
 * Click nbfs://nbhost/SystemFileSystem/Templates/Licenses/license-default.txt to change this license
 * Click nbfs://nbhost/SystemFileSystem/Templates/Classes/Class.java to edit this template
 */
package napredne.java.tehnologije.njtserver.Models;


import jakarta.persistence.Column;
import jakarta.persistence.DiscriminatorValue;
import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.ManyToOne;
import jakarta.persistence.OneToOne;
import jakarta.persistence.Table;
import jakarta.persistence.Temporal;
import jakarta.persistence.TemporalType;
import java.util.Date;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;
import org.springframework.data.annotation.CreatedDate;

/**
 *
 * @author Lenovo
 */

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Entity
@Table(name="transaction")
public class Transaction {
     @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;
     
     
      private String paymentId;
      private String transactionId;
    private double amount;
    private String currency;
    private String transactionStatus;
    private String payerId;
    
    
    @Column(nullable = false)
    @Temporal(TemporalType.TIMESTAMP)
    @CreatedDate
    private Date createdAt;
    
    
    /* @ManyToOne
    @JoinColumn(name = "order_id", nullable = false)
    private Porudzbina order; // Reference na porudžbinu*/
     
     
      @OneToOne
    @JoinColumn(name = "order_id", referencedColumnName = "id",nullable=false)
    private Porudzbina order;
}
