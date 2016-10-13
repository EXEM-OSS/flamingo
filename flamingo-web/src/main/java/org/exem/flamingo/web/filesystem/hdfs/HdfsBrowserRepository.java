package org.exem.flamingo.web.filesystem.hdfs;

import java.util.Map;

/**
 * Created by Park on 2016. 8. 4..
 */
public interface HdfsBrowserRepository {

    public static final String NAMESPACE = HdfsBrowserRepository.class.getName();

    public Map select(Map params);

    public int selectCount(Map params);

    public void insert(Map params);

    public void update(Map params);

    public void delete(Map params);
}
