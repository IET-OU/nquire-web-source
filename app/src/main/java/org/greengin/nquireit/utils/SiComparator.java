package org.greengin.nquireit.utils;

/**
 * Class to create Sense-it data comparators.
 *
 * @author  Nick Freear, 15 February 2017.
 */

import java.util.*;
import org.greengin.nquireit.utils.TimeValue;

public class SiComparator {

    public static Comparator<Map.Entry<Long, String>> sensor() {
        Comparator<Map.Entry<Long, String>> sensorComparator = new Comparator<Map.Entry<Long, String>>() {
            @Override
            public int compare(Map.Entry<Long, String> o1, Map.Entry<Long, String> o2) {
                return o1.getKey().compareTo(o2.getKey());
            }
        };
        return sensorComparator;
    }

    public static Comparator<Map.Entry<String, TimeValue>> values() {
        Comparator<Map.Entry<String, TimeValue>> valuesComparator = new Comparator<Map.Entry<String, TimeValue>>() {
            @Override
            public int compare(Map.Entry<String, TimeValue> o1, Map.Entry<String, TimeValue> o2) {
                return o1.getKey().compareTo(o2.getKey());
            }
        };
        return valuesComparator;
    }
}
