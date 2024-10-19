package napredne.java.tehnologije.njtserver.Controller;


import io.jsonwebtoken.Claims;
import napredne.java.tehnologije.njtserver.Models.Proizvod;
import napredne.java.tehnologije.njtserver.Services.ProizvodService;

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.util.List;
import java.util.logging.Level;
import java.util.logging.Logger;
import lombok.RequiredArgsConstructor;
import napredne.java.tehnologije.njtserver.DTOs.CheckStockDto;
import napredne.java.tehnologije.njtserver.DTOs.CreateProizvodReturnDto;
import napredne.java.tehnologije.njtserver.DTOs.UpdateProizvodReturnDto;
import napredne.java.tehnologije.njtserver.Services.TokenService;


import napredne.java.tehnologije.njtserver.Utils.Response;
import napredne.java.tehnologije.njtserver.Utils.ResponseConverter;

@RequiredArgsConstructor
@RestController
@RequestMapping("/api")
//@CrossOrigin(origins = "http://localhost:3000")
@CrossOrigin(origins = "*")
public class ProizvodController {
    private final ProizvodService proizvodService;
   
     private final ResponseConverter<Proizvod> converter;
     private final ResponseConverter<String> converterS;
     private final ResponseConverter<CheckStockDto> converterB;
     private final ResponseConverter<CreateProizvodReturnDto> converterCPRD;
     private final ResponseConverter<UpdateProizvodReturnDto> converterUPRD;
     
     
    
     @PostMapping(path = "/proizvodi/knjiga", consumes = "multipart/form-data")
    public ResponseEntity<CreateProizvodReturnDto> createKnjiga( 
                @RequestHeader(value = "Authorization", required = true) String token,
            @RequestParam("file") MultipartFile file,
            @RequestParam("naziv") String naziv,
            @RequestParam("cena") double cena,
            @RequestParam("kolicina") int kolicina,
            @RequestParam("izdanje") int izdanje,
            @RequestParam("opis") String opis,
            @RequestParam("pisci") String pisciJson) {
       
        
       System.out.println("doslo");
        Response<CreateProizvodReturnDto> response = proizvodService.createNewKnjiga(token,file,naziv,cena,kolicina,izdanje,opis,pisciJson);
        return converterCPRD.toResponseEntity(response);
    }
    
     @PostMapping(path = "/proizvodi/kancelarijski", consumes = "multipart/form-data")
    public ResponseEntity<CreateProizvodReturnDto> createKancelarijskiMaterijal(
            @RequestHeader(value = "Authorization", required = true) String token,
            @RequestParam("file") MultipartFile file,
            @RequestParam("naziv") String naziv,
            @RequestParam("cena") double cena,
             @RequestParam("kolicina") int kolicina,
            @RequestParam("duzina") double duzina,
            @RequestParam("visina") double visina,
            @RequestParam("sirina") double sirina,
             @RequestParam("proizvodjac") String proizvodjac,
              @RequestParam("vrstaKancelarijskogProizvoda") String vrstaKancelarijskogProizvoda)  {
        
        /*Claims claims;
        try {
            String pravi=tokenService.extractToken(token);
            System.out.println(pravi);
            claims = tokenService.extractValidClaims(pravi);
            System.out.println(claims);
        } catch (Exception ex) {
            Logger.getLogger(ProizvodController.class.getName()).log(Level.SEVERE, null, ex);
        }*/
        
        Response<CreateProizvodReturnDto> response = proizvodService.createNewKancelarijskiMaterijal(token,file,naziv,cena,kolicina,duzina,visina,sirina,proizvodjac,vrstaKancelarijskogProizvoda);
        return converterCPRD.toResponseEntity(response);
    }
    
    
    @PostMapping(path = "/proizvodi/kancelarijski/{id}", consumes = "multipart/form-data")
public ResponseEntity<UpdateProizvodReturnDto> updateKancelarijskiMaterijal(
        @RequestHeader(value = "Authorization", required = true) String token,
        @PathVariable Long id,
         @RequestParam(value="file",required = false) MultipartFile file,
            @RequestParam("naziv") String naziv,
            @RequestParam("cena") double cena,
            @RequestParam("kolicina") int kolicina,
            @RequestParam("duzina") double duzina,
            @RequestParam("visina") double visina,
            @RequestParam("sirina") double sirina,
             @RequestParam("proizvodjac") String proizvodjac,
              @RequestParam("vrstaKancelarijskogProizvoda") String vrstaKancelarijskogProizvoda) {
    
    
    Response<UpdateProizvodReturnDto> response = proizvodService.updateKancelarijskiMaterijal(token,id, file, naziv, cena,kolicina,duzina, visina, sirina, proizvodjac, vrstaKancelarijskogProizvoda);
    
    
    return converterUPRD.toResponseEntity(response);
}


    /*@PostMapping(path = "/kancelarijski/be/{id}",consumes = "multipart/form-data")
public ResponseEntity<UpdateProizvodReturnDto> updateKancelarijskiMaterijal(
        @RequestHeader(value = "Authorization", required = true) String token,
        @PathVariable Long id,
            @RequestParam("naziv") String naziv,
            @RequestParam("cena") double cena,
            @RequestParam("kolicina") int kolicina,
            @RequestParam("duzina") double duzina,
            @RequestParam("visina") double visina,
            @RequestParam("sirina") double sirina,
             @RequestParam("proizvodjac") String proizvodjac,
              @RequestParam("vrstaKancelarijskogProizvoda") String vrstaKancelarijskogProizvoda) {
 
    
    Response<UpdateProizvodReturnDto> response = proizvodService.updateKancelarijskiMaterijal(token,id,null, naziv, cena,kolicina,duzina, visina, sirina, proizvodjac, vrstaKancelarijskogProizvoda);
    
  
    return converterUPRD.toResponseEntity(response);
}*/



    @PostMapping(path = "/proizvodi/knjiga/{id}", consumes = "multipart/form-data")
public ResponseEntity<UpdateProizvodReturnDto> updateKnjiga(
        @RequestHeader(value = "Authorization", required = true) String token,
        @PathVariable Long id,@RequestParam(value="file",required = false) MultipartFile file,
            @RequestParam("naziv") String naziv,
            @RequestParam("cena") double cena,
            @RequestParam("kolicina") int kolicina,
            @RequestParam("izdanje") int izdanje,
            @RequestParam("opis") String opis,
            @RequestParam("pisci") String pisciJson) {
    
  
    Response<UpdateProizvodReturnDto> response = proizvodService.updateKnjiga(token,id, file, naziv, cena,kolicina,izdanje,opis,pisciJson);
    
   
    return converterUPRD.toResponseEntity(response);
}  
     
   /* @PostMapping(path = "/knjiga/bezslike/{id}", consumes = "multipart/form-data")
public ResponseEntity<UpdateProizvodReturnDto> updateKnjiga(
        @RequestHeader(value = "Authorization", required = true) String token,
        @PathVariable Long id,
            @RequestParam("naziv") String naziv,
            @RequestParam("cena") double cena,
            @RequestParam("kolicina") int kolicina,
            @RequestParam("izdanje") int izdanje,
            @RequestParam("opis") String opis,
            @RequestParam("pisci") String pisciJson) {
    
   
    Response<UpdateProizvodReturnDto> response = proizvodService.updateKnjiga(token,id, null, naziv, cena,kolicina,izdanje,opis,pisciJson);
    
 
    return converterUPRD.toResponseEntity(response);
}*/
    
    
     @DeleteMapping("/proizvodi/{id}")
    public ResponseEntity<String> deleteProizvod(
            @RequestHeader(value = "Authorization", required = true) String token,
            @PathVariable Long id) {
         Response<String> response = (Response<String>) proizvodService.deleteProizvod(token,id);
        return converterS.toResponseEntity(response);
    }
  

    @GetMapping("/public/proizvodi")
    public ResponseEntity<List<Proizvod>> getAllProizvodi() {
        Response<List<Proizvod>> proizvodi = (Response<List<Proizvod>>) proizvodService.getAllProizvodi();
        return converter.toListResponseEntity(proizvodi);
    }
    
    
    @GetMapping("/public/proizvodi/find")
    public ResponseEntity<List<Proizvod>> findAllProizvodi(@RequestParam(value = "naziv", required = true) String naziv) {
       
        Response<List<Proizvod>> proizvodi = (Response<List<Proizvod>>) proizvodService.findAllProizvodi(naziv);
        return converter.toListResponseEntity(proizvodi);
    }
    
    
    @GetMapping("/public/proizvodi/vrsteKancelarijskogMaterijala")
     public ResponseEntity<List<String>> getAllVrstaKancelarijskogProizvoda() {
        Response<List<String>> vrste = (Response<List<String>>) proizvodService.getAllVrstaKancelarijskogProizvoda();
        return converterS.toListResponseEntity(vrste);
    }
     @GetMapping("/public/proizvodi/{id}")
     public ResponseEntity<Proizvod> getProizvod(@PathVariable Long id) {
        Response<Proizvod> proizvod = (Response<Proizvod>) proizvodService.getProizvod(id);
        return converter.toResponseEntity(proizvod);
    }
     
     
    @PostMapping("/public/proizvodi/check-stock")
public ResponseEntity<CheckStockDto> checkStock(@RequestParam String stavkePorudzbineJson) {
    System.out.println(stavkePorudzbineJson);
    Response<CheckStockDto> response = (Response<CheckStockDto>) proizvodService.checkAvailability(stavkePorudzbineJson);
    return converterB.toResponseEntity(response);
}
}
