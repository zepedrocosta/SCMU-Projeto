package fct.project.scmu.config;

import org.springframework.boot.autoconfigure.cache.RedisCacheManagerBuilderCustomizer;
import org.springframework.cache.annotation.EnableCaching;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.data.redis.cache.RedisCacheConfiguration;
import org.springframework.data.redis.serializer.JdkSerializationRedisSerializer;
import org.springframework.data.redis.serializer.RedisSerializationContext;
import org.springframework.data.redis.serializer.StringRedisSerializer;

import java.time.Duration;

//@EnableCaching
//@Configuration
public class RedisConfig {
    public static final String USERS = "users";
    public static final String SPAM_FILTER = "spam";

    private static final int DURATION = 5;
    private static final int SPAM_DURATION = 1;

    private static final RedisCacheConfiguration DEFAULT;
    private static final RedisCacheConfiguration UNLIMITED;
    private static final RedisCacheConfiguration SPAM;

    static {
        var keyMapper = RedisSerializationContext.SerializationPair.fromSerializer(new StringRedisSerializer());
        var valueMapper = RedisSerializationContext.SerializationPair.fromSerializer(new JdkSerializationRedisSerializer());

        DEFAULT = RedisCacheConfiguration.defaultCacheConfig()
                .disableCachingNullValues()
                .entryTtl(Duration.ofMinutes(DURATION))
                .serializeKeysWith(keyMapper)
                .serializeValuesWith(valueMapper);
        UNLIMITED = RedisCacheConfiguration.defaultCacheConfig()
                .disableCachingNullValues()
                .entryTtl(Duration.ZERO)
                .serializeKeysWith(keyMapper)
                .serializeValuesWith(valueMapper);
        SPAM = RedisCacheConfiguration.defaultCacheConfig()
                .disableCachingNullValues()
                .entryTtl(Duration.ofMinutes(SPAM_DURATION))
                .serializeKeysWith(keyMapper)
                .serializeValuesWith(valueMapper);
    }

    @Bean
    RedisCacheManagerBuilderCustomizer customizer() {
        return (builder) -> builder
                .withCacheConfiguration(USERS, DEFAULT)
                .withCacheConfiguration(SPAM_FILTER, SPAM);
    }

}
