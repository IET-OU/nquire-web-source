package org.greengin.nquireit.controllers.base;

/**
 * nQuire-it - backend and web-service API for nQuire-it (Java sources).
 *
 * License: GNU GPL-3.0+ (https://gnu.org/licenses/gpl.html)
 * Copyright © 2014-2017 The Open University (IET-OU).
 */

import org.greengin.nquireit.logic.ContextBean;
import org.greengin.nquireit.logic.base.FilterResponse;
import org.greengin.nquireit.logic.base.OkFailResponse;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestMethod;
import org.springframework.web.bind.annotation.ResponseBody;

import javax.persistence.RollbackException;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;
import java.util.Map;
import java.util.List;

/**
 * Created by evilfer on 8/11/14.
 */

@Controller
public class MainController {

    @Autowired
    ContextBean contextBean;

    @RequestMapping(value = "/api/text", method = RequestMethod.GET)
    @ResponseBody
    public Map<String, String> texts(HttpServletRequest request) {

        return contextBean.getTextDao().getTexts();
    }

    @RequestMapping(value = "/api/filter", method = RequestMethod.GET)
    @ResponseBody
    public List<FilterResponse> filters(HttpServletRequest request) {

        return contextBean.getFilterDao().getFilters();
    }

    @RequestMapping(value = "/api/test/fail", method = RequestMethod.GET)
    @ResponseBody
    public OkFailResponse testFail(HttpServletRequest request, HttpServletResponse response) {
        OkFailResponse stat = new OkFailResponse("/api/test/fail");
        try {
            stat.throwTestException();
        } catch (RollbackException ex) {  //Was: (JpaSystemException ex)
            stat.setError(ex, response);
        }
        return stat;
    }

    @RequestMapping(value = "/api/test/ok", method = RequestMethod.GET)
    @ResponseBody
    public OkFailResponse testOk(HttpServletRequest request) {
        return new OkFailResponse("/api/test/ok");
    }
}
