package fct.project.scmu.config.json;

import com.google.gson.ExclusionStrategy;
import com.google.gson.FieldAttributes;

/**
 * An exclusion strategy used to log the DAO classes without triggering the fetch
 * of all related data.
 */
@SuppressWarnings({ "unchecked", "rawtypes" })
public class SqlRelationshipStrategy implements ExclusionStrategy {

    @Override
    public boolean shouldSkipField(FieldAttributes f) {
        var manyToMany = forName("jakarta.persistence.ManyToMany");
        var oneToMany = forName("jakarta.persistence.OneToMany");
        var manyToOne = forName("jakarta.persistence.ManyToOne");
        var oneToOne = forName("jakarta.persistence.OneToOne");
        var elementCollection = forName("jakarta.persistence.ElementCollection");
        if (manyToMany == null || oneToMany == null || manyToOne == null || oneToOne == null
                || elementCollection == null) {
            return false;
        }
        return f.getAnnotation(manyToMany) != null ||
                f.getAnnotation(oneToMany) != null ||
                f.getAnnotation(manyToOne) != null ||
                f.getAnnotation(oneToOne) != null ||
                f.getAnnotation(elementCollection) != null;
    }

    @Override
    public boolean shouldSkipClass(Class<?> clazz) {
        return false;
    }

    private Class forName(String path) {
        try {
            return Class.forName(path);
        } catch (ClassNotFoundException e) {
            return null;
        }
    }
}