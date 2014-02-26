package org.greengin.senseitweb.entities;

import javax.persistence.Column;
import javax.persistence.DiscriminatorColumn;
import javax.persistence.Entity;
import javax.persistence.GeneratedValue;
import javax.persistence.GenerationType;
import javax.persistence.Id;
import javax.persistence.Inheritance;
import javax.persistence.InheritanceType;

@Entity
@Inheritance(strategy = InheritanceType.JOINED)
@DiscriminatorColumn(name = "ENTITY_TYPE")
public abstract class AbstractEntity {
	@Id
    @Column (name = "ENTITY_ID", nullable = false)
    @GeneratedValue (strategy = GenerationType.TABLE)
	Long id;

	
	public Long getId() {
		return id;
	}
}