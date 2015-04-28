package org.greengin.nquireit.entities.activities.senseit;

import java.util.*;

import javax.persistence.Basic;
import javax.persistence.Entity;
import javax.persistence.Lob;

import lombok.Getter;
import lombok.NonNull;
import lombok.Setter;
import org.greengin.nquireit.entities.activities.base.AbstractActivity;
import org.greengin.nquireit.entities.data.AbstractDataProjectItem;
import org.greengin.nquireit.entities.projects.Project;
import org.greengin.nquireit.logic.ContextBean;
import org.greengin.nquireit.logic.admin.ReportedContent;
import org.greengin.nquireit.logic.project.senseit.transformations.SenseItOperations;
import org.greengin.nquireit.logic.project.senseit.transformations.SenseItProcessedSeries;
import org.greengin.nquireit.logic.project.senseit.transformations.SenseItProcessedSeriesVariable;
import org.greengin.nquireit.utils.TimeValue;
import org.springframework.beans.factory.annotation.Configurable;

@Configurable
@Entity
public class SenseItSeries extends AbstractDataProjectItem {

	@Basic
    @Getter
    @Setter
	String geolocation;

	@Lob
    @Getter
    @Setter
    @NonNull
	HashMap<Long, String> sensors = new HashMap<Long, String>();

    @Lob
    @Getter
    @Setter
    @NonNull
    HashMap<Long, Vector<TimeValue>> data = new HashMap<Long, Vector<TimeValue>>();

	transient SenseItProcessedSeries processData = null;


	public HashMap<String, TimeValue> getVarValue() {
		processData();
		return SenseItOperations.tableVariables(processData, (SenseItActivity) this.dataStore);
	}
	
	public SenseItProcessedSeriesVariable varData(String varId) {
		processData();
		return processData.values.get(varId);
	}

	private void processData() {
        if (processData == null) {
            processData = SenseItOperations.instance().process(this.data, (SenseItActivity) this.dataStore);
        }
	}

    @Override
    public String getReportedType(ContextBean context) {
        return "senseitSeries";
    }

    @Override
    public String getReportedPath(ContextBean context) {
        AbstractActivity activity = this.dataStore;
        Project project = context.getProjectDao().findProject(activity);
        return String.format("/project/%d/map?item=%d", project.getId(), getId());
    }

    @Override
    public void createReportedInfo(ReportedContent info, ContextBean context) {
        info.setPath(getReportedPath(context));
        info.setAuthor(getAuthor());
        info.addInfo("Title", title);
    }


    @Override
    public Date getDate() {
        Iterator<Vector<TimeValue>> iter = data.values().iterator();
        if (iter.hasNext()) {
            Vector<TimeValue> values = iter.next();
            if (values.size() > 0) {
                return new Date(values.firstElement().getT());
            }
        }

        return super.getDate();
    }
}
