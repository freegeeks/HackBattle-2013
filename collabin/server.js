var app = require('express')()
  , server = require('http').createServer(app)
  , io = require('socket.io').listen(server);

server.listen(8080);
server.configure(function() {
	server.use(express.static(__dirname + '/public'));
});

app.get('/', function (req, res) {
	res.sendfile(__dirname + '/index.html');
});

var Member = {
	memberList: {
		p46mKSli2j:
		   { id: 'p46mKSli2j',
		     firstName: 'Renan',
		     lastName: 'Gonçalves',
		     pictureUrl: 'http://m3.licdn.com/mpr/mprx/0_54wi7eKFz4gZfkGdFYEr7IAoBVecfFGdF0xy7IlZe0yFr_zWdOUf3wLnMNHHuhiLkRWj8uf7KGrz',
		     skills:
		      [ 'Development',
		        'Server Administration',
		        'Team Leadership',
		        'Open Source Development',
		        'PHP',
		        'CakePHP',
		        'MySQL',
		        'Apache',
		        'JavaScript',
		        'Flex',
		        'Bash',
		        'Linux',
		        'Git',
		        'jQuery',
		        'MVC',
		        'HTML5',
		        'Web Applications' ] }
	},

	search: function(skills) {
		var matches = {};
		for (var memberId in Member.memberList) {
			var member = Member.memberList[memberId];
			var joined = member.skills.join(' ');
			for (var key in skills) {
				var re = new RegExp(skills[key], 'i');
				console.log(joined, re);
				if (joined.match(re)) {
					matches[memberId] = member;
				}
			}
		}
		return matches;
	}
};

var Project = {
	projectList: {
		1: {
			name: 'PHP Test',
			duration: 24 * 21,
			skills: ['PHP', 'Apache', 'MySQL']
		},

		2: {
            img: 'https://www.gravatar.com/avatar/bdd950cb95810dc774a7836d86ef203',
			name: 'JavaScript Test',
			duration: 40,
			skills: ['JavaScript']
		}
	},

	search: function(skills) {
		var matches = {};
		for (var projectId in Project.projectList) {
			var project = Project.projectList[projectId];
			var joined = project.skills.join(' ');
			for (var key in skills) {
				var re = new RegExp(skills[key], 'i');
				console.log(joined, re);
				if (joined.match(re)) {
					matches[projectId] = project;
				}
			}
		}
		return matches;
	}
};

io.sockets.on('connection', function (socket) {

	socket.on('member-register', function(data) {
		Member.memberList[data.id] = data;
        var projects = Project.search(data.skills);
        socket.emit('project-results', projects);
	});

	socket.on('project-register', function(data) {
		Project.projectList[data.id] = data;
	});

});
