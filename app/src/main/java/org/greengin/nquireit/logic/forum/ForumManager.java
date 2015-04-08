package org.greengin.nquireit.logic.forum;

import org.greengin.nquireit.entities.projects.Project;
import org.greengin.nquireit.entities.rating.Comment;
import org.greengin.nquireit.entities.rating.ForumNode;
import org.greengin.nquireit.entities.rating.ForumThread;
import org.greengin.nquireit.entities.users.UserProfile;
import org.greengin.nquireit.logic.AbstractContentManager;
import org.greengin.nquireit.logic.ContextBean;
import org.greengin.nquireit.logic.rating.CommentFeedResponse;
import org.greengin.nquireit.logic.rating.CommentRequest;
import org.greengin.nquireit.logic.rating.VoteCount;
import org.greengin.nquireit.logic.rating.VoteRequest;
import org.springframework.beans.factory.annotation.Value;

import javax.servlet.http.HttpServletRequest;
import java.util.List;
import java.util.Vector;

import java.io.UnsupportedEncodingException;
import java.util.Properties;
import javax.mail.*;
import javax.mail.internet.*;

/**
 * Created by evilfer on 6/26/14.
 */
public class ForumManager extends AbstractContentManager {

    static final String ROOT_NODE = "SELECT f FROM ForumNode f WHERE f.parent IS NULL";

    public ForumManager(ContextBean context, HttpServletRequest request) {
        super(context, request);
    }

    public ForumManager(ContextBean context, UserProfile user, boolean tokenOk) {
        super(context, user, tokenOk);
    }

    private String appUrl = "http://nquire-it.org";

    private String smtpHost = "smtpmail.open.ac.uk";

    /* view actions */

    public ForumThread getThread(Long id) {
        return context.getForumDao().findThread(id);
    }

    public ForumNode getRoot() {
        return context.getForumDao().findRoot();
    }

    public ForumNode getNode(Long forumId) {
        return context.getForumDao().findForum(forumId);
    }

    /* admin actions */
    public ForumNode createForum(Long containerId, ForumRequest forumData) {

        if (loggedWithToken && user.isAdmin()) {
            context.getForumDao().createForum(containerId, forumData);
        }

        return getRoot();
    }

    public ForumNode updateForum(Long forumId, ForumRequest forumData) {
        if (loggedWithToken && user.isAdmin()) {
            context.getForumDao().updateForum(forumId, forumData);
        }

        return getRoot();
    }

    public ForumNode deleteForum(Long forumId) {
        if (loggedWithToken && user.isAdmin()) {
            context.getForumDao().deleteForum(forumId);
        }

        return getRoot();
    }




    public Long createThread(Long forumId, ForumRequest forumData) {
        if (loggedWithToken) {
            ForumThread thread = context.getForumDao().createThread(user, forumId, forumData);
            if (thread != null) {
                return thread.getId();
            }
        }

        return null;
    }

    public ForumThread updateThread(Long threadId, ForumRequest forumData) {
        if (loggedWithToken) {
            return context.getForumDao().updateThread(user, threadId, forumData);
        } else {
            return null;
        }
    }


    public ForumThread comment(Long threadId, CommentRequest data) {
        if (loggedWithToken) {
            ForumThread thread = context.getForumDao().findThread(threadId);
            context.getForumDao().comment(user, thread, data);
            return thread;
        }

        return null;
    }

    public ForumThread deleteComment(Long threadId, Long commentId) {
        if (loggedWithToken) {
            ForumThread thread = context.getForumDao().findThread(threadId);
            if (thread != null) {
                context.getForumDao().deleteComment(user, thread, commentId);
            }
            return thread;
        }
        return null;
    }

    public ForumThread updateComment(Long threadId, Long commentId, CommentRequest data) {
        if (loggedWithToken) {
            ForumThread thread = context.getForumDao().findThread(threadId);
            if (thread != null) {
                context.getCommentsDao().updateComment(user, thread, commentId, data);
            }
            return thread;
        }
        return null;
    }



    public VoteCount voteComment(Long threadId, Long commentId, VoteRequest voteData) {
        if (loggedWithToken) {
            ForumThread thread = context.getForumDao().findThread(threadId);
            if (thread != null) {
                Comment comment = context.getCommentsDao().getComment(thread, commentId);
                if (comment != null) {
                    if (voteData.isReport()) {
                        try {
                            Properties properties = new Properties();
                            properties.put("mail.smtp.host", this.smtpHost);
                            Session session = Session.getInstance(properties, null);
                            session.setDebug(true);
                            MimeMessage msg = new MimeMessage(session);
                            msg.setFrom(new InternetAddress("no-reply@nquire-it.org", "nQuire-it"));
                            msg.setSubject("Inappropriate content at " + this.appUrl);
                            msg.setText(
                                "Dear nQuire-it administrator,\n\n" +
                                "Inappropriate content has been reported on the nQuire-it website.\n\n" +
                                "Please review the reports and take appropriate action.\n\n" +
                                this.appUrl + "/#/admin/reported\n\n" +
                                "This is an automatically generated e-mail sent to all administrators.  " +
                                "To stop receiving these messages, arrange for your administrator status to be revoked."
                            );

                            List<UserProfile> admins = context.getUserProfileDao().listAdmins();
                            for(UserProfile admin: admins) {
                                msg.addRecipient(
                                    MimeMessage.RecipientType.TO,
                                    new InternetAddress(admin.getEmail(),
                                    admin.getUsername())
                                );
                            }

                            Transport.send(msg);
                        } catch (UnsupportedEncodingException ex) {
                            ex.printStackTrace();
                        } catch (MessagingException ex) {
                            ex.printStackTrace();
                        }
                    }
                    return context.getVoteDao().vote(user, comment, voteData);
                }
            }
        }

        return null;
    }

    public List<CommentFeedResponse> getForumCommentFeed() {
        List<CommentFeedResponse> list = new Vector<CommentFeedResponse>();
        for (Comment c : context.getCommentsDao().commentsFeed(ForumThread.class, 3)) {
            list.add(new CommentFeedResponse(c));
        }
        return list;
    }

}
