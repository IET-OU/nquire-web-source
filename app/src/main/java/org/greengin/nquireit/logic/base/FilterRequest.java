package org.greengin.nquireit.logic.base;

import lombok.Getter;
import lombok.Setter;

/**
 * Created by nfreear on 29//11/15.
 */
public class FilterRequest {
    @Getter
    @Setter
    Long id;

    @Getter
    @Setter
    String label;

    @Getter
    @Setter
    String query;

}
