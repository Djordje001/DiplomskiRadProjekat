/*
 * Click nbfs://nbhost/SystemFileSystem/Templates/Licenses/license-default.txt to change this license
 * Click nbfs://nbhost/SystemFileSystem/Templates/Classes/Interface.java to edit this template
 */
package napredne.java.tehnologije.njtserver.Services;

import java.util.List;
import napredne.java.tehnologije.njtserver.DTOs.CheckStockDto;
import napredne.java.tehnologije.njtserver.DTOs.CreateProizvodReturnDto;
import napredne.java.tehnologije.njtserver.DTOs.UpdateProizvodReturnDto;
import napredne.java.tehnologije.njtserver.Models.Proizvod;
import napredne.java.tehnologije.njtserver.Utils.Response;
import org.springframework.web.multipart.MultipartFile;

/**
 *
 * @author Lenovo
 */
public interface ProizvodService {
    
    public Response<List<Proizvod>> getAllProizvodi();
    public Response<List<Proizvod>> findAllProizvodi(String naziv);
     public Response<List<String>> getAllVrstaKancelarijskogProizvoda();
     public Response<Proizvod> getProizvod(Long id);

    public Response<CreateProizvodReturnDto> createNewKnjiga(String token,MultipartFile file, String naziv, double cena,int kolicina, int izdanje, String opis, String pisciJson);

    public Response<CreateProizvodReturnDto> createNewKancelarijskiMaterijal(String token,MultipartFile file, String naziv, double cena,int kolicina,double duzina, double visina, double sirina, String proizvodjac, String vrstaKancelarijskogProizvoda);
    
    public Response<String> deleteProizvod(String token,Long id);

    public Response<UpdateProizvodReturnDto> updateKancelarijskiMaterijal(String token,Long id, MultipartFile file, String naziv, double cena,int kolicina, double duzina, double visina, double sirina, String proizvodjac, String vrstaKancelarijskogProizvoda);

    public Response<UpdateProizvodReturnDto> updateKnjiga(String token,Long id, MultipartFile file, String naziv, double cena, int kolicina,int izdanje, String opis, String pisciJson);
    
    
   public Response<CheckStockDto> checkAvailability(String stavkePorudzbineJson);
}
