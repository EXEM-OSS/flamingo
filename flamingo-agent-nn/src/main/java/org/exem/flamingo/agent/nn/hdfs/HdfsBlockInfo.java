package org.exem.flamingo.agent.nn.hdfs;

import java.util.List;

/**
 * HDFS Block의 메타 정보
 */
public class HdfsBlockInfo {
    private long blockSize;

    private int liveReplicas;

    private List<String> replicationNodeList;

    private long blockId;

    private String blockName;

    private String blockPoolId;

    private long generationStamp;

    public long getBlockSize() {
        return blockSize;
    }

    public void setBlockSize(long blockSize) {
        this.blockSize = blockSize;
    }

    public int getLiveReplicas() {
        return liveReplicas;
    }

    public void setLiveReplicas(int liveReplicas) {
        this.liveReplicas = liveReplicas;
    }

    public List<String> getReplicationNodeList() {
        return replicationNodeList;
    }

    public void setReplicationNodeList(List<String> replicationNodeList) {
        this.replicationNodeList = replicationNodeList;
    }

    public long getBlockId() {
        return blockId;
    }

    public void setBlockId(long blockId) {
        this.blockId = blockId;
    }

    public String getBlockName() {
        return blockName;
    }

    public void setBlockName(String blockName) {
        this.blockName = blockName;
    }

    public String getBlockPoolId() {
        return blockPoolId;
    }

    public void setBlockPoolId(String blockPoolId) {
        this.blockPoolId = blockPoolId;
    }

    public long getGenerationStamp() {
        return generationStamp;
    }

    public void setGenerationStamp(long generationStamp) {
        this.generationStamp = generationStamp;
    }

    @Override
    public String toString() {
        return "HdfsBlockInfo{" +
                "blockSize=" + blockSize +
                ", liveReplicas=" + liveReplicas +
                ", replicationNodeList=" + replicationNodeList +
                ", blockId=" + blockId +
                ", blockName=" + blockName +
                ", blockPoolId=" + blockPoolId +
                ", generationStamp=" + generationStamp +
                '}';
    }
}
