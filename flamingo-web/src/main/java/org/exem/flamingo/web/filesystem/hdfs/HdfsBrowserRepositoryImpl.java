package org.exem.flamingo.web.filesystem.hdfs;

import org.exem.flamingo.shared.core.repository.PersistentRepositoryImpl;
import org.mybatis.spring.SqlSessionTemplate;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Repository;

import java.util.Map;

/**
 * Created by Park on 2016. 8. 4..
 */
@Repository
public class HdfsBrowserRepositoryImpl extends PersistentRepositoryImpl implements HdfsBrowserRepository {

    @Override
    public String getNamespace() {
        return this.NAMESPACE;
    }

    @Autowired
    public HdfsBrowserRepositoryImpl(SqlSessionTemplate sqlSessionTemplate) {
        super.setSqlSessionTemplate(sqlSessionTemplate);
    }

    @Override
    public Map select(Map params) {
        return this.getSqlSessionTemplate().selectOne(this.getNamespace() + ".select", params);
    }

    @Override
    public int selectCount(Map params) {
        Map resultMap = this.getSqlSessionTemplate().selectOne(this.getNamespace() + ".selectCount", params);
        return Integer.parseInt(resultMap.get("cnt").toString());
    }

    @Override
    public void insert(Map params) {
        this.getSqlSessionTemplate().insert(this.getNamespace() + ".insert", params);
    }

    @Override
    public void update(Map params) {
        this.getSqlSessionTemplate().update(this.getNamespace() + ".update", params);
    }

    @Override
    public void delete(Map params) {
        this.getSqlSessionTemplate().delete(this.getNamespace() + ".delete", params);
    }
}
