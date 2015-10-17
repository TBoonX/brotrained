var app = angular.module('brotrained');

app.controller('maincontroller', ['$scope', function($scope, $localStorage, $sessionStorage) {
    $scope.days = [{id:1,date:(new Date()),name:"first set"},{id:2,date:(new Date()),name:"second set"}];
    $scope.sets = [{id:1,day:1,weight:undefined,name:"Liegestütze",repetitions:15,order:14},{id:2,day:1,weight:5,name:"Bizeps im Stehen",repetitions:18,order:2},
                   {id:3,day:2,weight:undefined,name:"Liegestütze",repetitions:16,order:1},{id:4,day:2,weight:10,name:"Bizeps im Stehen",repetitions:12,order:2}];
    
    $scope.setDayName = false;
    $scope.order = 1;
    $scope.currentSet = {};
    $scope.currentDay = undefined;
    
    $scope.getWeigth = function(weight) {
        if (weight === undefined || weight === null)
            return "";
        
        return "("+weight+"kg)";
    };
    
    
    $scope.getNewId = function() {
        var id = 0;
        $scope.days.forEach(function(day) {
            if (day.id > id)
                id = day.id;
        });
        
        return id+1;
    };
    
    $scope.createNewDay = function() {
        $scope.order = 1;
        
        $scope.currentDay = new Object();
        $scope.currentDay.id = $scope.getNewId();
        $scope.currentDay.date = new Date();
        
        // show input for name
        $scope.setDayName = true;
        
        //save it
        $scope.days.push($scope.currentDay);
        
        console.log($scope.currentDay);
    };
    
    $scope.getSetsOfDay = function(id) {
        var sets = [];
        $scope.sets.forEach(function(set) {
            if (set.day == id)
                sets.push(set);
        });
        return sets;
    };
    
    $scope.saveSet = function() {
        $scope.currentSet.day = $scope.currentDay.id;
        $scope.currentSet.order = $scope.order;
        $scope.order = $scope.order + 1; 
        $scope.sets.push($scope.currentSet);
        $scope.currentSet = new Object();
    };
}]);