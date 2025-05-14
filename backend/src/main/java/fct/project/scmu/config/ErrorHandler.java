package fct.project.scmu.config;

import jakarta.servlet.http.HttpServletRequest;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.RequestMapping;

@Controller
public class ErrorHandler {

    @RequestMapping(value = { "/", "/{spring:\\w+}", "/{spring:\\w+}/{spring:\\w+}" , "/{spring:\\w+}/{spring:\\w+}/{spring:\\w+}" })
    public String getIndex(HttpServletRequest request) {
        return "/index.html";
    }
}
