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
package org.exem.flamingo.web.oozie.workflow.tree;

import org.exem.flamingo.shared.core.rest.Response;
import org.exem.flamingo.web.model.rest.Tree;
import org.springframework.beans.factory.InitializingBean;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.*;

import java.util.HashMap;
import java.util.List;
import java.util.Map;

/**
 * Created by sanghyunbak on 2016. 12. 6..
 */
@Controller
@RequestMapping("/tree")
public class TreeController implements InitializingBean {

  /**
   * ROOT 노드의 ID
   */
  private final static String ROOT = "/";

  /**
   * 최초 애플리케이션이 초기화할 때 JOB, WORKFLOW 등과 같은 TREE를 추가한다.
   *
   * @throws Exception Tree를 초기화할 수 없는 경우
   */
  @Override
  public void afterPropertiesSet() throws Exception {
  }

  /**
   * 지정한 트리 유형의 특정 노드에 속한 자식 노드 목록을 반환한다.
   *
   * @param type 노드 유형
   * @param node 자식 노드를 탐색할 노드
   * @return HTTP REST Response
   */
  @RequestMapping(value = "get", method = RequestMethod.GET)
  @ResponseStatus(HttpStatus.OK)
  @ResponseBody
  //public Response get(@RequestParam String clusterName, @RequestParam String type, @RequestParam String node) {
    public Response get(@RequestParam String type, @RequestParam String node) {

    Response response = new Response();
    Tree parent;
//    if (ROOT.equals(node)) {
//      // ROOT 노드라면 Tree Type의 ROOT 노드를 부모 노드로 설정한다.
//      parent = treeService.getRoot(TreeType.valueOf(type.trim()), SessionUtils.getUsername());
//    } else {
//      // ROOT 노드가 아니라면 PK인 Tree Id를 부모 노드로 설정한다.
//      parent = treeService.get(Long.parseLong(node));
//    }
//
//    // 부모 노드의 자식 노드를 조회한다.
//    List<Tree> childs = treeService.getChilds(parent.getId());
//    for (Tree tree : childs) {
//      Map<String, Object> map = new HashMap<>();
//      map.put("id", tree.getId());
//      map.put("cls", NodeType.FOLDER.equals(tree.getNodeType()) ? "folder" : "file");
//      map.put("text", tree.getName());
//      map.put("leaf", !NodeType.FOLDER.equals(tree.getNodeType()));
//      response.getList().add(map);
//    }

    Map<String, Object> map = new HashMap<>();
    map.put("id", 1);
    map.put("cls", "file");
    map.put("text", "testName");
    //map.put("leaf", !NodeType.FOLDER.equals(tree.getNodeType()));

    response.setSuccess(true);
    return response;
  }

  /**
   * 노드를 이동한다.
   * <ul>
   * <li>from - 이동할 노드(노드)</li>
   * <li>to - 최종 목적지 노드(폴더)</li>
   * </ul>
   *
   * @param map from, to를 포함하는 노드
   * @return Response REST JAXB Object
   */
//  @RequestMapping(value = "move", method = RequestMethod.POST)
//  @ResponseStatus(HttpStatus.OK)
//  @ResponseBody
//  public Response move(@RequestBody Map<String, String> map) {
//    EngineService engineService = this.getEngineService(map.get("clusterName"));
//    TreeService treeService = engineService.getTreeRemoteService();
//
//    Response response = new Response();
//    treeService.move(map.get("from"), map.get("to"), TreeType.valueOf(map.get("type")));
//    response.setSuccess(true);
//    return response;
//  }
}
