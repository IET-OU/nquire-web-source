package org.greengin.nquireit.entities.users;


import com.fasterxml.jackson.annotation.JsonCreator;
import com.fasterxml.jackson.annotation.JsonValue;

public enum RoleType {
    NONE,
    LOGGED_IN,
	ADMIN,
	MEMBER;
	
	@JsonValue
    public String getValue() { return this.name().toLowerCase(); }

    @JsonCreator
    public static RoleType create(String val) {
    	RoleType[] units = RoleType.values();
        for (RoleType unit : units) {
            if (unit.getValue().equals(val)) {
                return unit;
            }
        }
        return NONE;
    }
}
