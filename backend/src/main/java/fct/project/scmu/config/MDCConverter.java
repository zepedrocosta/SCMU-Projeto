package fct.project.scmu.config;

import ch.qos.logback.classic.pattern.ClassicConverter;
import ch.qos.logback.classic.spi.ILoggingEvent;

/**
 * Custom Logback converter to format MDC (Mapped Diagnostic Context) properties.
 */
public class MDCConverter extends ClassicConverter {

    /**
     * Converts the MDC properties of a logging event to a formatted string.
     *
     * @param event the logging event containing MDC properties
     * @return a formatted string representing the MDC properties
     */
    @Override
    public String convert(ILoggingEvent event) {
        var mdc = event.getMDCPropertyMap();
        var builder = new StringBuilder();

        mdc.entrySet().forEach(entry -> {
            builder.append("[")
                    .append(entry.getKey())
                    .append("=")
                    .append(entry.getValue())
                    .append("]")
                    .append(" ");
        });
        return builder.toString();
    }
}
