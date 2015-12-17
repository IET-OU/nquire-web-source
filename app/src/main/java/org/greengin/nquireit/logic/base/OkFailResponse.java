package org.greengin.nquireit.logic.base;


import org.springframework.orm.jpa.JpaSystemException;
import javax.persistence.RollbackException;
import javax.servlet.http.HttpServletResponse;

import lombok.Getter;
import lombok.Setter;

/**
 * Created by nfreear on 14/12/15.
 */
public class OkFailResponse {
    @Getter
    @Setter
    String stat = "ok";

    @Getter
    @Setter
    int code = 200;

    @Getter
    @Setter
    String exception = null;

    @Getter
    @Setter
    String message = null;

    @Getter
    @Setter
    String cause = null;

    @Getter
    @Setter
    String url = null;

    @Getter
    @Setter
    Object details = null;

    /* Constructor(s).
    */
    public OkFailResponse() {}

    public OkFailResponse(String url) {
        setUrl(url);
    }


    public Boolean setHeaders(Exception ex, HttpServletResponse response, int code) {
        response.setStatus(code);
        response.setHeader("X-Code", Integer.toString(code));
        response.setHeader("X-Exception", ex.getClass().getName());
        response.setHeader("X-Message", ex.getMessage());
        return true;
    }

    public OkFailResponse setError(Exception ex, HttpServletResponse response) {
        String name = ex.getClass().getName();
        String msg = ex.getMessage();
        int code = msg.contains("javax.persistence.RollbackException") ? 400 : 500;
        //Was: int code = name.equals("javax.persistence.RollbackException") ? 400 : 500;
        Throwable cause = ex.getCause();
        setHeaders(ex, response, code);
        setStat("fail");
        setCode(code);
        setException(name);
        setMessage(msg);
        setCause(null != cause ? cause.toString() : null);
        return this;
    }


    public Boolean throwTestException() {
        //Was: throw new JpaSystemException(
        throw new RollbackException(
        "[TEST] Error while committing the transaction; nested exception is javax.persistence.RollbackException: ...");
    }

    /*
    Ex:     org.springframework.orm.jpa.JpaSystemException;
    Nested: javax.persistence.RollbackException
    Cause:  com.mysql.jdbc.exceptions.jdbc4.MySQLIntegrityConstraintViolationException: Duplicate entry 'greek-schools' for key 'UK_eq515nq0j31u4stqioda0acae'
    */
}
