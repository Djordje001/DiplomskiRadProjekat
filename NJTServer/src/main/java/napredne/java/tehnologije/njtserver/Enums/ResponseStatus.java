package napredne.java.tehnologije.njtserver.Enums;

import lombok.Getter;
import lombok.RequiredArgsConstructor;

@Getter
@RequiredArgsConstructor
public enum ResponseStatus {
    Ok(200),
    Created(201),
    NoContent(204),
    BadRequest(400),
    Unauthorized(401),
    Forbidden(403),
    NotFound(404),
    Conflict(409),
    InternalServerError(500);

    private final int code;

}
