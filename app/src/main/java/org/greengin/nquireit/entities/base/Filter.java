package org.greengin.nquireit.entities.base;

import lombok.Getter;
import lombok.Setter;
import org.greengin.nquireit.entities.AbstractEntity;

import javax.persistence.Basic;
import javax.persistence.Entity;
import javax.persistence.Column;

import java.text.DateFormat;
import java.text.SimpleDateFormat;
import java.util.Date;
import java.util.Locale;
import java.util.TimeZone;

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

    @Basic
    @Getter
    @Setter
    // Date created and/or edited.
    Date date;

    // https://gist.github.com/kristopherjohnson/6124652
    public String getIsoDate() {
        String isodate = null;
        if (date != null) {
            DateFormat dateFormat = new SimpleDateFormat("yyyy-MM-dd'T'HH:mm:ss'Z'", Locale.US);
            dateFormat.setTimeZone(TimeZone.getTimeZone("UTC"));
            isodate = dateFormat.format(date);
        }
        return isodate;
    }
}
