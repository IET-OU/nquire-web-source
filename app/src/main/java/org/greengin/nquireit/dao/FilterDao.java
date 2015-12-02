package org.greengin.nquireit.dao;

import org.greengin.nquireit.entities.base.Filter;

import javax.persistence.EntityManager;
import javax.persistence.PersistenceContext;
import javax.persistence.TypedQuery;
import javax.transaction.Transactional;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

/**
 * Created by nfreear on 29/11/15.
 */
public class FilterDao {
    static final String FILTER_KEY_QUERY = "SELECT f FROM TextItem f WHERE f.label=:label";
    static final String FILTER_QUERY = "SELECT f FROM Filter f";

    @PersistenceContext
    EntityManager em;

    @Transactional
    public Boolean setFilter(String label, String the_query) {
        TypedQuery<Filter> query = em.createQuery(FILTER_KEY_QUERY, Filter.class);
        query.setParameter("label", label);
        List<Filter> filters = query.getResultList();
        if (filters.size() == 0) {
            Filter filter = new Filter();
            filter.setLabel(label);
            filter.setQuery(the_query);
            em.persist(filter);
        } else {
            Filter filter = filters.get(0);
            filter.setQuery(the_query);

            for (int i = 1; i < filters.size(); i++) {
                em.remove(filters.get(i));
            }
        }

        return true;
    }

    public Map<String, String> getFilters() {
        Map<String, String> filters = new HashMap<String, String>();
        TypedQuery<Filter> query = em.createQuery(FILTER_QUERY, Filter.class);
        for (Filter item : query.getResultList()) {
            filters.put(item.getLabel(), item.getQuery());
        }
        return filters;
    }
}
