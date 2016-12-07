/*
 * Copyright 2012-2016 the Flamingo Community.
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *      http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */
package org.exem.flamingo.web.model.rest;

import javax.xml.bind.annotation.XmlAccessType;
import javax.xml.bind.annotation.XmlAccessorType;
import javax.xml.bind.annotation.XmlRootElement;
import javax.xml.bind.annotation.XmlType;
import java.io.Serializable;

/**
 * ExtJS Tree의 Tree JAXB Object.
 *
 * @author Edward KIM
 * @since 0.1
 */
@XmlAccessorType(XmlAccessType.FIELD)
@XmlType(name = "", propOrder = {
        "id",
        "referenceId",
        "name",
        "parent",
        "treeType",
        "nodeType",
        "root",
        "username"
})
@XmlRootElement(name = "tree")
public class Tree implements Serializable {

  private long id;

  private long referenceId;

  private String name;

  private TreeType treeType;

  private NodeType nodeType;

  private boolean root;

  private String username;

  private Tree parent;

  public Tree() {
  }

  public Tree(long id) {
    this.id = id;
  }

  public Tree(String name) {
    this.name = name;
  }

  public long getId() {
    return id;
  }

  public void setId(int id) {
    this.id = id;
  }

  public String getName() {
    return name;
  }

  public void setName(String name) {
    this.name = name;
  }

  public Tree getParent() {
    return parent;
  }

  public void setParent(Tree parent) {
    this.parent = parent;
  }

  public TreeType getTreeType() {
    return treeType;
  }

  public void setTreeType(TreeType treeType) {
    this.treeType = treeType;
  }

  public NodeType getNodeType() {
    return nodeType;
  }

  public void setNodeType(NodeType nodeType) {
    this.nodeType = nodeType;
  }

  public boolean isRoot() {
    return root;
  }

  public void setRoot(boolean root) {
    this.root = root;
  }

  public void setId(long id) {
    this.id = id;
  }

  public String getUsername() {
    return username;
  }

  public void setUsername(String username) {
    this.username = username;
  }

  public long getReferenceId() {
    return referenceId;
  }

  public void setReferenceId(long referenceId) {
    this.referenceId = referenceId;
  }

  @Override
  public boolean equals(Object o) {
    if (this == o) return true;
    if (o == null || getClass() != o.getClass()) return false;

    Tree tree = (Tree) o;

    if (id != tree.id) return false;

    return true;
  }

  @Override
  public int hashCode() {
    return (int) (id ^ (id >>> 32));
  }

  @Override
  public String toString() {
    return "Tree{" +
            "id=" + id +
            ", referenceId=" + referenceId +
            ", name='" + name + '\'' +
            ", treeType=" + treeType +
            ", nodeType=" + nodeType +
            ", root=" + root +
            ", username='" + username + '\'' +
            ", parent=" + parent +
            '}';
  }
}
