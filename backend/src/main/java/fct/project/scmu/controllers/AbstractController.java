package fct.project.scmu.controllers;

import org.modelmapper.ModelMapper;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.http.ResponseEntity;
import org.springframework.validation.Validator;
import org.springframework.web.bind.WebDataBinder;
import org.springframework.web.bind.annotation.InitBinder;

import java.lang.reflect.Type;
import java.util.Optional;

public abstract class AbstractController {

    private ModelMapper mapper;
    private Validator[] validators;

    @InitBinder
    void setUpValidators(WebDataBinder webDataBinder) {
        var target = webDataBinder.getTarget();
        for (Validator validator : validators) {
            if (target != null && validator.supports(target.getClass())
                    && !validator.getClass().getName().contains("org.springframework"))
                webDataBinder.addValidators(validator);
        }
    }

    @Autowired
    final void setMapper(ModelMapper mapper) {
        this.mapper = mapper;
    }

    @Autowired
    final void setValidators(Validator[] validators) {
        this.validators = validators;
    }

    protected final <S, T> T convert(S param, Class<T> target) {
        return mapper.map(param, target);
    }

    protected final <S, T> T convert(S param, Type target) {
        return mapper.map(param, target);
    }

    protected final <S, T> Page<T> convert(Page<S> param, Class<T> target) {
        return param.map(it -> convert(it, target));
    }

    protected final <T> ResponseEntity<T> ok(T param) {
        return build(param);
    }

    protected final <T> ResponseEntity<T> ok(Optional<T> param) {
        return build(param.orElse(null));
    }

    protected final <S, T> ResponseEntity<T> ok(S param, Class<T> target) {
        return build(convert(param, target));
    }

    protected final <S, T> ResponseEntity<Page<T>> ok(Page<S> param, Class<T> target) {
        return build(convert(param, target));
    }

    protected final <S, T> ResponseEntity<T> ok(S param, Type target) {
        return build(convert(param, target));
    }

    private final <T> ResponseEntity<T> build(T param) {
        return param == null ? ResponseEntity.ok().build() : ResponseEntity.ok(param);
    }

}
