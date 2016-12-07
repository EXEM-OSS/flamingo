package org.exem.flamingo.web.model.rest;

import java.io.Serializable;

/**
 * Created by sanghyunbak on 2016. 12. 6..
 */
public enum WorkflowStatusType implements Serializable {

  CREATED("created"), REGISTERED("registered"), DESTROYED("destroyed"), COPIED("copied");

  /**
   * 상태를 표현하는 문자열값
   */
  public final String value;

  /**
   * 기본 생성자.
   *
   * @param value 상태를 표현하는 문자열값
   */
  WorkflowStatusType(String value) {
    this.value = value;
  }
}
