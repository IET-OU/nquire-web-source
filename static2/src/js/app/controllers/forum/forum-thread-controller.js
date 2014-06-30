angular.module('senseItWeb', null, null).controller('ForumThreadCtrl', function ($scope, $state) {

    $scope.forum.getThread($state.params.threadId);

    $scope.newComment = {comment: ''};
    $scope.form = new SiwFormManager($scope.newComment, ['comment'], function() {
        $scope.forum.postComment($scope.forum.thread.id, $scope.newComment.comment);
        $scope.newComment.comment = '';
    }, function() {
        $scope.newComment.comment = '';
    });

});