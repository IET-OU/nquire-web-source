package org.greengin.nquireit.dao;

import org.greengin.nquireit.entities.base.Filter;
import org.greengin.nquireit.logic.base.FilterResponse;

import javax.persistence.EntityManager;
import javax.persistence.PersistenceContext;
import javax.persistence.TypedQuery;
import javax.transaction.Transactional;
import java.util.HashMap;
import java.util.List;
import java.util.Vector;
import java.util.Map;

/**
 * Created by nfreear on 29/11/15.
 */
public class FilterDao {
    static final String FILTER_ID_QUERY = "SELECT f FROM Filter f WHERE f.id=:id"; //f.ENTITY_ID=:id
    static final String FILTER_QUERY = "SELECT f FROM Filter f";
    static final String FILTER_DELETE = "DELETE FROM Filter f WHERE f.id=:filter_id";


    @PersistenceContext
    EntityManager em;

    @Transactional
    public Boolean setFilter(String label, String filter_query, Long filter_id) {
        TypedQuery<Filter> query = em.createQuery(FILTER_ID_QUERY, Filter.class);
        query.setParameter("id", filter_id);
        List<Filter> filters = query.getResultList();
        if (filters.size() == 0) {
            Filter filter = new Filter();
            filter.setLabel(label);
            filter.setQuery(filter_query);
            //filter.setId(filter_id);
            em.persist(filter);
        } else {
            Filter filter = filters.get(0);
            filter.setLabel(label);
            filter.setQuery(filter_query);

            for (int i = 1; i < filters.size(); i++) {
                em.remove(filters.get(i));
            }
        }

        return true;
    }

    @Transactional
    public Boolean deleteFilter(Filter filter) {
        //context.getRoleDao().removeContextRoles(project);
        em.persist(filter);
        em.remove(filter);
        return true;
    }

    public List<FilterResponse> getFilters() {
        List<FilterResponse> response = new Vector<FilterResponse>();

        TypedQuery<Filter> query = em.createQuery(FILTER_QUERY, Filter.class);

        for (Filter item : query.getResultList()) {
            FilterResponse fr = new FilterResponse();
            fr.setId(item.getId());
            fr.setLabel(item.getLabel());
            fr.setQuery(item.getQuery());
            response.add(fr);
        }
        return response;
    }

    public Map<String, String> getFilters_OLD() {
        Map<String, String> filters = new HashMap<String, String>();
        TypedQuery<Filter> query = em.createQuery(FILTER_QUERY, Filter.class);
        for (Filter item : query.getResultList()) {
            filters.put(item.getLabel(), item.getQuery());
        }
        return filters;
    }
}
