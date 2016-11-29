package org.exem.flamingo.web.util;

import org.apache.hadoop.conf.Configuration;
import org.apache.hadoop.fs.FileSystem;
import org.apache.hadoop.fs.Path;
import org.apache.hadoop.io.IOUtils;

import java.io.*;
import java.net.URI;

/**
 * Created by sanghyunbak on 2016. 11. 28..
 */
public class HdfsUtils {
  public static void localFileToHdfs(String localFilePath, String hdfsFilePath) throws IOException {
    Configuration conf = new Configuration();
    FileSystem fs = FileSystem.get(URI.create(hdfsFilePath), conf);
    fs.copyFromLocalFile(new Path(localFilePath), new Path(hdfsFilePath));
  }
}
