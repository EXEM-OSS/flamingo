package org.exem.flamingo.shared.util.cli;

import org.apache.commons.io.IOUtils;
import org.exem.flamingo.shared.core.exception.ServiceException;
import org.slf4j.Logger;
import org.springframework.util.StringUtils;

import java.io.*;

public class FileWriter {

    /**
     * 로그 파일명
     */
    private String filename;

    /**
     * 최대 파일의 크기
     */
    private long maxSize = Long.MAX_VALUE;

    /**
     * SLF4J Logging
     */
    private Logger logger;

    /**
     * Log File Writer
     */
    private OutputStreamWriter outputStreamWriter;

    /**
     * Buffered Writer
     */
    private BufferedWriter bufferedWriter;

    /**
     * File Output Stream
     */
    private FileOutputStream fileOutputStream;

    /**
     * 현재 로그 파일의 크기
     */
    private long currentLength = 0;

    /**
     * 동기화를 위한 Mutex
     */
    private Object mutex = new Object();

    /**
     * @param filename 로그 파일명
     */
    public FileWriter(Logger logger, String filename) {
        this.logger = logger;
        try {
            this.fileOutputStream = new FileOutputStream(filename);
            this.outputStreamWriter = new OutputStreamWriter(this.fileOutputStream, "UTF-8");
            this.bufferedWriter = new BufferedWriter(outputStreamWriter);
            this.filename = filename;
        } catch (Exception ex) {
            throw new ServiceException("초기화할 수 없습니다.", ex);
        }
    }

    /**
     * @param filename 로그 파일명
     */
    public FileWriter(Logger logger, String filename, long maxSize) {
        this.logger = logger;
        try {
            this.fileOutputStream = new FileOutputStream(filename);
            this.outputStreamWriter = new OutputStreamWriter(this.fileOutputStream, "UTF-8");
            this.bufferedWriter = new BufferedWriter(outputStreamWriter);
            this.maxSize = maxSize;
            this.filename = filename;
        } catch (Exception ex) {
            throw new ServiceException("초기화할 수 없습니다.", ex);
        }
    }

    public void log(String message) {
        try {
            if (currentLength > maxSize) {
                if (logger != null) logger.info("저자할 수 있는 파일의 크기를 초과했습니다.");
                synchronized (mutex) {
                    close();
                    new File(filename).delete();

                    this.fileOutputStream = new FileOutputStream(filename);
                    this.outputStreamWriter = new OutputStreamWriter(this.fileOutputStream, "UTF-8");
                    this.bufferedWriter = new BufferedWriter(outputStreamWriter);

                    this.currentLength = 0;
                }
            }
            int length = message.getBytes().length;
            bufferedWriter.write(message + "\n");
            bufferedWriter.flush();
            currentLength += length;
        } catch (IOException e) {
            logger.warn("파일을 기록할 수 없습니다.", e);
        }
    }

    public void close() {
        try {
            bufferedWriter.flush();
        } catch (Exception ex) {
            if (logger != null) logger.warn("버퍼를 Flush할 수 없습니다.", ex);
        }

        IOUtils.closeQuietly(fileOutputStream);
        IOUtils.closeQuietly(outputStreamWriter);
        IOUtils.closeQuietly(bufferedWriter);
    }

    public String getPath() {
        return filename;
    }

    public static String getBaseDir(String filename) {
        String fn = StringUtils.getFilename(filename);
        String dir = StringUtils.replace(filename, fn, "");
        return new File(dir).getAbsolutePath();
    }

    public String getBaseDir() {
        return getBaseDir(this.filename);
    }
}