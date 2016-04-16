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
        SessionAmplify.set('activity_id', this.params._activity_id);
    }
});

Router.route('/archive/CS3219/lecture:_lecture_id/activity:_activity_id', {
    template: 'archive_submission',
    data: function() {
        SessionAmplify.set('archive_module_code', "CS3219");
        SessionAmplify.set('archive_lecture_id', this.params._lecture_id);
        SessionAmplify.set('archive_activity_id', this.params._activity_id);
    }
});
Router.route('/archive/CS3240/lecture:_lecture_id/activity:_activity_id', {
    template: 'archive_submission',
    data: function() {
        SessionAmplify.set('archive_module_code', "CS3240");
        SessionAmplify.set('archive_lecture_id', this.params._lecture_id);
        SessionAmplify.set('archive_activity_id', this.params._activity_id);
    }
});

Router.configure({
    layoutTemplate: 'sidemenu'
});

Router.map(function() {
  this.route('txtFile', {
    where: 'server',
    path: '/text',
    action: function() {
      var text = "This is the awesome text.";
      var filename = 'textfile' + '.txt';

      var headers = {
        'Content-Type': 'text/plain',
        'Content-Disposition': "attachment; filename=" + filename
      };

      this.response.writeHead(200, headers);
      return this.response.end(text);
    }
  })
});