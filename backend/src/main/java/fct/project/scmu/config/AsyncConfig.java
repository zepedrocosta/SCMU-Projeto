package fct.project.scmu.config;

import org.springframework.context.annotation.Configuration;
import org.springframework.scheduling.annotation.AsyncConfigurer;
import org.springframework.scheduling.annotation.EnableAsync;
import org.springframework.scheduling.concurrent.ThreadPoolTaskExecutor;
import org.springframework.security.task.DelegatingSecurityContextAsyncTaskExecutor;

import java.util.concurrent.Executor;

/**
 * Configuration class for asynchronous execution.
 * It enables Spring's asynchronous method execution capability and provides a custom Executor.
 */
@EnableAsync
@Configuration
public class AsyncConfig implements AsyncConfigurer {

    /**
     * Overrides the default executor configuration.
     * It creates a ThreadPoolTaskExecutor with a core pool size of 20 and a maximum pool size of 1000.
     * The executor is configured to wait for tasks to complete on shutdown.
     * A DelegatingSecurityContextAsyncTaskExecutor is returned to ensure that the SecurityContext is propagated to @Async methods.
     * @return a DelegatingSecurityContextAsyncTaskExecutor that delegates to the ThreadPoolTaskExecutor
     */
    @Override
    public Executor getAsyncExecutor() {
        ThreadPoolTaskExecutor executor = new ThreadPoolTaskExecutor();
        executor.setCorePoolSize(20);
        executor.setMaxPoolSize(1000);
        executor.setWaitForTasksToCompleteOnShutdown(true);
        executor.setThreadNamePrefix("Thread");
        executor.initialize();
        return new DelegatingSecurityContextAsyncTaskExecutor(executor);
    }
}