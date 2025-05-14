package fct.project.scmu.validators.users;

import fct.project.scmu.daos.User;
import fct.project.scmu.dtos.forms.users.EditUserForm;
import fct.project.scmu.repositories.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Component;
import org.springframework.validation.Errors;
import org.springframework.validation.Validator;
import org.springframework.web.server.ResponseStatusException;

@Component
@RequiredArgsConstructor
public class EditUserValidator implements Validator {

    private final UserRepository users;

    @Override
    public boolean supports(Class<?> clazz) {
        return clazz == EditUserForm.class;
    }

    @Override
    public void validate(Object target, Errors errors) {
        var form = (EditUserForm) target;

        if (errors.hasErrors())
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST);

        if (form.getNif() != null)
            if (!form.getNif().matches("^\\d+$"))
                throw new ResponseStatusException(HttpStatus.PRECONDITION_FAILED);

        if (form.getPostalCode() != null)
            if (!form.getPostalCode().matches("^\\d{4}(-\\d{3})?$"))
                throw new ResponseStatusException(HttpStatus.PRECONDITION_FAILED);

        if (form.getPhoneNum() != null)
            if (!form.getPhoneNum().isEmpty() && !form.getPhoneNum().matches("^\\+(?:[0-9] ?){6,14}[0-9]$"))
                throw new ResponseStatusException(HttpStatus.BAD_REQUEST);

        User user = users.findByNickname(form.getNickname()).orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND));

        //TODO: Implement edit user validation
    }
}
