package org.greengin.nquireit.controllers.admin;

/**
 * nquire-it - backend and web-service API for nQuire-it (Java sources).
 *
 * License: GNU GPL-3.0+ (https://gnu.org/licenses/gpl.html)
 * © 2014-2017 The Open University (IET-OU).
 */

import com.mangofactory.jsonview.ResponseView;
import org.greengin.nquireit.entities.projects.Project;
import org.greengin.nquireit.entities.users.UserProfile;
import org.greengin.nquireit.json.Views;
import org.greengin.nquireit.logic.ContextBean;
import org.greengin.nquireit.logic.admin.AdminActions;
import org.greengin.nquireit.logic.admin.ProjectFeaturedRequest;
import org.greengin.nquireit.logic.admin.ProjectFiltersRequest;
import org.greengin.nquireit.logic.admin.ReportedContent;
import org.greengin.nquireit.logic.admin.UserAdminRequest;
import org.greengin.nquireit.logic.base.TextRequest;
import org.greengin.nquireit.logic.base.FilterRequest;
import org.greengin.nquireit.logic.base.OkFailResponse;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.*;

import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;
import java.util.HashMap;
import java.util.Map;
import java.util.List;

import org.springframework.orm.jpa.JpaSystemException;


@Controller
@RequestMapping(value = "/api/admin")
public class AdminController {

    @Autowired
    ContextBean contextBean;

    private AdminActions createAdminManager(HttpServletRequest request) {
        return new AdminActions(contextBean, request);
    }

    @RequestMapping(value = "/users", method = RequestMethod.GET)
    @ResponseBody
    @ResponseView(value = Views.UserProfileData.class)
    public List<UserProfile> users(HttpServletRequest request) {
        return createAdminManager(request).getUsers();
    }

    @RequestMapping(value = "/user/{userId}/admin", method = RequestMethod.PUT)
    @ResponseBody
    @ResponseView(value = Views.UserProfileData.class)
    public List<UserProfile> setAdmin(@PathVariable("userId") Long userId, @RequestBody UserAdminRequest data, HttpServletRequest request) {
        AdminActions manager = createAdminManager(request);
        manager.setAdmin(userId, data);
        return manager.getUsers();
    }

    @RequestMapping(value = "/projects", method = RequestMethod.GET)
    @ResponseBody
    @ResponseView(value = Views.UserName.class)
    public List<Project> projects(HttpServletRequest request) {
        return createAdminManager(request).getProjects();
    }


    @RequestMapping(value = "/project/{projectId}/featured", method = RequestMethod.PUT)
    @ResponseBody
    @ResponseView(value = Views.UserProfileData.class)
    public List<Project> setFeatured(@PathVariable("projectId") Long projectId, @RequestBody ProjectFeaturedRequest data, HttpServletRequest request) {
        AdminActions manager = createAdminManager(request);
        manager.setFeatured(projectId, data);
        return manager.getProjects();
    }

    @RequestMapping(value = "/project/{projectId}/filters", method = RequestMethod.PUT)
    @ResponseBody
    @ResponseView(value = Views.UserProfileData.class)
    public List<Project> setProjectFilters(@PathVariable("projectId") Long projectId, @RequestBody ProjectFiltersRequest data, HttpServletRequest request) {
        AdminActions manager = createAdminManager(request);
        manager.setProjectFilters(projectId, data);
        return manager.getProjects();
    }

    @RequestMapping(value = "/reported", method = RequestMethod.GET)
    @ResponseBody
    @ResponseView(value = Views.UserName.class)
    public HashMap<String, List<ReportedContent>> reported(HttpServletRequest request) {
        return createAdminManager(request).getReportedContent();
    }

    @RequestMapping(value = "/reported/{entityId}", method = RequestMethod.DELETE)
    @ResponseBody
    @ResponseView(value = Views.UserName.class)
    public HashMap<String, List<ReportedContent>> deleteReported(@PathVariable("entityId") Long id, HttpServletRequest request) {
        return createAdminManager(request).deleteReportedContent(id);
    }

    @RequestMapping(value = "/reported/{entityId}/approve", method = RequestMethod.POST)
    @ResponseBody
    @ResponseView(value = Views.UserName.class)
    public HashMap<String, List<ReportedContent>> approveReported(@PathVariable("entityId") Long id, HttpServletRequest request) {
        return createAdminManager(request).approveReportedContent(id);
    }


    @RequestMapping(value = "/text", method = RequestMethod.PUT)
    @ResponseBody
    @ResponseView(value = Views.UserProfileData.class)
    public Boolean setText(@RequestBody TextRequest data, HttpServletRequest request) {
        AdminActions manager = createAdminManager(request);
        return manager.setText(data.getKey(), data.getContent());
    }

    @RequestMapping(value = "/filter", method = RequestMethod.PUT)
    @ResponseBody
    @ResponseView(value = Views.UserProfileData.class)
    public OkFailResponse setFilter(@RequestBody FilterRequest data, HttpServletRequest request, HttpServletResponse response) {
        AdminActions manager = createAdminManager(request);
        OkFailResponse stat = new OkFailResponse("/api/admin/filter");
        try {
            manager.setFilter(data.getLabel(), data.getQuery(), data.getId());
            stat.setMessage("Filter saved successfully.");
        } catch (JpaSystemException ex) {  //Was: (RollbackException ex)
            stat.setError(ex, response);
        }
        return stat;
    }

    @RequestMapping(value = "/filter/{ID}", method = RequestMethod.DELETE)
    @ResponseBody
    @ResponseView(value = Views.UserProfileData.class)
    public OkFailResponse deleteFilter(@PathVariable("ID") Long filterId, HttpServletRequest request, HttpServletResponse response) {
        AdminActions manager = createAdminManager(request);
        OkFailResponse stat = new OkFailResponse("/api/admin/filter/{ID}");
        Map<String, Long> details = new HashMap<String, Long>();
        details.put("ID", filterId);
        stat.setDetails(details);
        try {
            manager.deleteFilter(filterId);
            stat.setMessage("Filter deleted successfully.");
        } catch (Exception ex) {
            stat.setError(ex, response);
        }
        return stat;  //HTTP codes: 405; 415; 500.
    }

    @RequestMapping(value = "/model/update", method = RequestMethod.POST)
    @ResponseBody
    @ResponseView(value = Views.UserProfileData.class)
    public Boolean modelUpdate(HttpServletRequest request) {
        AdminActions manager = createAdminManager(request);
        return manager.updateModel();
    }


}
