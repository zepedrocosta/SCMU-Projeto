package fct.project.scmu.config;

import com.google.gson.Gson;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.aspectj.lang.ProceedingJoinPoint;
import org.aspectj.lang.annotation.Around;
import org.aspectj.lang.annotation.Aspect;
import org.aspectj.lang.annotation.Pointcut;
import org.aspectj.lang.reflect.MethodSignature;
import org.slf4j.MDC;
import org.springframework.aop.framework.Advised;
import org.springframework.aop.support.AopUtils;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Qualifier;
import org.springframework.boot.autoconfigure.AutoConfigurationPackages;
import org.springframework.context.ApplicationContext;
import org.springframework.data.domain.Page;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.stereotype.Component;

import java.lang.reflect.Parameter;
import java.util.*;

@Aspect
@Component
@Slf4j
@RequiredArgsConstructor
public class LoggingAspect {

    private static final String POINT_CUT = """
            (within(fct.project.scmu.controllers..*) && execution(public * * (..))) ||
            (within(fct.project.scmu.services..*) && execution(public * * (..)))
            """;

    private final ApplicationContext applicationContext;

    // If the class is not part of the project, it should not be logged, unless it is defined here
    private static final List<Class<?>> additional = Arrays.asList(
            String.class, Long.class, Integer.class, Optional.class, ResponseEntity.class, Page.class, Collection.class);


    @Autowired
    @Qualifier("getGsonAspect")
    private Gson gson;

    /**
     * Specifies the packages and methods where the logging aspect should be applied.
     * Targets public methods in the controllers and services packages.
     */
    @Pointcut(POINT_CUT)
    void logs() {
    }

    /**
     * Logs the method parameters and return value.
     * MDC is used to store the method name and the user who called the method.
     *
     * @param joinPoint the join point
     * @return the return value of the method
     * @throws Throwable if an error occurs
     */
    @Around("logs()")
    public Object around(ProceedingJoinPoint joinPoint) throws Throwable {
        var signature = (MethodSignature) joinPoint.getSignature();
        MDC.put("method", getClassName(joinPoint.getTarget()) + "." + signature.getMethod().getName());

        var auth = SecurityContextHolder.getContext().getAuthentication();
        if (auth != null && !auth.getPrincipal().equals("anonymousUser")) {
            MDC.put("user", ((UserDetails) auth.getPrincipal()).getUsername());
        }
        else
            MDC.put("user", "anonymous");

        logParams(joinPoint, signature);
        Object result = joinPoint.proceed();
        logReturn(result);
        MDC.clear();
        return result;
    }

    private String getClassName(Object object) {
        if (AopUtils.isAopProxy(object) && object instanceof Advised advised) {
            try {
                return advised.getTargetSource().getTarget().getClass().getSimpleName();
            } catch (Exception ignored) {
            }
        }
        return object.getClass().getSimpleName();

    }

    private void logReturn(Object result) {
        if (result != null && (isProject(result.getClass()) || additional.contains(result.getClass()))) {
            Object body = result;
            if (result instanceof Optional<?> opt) {
                body = opt.orElse(null);
            } else if (result instanceof ResponseEntity<?> re) {
                if (re.hasBody())
                    body = re.getBody();
                else
                    body = null;
            } else if (result instanceof Collection<?> collect) {
                log.info("Result: {} entities returned.", collect.size());
                return;
            } else if (result instanceof Page<?> page) {
                log.info("Result: {} entities returned.", page.getNumberOfElements());
                return;
            }
            if (body != null) {
                log.info("Result: {}.", gson.toJson(body));
            }
        }
    }

    private void logParams(ProceedingJoinPoint joinPoint, MethodSignature signature) {
        final var data = new HashMap<>();

        final var args = joinPoint.getArgs();
        final var params = signature.getMethod().getParameters();

        for (int i = 0; i < args.length; i++) {
            final Parameter param = params[i];
            final Object arg = args[i];

            if (arg == null || isProject(arg.getClass()) || additional.contains(arg.getClass())) {
                data.put(param.getName(), arg == null ? null : gson.toJson(arg));
            }
        }
        if (!data.isEmpty()) {
            log.info("Params: {}", data);
        }
    }

    // Check if the class is part of the project, if it is then it is safe to log it
    private boolean isProject(Class<?> target) {
        return target.getCanonicalName().startsWith(AutoConfigurationPackages.get(applicationContext).get(0));
    }

}
