package org.exem.flamingo.shared.util;

public class JsonFormatterUtils {

    private static final String INDENT = "   ";

    private static final String NEW_LINE = System.getProperty("line.separator");

    private static void appendIndent(StringBuilder sb, int count) {
        for (; count > 0; --count) sb.append(INDENT);
    }

    private static boolean isEscaped(StringBuilder sb, int index) {
        boolean escaped = false;
        while (index > 0 && sb.charAt(--index) == '\\') escaped = !escaped;
        return escaped;
    }

    public static String prettyPrint(Object object) {
        String input = null;
        if (object instanceof String) {
            input = (String) object;
        } else {
            throw new IllegalArgumentException("지원하지 않는 유형의 데이터 포맷입니다. 문자열 또는 JsonBall만 지원합니다. 클래스: " + object.getClass().getName());
        }
        StringBuilder output = new StringBuilder(input.length() * 2);
        boolean quoteOpened = false;
        int depth = 0;

        for (int i = 0; i < input.length(); ++i) {
            char ch = input.charAt(i);

            switch (ch) {
                case '{':
                case '[':
                    output.append(ch);
                    if (!quoteOpened) {
                        output.append(NEW_LINE);
                        appendIndent(output, ++depth);
                    }
                    break;
                case '}':
                case ']':
                    if (quoteOpened)
                        output.append(ch);
                    else {
                        output.append(NEW_LINE);
                        appendIndent(output, --depth);
                        output.append(ch);
                    }
                    break;
                case '"':
                case '\'':
                    output.append(ch);
                    if (quoteOpened) {
                        if (!isEscaped(output, i))
                            quoteOpened = false;
                    } else quoteOpened = true;
                    break;
                case ',':
                    output.append(ch);
                    if (!quoteOpened) {
                        output.append(NEW_LINE);
                        appendIndent(output, depth);
                    }
                    break;
                case ':':
                    if (quoteOpened) output.append(ch);
                    else output.append(" : ");
                    break;
                default:
                    if (quoteOpened || !(ch == ' '))
                        output.append(ch);
                    break;
            }
        }
        return output.toString();
    }
}
