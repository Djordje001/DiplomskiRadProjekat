package napredne.java.tehnologije.njtserver.Controller;

import org.springframework.core.io.Resource;
import org.springframework.core.io.UrlResource;
import org.springframework.http.HttpHeaders;

import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.io.File;

import java.net.MalformedURLException;
import java.nio.file.Path;
import java.nio.file.Paths;

@RestController
@RequestMapping("/api/public/images")
//@CrossOrigin(origins = "http://localhost:3000")
@CrossOrigin(origins = "*")
public class ImageController {

    private final Path imagePath = Paths.get("src/main/resources/static/images");

    @GetMapping("/{filename}")
    public ResponseEntity<Resource> getImage(@PathVariable String filename) {
       
        try {
          
            File file = new File(imagePath.toFile(), filename);
            if (file.exists()) {
                
                Resource resource = new UrlResource(file.toURI());
                
                String contentType = "image/jpeg";
                if (filename.endsWith(".png")) {
                    contentType = "image/png";
                } else if (filename.endsWith(".jpg") || filename.endsWith(".jpeg")) {
                    contentType = "image/jpeg";
                }
                return ResponseEntity.ok()
                    .contentType(MediaType.parseMediaType(contentType))
                    .header(HttpHeaders.CONTENT_DISPOSITION, "attachment; filename=\"" + filename + "\"")
                    .body(resource);
            } else {
                return ResponseEntity.notFound().build();
            }
        } catch (MalformedURLException e) {
            return ResponseEntity.notFound().build();
        }
    }
}