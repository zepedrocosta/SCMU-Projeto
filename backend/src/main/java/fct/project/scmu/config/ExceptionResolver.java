package fct.project.scmu.config;

import io.jsonwebtoken.ExpiredJwtException;
import io.jsonwebtoken.MalformedJwtException;
import io.jsonwebtoken.UnsupportedJwtException;
import io.jsonwebtoken.security.SignatureException;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.HttpHeaders;
import org.springframework.http.HttpStatus;
import org.springframework.http.HttpStatusCode;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.AccessDeniedException;
import org.springframework.security.authentication.BadCredentialsException;
import org.springframework.security.core.AuthenticationException;
import org.springframework.web.bind.MethodArgumentNotValidException;
import org.springframework.web.bind.annotation.ControllerAdvice;
import org.springframework.web.bind.annotation.ExceptionHandler;
import org.springframework.web.context.request.WebRequest;
import org.springframework.web.server.ResponseStatusException;
import org.springframework.web.servlet.mvc.method.annotation.ResponseEntityExceptionHandler;

/**
 * Exception handler class that extends ResponseEntityExceptionHandler, a class with
 * an @ExceptionHandler method that handles all Spring MVC raised exceptions.
 * It is annotated with @ControllerAdvice to make it applicable to all @Controller classes.
 */
@ControllerAdvice
@RequiredArgsConstructor
@Slf4j
public class ExceptionResolver extends ResponseEntityExceptionHandler {

    /**
     * Handles JWT related exceptions.
     * @param ex the exception
     * @param request the current web request
     * @return a ResponseEntity with the status code set to FORBIDDEN
     */
    @ExceptionHandler({
            SignatureException.class,
            ExpiredJwtException.class,
            MalformedJwtException.class,
            UnsupportedJwtException.class
    })
    public final ResponseEntity<Object> handleJwtExceptions(Exception ex, WebRequest request) {
        return handle(ex, request, HttpStatus.FORBIDDEN);
    }

    /**
     * Handles AuthenticationException.
     * @param ex the exception
     * @return a ResponseEntity with the status code set to UNAUTHORIZED
     */
    @ExceptionHandler({ AuthenticationException.class })
    public ResponseEntity<Object> handleAuthenticationException(Exception ex) {
        return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body(null);
    }

    /**
     * Handles ResponseStatusException.
     * @param ex the exception
     * @param request the current web request
     * @return a ResponseEntity with the status code set to the status code of the exception
     */
    @ExceptionHandler(ResponseStatusException.class)
    public final ResponseEntity<Object> handleResponseStatus(ResponseStatusException ex, WebRequest request) {
        return handle(ex, request, (HttpStatus) ex.getStatusCode());
    }

    /**
     * Handles BadCredentialsException.
     * @param ex the exception
     * @param request the current web request
     * @return a ResponseEntity with the status code set to FORBIDDEN
     */
    @ExceptionHandler(BadCredentialsException.class)
    public final ResponseEntity<Object> handleBadCredentialException(BadCredentialsException ex, WebRequest request) {
        return handle(ex, request, HttpStatus.FORBIDDEN);
    }

    /**
     * Handles AccessDeniedException.
     * @param ex the exception
     * @param request the current web request
     * @return a ResponseEntity with the status code set to UNAUTHORIZED
     */
    @ExceptionHandler(AccessDeniedException.class)
    public final ResponseEntity<Object> handleAccessDeniedException(AccessDeniedException ex, WebRequest request) {
        return handle(ex, request, HttpStatus.UNAUTHORIZED);
    }

    /**
     * Overrides the default method to handle exceptions.
     * @param ex the exception
     * @param body the body for the response
     * @param headers the headers for the response
     * @param status the status code for the response
     * @param request the current web request
     * @return a ResponseEntity with the status code set to the status code of the exception
     */
    @Override
    protected ResponseEntity<Object> handleExceptionInternal(Exception ex, Object body, HttpHeaders headers, HttpStatusCode status, WebRequest request) {
        return handle(ex, request, (HttpStatus) status);
    }

    /**
     * Overrides the default method to handle MethodArgumentNotValidException.
     * @param ex the exception
     * @param headers the headers for the response
     * @param status the status code for the response
     * @param request the current web request
     * @return a ResponseEntity with the status code set to the status code of the exception
     */
    @Override
    protected ResponseEntity<Object> handleMethodArgumentNotValid(MethodArgumentNotValidException ex, HttpHeaders headers, HttpStatusCode status, WebRequest request) {
        return handle(ex, request, (HttpStatus) status);
    }

    /**
     * Handles exceptions by logging them and returning a ResponseEntity with the specified status code.
     * @param ex the exception
     * @param request the current web request
     * @param status the status code for the response
     * @return a ResponseEntity with the specified status code
     */
    private ResponseEntity<Object> handle(Throwable ex, WebRequest request, HttpStatus status) {
        log.error("", ex);
        return new ResponseEntity<>(null, new HttpHeaders(), status);
    }
}