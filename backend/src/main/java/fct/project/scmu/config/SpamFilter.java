package fct.project.scmu.config;

import jakarta.servlet.FilterChain;
import jakarta.servlet.ServletException;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import lombok.RequiredArgsConstructor;
import org.springframework.cache.CacheManager;
import org.springframework.stereotype.Component;
import org.springframework.web.filter.OncePerRequestFilter;

import java.io.IOException;

import static fct.project.scmu.config.RedisConfig.SPAM_FILTER;

/**
 * Uses the Redis Cache to keep a record of the number of requests made by an IP address.
 * If it reaches the SPAM_COUNT limit, it will block the IP address, until the cache expires.
 */
@Component
@RequiredArgsConstructor
public class SpamFilter extends OncePerRequestFilter {

    private static final int SPAM_COUNT = 200; // Max number of requests allowed before starting to ignore.

    private final CacheManager cacheManager;

    @Override
    protected void doFilterInternal(HttpServletRequest request, HttpServletResponse response, FilterChain filterChain) throws ServletException, IOException {
        var ip = request.getHeader("X-Forwarded-For");
        if (ip == null) {
            ip = request.getRemoteAddr();
        }
        else {
            ip = ip.split(",")[0];
        }
        var cache = cacheManager.getCache(SPAM_FILTER);
        var count = cache.get(ip, Integer.class);

        if (count != null && count > SPAM_COUNT) {
            response.setStatus(429);
            response.getWriter().write("Too many requests");
            return;
        }

        cache.put(ip, count == null ? 1 : count + 1);
        filterChain.doFilter(request, response);
    }
}
