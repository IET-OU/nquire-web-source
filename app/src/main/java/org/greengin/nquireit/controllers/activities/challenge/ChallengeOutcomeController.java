package org.greengin.nquireit.controllers.activities.challenge;


import javax.servlet.http.HttpServletRequest;

import com.mangofactory.jsonview.ResponseView;
import org.greengin.nquireit.entities.activities.challenge.ChallengeOutcome;
import org.greengin.nquireit.json.Views;
import org.greengin.nquireit.logic.project.challenge.ChallengeOutcomeRequest;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.*;


@Controller
@RequestMapping(value = "/api/project/{projectId}/challenge/outcome")
public class ChallengeOutcomeController extends AbstractChallengeController {

    @RequestMapping(method = RequestMethod.GET)
    @ResponseBody
    @ResponseView(value = Views.VotableCount.class)
	public ChallengeOutcome get(@PathVariable("projectId") Long projectId, HttpServletRequest request) {
		return createManager(projectId, request).getOutcome();
	}

    @RequestMapping(method = RequestMethod.PUT)
    @ResponseBody
    @ResponseView(value = Views.VotableCount.class)
	public ChallengeOutcome select(@PathVariable("projectId") Long projectId, @RequestBody ChallengeOutcomeRequest outcomeData, HttpServletRequest request) {
        return createManager(projectId, request).updateOutcome(outcomeData);
	}
	
}
