package fct.project.scmu.config.json;

import com.google.gson.*;
import org.springframework.data.domain.Page;

import java.lang.reflect.Type;

/**
 * Custom serializer for Page objects.
 * It serializes a Page object into a JSON object with properties for page size,
 * page number, number of elements, total pages, total elements, and content.
 * The content is a JSON array of the serialized content of the Page.
 * @param <T> the type of the content of the Page
 */
public class PageAdapter<T> implements JsonSerializer<Page<T>> {

    /**
     * Serializes a Page object into a JsonElement.
     * @param src the Page to serialize
     * @param typeOfSrc the actual type of the source object
     * @param context the context of the serialization
     * @return a JsonElement representing the serialized Page
     */
    @Override
    public JsonElement serialize(Page<T> src, Type typeOfSrc, JsonSerializationContext context) {
        JsonObject object = new JsonObject();
        object.addProperty("pageSize", src.getSize());
        object.addProperty("page", src.getNumber());
        object.addProperty("elements", src.getNumberOfElements());
        object.addProperty("totalPages", src.getTotalPages());
        object.addProperty("total", src.getTotalElements());
        JsonArray array = new JsonArray();
        src.getContent().forEach((item) -> array.add(context.serialize(item)));
        object.add("content", array);
        return object;
    }
}