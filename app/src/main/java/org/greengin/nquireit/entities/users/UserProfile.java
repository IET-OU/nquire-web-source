package org.greengin.nquireit.entities.users;

import lombok.Getter;
import lombok.NonNull;
import lombok.Setter;
import org.greengin.nquireit.entities.AbstractEntity;
import org.greengin.nquireit.logic.ContextBean;
import org.greengin.nquireit.utils.TimeValue;
import org.springframework.security.core.GrantedAuthority;
import org.springframework.security.core.userdetails.UserDetails;

import javax.persistence.*;
import java.text.DateFormat;
import java.text.SimpleDateFormat;
import java.util.Date;
import java.util.Locale;
import java.util.TimeZone;
import java.util.HashMap;
import java.util.List;
import java.util.Vector;

@Entity
public class UserProfile extends AbstractEntity implements UserDetails {

    @Basic
    @Setter
    String username;

    @Basic
    @Setter
    String password;

    @Basic
    @Setter
    @Getter
    String email;

    @Basic
    @Setter
    @Getter
    String notify1 = "1";

    @Basic
    @Setter
    @Getter
    String notify2 = "1";

    @Basic
    @Setter
    @Getter
    String notify3 = "1";

    @Basic
    @Setter
    @Getter
    String notify4 = "1";

    @Basic
    @Setter
    @Getter
    String notify5 = "1";

    @Basic
    @Getter
    @Setter
    boolean emailConfirmed = false;

    @Basic
    @Setter
    @Getter
    boolean admin = false;

    @Basic
    @Setter
    @Getter
    String status = "";

    @Basic
    @Getter
    @Setter
    Date date;

    @Basic
    @Getter
    @Setter
    String image;

    @Lob
    @Getter
    @Setter
    HashMap<String, String> metadata = new HashMap<String, String>();

    @Lob
    @Setter
    HashMap<String, Boolean> visibility = new HashMap<String, Boolean>();

    public HashMap<String, Boolean> getVisibility() {
        if (visibility == null) {
            visibility = new HashMap<String, Boolean>();
        }

        for (String key : new String[] {"metadata", "projectsJoined", "projectsCreated"}) {
            if (!visibility.containsKey(key)) {
                visibility.put(key, true);
            }
        }

        return visibility;
    }

    @Override
    public List<? extends GrantedAuthority> getAuthorities() {
        return null;
    }

    @Override
    public String getPassword() {
        return password;
    }

    @Override
    public String getUsername() {
        return username;
    }

    @Override
    public boolean isAccountNonExpired() {
        return true;
    }

    @Override
    public boolean isAccountNonLocked() {
        return true;
    }

    @Override
    public boolean isCredentialsNonExpired() {
        return true;
    }

    @Override
    public boolean isEnabled() {
        return true;
    }

    public boolean isPasswordSet() {
        return password != null && password.length() > 0;
    }

    public boolean isLoggedIn() {
        return ContextBean.getContext().getUsersManager().isLoggedIn(this);
    }

    @Override
    public boolean equals(Object obj) {
        return obj != null && obj instanceof UserProfile && getId().equals(((UserProfile) obj).getId());
    }

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
