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