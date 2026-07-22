package smarttrip.config;

import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.AccessDeniedException;
import org.springframework.web.bind.MethodArgumentNotValidException;
import org.springframework.web.bind.annotation.ExceptionHandler;
import org.springframework.web.bind.annotation.RestControllerAdvice;

import java.util.LinkedHashMap;
import java.util.Map;

/**
 * Converts uncaught exceptions into a clean JSON body instead of Spring
 * Boot's default opaque {"status":500,"error":"Internal Server Error"} page,
 * so the frontend (and whoever is debugging) can see the real reason.
 */
@RestControllerAdvice
public class GlobalExceptionHandler {

    // Validation errors (e.g. @Valid @RequestBody failures) -> 400 with field messages
    @ExceptionHandler(MethodArgumentNotValidException.class)
    public ResponseEntity<Map<String, Object>> handleValidation(MethodArgumentNotValidException ex) {
        Map<String, Object> body = new LinkedHashMap<>();
        body.put("message", "Validation failed");

        Map<String, String> fieldErrors = new LinkedHashMap<>();
        ex.getBindingResult().getFieldErrors().forEach(fe ->
                fieldErrors.put(fe.getField(), fe.getDefaultMessage()));
        body.put("errors", fieldErrors);

        return ResponseEntity.badRequest().body(body);
    }

    // A @PreAuthorize role check rejected the caller -> 403 (must be declared
    // before the generic RuntimeException handler below, since AccessDeniedException
    // is itself a RuntimeException and we don't want it collapsed into a 400).
    @ExceptionHandler(AccessDeniedException.class)
    public ResponseEntity<Map<String, Object>> handleAccessDenied(AccessDeniedException ex) {
        Map<String, Object> body = new LinkedHashMap<>();
        body.put("message", "Access denied: you do not have permission for this action");
        return ResponseEntity.status(HttpStatus.FORBIDDEN).body(body);
    }

    // Anything we threw ourselves (User/Driver/Vehicle/Trip not found, invalid
    // email/password, missing fare, etc.) -> 400 with the real message
    @ExceptionHandler(RuntimeException.class)
    public ResponseEntity<Map<String, Object>> handleRuntime(RuntimeException ex) {
        Map<String, Object> body = new LinkedHashMap<>();
        body.put("message", ex.getMessage() != null ? ex.getMessage() : "Something went wrong");
        return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(body);
    }

    // Last-resort safety net so nothing ever falls back to the raw 500 page
    @ExceptionHandler(Exception.class)
    public ResponseEntity<Map<String, Object>> handleGeneric(Exception ex) {
        Map<String, Object> body = new LinkedHashMap<>();
        body.put("message", "Unexpected server error: " + ex.getMessage());
        return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(body);
    }
}
