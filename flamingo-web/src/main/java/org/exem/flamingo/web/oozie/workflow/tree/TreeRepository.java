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

import org.exem.flamingo.shared.core.repository.PersistentRepository;
import org.exem.flamingo.web.model.rest.Tree;
import org.exem.flamingo.web.model.rest.TreeType;

import java.util.List;
import java.util.Map;

/**
 * Tree Repository.
 *
 * @author Byoung Gon, Kim
 * @since 0.1
 */
public interface TreeRepository extends PersistentRepository<Tree, Long> {

    public static final String NAMESPACE = TreeRepository.class.getName();

    /**
     * 지정한 부모 노드의 자식 노드들을 반환한다.
     *
     * @param parentId 부모 노드의 ID
     * @return 자식 노드
     */
    List<Tree> getChilds(long parentId);

    /**
     * 지정한 자식 노드의 Child 노드를 반환한다.
     * 현재 지정한 자식 노드에 이미 부모 노드가 있다면 그대로 반환하고 그렇지 않다면 부모 노드를 조회한다.
     *
     * @param child 자식 노드
     * @return 부모 노드
     */
    Tree getParent(Tree child);

    /**
     * 지정한 Tree의 ROOT 노드가 존재하는지 확인한다.
     *
     * @param treeType Tree의 유형
     * @param username Username
     * @return 존재하는 경우 <tt>true</tt>
     */
    boolean existRoot(TreeType treeType, String username);

    /**
     * Tree의 ROOT 노드를 반환한다.
     *
     * @param treeType Tree의 유형
     * @param username Username
     * @return ROOT 노드
     */
    Tree getRoot(TreeType treeType, String username);

    List<Tree> selectWorkflowChilds(long parentId);

    int insertByMap(Map<String, Object> map);
}
