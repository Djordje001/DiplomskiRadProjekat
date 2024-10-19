/*
 * Click nbfs://nbhost/SystemFileSystem/Templates/Licenses/license-default.txt to change this license
 * Click nbfs://nbhost/SystemFileSystem/Templates/Classes/Class.java to edit this template
 */
package napredne.java.tehnologije.njtserver.Services.Impl;

import java.util.List;
import lombok.RequiredArgsConstructor;
import napredne.java.tehnologije.njtserver.Enums.ResponseStatus;
import napredne.java.tehnologije.njtserver.Models.Pisac;
import napredne.java.tehnologije.njtserver.Repositories.PisacRepository;
import napredne.java.tehnologije.njtserver.Services.PisacService;
import napredne.java.tehnologije.njtserver.Utils.Response;
import org.springframework.stereotype.Service;

/**
 *
 * @author Lenovo
 */
@RequiredArgsConstructor
@Service
public class PisacServiceImpl implements PisacService{
    private final PisacRepository pisacRepository;

    @Override
    public Response<List<Pisac>> getAllPisac() {
        List<Pisac> pisci = pisacRepository.findAll();
       
       
         
         return new Response<>(ResponseStatus.Ok, pisci);
    }
}
