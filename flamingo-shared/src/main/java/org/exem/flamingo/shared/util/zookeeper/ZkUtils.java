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
package org.exem.flamingo.shared.util.zookeeper;

import org.apache.curator.RetryPolicy;
import org.apache.curator.RetrySleeper;
import org.apache.curator.framework.CuratorFramework;
import org.apache.curator.framework.CuratorFrameworkFactory;
import org.apache.curator.framework.api.BackgroundCallback;
import org.apache.curator.framework.api.CuratorEvent;
import org.apache.curator.framework.api.CuratorListener;
import org.apache.zookeeper.CreateMode;
import org.apache.zookeeper.Watcher;

import java.util.List;

/**
 * ZooKeeper의 각종 Operation을 편리하게 제공하기 위한 유틸리티.
 * 이 클래스는 ZooKeeper를 편리하게 사용하기 위해서 Apache Curator를 이용한다.
 *
 * @author Edward KIM
 * @version 0.1
 */
public class ZkUtils {

    /**
     * Apache Curator Framework를 생성한다.
     *
     * @param zookeeperConnectionString ZooKeeper 연결을 위한 Connection String (<tt>zk1.cdh.local:2181</tt>)
     * @return Curator Framework
     */
    public static CuratorFramework createClient(String zookeeperConnectionString) {
        RetryPolicy retryPolicy = new RetryPolicy() {
            @Override
            public boolean allowRetry(int i, long l, RetrySleeper retrySleeper) {
                return false;
            }
        };

        return CuratorFrameworkFactory.newClient(zookeeperConnectionString, retryPolicy);
    }

    /**
     * Apache Curator Framework를 생성한다.
     *
     * @param zookeeperConnectionString ZooKeeper 연결을 위한 Connection String (<tt>zk1.cdh.local:2181</tt>)
     * @param retryPolicy               Retry Policy
     * @return Curator Framework
     */
    public static CuratorFramework createClient(String zookeeperConnectionString, RetryPolicy retryPolicy) {
        return CuratorFrameworkFactory.newClient(zookeeperConnectionString, retryPolicy);
    }

    /**
     * 노드를 생성한다.
     *
     * @param client  Curator Framework
     * @param path    생성할 노드의 경로
     * @param payload 노드의 내용
     * @throws Exception 노드를 생성할 수 없는 경우
     */
    public static void create(CuratorFramework client, String path, byte[] payload) throws Exception {
        client.create().forPath(path, payload);
    }

    /**
     * EPHEMERAL 노드를 생성한다.
     *
     * @param client  Curator Framework
     * @param path    생성할 노드의 경로
     * @param payload 노드의 내용
     * @throws Exception 노드를 생성할 수 없는 경우
     */
    public static void createEphemeral(CuratorFramework client, String path, byte[] payload) throws Exception {
        client.create().withMode(CreateMode.EPHEMERAL).forPath(path, payload);
    }

    /**
     * EPHEMERAL_SEQUENTIAL 노드를 생성한다.
     *
     * @param client  Curator Framework
     * @param path    생성할 노드의 경로
     * @param payload 노드의 내용
     * @throws Exception 노드를 생성할 수 없는 경우
     */
    public static void createEphemeralSequential(CuratorFramework client, String path, byte[] payload) throws Exception {
        // this will create the given EPHEMERAL-SEQUENTIAL ZNode with the given data using Curator protection.

        /*
            Protection Mode:

            It turns out there is an edge case that exists when creating sequential-ephemeral nodes. The creation
            can succeed on the server, but the server can crash before the created node name is returned to the
            client. However, the ZK session is still valid so the ephemeral node is not deleted. Thus, there is no
            way for the client to determine what node was created for them.

            Even without sequential-ephemeral, however, the create can succeed on the sever but the client (for various
            reasons) will not know it. Putting the create builder into protection mode works around this. The name of
            the node that is created is prefixed with a GUID. If node creation fails the normal retry mechanism will
            occur. On the retry, the parent path is first searched for a node that has the GUID in it. If that node is
            found, it is assumed to be the lost node that was successfully created on the first try and is returned to
            the caller.
         */
        client.create().withProtection().withMode(CreateMode.EPHEMERAL_SEQUENTIAL).forPath(path, payload);
    }

    /**
     * 지정한 노드가 존재하는지 확인한다.
     *
     * @param client Curator Framework
     * @param path   존재 유무를 확인할 경로
     * @param watch  Watch Listener가 등록되어 있는지 여부
     * @return 존재하는 경우 <tt>true</tt>
     * @throws Exception 노드의 상태를 확인할 수 없는 경우
     */
    public static boolean exists(CuratorFramework client, String path, boolean watch) throws Exception {
        return watch ? (client.checkExists().watched().forPath(path) != null) : (client.checkExists().forPath(path) != null);
    }

    /**
     * 사용자가 지정한 생성 모드와 경로로 노드를 생성한다.
     *
     * @param client Curator Framework
     * @param path   노드를 생성할 경로
     * @param data   노드의 값(내용)
     * @param mode   생성 모드
     * @return 노드의 경로
     * @throws Exception 노드를 생성할 수 없는 경우
     */
    public String create(CuratorFramework client, String path, byte[] data, CreateMode mode) throws Exception {
        return client.create().withMode(mode).forPath(path, data);
    }

    /**
     * 지정한 경로의 노드에 값을 설정한다.
     *
     * @param client  Curator Framework
     * @param path    생성할 노드의 경로
     * @param payload 노드의 내용
     * @throws Exception 노드의 값을 설정할 수 없는 경우
     */
    public static void setData(CuratorFramework client, String path, byte[] payload) throws Exception {
        client.setData().forPath(path, payload);
    }

    /**
     * 비동기로 지정한 경로의 노드에 값을 설정한다.
     *
     * @param client  Curator Framework
     * @param path    생성할 노드의 경로
     * @param payload 노드의 내용
     * @throws Exception 노드의 값을 설정할 수 없는 경우
     */
    public static void setDataAsync(CuratorFramework client, String path, byte[] payload) throws Exception {
        CuratorListener listener = new CuratorListener() {
            @Override
            public void eventReceived(CuratorFramework client, CuratorEvent event) throws Exception {
                // examine event for details
            }
        };
        client.getCuratorListenable().addListener(listener);

        // set data for the given node asynchronously. The completion notification
        // is done via the CuratorListener.
        client.setData().inBackground().forPath(path, payload);
    }

    /**
     * 비동기로 지정한 경로의 노드에 값을 설정한다.
     *
     * @param client  Curator Framework
     * @param path    생성할 노드의 경로
     * @param payload 노드의 내용
     * @throws Exception 노드의 값을 설정할 수 없는 경우
     */

    /**
     * 비동기로 지정한 경로의 노드에 값을 설정한다. 이 메소드는 삭제후 지정한 콜백으로 알람을 제공한다.
     *
     * @param client   Curator Framework
     * @param callback 콜백
     * @param path     생성할 노드의 경로
     * @param payload  노드의 내용
     * @throws Exception 노드의 값을 설정할 수 없는 경우
     */
    public static void setDataAsyncWithCallback(CuratorFramework client, BackgroundCallback callback, String path, byte[] payload) throws Exception {
        client.setData().inBackground(callback).forPath(path, payload);
    }

    /**
     * 지정한 경로를 삭제한다.
     *
     * @param client Curator Framework
     * @param path   삭제할 경로
     * @throws Exception 삭제할 수 없는 경우
     */
    public static void delete(CuratorFramework client, String path) throws Exception {
        client.delete().forPath(path);
    }

    /**
     * 지정한 경로를 삭제한다. 이 메소드는 해당 노드의 삭제를 보장한다.
     *
     * @param client Curator Framework
     * @param path   삭제할 경로
     * @throws Exception 삭제할 수 없는 경우
     */
    public static void guaranteedDelete(CuratorFramework client, String path) throws Exception {
        // delete the given node and guarantee that it completes

        /*
            Guaranteed Delete

            Solves this edge case: deleting a node can fail due to connection issues. Further, if the node was
            ephemeral, the node will not get auto-deleted as the session is still valid. This can wreak havoc
            with lock implementations.


            When guaranteed is set, Curator will record failed node deletions and attempt to delete them in the
            background until successful. NOTE: you will still get an exception when the deletion fails. But, you
            can be assured that as long as the CuratorFramework instance is open attempts will be made to delete
            the node.
         */

        client.delete().guaranteed().forPath(path);
    }

    /**
     * Watch Listener가 등록되어 있는 자식 노드를 가져온다.
     *
     * @param client  Curator Framework
     * @param path    자식노드 목록을 가져올 경로
     * @param watcher Watcher
     * @return 자식노드 목록
     * @throws Exception 예외
     */
    public static List<String> watchedGetChildren(CuratorFramework client, String path, Watcher watcher) throws Exception {
        return client.getChildren().usingWatcher(watcher).forPath(path);
    }

    /**
     * 자식 노드를 가져온다.
     *
     * @param client Curator Framework
     * @param path   자식노드 목록을 가져올 경로
     * @return 자식노드 목록
     * @throws Exception 예외
     */
    public static List<String> getChildren(CuratorFramework client, String path) throws Exception {
        return client.getChildren().forPath(path);
    }

    public static byte[] getData(CuratorFramework client, String path) throws Exception {
        return client.getData().forPath(path);
    }
}