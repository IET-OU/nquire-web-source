package org.greengin.nquireit.logic;

/**
 * nQuire-it - backend and web-service API for nQuire-it (Java sources).
 *
 * License: GNU GPL-3.0+ (https://gnu.org/licenses/gpl.html)
 * Copyright © 2014-2017 The Open University (IET-OU).
 */

import lombok.Getter;
import lombok.Setter;
import org.greengin.nquireit.dao.*;
import org.greengin.nquireit.logic.data.FileManagerBean;
import org.greengin.nquireit.logic.log.LogManagerBean;
import org.greengin.nquireit.dao.RoleDao;
import org.greengin.nquireit.logic.users.SubscriptionManagerBean;
import org.greengin.nquireit.logic.users.UserServiceBean;
import org.springframework.beans.factory.InitializingBean;
import org.springframework.beans.factory.annotation.Autowired;


public class ContextBean implements InitializingBean {

    @Getter
    static ContextBean context;


    @Setter
    private String httpProxyHost;

    @Setter
    private String httpProxyPort;

    @Autowired
    @Getter
    UserServiceBean usersManager;


    @Autowired
    @Getter
    SubscriptionManagerBean subscriptionManager;

    @Autowired
    @Getter
    FileManagerBean fileManager;

    @Autowired
    @Getter
    LogManagerBean logManager;

    @Autowired
    @Getter
    UserProfileDao userProfileDao;

    @Autowired
    @Getter
    VoteDao voteDao;

    @Autowired
    @Getter
    VotableDao votableDao;

    @Autowired
    @Getter
    CommentsDao commentsDao;

    @Autowired
    @Getter
    ForumDao forumDao;

    @Autowired
    @Getter
    ProjectDao projectDao;

    @Autowired
    @Getter
    DataActivityDao dataActivityDao;

    @Autowired
    @Getter
    SenseItDao senseItDao;

    @Autowired
    @Getter
    ChallengeDao challengeDao;

    @Autowired
    @Getter
    SpotItDao spotItDao;

    @Autowired
    @Getter
    TextDao textDao;

    @Autowired
    @Getter
    RoleDao roleDao;

    @Autowired
    @Getter
    FilterDao filterDao;

    @Override
    public void afterPropertiesSet() throws Exception {
        if (httpProxyHost.length() > 0 && httpProxyPort.length() > 0) {
            System.getProperties().put("http.proxyHost", httpProxyHost);
            System.getProperties().put("http.proxyPort", httpProxyPort);
        }

        context = this;
    }
}
