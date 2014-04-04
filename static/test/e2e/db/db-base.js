exports.module = function () {
    angular.module('e2eDBCommon', []).factory('e2eDBCommon', [function () {

        return {
            requests: function (id, admin, member, projectOpen) {
                var status = id ? {
                    logged: true,
                    profile: {id: id, name: id.toString(), openIds: []},
                    token: 'tkn'
                } : {
                    logged: false,
                    profile: null,
                    token: null
                };

                var projects = [
                    {
                        id: 101,
                        title: 'p101',
                        type: 'challenge',
                        activity: {},
                        open: projectOpen
                    }
                ];

                var project101 = {
                    project: projects[0],
                    access: id ? {member: member, admin: admin, author: admin} : {member: false, admin: false, author: false}
                };

                var project101comments = [
                    {id: 1001, user: {id: 1, name: '1'}, comment: 'c1'},
                    {id: 1002, user: {id: 2, name: '2'}, comment: 'c2'}
                ];

                var project101commentsAfterPost = [
                    {id: 1001, user: {id: 1, name: '1'}, comment: 'c1'},
                    {id: 1002, user: {id: 2, name: '2'}, comment: 'c2'},
                    {id: 1003, user: {id: 1, name: '1'}, comment: 'c3'}
                ];

                var project101commentsAfterDelete = [
                    {id: 1001, user: {id: 1, name: '1'}, comment: 'c1'}
                ];


                return {
                    'api/openid/profile': status,
                    'api/projects': projects,
                    'api/project/101': project101,
                    'api/project/101/comments': project101comments,
                    'POST api/project/101/comments': project101commentsAfterPost,
                    'DELETE api/project/101/comments/1002': project101commentsAfterDelete
                };
            }
        };
    }]);
};