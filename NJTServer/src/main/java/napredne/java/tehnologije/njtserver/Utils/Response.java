package napredne.java.tehnologije.njtserver.Utils;


import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;
import napredne.java.tehnologije.njtserver.Enums.ResponseStatus;
import org.springframework.stereotype.Component;


@Component
@Setter
@Getter
@NoArgsConstructor
public class Response<T> {

    private T data;
    private ResponseStatus status;

    public Response(ResponseStatus status) {
        this.status = status;
    }

    public Response(ResponseStatus status, T data) {
        this.data = data;
        this.status = status;
    }
}
