package org.exem.flamingo.shared.util.zookeeper;

import org.apache.curator.framework.CuratorFramework;
import org.apache.hadoop.hdfs.server.namenode.ha.proto.HAZKInfoProtos;
import org.apache.hadoop.yarn.proto.YarnServerResourceManagerServiceProtos;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

/**
 * Created by Hyokun Park on 2016. 2. 26..
 */
public class ZkHaUtils {
    private static Logger logger = LoggerFactory.getLogger(ZkHaUtils.class);

    public static String getActiveNnHost(String zkQuorum, String znode) {

        CuratorFramework client = ZkUtils.createClient(zkQuorum);

        client.start();

        try {
            byte[] bytes = ZkUtils.getData(client, znode);

            HAZKInfoProtos.ActiveNodeInfo proto = HAZKInfoProtos.ActiveNodeInfo.parseFrom(bytes);

            logger.info("Active namenode is " + proto.getHostname());

            return proto.getHostname();
        } catch (Exception e) {
            e.printStackTrace();
            return null;
        } finally {
            client.close();
        }
    }

    public static String getActiveRmHost(String zkQuorum, String znode) {
        CuratorFramework client = ZkUtils.createClient(zkQuorum);

        client.start();

        try {
            byte[] bytes = ZkUtils.getData(client, znode);

            YarnServerResourceManagerServiceProtos.ActiveRMInfoProto proto = YarnServerResourceManagerServiceProtos.ActiveRMInfoProto.parseFrom(bytes);

            logger.info("Active resourcemanager is " + proto.getRmId());

            return proto.getRmId();
        } catch (Exception e) {
            e.printStackTrace();
            return null;
        } finally {
            client.close();
        }
    }
}
