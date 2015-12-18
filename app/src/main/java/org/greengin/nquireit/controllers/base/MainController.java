package org.greengin.nquireit.controllers.base;

import org.greengin.nquireit.logic.ContextBean;
import org.greengin.nquireit.logic.base.FilterResponse;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestMethod;
import org.springframework.web.bind.annotation.ResponseBody;

import javax.servlet.http.HttpServletRequest;
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

    @RequestMapping(value = "/api/filter_OLD", method = RequestMethod.GET)
    @ResponseBody
    public Map<String, String> filters_OLD(HttpServletRequest request) {

        return contextBean.getFilterDao().getFilters_OLD();
    }
}
