package org.exem.flamingo.web.filesystem.hdfs;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.Map;

/**
 * Created by Park on 2016. 8. 4..
 */
@Service
public class HdfsBrowserServiceImpl implements HdfsBrowserService {

    @Autowired
    HdfsBrowserRepository repository;

    @Override
    public void save(Map params) {
        int cnt = repository.selectCount(params);

        if (params.get("max_value") == null) {
            repository.delete(params);
        }
        else {
            if (cnt == 0) {
                repository.insert(params);
            }
            else {
                repository.update(params);
            }
        }


    }
}
