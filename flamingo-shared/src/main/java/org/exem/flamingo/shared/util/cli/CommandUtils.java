package org.exem.flamingo.shared.util.cli;

import org.apache.commons.exec.*;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

import java.io.File;
import java.io.IOException;
import java.util.Map;

public class CommandUtils {

    /**
     * SLF4J Logging
     */
    private static Logger logger = LoggerFactory.getLogger(CommandUtils.class);

    public static int execute(String[] cmds, String working, Map envs) throws IOException {
        CommandLine command = new CommandLine(cmds[0]);
        for (int i = 1; i < cmds.length; i++) {
            command.addArgument(cmds[i]);
        }
        CommandOutput adapter = executeCommand(command, working, envs, new CommandOutput(logger));
        return adapter.getExitCode();
    }

    public static CommandOutput execute(String[] cmds, String working, Map envs, CommandOutput adapter) throws IOException {
        CommandLine command = new CommandLine(cmds[0]);
        for (int i = 1; i < cmds.length; i++) {
            command.addArgument(cmds[i]);
        }
        return executeCommand(command, working, envs, adapter);
    }

    public static CommandOutput execute(String command, String working, Map envs, CommandOutput adapter) throws IOException {
        logger.info("Executing >> Command = {} / Working = {}", command, working);
        String[] cmds = org.apache.commons.lang.StringUtils.splitPreserveAllTokens(command, " ");
        return execute(cmds, working, envs, adapter);
    }

    public static int execute(String command, String working, Map envs) throws IOException {
        logger.info("Executing >> Command = {} / Working = {}", command, working);
        String[] cmds = org.apache.commons.lang.StringUtils.splitPreserveAllTokens(command, " ");
        return execute(cmds, working, envs);
    }

    public static int executeCommand(CommandLine command, String working, Map envs, Logger logger) throws IOException {
        logger.info("Executing >> Command = {} / Working = {}", command.toString(), working);
        DefaultExecutor executor = new DefaultExecutor();
        executor.setWorkingDirectory(new File(working));
        try {
            executor.setExitValue(0);
            CommandOutput adapter = new CommandOutput(logger);
            PumpStreamHandler psh = new PumpStreamHandler(new ExecLogHandler(adapter), new ExecLogHandler(adapter));
            executor.setStreamHandler(psh);
            return executor.execute(command, envs);
        } catch (ExecuteException ex) {
            // SystemAlert.get().send("COMMON", "COMMAND", "EXECUTE", "FAILED", "커맨드 라인 '" + command.toString() + "'을 실행할 수 없습니다. 종료코드는 " + ex.getExitValue() + " 입니다.", ex);
            return ex.getExitValue();
        }
    }

    public static CommandOutput executeCommand(CommandLine command, String working, Map envs, CommandOutput adapter) throws IOException {
        logger.info("Executing >> Command = {} / Working = {}", command.toString(), working);
        PumpStreamHandler psh = null;
        DefaultExecutor executor = new DefaultExecutor();
        try {
            executor.setWorkingDirectory(new File(working));
            executor.setExitValue(0);
            psh = new PumpStreamHandler(new ExecLogHandler(adapter), new ExecLogHandler(adapter));
            executor.setStreamHandler(psh);
            adapter.setExitCode(executor.execute(command, envs));
        } catch (ExecuteException ex) {
            // SystemAlert.get().send("COMMON", "COMMAND", "EXECUTE", "FAILED", "커맨드 라인 '" + command.toString() + "'을 실행할 수 없습니다. 종료코드는 " + ex.getExitValue() + " 입니다.", ex);
            adapter.setExitCode(ex.getExitValue());
        }
        return adapter;
    }

    static class ExecLogHandler extends LogOutputStream {

        private CommandOutput adapter;

        public ExecLogHandler(CommandOutput adapter) {
            this.adapter = adapter;
        }

        @Override
        protected void processLine(String line, int level) {
            if (adapter != null) {
                adapter.getBuilder().append(line);
            }
            if (adapter.getLogger() != null) {
                adapter.getLogger().info("LOG >> {}", line);
            }
        }
    }
}
