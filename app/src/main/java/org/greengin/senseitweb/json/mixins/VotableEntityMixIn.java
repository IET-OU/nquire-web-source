package org.greengin.senseitweb.json.mixins;

import java.util.Collection;

import com.fasterxml.jackson.annotation.JsonView;
import org.greengin.senseitweb.entities.rating.Vote;
import org.greengin.senseitweb.json.Views;
import org.greengin.senseitweb.logic.moderation.ModerationStatus;
import org.greengin.senseitweb.logic.rating.VoteCount;

public abstract class VotableEntityMixIn {

    @JsonView(Views.VotableNamedVotes.class) Collection<Vote> votes;
    @JsonView(Views.VotableNamedVotes.class) abstract Collection<Vote> getVotes();
	@JsonView(Views.VotableCount.class) abstract VoteCount getVoteCount();
	@JsonView(value = Views.VotableCountModeration.class) abstract ModerationStatus getModerationStatus();

}