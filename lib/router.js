Router.route('/welcome');

Router.route('/activity_page',{
    template: 'activity_page'
});
Router.route('/archive', {
    template: 'archive'
});

Router.route('/lecture:_lecture_id',{
    template: 'activity_list'
});

Router.route('/activity:_activity_id', {
    template: 'activity',
    data: function() {
        //console.log(this.params._activity_id);
        Session.set('activity_id', this.params._activity_id);
    }
});

Router.route('/archive/lecture:_lecture_id/activity:_activity_id', {
    template: 'archive_submission',
    data: function() {
        Session.set('archive_lecture_id', this.params._lecture_id);
        Session.set('archive_activity_id', this.params._activity_id);
    }
});

Router.configure({
    layoutTemplate: 'sidemenu'
});