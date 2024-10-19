/*
 * Click nbfs://nbhost/SystemFileSystem/Templates/Licenses/license-default.txt to change this license
 * Click nbfs://nbhost/SystemFileSystem/Templates/Classes/Interface.java to edit this template
 */
package napredne.java.tehnologije.njtserver.Services;


import java.util.List;
import napredne.java.tehnologije.njtserver.DTOs.CreatePorudzbinaReturnDto;
import napredne.java.tehnologije.njtserver.Models.Porudzbina;
import napredne.java.tehnologije.njtserver.Utils.Response;

/**
 *
 * @author Lenovo
 */
public interface PorudzbinaService {

    public Response<List<Porudzbina>> getPendingOrders();
    public Response<List<Porudzbina>> getProcessedOrders();
    public Response<List<Porudzbina>> getRejectedOrders();
    public Response<List<Porudzbina>> findAllPorudzbine(String email);
  //  public Response<List<Porudzbina>> getUnprocessedOrders();

    public Response<String> acceptOrRejectPorudzbina(String token, Long id, Long admin_id, boolean prihvacena,String poruka);

    public Response<CreatePorudzbinaReturnDto> createNewPorudzbina(String token, String adresa,String datumIsporukeString, String grad, Long kupacId, String stavkePorudzbineJson);
    public Response<String> createOrder(String token,String paymentId,String transactionId,double amount,String currency,String transactionStatus,String payerId,String fullName,String address,String email,String phoneNumber,String stavkePorudzbineJson);
    
    
    
    public Response<String> processPorudzbina(String token, Long id, Long admin_id);

    public Response<String> updateOrder(String token, Long id, boolean prihvacena, String poruka);

    public Response<List<Porudzbina>> getAllPorudzbine();
    
}
