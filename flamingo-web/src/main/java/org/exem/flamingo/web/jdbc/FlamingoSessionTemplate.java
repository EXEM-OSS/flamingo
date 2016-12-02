package org.exem.flamingo.web.jdbc;

import org.apache.ibatis.session.SqlSessionFactory;
import org.mybatis.spring.SqlSessionTemplate;
import org.springframework.stereotype.Component;

/**
 * Created by sanghyunbak on 2016. 12. 1..
 */
@Component
public class FlamingoSessionTemplate extends SqlSessionTemplate{
  public FlamingoSessionTemplate(SqlSessionFactory sqlSessionFactory) {
    super(sqlSessionFactory);
  }
}
