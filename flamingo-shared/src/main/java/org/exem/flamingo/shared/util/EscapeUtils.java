package org.exem.flamingo.shared.util;

/**
 * 문자열을 Escape, UnEscape 처리하는 유틸리티.
 * 이 유틸리티를 이용하여 서버와 클라이언트간 스크립트 송수신을 처리한다.
 *
 * @author Byoung Gon, Kim
 * @version 0.1
 */
public class EscapeUtils {

    /**
     * Escape 처리한 문자열을 unescape처리한다.
     *
     * @param string Escape 처리한 문자열
     * @return escape Unescape 처리한 문자열
     */
    public static String unescape(String string) {
        return StringUtils.unescape(string);
    }

    /**
     * 지정한 문자열을 escape 처리한다.
     *
     * @param string Escape 처리할 문자열
     * @return escape 처리한 문자열
     */
    public static String escape(String string) {
        return StringUtils.escape(string);
    }

}
