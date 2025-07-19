// app.js
const app = angular.module('emailApp', []);

app.controller('MainController', function($scope, $http) {
    $scope.user = {};
    $scope.responseMessage = '';
    $scope.isSuccess = false;

    $scope.subscribe = function() {
        $scope.responseMessage = ''; // Clear previous message
        
        // POST request to the Node.js backend
        $http.post('http://localhost:3000/api/subscribe', $scope.user)
            .then(function(response) {
                // Success
                $scope.isSuccess = true;
                $scope.responseMessage = response.data.message;
                console.log('Preview the email at: ' + response.data.previewURL);
                $scope.user = {}; // Clear the form
            })
            .catch(function(error) {
                // Error
                $scope.isSuccess = false;
                $scope.responseMessage = error.data ? error.data.message : 'Could not connect to the server.';
                console.error('Error:', error);
            });
    };
});