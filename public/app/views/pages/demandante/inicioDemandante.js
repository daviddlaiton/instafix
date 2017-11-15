document.write('\
<div class="page-header">\
	<h1>\
		Users\
		<a href="/users/create" class="btn btn-default">\
			<span class="glyphicon glyphicon-plus"></span>\
			New User\
		</a>\
	</h1>\
\
</div>\
\
<div class="jumbotron text-center" ng-show="user.processing">\
	<span class="glyphicon glyphicon-repeat spinner"></span>\
	<p>Loading Users...</p>\
</div>\
\
<table class="table table-bordered table-striped" ng-show="user.users">\
	<thead>\
		<tr>\
			<th>_idaaaa</th>\
			<th>Name</th>\
			<th>Username</th>\
			<th class="col-sm-2"></th>\
		</tr>\
	</thead>\
	<tbody>\
		<tr ng-repeat="person in user.users">\
			<td>{{ person._id }}</td>\
			<td>{{ person.name }}</td>\
			<td>{{ person.username }}</td>\
			<td class="col-sm-2">\
				<a ng-href="/users/{{ person._id }}" class="btn btn-danger">Edit</a>\
				<a href="#" ng-click="user.deleteUser(person._id)" class="btn btn-primary">Delete</a>\
			</td>\
		</tr>\
	</tbody>\
</table>\
');