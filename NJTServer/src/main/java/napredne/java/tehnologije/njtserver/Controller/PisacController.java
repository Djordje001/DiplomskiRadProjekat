/*
 * Click nbfs://nbhost/SystemFileSystem/Templates/Licenses/license-default.txt to change this license
 * Click nbfs://nbhost/SystemFileSystem/Templates/Classes/Class.java to edit this template
 */
package napredne.java.tehnologije.njtserver.Controller;

import java.util.List;
import lombok.RequiredArgsConstructor;
import napredne.java.tehnologije.njtserver.Models.Pisac;
import napredne.java.tehnologije.njtserver.Services.PisacService;
import napredne.java.tehnologije.njtserver.Utils.Response;
import napredne.java.tehnologije.njtserver.Utils.ResponseConverter;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

/**
 *
 * @author Lenovo
 */

@RequiredArgsConstructor
@RestController
@RequestMapping("/api/public/pisci")
//@CrossOrigin(origins = "http://localhost:3000")
@CrossOrigin(origins = "*")
public class PisacController {
      private final PisacService pisacService;
      private  final ResponseConverter<Pisac> converter;
      
      
    @GetMapping
    public ResponseEntity<List<Pisac>> getAllPisac() {
        Response<List<Pisac>> response = pisacService.getAllPisac();
        return converter.toListResponseEntity(response);
    }
}
