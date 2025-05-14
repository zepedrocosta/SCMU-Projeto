package fct.project.scmu.config;

import jakarta.servlet.FilterChain;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import lombok.RequiredArgsConstructor;
import org.springframework.web.filter.OncePerRequestFilter;
import org.springframework.web.servlet.HandlerExceptionResolver;

/**
 * Filter class for handling exceptions during the filter chain execution.
 * Filter chain is a series of filters that are applied to the request before it is passed to the servlet.
 * When an exception is caught, it passed to the FilterExceptionHandler to be resolved.
 * It extends Spring's OncePerRequestFilter to ensure that it is executed once per request within a single request thread.
 */
@RequiredArgsConstructor
public class FilterExceptionHandler extends OncePerRequestFilter {

    // Handler for resolving exceptions
    private final HandlerExceptionResolver handler;

    /**
     * Overrides the doFilterInternal method of OncePerRequestFilter.
     * It tries to execute the filter chain and if an exception occurs, it is resolved by the handler.
     * @param request the current HTTP request
     * @param response the current HTTP response
     * @param filterChain provides access to the next filter in the chain
     */
    @Override
    protected void doFilterInternal(HttpServletRequest request, HttpServletResponse response, FilterChain filterChain) {
        try {
            filterChain.doFilter(request, response);
        } catch (Exception e) {
            handler.resolveException(request, response, null, e);
        }
    }
}