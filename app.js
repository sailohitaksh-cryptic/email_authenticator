// app.js (Auth App)
const app = angular.module('authApp', []);

app.controller('AuthController', function($scope, $http, $interval) {
    // --- Scope Variables ---
    $scope.viewState = 'enterEmail'; 
    $scope.user = {};
    $scope.responseMessage = '';
    $scope.isSuccess = false;
    $scope.resendTimer = 0;
    let countdownInterval = null;

    // --- Timer Function ---
    function startTimer() {
        // Cancel any existing timer
        if (countdownInterval) {
            $interval.cancel(countdownInterval);
        }
        $scope.resendTimer = 15;
        countdownInterval = $interval(function() {
            $scope.resendTimer--;
            if ($scope.resendTimer <= 0) {
                $interval.cancel(countdownInterval);
            }
        }, 1000, 15); 
    }

    // --- Step 1: Send the verification code ---
    $scope.sendCode = function() {
        $scope.responseMessage = ''; // Clear previous message
        $http.post('http://localhost:3000/api/send-code', { email: $scope.user.email })
            .then(function(response) {
                $scope.viewState = 'enterCode';
                $scope.isSuccess = true;
                $scope.responseMessage = response.data.message;
                startTimer();
            })
            .catch(function(error) {
                $scope.isSuccess = false;
                $scope.responseMessage = error.data ? error.data.message : 'Could not connect to the server.';
            });
    };

    // --- Resend Code Function ---
    $scope.resendCode = function() {
        if ($scope.resendTimer > 0) return; // Prevent clicking while timer is active
        $scope.sendCode(); // Just call the original function
    };

    // --- Step 2: Verify the code ---
    $scope.verifyCode = function() {
        $scope.responseMessage = ''; // Clear previous message
        $http.post('http://localhost:3000/api/verify-code', { email: $scope.user.email, code: $scope.user.code })
            .then(function(response) {
                $scope.isSuccess = true;
                $scope.responseMessage = response.data.message;
                $scope.viewState = 'success'; // Switch to the success checkmark view
                $interval.cancel(countdownInterval); // Stop the timer
            })
            .catch(function(error) {
                $scope.isSuccess = false;
                $scope.responseMessage = error.data ? error.data.message : 'Invalid request.';
                $scope.user.code = ''; // Clear the wrong code
            });
    };
    
    // --- Utility to go back to the first step ---
    $scope.resetView = function() {
        $scope.viewState = 'enterEmail';
        $scope.user = {};
        $scope.responseMessage = '';
        $scope.isSuccess = false;
        $interval.cancel(countdownInterval); // Stop any running timer
    };

    // Clean up the interval if the scope is destroyed
    $scope.$on('$destroy', function() {
        if (countdownInterval) {
            $interval.cancel(countdownInterval);
        }
    });
});
