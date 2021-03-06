package org.greengin.nquireit.logic.project.challenge;

import lombok.Getter;
import lombok.Setter;
import org.greengin.nquireit.entities.activities.challenge.ChallengeActivity;

public class ChallengeActivityRequest {

    @Getter
    @Setter
    Integer maxAnswers;


    public void update(ChallengeActivity activity) {
        activity.setMaxAnswers(maxAnswers);
    }
}
