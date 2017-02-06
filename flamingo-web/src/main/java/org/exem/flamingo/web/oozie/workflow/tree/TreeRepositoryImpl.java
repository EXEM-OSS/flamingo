/**
 * Copyright (C) 2011 Flamingo Project (http://www.cloudine.io).
 * <p/>
 * This program is free software: you can redistribute it and/or modify
 * it under the terms of the GNU General Public License as published by
 * the Free Software Foundation, either version 3 of the License, or
 * (at your option) any later version.
 * <p/>
 * This program is distributed in the hope that it will be useful,
 * but WITHOUT ANY WARRANTY; without even the implied warranty of
 * MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
 * GNU General Public License for more details.
 * <p/>
 * You should have received a copy of the GNU General Public License
 * along with this program.  If not, see <http://www.gnu.org/licenses/>.
 */
package org.exem.flamingo.web.oozie.workflow.tree;

import org.exem.flamingo.shared.core.repository.PersistentRepositoryImpl;
import org.exem.flamingo.web.model.rest.Tree;
import org.exem.flamingo.web.model.rest.TreeType;
import org.mybatis.spring.SqlSessionTemplate;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Map;

/**
 * Hibernate Tree Repository.
 *
 * @author Byoung Gon, Kim
 * @since 0.1
 */
@Repository
public class TreeRepositoryImpl extends PersistentRepositoryImpl<Tree, Long> implements TreeRepository {

    /**
     * SLF4J Logging
     */
    private Logger logger = LoggerFactory.getLogger(TreeRepositoryImpl.class);

    @Autowired
    public TreeRepositoryImpl(SqlSessionTemplate sqlSessionTemplate) {
        super.setSqlSessionTemplate(sqlSessionTemplate);
    }

    @Override
    public String getNamespace() {
        return NAMESPACE;
    }

    @Override
    public List<Tree> getChilds(long parentId) {
        return this.getSqlSessionTemplate().selectList(this.getNamespace() + ".selectChilds", parentId);
    }

    @Override
    public boolean existRoot(TreeType treeType, String username) {
        return getRoot(treeType, username) != null;
    }

    @Override
    public Tree getRoot(TreeType treeType, String username) {
        Tree tree = new Tree();
        tree.setUsername(username);
        tree.setTreeType(treeType);

        return this.getSqlSessionTemplate().selectOne(this.getNamespace() + ".selectRoot", tree);
    }

    @Override
    public List<Tree> selectWorkflowChilds(long parentId) {
        return this.getSqlSessionTemplate().selectList(this.getNamespace() + ".selectWorkflowChilds", parentId);
    }

    @Override
    public int insertByMap(Map<String, Object> map) {
        return this.getSqlSessionTemplate().insert(this.getNamespace() + ".insertByMap", map);
    }

    @Override
    public Tree getParent(Tree child) {
        if (child.getParent() != null) {
            return child.getParent();
        }
        return this.select(child.getId()).getParent();
    }
}
