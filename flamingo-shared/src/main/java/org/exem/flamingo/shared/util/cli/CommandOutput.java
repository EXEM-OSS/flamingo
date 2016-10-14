package org.exem.flamingo.shared.util.cli;

import org.slf4j.Logger;

public class CommandOutput {

    int exitCode;

    StringBuilder builder;

    String logfile;

    Logger logger;

    public CommandOutput(Logger logger) {
        this.logger = logger;
    }

    public Logger getLogger() {
        return logger;
    }

    public StringBuilder getBuilder() {
        if (builder == null) {
            builder = new StringBuilder();
        }
        return builder;
    }

    public int getExitCode() {
        return exitCode;
    }

    public void setExitCode(int exitCode) {
        this.exitCode = exitCode;
    }
}
