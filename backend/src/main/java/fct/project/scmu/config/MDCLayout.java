package fct.project.scmu.config;

import ch.qos.logback.classic.PatternLayout;

public class MDCLayout extends PatternLayout {

    static {
        DEFAULT_CONVERTER_MAP.put("customMdc", MDCConverter.class.getName());
    }

}
