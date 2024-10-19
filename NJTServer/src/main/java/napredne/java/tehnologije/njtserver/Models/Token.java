package napredne.java.tehnologije.njtserver.Models;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;


import java.util.Date;
import napredne.java.tehnologije.njtserver.Enums.TipTokena;


@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Entity
@Table(name = "token")
public class Token {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(name = "vrednost_tokena",length = 700)
    private String vrednostTokena;

    @Column(name = "created_at")
    private Date createdAt;

    @Column(name = "expires_at")
    private Date expiresAt;

    @OneToOne
    @JoinColumn(name = "user_id", referencedColumnName = "id")
    private User user;

    @Column(name = "tip_tokena")
    @Enumerated(EnumType.STRING)
    private TipTokena tipTokena;

}

