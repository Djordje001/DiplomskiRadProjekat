/*
 * Click nbfs://nbhost/SystemFileSystem/Templates/Licenses/license-default.txt to change this license
 * Click nbfs://nbhost/SystemFileSystem/Templates/Classes/Class.java to edit this template
 */


package napredne.java.tehnologije.njtserver.Config;


import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.config.annotation.web.configuration.EnableWebSecurity;
import org.springframework.security.config.http.SessionCreationPolicy;
import org.springframework.security.web.SecurityFilterChain;
import org.springframework.security.web.authentication.UsernamePasswordAuthenticationFilter;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpMethod;
import org.springframework.web.cors.CorsConfiguration;
import org.springframework.web.cors.UrlBasedCorsConfigurationSource;

@EnableWebSecurity
@RequiredArgsConstructor
@Configuration
public class SecurityConfig {

    private final JwtAuthenticationFilter jwtAuthenticationFilter;

    @Bean
    public SecurityFilterChain securityFilterChain(HttpSecurity http) throws Exception {
        http.
                exceptionHandling()
        .accessDeniedHandler(new CustomAccessDeniedHandler())
        .and()
            .cors(cors -> cors.configurationSource(corsConfigurationSource()))  // Omogući CORS
            .csrf(csrf -> csrf.disable())  // Isključi CSRF zaštitu
            .sessionManagement(session -> session
                .sessionCreationPolicy(SessionCreationPolicy.STATELESS)  // Koristi stateless sesije
            )
            .authorizeHttpRequests(authz -> authz
                .requestMatchers("/api/public/**").permitAll()  // Dozvoli pristup bez autentifikacije
                .requestMatchers("/api/auth/register").permitAll()  // Dozvoli pristup bez autentifikacije
                .requestMatchers("/api/auth/login").permitAll()  // Dozvoli pristup bez autentifikacije
                    .requestMatchers("/api/auth/request-password-change").permitAll()
                     .requestMatchers("/api/auth/change-password").permitAll()
                     .requestMatchers("/api/auth/validate-token").permitAll()
                     .requestMatchers("/api/users/change-user-data").hasAuthority("KUPAC")
                    .requestMatchers("/api/porudzbine/add-order-add-transaction").hasAuthority("KUPAC")
                     .requestMatchers("/api/porudzbine/rejectOrProcess").hasAuthority("HIGHADMIN")
                   .requestMatchers("/api/proizvodi/**").hasAnyAuthority("HIGHADMIN","LOWADMIN")
                   
                   // .requestMatchers("/api/auth/logout").permitAll()
                .requestMatchers(HttpMethod.OPTIONS, "/**").permitAll()  // Dozvoli OPTIONS zahteve
                //.requestMatchers("/api/proizvodi/**").hasAuthority("HIGHADMIN")  // Zahtevaj autoritet "KUPAC"
                .anyRequest().authenticated()  // Sve ostale rute zahtevaju autentifikaciju
            )
            .addFilterBefore(jwtAuthenticationFilter, UsernamePasswordAuthenticationFilter.class)  // Dodaj JWT filter pre defaultnog
            .httpBasic(httpBasic -> httpBasic.disable())  // Isključi osnovnu autentifikaciju
            .formLogin(form -> form.disable())  // Isključi login formu
            .logout(logout -> logout.disable());  // Isključi logout mehanizam

        return http.build();
    }

    // CORS konfiguracija
    @Bean
    public UrlBasedCorsConfigurationSource corsConfigurationSource() {
        CorsConfiguration config = new CorsConfiguration();
        config.setAllowCredentials(true);
        config.addAllowedOrigin("http://localhost:3000");
        config.addAllowedHeader("*");
        config.addAllowedMethod("*");
        
        UrlBasedCorsConfigurationSource source = new UrlBasedCorsConfigurationSource();
        source.registerCorsConfiguration("/**", config);
        return source;
    }
}
