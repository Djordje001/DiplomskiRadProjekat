/*
 * Click nbfs://nbhost/SystemFileSystem/Templates/Licenses/license-default.txt to change this license
 * Click nbfs://nbhost/SystemFileSystem/Templates/Classes/Class.java to edit this template
 */
package napredne.java.tehnologije.njtserver.Services.Impl;

import com.fasterxml.jackson.core.JsonProcessingException;
import com.fasterxml.jackson.core.type.TypeReference;

import java.io.IOException;
import lombok.RequiredArgsConstructor;
import napredne.java.tehnologije.njtserver.Repositories.ProizvodRepository;
import napredne.java.tehnologije.njtserver.Services.ProizvodService;
import org.springframework.stereotype.Service;



import java.util.List;
import napredne.java.tehnologije.njtserver.Enums.ResponseStatus;


import napredne.java.tehnologije.njtserver.Models.Proizvod;
import napredne.java.tehnologije.njtserver.Utils.Response;


import org.springframework.beans.factory.annotation.Value;
import org.springframework.web.multipart.MultipartFile;
import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.Paths;
import java.util.ArrayList;
import java.util.UUID;
import napredne.java.tehnologije.njtserver.Models.Autor;
import napredne.java.tehnologije.njtserver.Models.Knjiga;
import napredne.java.tehnologije.njtserver.Models.Pisac;

import com.fasterxml.jackson.databind.ObjectMapper;
import io.jsonwebtoken.Claims;
import java.util.Arrays;
import java.util.Date;
import java.util.Optional;

import java.util.stream.Collectors;
import napredne.java.tehnologije.njtserver.DTOs.CheckStockDto;
import napredne.java.tehnologije.njtserver.DTOs.CreateProizvodReturnDto;
import napredne.java.tehnologije.njtserver.DTOs.UpdateProizvodReturnDto;
import napredne.java.tehnologije.njtserver.DTOs.UpdateUserReturnDto;
import napredne.java.tehnologije.njtserver.Enums.VrstaKancelarijskogProizvoda;
import napredne.java.tehnologije.njtserver.Models.Admin;
import napredne.java.tehnologije.njtserver.Models.KancelarijskiProizvod;
import napredne.java.tehnologije.njtserver.Models.StavkaPorudzbine;
import napredne.java.tehnologije.njtserver.Models.Token;
import napredne.java.tehnologije.njtserver.Models.Transaction;
import napredne.java.tehnologije.njtserver.Repositories.PisacRepository;
import napredne.java.tehnologije.njtserver.Repositories.StavkaPorudzbineRepository;
import napredne.java.tehnologije.njtserver.Repositories.TokenRepository;
import napredne.java.tehnologije.njtserver.Services.TokenService;





@RequiredArgsConstructor
@Service
public class ProizvodServiceImpl implements ProizvodService {
    private final ProizvodRepository proizvodRepository;
    private final StavkaPorudzbineRepository stavkaPorudzbineRepository;
    private final TokenRepository tokenRepository;
    private final PisacRepository pisacRepository;
    
    
    
      private final TokenService tokenService;

    @Value("${upload.path}")
    private String uploadDir;

   
    private static final Path ROOT_LOCATION = Paths.get("src/main/resources/static/images");
    private final ObjectMapper objectMapper;


    
    
    @Override
    public Response<CreateProizvodReturnDto> createNewKnjiga(String token,MultipartFile file, String naziv, double cena,int kolicina, int izdanje, String opis, String pisciJson) {
        
         CreateProizvodReturnDto dto=new CreateProizvodReturnDto();
       
        /*if(!tokenService.validateToken(token)){
             return new Response<>(ResponseStatus.Unauthorized, dto);
         }*/
       
        /*Claims claims;
        try {
            claims = tokenService.extractValidClaims(token);
        } catch (Exception ex) {
            dto.setMessage("invalid token");
             
             return new Response<>(ResponseStatus.Unauthorized, dto);
        }
        
       */
        
      
        
        if(file==null || naziv==null || opis==null || pisciJson==null || cena<=0 || izdanje<=0 || naziv.equals("") || opis.equals("") || pisciJson.equals("")){
            dto.setMessage("Invalid parameteres");
            dto.setProduct(null);
            return new Response<>(ResponseStatus.BadRequest,dto);
        }
       /* if(!dobarTokenZaAdmina(token)){
            dto.setMessage("Invalid token");
            dto.setProduct(null);
             return new Response<>(ResponseStatus.Unauthorized,dto);
        }*/
          Knjiga knjiga = new Knjiga();
        knjiga.setNaziv(naziv);
        knjiga.setCena(cena);
        knjiga.setIzdanje(izdanje);
        knjiga.setOpis(opis);
        knjiga.setKolicina(kolicina);

        List<Integer> idPisaca;
        try {
            idPisaca = objectMapper.readValue(pisciJson, new TypeReference<List<Integer>>() {});
            
            List<Autor> autori = new ArrayList<>();
        for (Integer id : idPisaca) {
            Autor autor = new Autor();
            Optional<Pisac> pisac=pisacRepository.findById(id.longValue());
            if(pisac.isEmpty()){
                dto.setMessage("Invalid authors");
                dto.setProduct(null);
                return new Response<>(ResponseStatus.BadRequest,dto);
            }
            autor.setPisac(pisac.get());
            autor.setKnjiga(knjiga);
            autori.add(autor);
        }
        knjiga.setAutori(autori);
        String fileUrl=dodajSliku(file);
        knjiga.setUrl(fileUrl);
        
        
        proizvodRepository.save(knjiga);
        dto.setMessage("Successfuly created book");
        dto.setProduct(knjiga);
        return new Response<>(ResponseStatus.Created, dto);
        } catch (JsonProcessingException ex) {
            
            dto.setMessage("Invalid authors");
            dto.setProduct(null);
           return new Response<>(ResponseStatus.BadRequest, dto);
        }
        
        
    }
    
      @Override
    public Response<CreateProizvodReturnDto> createNewKancelarijskiMaterijal(String token,MultipartFile file, String naziv, double cena,int kolicina, double duzina, double visina, double sirina, String proizvodjac, String vrstaKancelarijskogProizvoda) {
        CreateProizvodReturnDto dto=new CreateProizvodReturnDto();
       
       /* if(!tokenService.validateToken(token)){
             return new Response<>(ResponseStatus.Unauthorized, dto);
         }*/
       
     /*   Claims claims;
        try {
            claims = tokenService.extractValidClaims(token);
        } catch (Exception ex) {
            dto.setMessage("invalid token");
             
             return new Response<>(ResponseStatus.Unauthorized, dto);
        }*/
        
        
        
        if(file==null || naziv==null ||  cena<=0 || naziv.equals("") || duzina<=0 || visina<=0 || sirina<=0 || proizvodjac==null || proizvodjac.equals("") || vrstaKancelarijskogProizvoda==null || vrstaKancelarijskogProizvoda.equals("")
                ){
            dto.setMessage("Invalid parameters");
            dto.setProduct(null);
            return new Response<>(ResponseStatus.BadRequest,dto);
        }
      /*  if(!dobarTokenZaAdmina(token)){
            dto.setMessage("Invalid token");
            dto.setProduct(null);
             return new Response<>(ResponseStatus.Unauthorized,dto);
        }*/
         KancelarijskiProizvod kp=new KancelarijskiProizvod();
         kp.setNaziv(naziv);
         kp.setCena(cena);
         kp.setDuzina(duzina);
         kp.setVisina(visina);
         kp.setSirina(sirina);
         kp.setProizvodjac(proizvodjac);
         kp.setKolicina(kolicina);
         try {
            VrstaKancelarijskogProizvoda vrsta = VrstaKancelarijskogProizvoda.valueOf(vrstaKancelarijskogProizvoda.toUpperCase());
            kp.setVrstaKancelarijskogProizvoda(vrsta);
            
             String fileUrl=dodajSliku(file);
        kp.setUrl(fileUrl);
        
        
        proizvodRepository.save(kp);
        dto.setMessage("Successfuly created office supply");
        dto.setProduct(kp);
        return new Response<>(ResponseStatus.Created,dto);
        } catch (IllegalArgumentException e) {
            dto.setMessage("Invalid type of office supply");
            dto.setProduct(null);
            return new Response<>(ResponseStatus.BadRequest,dto);
        }
    }
    
     @Override
    public Response<String> deleteProizvod(String token,Long id) {
         
      /* if(!tokenService.validateToken(token)){
             return new Response<>(ResponseStatus.Unauthorized, "invalid token");
         }*/
       
       /* Claims claims;
        try {
            claims = tokenService.extractValidClaims(token);
        } catch (Exception ex) {
            
             
             return new Response<>(ResponseStatus.Unauthorized, "invalid token");
        }*/
       
        if(id==null || id<=0){
            return new Response<>(ResponseStatus.BadRequest, "Invalid id");
        }
      /*  if(!dobarTokenZaAdmina(token)){
             return new Response<>(ResponseStatus.Unauthorized,null);
        }*/
        Optional<Proizvod> proizvod=proizvodRepository.findById(id);
        if(proizvod.isEmpty()){
            return new Response<>(ResponseStatus.NotFound, "Not found product with this id");
        }
        /*List<StavkaPorudzbine> stavke=stavkaPorudzbineRepository.findByProizvod(proizvod.get());
        if(stavke.size()>0){
            return new Response<>(ResponseStatus.Conflict, "This product already contains in some order items so you cant delete him");
        }*/
        
        String oldFileUrl = proizvod.get().getUrl();
            if (oldFileUrl != null && !oldFileUrl.isEmpty()) {
                deleteOldImage(oldFileUrl); 
            }
        
        proizvodRepository.delete(proizvod.get());
        return  new Response<>(ResponseStatus.Ok, "Successfuly deleted product");
    }
    
    
    @Override
    public Response<UpdateProizvodReturnDto> updateKancelarijskiMaterijal(String token,Long id, MultipartFile file, String naziv, double cena,int kolicina, double duzina, double visina, double sirina, String proizvodjac, String vrstaKancelarijskogProizvoda) {
      
        UpdateProizvodReturnDto dto=new UpdateProizvodReturnDto();
       
       /* if(!tokenService.validateToken(token)){
             return new Response<>(ResponseStatus.Unauthorized, dto);
         }
       
        Claims claims;
        try {
            claims = tokenService.extractValidClaims(token);
        } catch (Exception ex) {
            dto.setMessage("invalid token");
             
             return new Response<>(ResponseStatus.Unauthorized, dto);
        }*/
        
        
        if(id==null || id<=0){
            dto.setMessage("Invalid parameters");
            return new Response<>(ResponseStatus.BadRequest, dto);
        }
        if( naziv==null ||  cena<=0 || naziv.equals("") || duzina<=0 || visina<=0 || sirina<=0 || proizvodjac==null || proizvodjac.equals("") || vrstaKancelarijskogProizvoda==null || vrstaKancelarijskogProizvoda.equals("")
                ){
            dto.setMessage("Invalid parameteres");
            return new Response<>(ResponseStatus.BadRequest,dto);
        }
       /* if(!dobarTokenZaAdmina(token)){
            dto.setMessage("Invalid token");
             return new Response<>(ResponseStatus.Unauthorized,dto);
        }*/
        Optional<Proizvod> proizvod=proizvodRepository.findById(id);
        if(proizvod.isEmpty()){
            dto.setMessage("Not found product with this id");
            return new Response<>(ResponseStatus.NotFound, dto);
        }
        KancelarijskiProizvod kp=new KancelarijskiProizvod();
        kp.setUrl(proizvod.get().getUrl());
        kp.setId(id);
        kp.setNaziv(naziv);
        kp.setCena(cena);
        kp.setKolicina(kolicina);
        kp.setDuzina(duzina);
        kp.setVisina(visina);
        kp.setSirina(sirina);
        kp.setProizvodjac(proizvodjac);
        try {
            VrstaKancelarijskogProizvoda vrsta = VrstaKancelarijskogProizvoda.valueOf(vrstaKancelarijskogProizvoda.toUpperCase());
            kp.setVrstaKancelarijskogProizvoda(vrsta);
            
            
        if (file != null && !file.isEmpty()) {
            String oldFileUrl = kp.getUrl();
            if (oldFileUrl != null && !oldFileUrl.isEmpty()) {
                deleteOldImage(oldFileUrl); 
            }
            
            String fileUrl = dodajSliku(file);
            kp.setUrl(fileUrl);
        }
        
        proizvodRepository.save(kp);
        dto.setMessage("Succesfully updated office supply");
        dto.setProduct(kp);
        return new Response<>(ResponseStatus.Ok,dto);
        } catch (IllegalArgumentException e) {
                dto.setMessage("Invalid type of office supply");
            return new Response<>(ResponseStatus.BadRequest,dto);
        }
    }
    
    @Override
    public Response<UpdateProizvodReturnDto> updateKnjiga(String token,Long id, MultipartFile file, String naziv, double cena,int kolicina,int izdanje, String opis, String pisciJson) {
         UpdateProizvodReturnDto dto=new UpdateProizvodReturnDto();
      /* if(!tokenService.validateToken(token)){
             return new Response<>(ResponseStatus.Unauthorized, dto);
         }
       
        Claims claims;
        try {
            claims = tokenService.extractValidClaims(token);
        } catch (Exception ex) {
            dto.setMessage("invalid token");
             
             return new Response<>(ResponseStatus.Unauthorized, dto);
        }*/
        
        
       
        if(id==null || id<=0){
            
            dto.setMessage("Invalid id");
            return new Response<>(ResponseStatus.BadRequest, dto);
        }
        if( naziv==null ||  cena<=0 || naziv.equals("") || izdanje<=0 || opis==null || opis.equals("") || pisciJson==null || pisciJson.equals("")
                ){
            dto.setMessage("Invalid parameters");
            return new Response<>(ResponseStatus.BadRequest,dto);
        }
       /* if(!dobarTokenZaAdmina(token)){
            dto.setMessage("Invalid token");
             return new Response<>(ResponseStatus.Unauthorized,dto);
        }*/
        Optional<Proizvod> proizvod=proizvodRepository.findById(id);
        if(proizvod.isEmpty()){
            dto.setMessage("Not found product with this id");
            return new Response<>(ResponseStatus.NotFound, dto);
        }
        
          Knjiga knjiga = new Knjiga();
          knjiga.setId(proizvod.get().getId());
          knjiga.setUrl(proizvod.get().getUrl());
        knjiga.setNaziv(naziv);
        knjiga.setCena(cena);
        knjiga.setKolicina(kolicina);
        knjiga.setIzdanje(izdanje);
        knjiga.setOpis(opis);

        List<Integer> idPisaca;
        try {
            idPisaca = objectMapper.readValue(pisciJson, new TypeReference<List<Integer>>() {});
            
            List<Autor> autori = new ArrayList<>();
        for (Integer idPomocni : idPisaca) {
            Autor autor = new Autor();
            Optional<Pisac> pisac=pisacRepository.findById(idPomocni.longValue());
            if(pisac.isEmpty()){
                dto.setMessage("Invalid authors");
                return new Response<>(ResponseStatus.BadRequest,dto);
            }
            autor.setPisac(pisac.get());
            autor.setKnjiga(knjiga);
            autori.add(autor);
        }
        knjiga.setAutori(autori);
       
        if (file != null && !file.isEmpty()) {
            String oldFileUrl = knjiga.getUrl();
            if (oldFileUrl != null && !oldFileUrl.isEmpty()) {
                deleteOldImage(oldFileUrl); 
            }
            
            String fileUrl = dodajSliku(file);
            knjiga.setUrl(fileUrl);
        }
        
        
        
        
        proizvodRepository.save(knjiga);
        dto.setMessage("Successfully updated book");
        dto.setProduct(knjiga);
        return new Response<>(ResponseStatus.Ok, dto);
        } catch (JsonProcessingException ex) {
           
            dto.setMessage("Invalid authors");
            return new Response<>(ResponseStatus.BadRequest,dto);
        }
    }

    
    
    
    private String dodajSliku(MultipartFile file){
        try {
          
            if (!Files.exists(ROOT_LOCATION)) {
                Files.createDirectories(ROOT_LOCATION);
            }

            
            String fileName = UUID.randomUUID().toString() + getFileExtension(file.getOriginalFilename());
            Path filePath = ROOT_LOCATION.resolve(fileName);

          
            Files.copy(file.getInputStream(), filePath);

          
            String fileUrl = "http://localhost:8080/api/public/images/" + fileName;
         
            return fileUrl;
            
        } catch (IOException e) {
            e.printStackTrace();
            throw new RuntimeException("The file saving error occurred", e);
        }
    }
    private void deleteOldImage(String fileUrl) {
   
    String fileName = fileUrl.substring(fileUrl.lastIndexOf("/") + 1);
    Path filePath = ROOT_LOCATION.resolve(fileName);
    
    try {
        
        Files.deleteIfExists(filePath);
    } catch (IOException e) {
        e.printStackTrace();
       
    }
}

    private String getFileExtension(String filename) {
        int dotIndex = filename.lastIndexOf(".");
        if (dotIndex > 0) {
            return filename.substring(dotIndex);
        }
        return "";
    }

    @Override
    public Response<List<Proizvod>> getAllProizvodi() {
     
        return new Response<>(ResponseStatus.Ok,proizvodRepository.findAll());
    }
    
    @Override
    public Response<List<Proizvod>> findAllProizvodi(String naziv) {
        return new Response<>(ResponseStatus.Ok,proizvodRepository.findByNazivContainingIgnoreCase(naziv));
    }
    
    @Override
public Response<List<String>> getAllVrstaKancelarijskogProizvoda() {
   
    List<String> vrste = Arrays.stream(VrstaKancelarijskogProizvoda.values())
                               .map(Enum::name)
                               .collect(Collectors.toList());
    return new Response<>(ResponseStatus.Ok, vrste);
}

    
    private boolean dobarTokenZaAdmina(String token){
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
        
        return true;
    }

    @Override
    public Response<CheckStockDto> checkAvailability(String stavkePorudzbineJson) {
        CheckStockDto dto=new CheckStockDto();
        List<StavkaPorudzbine> stavkePorudzbine;
        try {
            stavkePorudzbine = objectMapper.readValue(stavkePorudzbineJson, new TypeReference<List<StavkaPorudzbine>>() {});
            
           
             for(StavkaPorudzbine stavka : stavkePorudzbine){
            if(stavka.getProizvod().getKolicina()-stavka.getKolicina()<0){
                dto.setIndikator(false);
                dto.setMessage("Out of stock");
                return new Response<>(ResponseStatus.BadRequest, dto);
            }
            stavka.getProizvod().setKolicina(stavka.getProizvod().getKolicina()-stavka.getKolicina());
        }
             dto.setIndikator(true);
             dto.setMessage("We have this products on stock");
              return new Response<>(ResponseStatus.Ok, dto);
            
            
            
        
        
        
        } catch (JsonProcessingException ex) {
            dto.setIndikator(false);
            dto.setMessage("Bad order items");
           return new Response<>(ResponseStatus.BadRequest, dto);
        }
    }

    @Override
    public Response<Proizvod> getProizvod(Long id) {
        if(id==null || id<=0){
            return new Response<>(ResponseStatus.BadRequest, null);
        }
        
        if(proizvodRepository.findById(id).isEmpty()){
            return new Response<>(ResponseStatus.NotFound, null);
        }
        return  new Response<>(ResponseStatus.Ok, proizvodRepository.findById(id).get());
    }

    

    

    
   

  

    
}