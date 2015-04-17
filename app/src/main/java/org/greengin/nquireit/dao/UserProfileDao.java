package org.greengin.nquireit.dao;

import org.greengin.nquireit.entities.users.UserProfile;
import org.greengin.nquireit.logic.data.FileManagerBean;
import org.greengin.nquireit.logic.files.FileMapUpload;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Component;
import org.springframework.transaction.annotation.Transactional;

import javax.persistence.EntityManager;
import javax.persistence.PersistenceContext;
import javax.persistence.Query;
import javax.persistence.TypedQuery;
import java.io.IOException;
import java.util.Date;
import java.util.HashMap;
import java.util.List;

@Component
public class UserProfileDao {

    static final String ALL_USERS_QUERY = "SELECT u FROM UserProfile u";
    static final String ALL_ADMINS_QUERY = "SELECT u FROM UserProfile u WHERE admin = 1 AND email IS NOT NULL";
    static final String FORUM_NOTIFICATIONS_QUERY = "SELECT DISTINCT userprofile.* FROM forumthread JOIN comment ON comment.target_ENTITY_ID = forumthread.ENTITY_ID JOIN userprofile ON (userprofile.ENTITY_ID = forumthread.author_ENTITY_ID AND userprofile.notify4 = '1' OR userprofile.ENTITY_ID = comment.author_ENTITY_ID AND userprofile.notify5 = '1') WHERE forumthread.ENTITY_ID = :thread_id AND userprofile.ENTITY_ID <> :author_id";
    static final String COMMENT_NOTIFICATIONS_QUERY = "SELECT DISTINCT userprofile.* FROM project JOIN comment ON comment.target_ENTITY_ID = project.ENTITY_ID JOIN userprofile ON (userprofile.ENTITY_ID = project.author_ENTITY_ID AND userprofile.notify2 = '1' OR userprofile.ENTITY_ID = comment.author_ENTITY_ID AND userprofile.notify3 = '1') WHERE project.ENTITY_ID = :project_id AND userprofile.ENTITY_ID <> :author_id";
    static final String AUTHORITY_QUERY = "SELECT userId FROM UserConnection WHERE providerId = ? AND providerUserId = ?";
    static final String USER_QUERY = "SELECT u from UserProfile u WHERE LOWER(u.username)=LOWER(:username)";
    static final String USER_EMAIL_QUERY = "SELECT u from UserProfile u WHERE LOWER(u.email)=LOWER(:email)";
    static final String UPDATE_USER_CONNECTIONS = "UPDATE UserConnection SET userId = ? WHERE userId = ?";
    static final String DELETE_USER_CONNECTION = "DELETE FROM UserConnection WHERE userId = ? AND providerId = ?";

    @PersistenceContext
    EntityManager em;

    @Autowired
    PasswordEncoder passwordEncoder;

    @Autowired
    FileManagerBean fileManager;


    public UserProfile loadUserById(Long id) {
        return em.find(UserProfile.class, id);
    }

    public UserProfile loadUserByUsernameOrEmail(String username, String email) throws UsernameNotFoundException {
        try {
            return loadUserByUsername(username);
        } catch (UsernameNotFoundException e) {
            return loadUserByEmail(email);
        }
    }

    public UserProfile loadUserByUsername(String s) throws UsernameNotFoundException {
        TypedQuery<UserProfile> query = em.createQuery(USER_QUERY, UserProfile.class);

        query.setParameter("username", s);
        try {
            return query.getSingleResult();
        } catch (Exception e) {
            throw new UsernameNotFoundException(s);
        }
    }

    public UserProfile loadUserByEmail(String email) throws UsernameNotFoundException {
        TypedQuery<UserProfile> query = em.createQuery(USER_EMAIL_QUERY, UserProfile.class);

        query.setParameter("email", email);
        try {
            return query.getSingleResult();
        } catch (Exception e) {
            throw new UsernameNotFoundException(email);
        }
    }

    public UserProfile loadUserByProviderUserId(String providerId, String id) {

        Query query = em.createNativeQuery(AUTHORITY_QUERY);

        try {
            query.setParameter(1, providerId);
            query.setParameter(2, id);
            Object obj = query.getSingleResult();
            return loadUserByUsername((String) obj);
        } catch (Exception e) {
            return null;
        }
    }

    @Transactional
    public UserProfile createUser(String username, String password, String email, boolean emailConfirmed) {
        UserProfile user = new UserProfile();
        user.setUsername(username);
        user.setEmail(email);
        user.setEmailConfirmed(emailConfirmed);
        user.setDate(new Date());
        user.setPassword(password != null ? passwordEncoder.encode(password) : null);
        em.persist(user);

        return user;
    }

    public UserProfile user(UserProfile user) {
        return em.contains(user) ? user : em.find(UserProfile.class, user.getId());
    }

    @Transactional
    public void setPassword(UserProfile user, String password) {
        em.persist(user);
        user.setPassword(passwordEncoder.encode(password));
    }


    public boolean matchPassword(UserProfile user, String password) {
        return passwordEncoder.matches(password, user.getPassword());
    }

    @Transactional
    public boolean updateProfileImage(UserProfile user, FileMapUpload files) {
        if (files.getData().containsKey("image")) {
            em.persist(user);

            FileMapUpload.FileData file = files.getData().get("image");
            String fileContext = user.getId().toString();
            String filename = null;
            if (file != null) {
                try {
                    filename = fileManager.uploadFile(fileContext, file.filename, file.data);
                } catch (IOException ignored) {
                }
            }

            user.setImage(filename);
            return true;
        }
        return false;
    }


    @Transactional
    public boolean deleteConnection(UserProfile user, String providerId) {
        em.persist(user);
        Query query = em.createNativeQuery(DELETE_USER_CONNECTION);
        query.setParameter(1, user.getUsername());
        query.setParameter(2, providerId);
        query.executeUpdate();

        return true;
    }

    @Transactional
    public void updateUsername(UserProfile user, String username) {
        em.persist(user);

        Query query = em.createNativeQuery(UPDATE_USER_CONNECTIONS);
        query.setParameter(1, username);
        query.setParameter(2, user.getUsername());
        query.executeUpdate();

        user.setUsername(username);
    }

    @Transactional
    public void updateEmail(UserProfile user, String email) {
        em.persist(user);
        user.setEmail(email);
    }

    @Transactional
    public void updateNotify1(UserProfile user, String notify1) {
        em.persist(user);
        user.setNotify1(notify1);
    }

    @Transactional
    public void updateNotify2(UserProfile user, String notify2) {
        em.persist(user);
        user.setNotify2(notify2);
    }

    @Transactional
    public void updateNotify3(UserProfile user, String notify3) {
        em.persist(user);
        user.setNotify3(notify3);
    }

    @Transactional
    public void updateNotify4(UserProfile user, String notify4) {
        em.persist(user);
        user.setNotify4(notify4);
    }

    @Transactional
    public void updateNotify5(UserProfile user, String notify5) {
        em.persist(user);
        user.setNotify5(notify5);
    }

    @Transactional
    public void updateUserInformation(UserProfile user, HashMap<String, String> metadata, HashMap<String, Boolean> visibility) {
        em.persist(user);

        if (metadata != null) {
            HashMap<String, String> current = user.getMetadata();
            if (current == null) {
                current = new HashMap<String, String>();
            }
            current.putAll(metadata);
            user.setMetadata(current);
        }

        if (visibility != null) {
            user.setVisibility(visibility);
        }
    }

    public List<UserProfile> listAdmins() {
        return em.createQuery(ALL_ADMINS_QUERY, UserProfile.class).getResultList();
    }

    public List<UserProfile> commentNotifications(Long project_id, Long author_id) {
        System.out.println("===========================");
        System.out.println("project_id=" + project_id);
        System.out.println("author_id=" + author_id);
        System.out.println("SQL=" + COMMENT_NOTIFICATIONS_QUERY);
        System.out.println("===========================");

        return em
            .createNativeQuery(COMMENT_NOTIFICATIONS_QUERY, UserProfile.class)
            .setParameter("project_id", project_id)
            .setParameter("author_id", author_id)
            .getResultList();
    }

    public List<UserProfile> forumNotifications(Long thread_id, Long author_id) {
        return em
            .createNativeQuery(FORUM_NOTIFICATIONS_QUERY, UserProfile.class)
            .setParameter("thread_id", thread_id)
            .setParameter("author_id", author_id)
            .getResultList();
    }

    public List<UserProfile> listUsers() {
        return em.createQuery(ALL_USERS_QUERY, UserProfile.class).getResultList();
    }

    @Transactional
    public void setAdmin(Long userId, boolean isAdmin) {
        UserProfile user = em.find(UserProfile.class, userId);
        if (user != null) {
            user.setAdmin(isAdmin);
        }
    }

    @Transactional
    public void deleteUser(UserProfile user) {
        for (String providerId : new String[]{"google", "twitter", "facebook"}) {
            deleteConnection(user, providerId);
        }
        em.persist(user);
        em.remove(user);
    }
}
