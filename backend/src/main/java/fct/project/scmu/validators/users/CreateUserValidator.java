package fct.project.scmu.validators.users;

import fct.project.scmu.dtos.forms.users.UserForm;
import fct.project.scmu.repositories.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Component;
import org.springframework.validation.Errors;
import org.springframework.validation.Validator;
import org.springframework.web.server.ResponseStatusException;

@Component
@RequiredArgsConstructor
public class CreateUserValidator implements Validator {

    private final UserRepository users;

    @Override
    public boolean supports(Class<?> clazz) {
        return clazz == UserForm.class;
    }

    @Override
    public void validate(Object target, Errors errors) {
        var user = (UserForm) target;

        if (errors.hasErrors())
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST);

        if (user.getNickname().contains("-") || user.getNickname().contains(" "))
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST);

        if (user.getNickname().trim().equals("system") || users.existsByEmail(user.getEmail().trim()) || users.existsByNickname(user.getNickname().trim()))
            throw new ResponseStatusException(HttpStatus.CONFLICT);

        if (!user.getPassword().equals(user.getConfirmPassword()))
            throw new ResponseStatusException(HttpStatus.FORBIDDEN);

        
    }
}
