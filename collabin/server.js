var app = require('express')()
  , server = require('http').createServer(app)
  , io = require('socket.io').listen(server)
  , uuid = require('node-uuid');

server.listen(8080);

app.get('/', function (req, res) {
	res.sendfile(__dirname + '/index.html');
});

var routers = [
    '/img/bg_blue.png',
	'/img/bg.png',
	'/img/bg_dark.png',
	'/img/bg_dark2.png',
	'/img/bg_dark3.png',
	'/img/dash_sprites.png',
	'/img/favicon.png*',
	'/img/iPhone5.png',
	'/img/icons.png',
	'/img/loading.gif',
	'/img/login_sprites.png',
	'/img/login_sprites_.png'
];
var connectRoute = function(file) {
	app.get(file, function (req, res) {
        res.sendfile(__dirname + file);
    });
};

for (var key in routers) {
    connectRoute(routers[key]);
}

var Member = {
	mapping: {},

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
			memberId: 'p46mKSli2j',
			name: 'PHP Test',
			duration: 24 * 21,
			skills: ['PHP', 'Apache', 'MySQL']
		},

		2: {
			img: 'https://www.gravatar.com/avatar/bdd950cb95810dc774a7836d86ef203',
			name: 'JavaScript Test',
			duration: 40,
			skills: ['JavaScript']
		},

		3: {
            img: 'https://www.gravatar.com/avatar/bdd950cb95810dc774a7836d86ef203',
			name: 'Web Designer',
			duration: 40,
			skills: ['photoshop']
		}
	},

	search: function(skills) {
		var matches = {};
		for (var projectId in Project.projectList) {
			var project = Project.projectList[projectId];
			var joined = project.skills.join(' ');
			for (var key in skills) {
				var re = new RegExp(skills[key], 'i');
				if (joined.match(re)) {
					matches[projectId] = project;
				}
			}
		}
		return matches;
	},

	fromMember: function(memberId) {
		var projects = {};
		for (var id in Project.projectList) {
			var project = Project.projectList[id];
			var members = Member.search(project.skills);

			if (project.memberId === memberId) {
				project.members = 0;
				for (var key in members) {
					project.members++;
				}

				projects[id] = project;
			}
		}
		return projects;
	}
};

io.sockets.on('connection', function (socket) {

	socket.on('member-register', function(data) {
		Member.memberList[data.id] = data;
		Member.mapping[socket.id] = data.id;

        var projects = Project.search(data.skills);
        socket.emit('project-results', projects);
        
        var myProjects = Project.fromMember(data.id);
        socket.emit('myproject-results', myProjects);
	});

	socket.on('project-register', function(data) {
		var memberId = Member.mapping[socket.id];

		data.id = uuid.v4();
		data.memberId = memberId;
		Project.projectList[data.id] = data;

		var member = Member.memberList[memberId];
		var projects = Project.search(member.skills);
        socket.emit('project-results', projects);

		var myProjects = Project.fromMember(memberId);        
        socket.emit('myproject-results', myProjects);
	});

});
