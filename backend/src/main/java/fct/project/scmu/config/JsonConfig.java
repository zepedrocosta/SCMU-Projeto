package fct.project.scmu.config;

import com.fatboyindustrial.gsonjavatime.Converters;
import com.google.common.reflect.TypeResolver;
import com.google.gson.*;
import fct.project.scmu.config.json.AnnotationExclusionStrategy;
import fct.project.scmu.config.json.PageAdapter;
import fct.project.scmu.config.json.SqlRelationshipStrategy;
import org.springframework.boot.autoconfigure.condition.ConditionalOnClass;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.context.annotation.Primary;
import org.springframework.data.domain.Page;
import org.springframework.http.converter.json.GsonHttpMessageConverter;

/**
 * Configuration class for JSON processing.
 * Annotated with @ConditionalOnClass to only instantiate the beans if Gson class is on the classpath.
 */
@Configuration
@ConditionalOnClass(Gson.class)
public class JsonConfig {

    /**
     * Provides a TypeResolver bean.
     * TypeResolver is a utility class for resolving type parameters.
     * It is used by the PageAdapter to resolve the type of the content of a Page.
     * @return a new TypeResolver
     */
    @Bean
    public TypeResolver resolver() {
        return new TypeResolver();
    }

    @Bean
    @Primary
    public Gson getGson() {
        return Converters.registerAll(new GsonBuilder()
                .setPrettyPrinting()
                .setExclusionStrategies(new AnnotationExclusionStrategy())
                .registerTypeAdapter(Page.class, new PageAdapter<>()))
                .create();
    }

    @Bean
    public Gson getGsonAspect() {
        return Converters.registerAll(new GsonBuilder()
                .setExclusionStrategies(new SqlRelationshipStrategy())
                .registerTypeAdapter(Page.class, new PageAdapter<>()))
                .create();
    }

    /**
     * Provides a GsonHttpMessageConverter bean.
     * The converter is configured with a Gson instance that has
     * pretty printing enabled and a custom serializer for Page objects.
     * Pretty printing is used to make the JSON output more readable.
     * @return a new GsonHttpMessageConverter
     */
    @Bean
    public GsonHttpMessageConverter getMsgConverter() {
        return new GsonHttpMessageConverter(getGson());
    }
}