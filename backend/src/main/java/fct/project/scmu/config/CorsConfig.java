package fct.project.scmu.config;

import jakarta.servlet.FilterChain;
import jakarta.servlet.ServletException;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import org.springframework.stereotype.Component;
import org.springframework.web.filter.OncePerRequestFilter;

import java.io.IOException;

/**
 * Configuration class for Cross-Origin Resource Sharing (CORS).
 * It extends Spring's OncePerRequestFilter to ensure that it is executed once per request within a single request thread.
 * It is annotated with @Component to be automatically detected by Spring's component scanning.
 */
@Component
public class CorsConfig extends OncePerRequestFilter {

    /**
     * Overrides the doFilterInternal method of OncePerRequestFilter.
     * It adds CORS headers to the response and then delegates to the next element in the filter chain.
     * @param request the current HTTP request
     * @param response the current HTTP response
     * @param filterChain provides access to the next filter in the chain
     * @throws ServletException in case of errors
     * @throws IOException in case of I/O errors
     */
    @Override
    protected void doFilterInternal(HttpServletRequest request, HttpServletResponse response, FilterChain filterChain)
            throws ServletException, IOException {
        response.addHeader("Access-Control-Allow-Methods", "HEAD,GET,PUT,POST,DELETE,OPTIONS");
        response.addHeader("Access-Control-Allow-Origin", "*");
        response.addHeader("Access-Control-Allow-Headers", "Content-Type, X-Requested-With");
        filterChain.doFilter(request, response);
    }
}