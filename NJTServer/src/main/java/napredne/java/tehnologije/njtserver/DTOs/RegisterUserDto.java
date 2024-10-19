package napredne.java.tehnologije.njtserver.DTOs;

import java.util.Date;

public record RegisterUserDto(String email,String firstName,String lastName,Date datumRodjenja,String brojTelefona) {
}
