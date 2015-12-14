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
    @Column(columnDefinition = "TEXT")
    String label;

    @Basic
    @Getter
    @Setter
    //Was: @Column(columnDefinition = "TEXT") ->> varchar(255)
    //Try: @Column(length = 255), @Size(max = 255)
    @Column(unique = true, nullable = false)
    String query;
}
