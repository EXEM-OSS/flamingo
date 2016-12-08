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

import org.exem.flamingo.shared.core.exception.ServiceException;
import org.exem.flamingo.shared.core.security.SessionUtils;
import org.exem.flamingo.web.model.rest.NodeType;
import org.exem.flamingo.web.model.rest.Tree;
import org.exem.flamingo.web.model.rest.TreeType;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Component;

import java.util.HashMap;
import java.util.List;
import java.util.Map;

/**
 * Tree Service.
 *
 * @author Byoung Gon, Kim
 * @since 0.1
 */
@Component
public class TreeServiceImpl implements TreeService {

    /**
     * Tree Repository
     */
    @Autowired
    private TreeRepository treeRepository;

    @Override
    public int rename(Tree tree) {
        return treeRepository.update(tree);
    }

    @Override
    public boolean delete(long id) {
        if (treeRepository.getChilds(id) != null && treeRepository.getChilds(id).size() > 0) {
            throw new ServiceException("Failed to delete a tree node.");
        }
        return treeRepository.delete(id) > 0;
    }

    @Override
    public Tree create(Tree parent, Tree child, NodeType nodeType) {
        Map<String, Object> map = new HashMap<>();
        map.put("id", null);
        map.put("name", child.getName());
        map.put("treeType", child.getTreeType());
        map.put("nodeType", child.getNodeType());
        map.put("root", false);
        map.put("username", child.getUsername());
        map.put("parentId", parent.getId());
        treeRepository.insertByMap(map);
        child.setId((Long) map.get("id"));
        return child;
    }

    @Override
    public Tree createRoot(TreeType treeType, String username) {
        if (!treeRepository.existRoot(treeType, username)) {
            Tree tree = new Tree("/");
            tree.setTreeType(treeType);
            tree.setNodeType(NodeType.FOLDER);
            tree.setRoot(true);
            tree.setUsername(username);
            treeRepository.insert(tree);
            return tree;
        }
        return treeRepository.getRoot(treeType, username);
    }

    @Override
    public boolean checkSameNode(Tree parent, Tree child, TreeType treeType, NodeType nodeType) {
        if (nodeType == NodeType.FOLDER) {
            return this.existSubFolder(new Tree(parent.getId()), child.getName(), treeType);
        } else {
            return this.existSubItem(new Tree(parent.getId()), child.getName(), treeType);
        }
    }

    @Override
    public boolean existSubItem(Tree selectedNode, String name, TreeType treeType) {
        return true; // FIXME
    }

    @Override
    public boolean existSubFolder(Tree selectedNode, String name, TreeType treeType) {
        return true; // FIXME
    }

    @Override
    public Tree getRoot(TreeType treeType, String username) {
        return treeRepository.getRoot(treeType, username);
    }

    @Override
    public List<Tree> getChilds(long parentId) {
        return treeRepository.getChilds(parentId);
    }

    @Override
    public Tree get(long id) {
        return treeRepository.select(id);
    }

    @Override
    public void move(String from, String to, TreeType type) {
        Tree source = treeRepository.select(Long.parseLong(from));
        Tree target;
        if ("/".equals(to)) {
            target = treeRepository.getRoot(type, SessionUtils.getUsername());
        } else {
            target = treeRepository.select(Long.parseLong(to));
        }
        source.setParent(target);
        treeRepository.update(source);
    }

    @Override
    public List<Tree> getWorkflowChilds(long parentId) {
        return treeRepository.selectWorkflowChilds(parentId);
    }

    public void setTreeRepository(TreeRepository treeRepository) {
        this.treeRepository = treeRepository;
    }
}
