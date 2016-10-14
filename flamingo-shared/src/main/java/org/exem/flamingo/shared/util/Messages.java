package org.exem.flamingo.shared.util;

import java.text.MessageFormat;
import java.util.*;

public class Messages {

    private static final String BUNDLE_NAME = "locale.messages";

    private static final ResourceBundle RESOURCE_BUNDLE = UTF8ResourceBundle.getBundle(BUNDLE_NAME);

    private static Map<String, ResourceBundle> bundleCache = new HashMap();

    private static Map<String, String> resourceCache = new HashMap();

    private Messages() {
    }

    public static String getString(String key) {
        try {
            return RESOURCE_BUNDLE.getString(key);
        } catch (MissingResourceException e) {
            return '!' + key + '!';
        }
    }

    public static String getResources(Locale locale) {
        if (!resourceCache.containsKey(locale.toString())) {
            ResourceBundle bundle = UTF8ResourceBundle.getBundle(BUNDLE_NAME, locale);
            resourceCache.put(locale.toString(), getResources(bundle));
            bundleCache.put(locale.toString(), bundle);
        }
        return resourceCache.get(locale.toString());
    }

    public static Map toMap(Locale locale) {
        Map map = new HashMap();
        if (!resourceCache.containsKey(locale.toString())) {
            ResourceBundle bundle = UTF8ResourceBundle.getBundle(BUNDLE_NAME, locale);
            resourceCache.put(locale.toString(), getResources(bundle));
            bundleCache.put(locale.toString(), bundle);
        }

        ResourceBundle rb = bundleCache.get(locale.toString());
        Set<String> keys = rb.keySet();
        for (String key : keys) {
            map.put(key, rb.getString(key));
        }
        return map;
    }

    public static String getResources() {
        return getResources(RESOURCE_BUNDLE);
    }

    public static String getResources(ResourceBundle resourceBundle) {
        StringBuilder builder = new StringBuilder();
        Set<String> keys = resourceBundle.keySet();
        for (String key : keys) {
            String value = resourceBundle.getString(key);
            builder.append(key).append("=").append(value).append("\n");
        }
        return builder.toString();
    }

    public static String getString(String key, Object... params) {
        try {
            return MessageFormat.format(RESOURCE_BUNDLE.getString(key), params);
        } catch (MissingResourceException e) {
            return '!' + key + '!';
        }
    }
}