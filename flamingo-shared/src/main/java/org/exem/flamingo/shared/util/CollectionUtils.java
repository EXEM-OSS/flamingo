package org.exem.flamingo.shared.util;

import java.util.HashSet;
import java.util.Set;

public class CollectionUtils {

    public static Set toSet(String... values) {
        Set<Object> set = new HashSet<>();
        for (String value : values) {
            set.add(value);
        }
        return set;
    }

}
