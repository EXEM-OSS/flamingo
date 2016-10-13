package org.exem.flamingo.shared.util;

import org.apache.commons.logging.Log;
import org.apache.commons.logging.LogFactory;

import java.io.*;
import java.text.SimpleDateFormat;
import java.util.Date;

/**
 * Simple library class for working with JNI (Java Native Interface)
 */
public class NativeUtils {

    private static final Log LOG = LogFactory.getLog(NativeUtils.class);

    private static SimpleDateFormat simpleDateFormat = new SimpleDateFormat("yyyyMMddHHmmss");

    /**
     * Private constructor - this class will never be instanced
     */
    private NativeUtils() {
    }

    /**
     * Loads library from current JAR archive
     * <p/>
     * The file from JAR is copied into system temporary directory and then loaded. The temporary file is deleted after exiting.
     * Method uses String as filename because the pathname is "abstract", not system-dependent.
     *
     * @param path The path inside JAR as absolute path (beginning with '/'), e.g. /package/File.ext
     * @throws IOException      If temporary file creation or read/write operation fails
     * @throws IllegalArgumentException If source file (param path) does not exist
     */
    public static void loadLibraryFromJar(String path) throws IOException {
        if (!path.startsWith("/")) {
            throw new IllegalArgumentException("The path to be absolute (start with '/').");
        }

        // Obtain filename from path
        String[] parts = path.split("/");
        String filename = (parts.length > 1) ? parts[parts.length - 1] : null;

        // Split filename to prexif and suffix (extension)
        String prefix = "";
        String suffix = null;
        if (filename != null) {
            parts = filename.split("\\.", 2);
            prefix = parts[0];
            suffix = (parts.length > 1) ? "." + parts[parts.length - 1] : null; // Thanks, davs! :-)
        }

        // Check if the filename is okay
        if (filename == null || prefix.length() < 3) {
            throw new IllegalArgumentException("The filename has to be at least 3 characters long.");
        }

        // Prepare temporary file
        String temporaryPath = null;
        if (System.getProperty("flamingo.tmpdir") != null) {
            temporaryPath = System.getProperty("flamingo.tmpdir");
        } else {
            temporaryPath = System.getProperty("java.io.tmpdir");
        }

        File nativeLibraryBasePath = new File(temporaryPath + "/flamingo2");
        if (!nativeLibraryBasePath.exists()) {
            nativeLibraryBasePath.mkdirs();
        }
        File nativeLibraryPath = new File(nativeLibraryBasePath, simpleDateFormat.format(new Date()));
        nativeLibraryPath.mkdirs();
        nativeLibraryPath.deleteOnExit();

        File nativeLibraryFilePath = new File(nativeLibraryPath, filename);
        nativeLibraryFilePath.deleteOnExit();

        // Prepare buffer for data copying
        byte[] buffer = new byte[1024];
        int readBytes;

        // Open and check input stream
        InputStream is = NativeUtils.class.getResourceAsStream(path);
        if (is == null) {
            throw new FileNotFoundException("File " + path + " was not found inside JAR.");
        }

        // Open output stream and copy data between source file in JAR and the temporary file
        OutputStream os = new FileOutputStream(nativeLibraryFilePath);
        try {
            while ((readBytes = is.read(buffer)) != -1) {
                os.write(buffer, 0, readBytes);
            }
        } finally {
            // If read/write fails, close streams safely before throwing an exception
            os.close();
            is.close();
        }

        // set library path
        System.setProperty("java.library.path", nativeLibraryPath.getAbsolutePath());

        // Finally, load the library
        System.load(nativeLibraryFilePath.getAbsolutePath());

        LOG.info("Loaded sigar native library : " + nativeLibraryFilePath.getAbsolutePath());
    }
}