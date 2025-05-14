package fct.project.scmu.validators.users;

import fct.project.scmu.dtos.forms.users.ChangeRoleForm;
import fct.project.scmu.repositories.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Component;
import org.springframework.validation.Errors;
import org.springframework.validation.Validator;
import org.springframework.web.server.ResponseStatusException;

@Component
@RequiredArgsConstructor
public class ChangeRoleValidator implements Validator {

    private final UserRepository users;

    @Override
    public boolean supports(Class<?> clazz) {
        return clazz == ChangeRoleForm.class;
    }

    @Override
    public void validate(Object target, Errors errors) {
        var form = (ChangeRoleForm) target;

        if (errors.hasErrors())
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST);

        var user = users.findByNickname(form.getNickname()).orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND));

        //TODO: Implement role change validation
    }
}
