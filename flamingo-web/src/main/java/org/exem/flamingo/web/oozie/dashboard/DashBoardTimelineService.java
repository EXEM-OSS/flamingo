package org.exem.flamingo.web.oozie.dashboard;

import java.util.List;
import java.util.Map;

/**
 * Created by park on 2016. 10. 19..
 */
public interface DashBoardTimelineService {

    public List<Map> getTimeline(Map params);
}
