package org.exem.flamingo.shared.util.cli;

import com.google.common.base.Joiner;
import com.google.common.collect.Iterators;

import java.util.ArrayList;
import java.util.Iterator;
import java.util.List;

/**
 * 지정한 길이만큼 아이템을 유지하는 순환 버퍼.
 * 지정한 크기보다 더 많은 아이템을 아이템을 버퍼에 추가하면 오래된 아이템을 덮어씌운다.
 *
 * @author Byoung Gon, Kim
 * @since 0.5
 */
public class CircularBuffer<T> implements Iterable<T> {

    /**
     * 리스트 기반 버퍼
     */
    private final List<T> buffer;

    /**
     * 버퍼에 넣을 수 있는 아이템의 최대 개수
     */
    private final int size;

    /**
     * 현재 버퍼의 위치
     */
    private int start;

    /**
     * 기본 생성자.
     *
     * @param size 버퍼에 넣을 수 있는 아이템의 최대 개수
     */
    public CircularBuffer(int size) {
        this.buffer = new ArrayList<T>();
        this.size = size;
        this.start = 0;
    }

    /**
     * 아이템을 추가한다.
     *
     * @param item 아이템
     */
    public void append(T item) {
        if (buffer.size() < size) {
            buffer.add(item);
        } else {
            buffer.set(start, item);
            start = (start + 1) % size;
        }
    }

    @Override
    public String toString() {
        return "CircularBuffer [" + Joiner.on(", ").join(buffer) + "]";
    }

    /**
     * Iterator를 반환하다.
     *
     * @return Iterator
     */
    public Iterator<T> iterator() {
        if (start == 0)
            return buffer.iterator();
        else
            return Iterators.concat(buffer.subList(start, buffer.size()).iterator(), buffer.subList(0, start).iterator());
    }

    /**
     * 버퍼에 넣을 수 있는 최대 아이템의 개수를 반환한다.
     *
     * @return 버퍼에 넣을 수 있는 최대 아이템의 개수
     */
    public int getMaxSize() {
        return this.size;
    }

    /**
     * 현재 버퍼에 들어있는 아이템의 개수를 반환한다.
     *
     * @return 현재 버퍼에 들어있는 아이템의 개수
     */
    public int getSize() {
        return this.buffer.size();
    }

}