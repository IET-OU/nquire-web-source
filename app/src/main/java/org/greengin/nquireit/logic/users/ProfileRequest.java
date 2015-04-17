package org.greengin.nquireit.logic.users;


import lombok.Getter;
import lombok.Setter;

import java.util.HashMap;

public class ProfileRequest {

    @Getter
    @Setter
    String username;

    @Getter
    @Setter
    String email;

    @Getter
    @Setter
    String notify1;

    @Getter
    @Setter
    String notify2;

    @Getter
    @Setter
    String notify3;

    @Getter
    @Setter
    String notify4;

    @Getter
    @Setter
    String notify5;

    @Getter
    @Setter
    HashMap<String, String> metadata;

    @Getter
    @Setter
    HashMap<String, Boolean> visibility;

}
