package org.greengin.nquireit.entities.base;

import lombok.Getter;
import lombok.Setter;
import org.greengin.nquireit.entities.AbstractEntity;

import javax.persistence.Basic;
import javax.persistence.Entity;
import javax.persistence.Column;


/**
 * Created by nfreear on 29/11/15.
 */
@Entity
public class Filter extends AbstractEntity {

    @Basic
    @Getter
    @Setter
    String label;

    @Basic
    @Getter
    @Setter
    @Column(columnDefinition = "TEXT")
    String query;
}
