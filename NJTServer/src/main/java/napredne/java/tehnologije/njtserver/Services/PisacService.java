/*
 * Click nbfs://nbhost/SystemFileSystem/Templates/Licenses/license-default.txt to change this license
 * Click nbfs://nbhost/SystemFileSystem/Templates/Classes/Interface.java to edit this template
 */
package napredne.java.tehnologije.njtserver.Services;

import java.util.List;
import napredne.java.tehnologije.njtserver.Models.Pisac;
import napredne.java.tehnologije.njtserver.Utils.Response;

/**
 *
 * @author Lenovo
 */
public interface PisacService {

    public Response<List<Pisac>> getAllPisac();
    
}
