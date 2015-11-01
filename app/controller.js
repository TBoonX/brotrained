//var app = angular.module('brotrained');

app.controller('maincontroller', function($scope, $localStorage, $sessionStorage) {
    $scope.$storage = $localStorage;

    if ($scope.$storage.days == undefined || $scope.$storage.days == null)  {
        $scope.$storage.days = [];
    }
    if ($scope.$storage.sets == undefined || $scope.$storage.sets == null)  {
        $scope.$storage.sets = [];
    }
    
    $scope.setDayName = false;
    $scope.order = 1;
    $scope.currentSet = {};
    $scope.currentDay = undefined;
    
    $scope.getWeight = function(weight) {
        if (weight === undefined || weight === null)
            return "";
        
        return "("+weight+"kg)";
    };
    
    
    $scope.getNewId = function() {
        var id = 0;
        $scope.$storage.days.forEach(function(day) {
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
        $scope.$storage.days.push($scope.currentDay);
        
        console.log($scope.currentDay);
    };
    
    $scope.getSetsOfDay = function(id) {
        var sets = [];
        $scope.$storage.sets.forEach(function(set) {
            if (set.day == id)
                sets.push(set);
        });
        return sets;
    };
    
    $scope.saveSet = function() {
        if ($scope.currentSet.name == undefined || $scope.currentSet.name == null || $scope.currentSet.name == "")
            return;
        
        $scope.currentSet.day = $scope.currentDay.id;
        $scope.currentSet.order = $scope.order;
        $scope.currentSet.date = new Date();
        $scope.order = $scope.order + 1; 
        $scope.$storage.sets.push($scope.currentSet);
        $scope.currentSet = new Object();
    };
    
    $scope.getTime = function(date) {
        var days = ["So","Mo","Di","Mi","Do","Fr","Sa"];
        
        if (typeof date == "string")
            date = new Date(date);
        
        return days[date.getDay()] + " " + date.toLocaleString();
    };
    
    $scope.printJsons = function() {
        console.log("days:");
        console.log(angular.toJson($scope.$storage.days));
        console.log("sets:");
        console.log(angular.toJson($scope.$storage.sets));
        
        //create object
        var workout = {
            days: $scope.$storage.days,
            sets: $scope.$storage.sets
        };
        //create file
        var filename = "workout.json";
        var b=document.createElement('a');
        b.download=filename;
        b.textContent=filename;
        b.href='data:application/json;base64,'+
            window.btoa(unescape(encodeURIComponent(angular.toJson(workout))));
        //download file
        var e=document.createEvent('Events');
        e.initEvent('click',true,false);
        b.dispatchEvent(e);
    };
    
    $scope.reuseSet = function(set) {
        $scope.currentSet = angular.copy(set);
    };

    $scope.reuseDay = function(day) {
        $scope.currentDay = angular.copy(day);
        $scope.$storage.sets.forEach(function(set) {
            if (set.day == $scope.currentDay.id)
                if (set.order > $scope.order)
                    $scope.order = set.order+1;
        });
    };
    $scope.hideSetsOfDay = function(day) {
        var hidden = false;
        hidden = day.hidden;
        if (hidden === true)
            day.hidden = undefined;
        else
            day.hidden = true;
    };
    
    $scope.saveSetAgain = function(set) {
        set.edit = undefined;
    };
    
    $scope.deleteSet = function(set) {
        $scope.$storage.sets.pop(set);
        set = new Object();
    };
    
    $scope.up = function(set) {
        if (set.order == 1)
            return;
        
        var i = set.order-1;
        while (i > 0) {
            var upableSet = getSetWithOrderAndDay(i, set.day);
            
            if (upableSet != false)
            {
                upableSet.order = i+1;
                set.order = i;

                break;
            }
            
            i = i -1 ;
        }
    };

    $scope.down = function(set) {
        var highestOrder = getHighestOrderOfDay(set.day);

        if (set.order >= highestOrder)
            return;

        var i = set.order+1;

        while (i <= highestOrder) {
            var downableSet = getSetWithOrderAndDay(i, set.day);

            if (downableSet != false)
            {
                downableSet.order = i-1;
                set.order = i;

                break;
            }

            i = i+1;
        }
    };
    
    var getHighestOrderOfDay = function(id) {
        var order = 1;
        $scope.$storage.sets.forEach(function(set) {
            if (set.day == id && set.order > order)
                order = set.order;
        });
        return order;
    };
    
    var getSetWithOrderAndDay = function(order, id) {
        var ret = false;
        $scope.$storage.sets.forEach(function(set) {
            if (set.day == id && set.order == order)
                ret = set;
        });
        return ret;
    };
    
    var loadSelectedFile = function(evt) {
        var files = evt.target.files; // FileList object
        console.log(evt);
        // Loop through the FileList
        for (var i = 0, f; f = files[i]; i++) {
            console.log(f);
            // Only process json
            if (!f.name.endsWith('.json')) {
                continue;
            }

            var reader = new FileReader();

            // Closure to capture the file information.
            reader.onload = (function(theFile) {
                return function(e) {
                    var json;
                    try {
                        var str = atob(e.target.result.substring(13, e.target.result.length));
                        str = decodeURIComponent(escape(str));
                        console.log(str);
                        json = JSON.parse(str);
                        console.log(json);
                    }
                    catch(err) {
                        json = {};
                    }
                    if (json.days == undefined || json.sets == undefined)
                    {
                        alert("Falsche Datei!");
                        return;
                    }
                    
                    $scope.$storage.sets = json.sets;
                    $scope.$storage.days = json.days;
                    
                    location.reload();
                };
            })(f);

            // Read in the image file as a data URL.
            reader.readAsDataURL(f);
        }
    };

    document.getElementById('file').addEventListener('change', loadSelectedFile, false);
});

//'angular-chartist'
app.controller('chartcontroller', function($scope, $localStorage, $sessionStorage) {

    $scope.$storage = $localStorage;
    
    if ($scope.$storage.chart == undefined || $scope.$storage.chart == null)  {
        $scope.$storage.chart = {};
    }
    if ($scope.$storage.chart.days == undefined || $scope.$storage.chart.days == null)  {
        $scope.$storage.chart.days = [];
    }
    
    // line chart
    $scope.$storage.chart.lineData = {
        labels: ['dummy'],
        series: [
            [0, 1]
        ]
    };

    this.lineOptions = {
        axisX: {
            labelInterpolationFnc: function(value) {
                return value;
            }
        }
    };
    
    this.setsForGraph = "";
    
    this.update = function() {
        console.log("update chart");

        $scope.$storage.chart.days = [];
        $scope.$storage.days.forEach(function(day) {
            $scope.$storage.chart.days.push(day.name+"<br>"+(new Date(day.date.toString())).toLocaleString());
        });

        $scope.$storage.chart.lineData = {
            labels: $scope.$storage.chart.days,
            series: [] //$scope.$storage.chart.data
        };
        
        var setnames = this.setsForGraph.split(", ");
        var filterSets = true;
        
        if (setnames.length < 1 || ( setnames.length == 1 && setnames[0] == "" ) )
            filterSets = false;
        
        var data = $scope.$storage.sets
            .reduce(function(prev, el, i, cont) {
                if (filterSets && -1 != $.inArray(el.name, setnames))
                {    
                    prev.push({day: el.day, index:el.name+" "+(el.weight>0 ? el.weight : '0')+"kg", repetitions:el.repetitions});
                }
                else if (!filterSets && el.repetitions > 0)
                {    
                    prev.push({day: el.day, index:el.name+" "+(el.weight>0 ? el.weight : '0')+"kg", repetitions:el.repetitions});
                }
                return prev;
            }, [])
            .reduce(function(previousValue, currentValue, i, cont) {
                if (previousValue.length == 0)
                    console.log(cont);
                
                var given = false;
                previousValue.forEach(function(e) {
                    if (e.index == currentValue.index && e.day == currentValue.day)
                    {
                        e.repetitions = (e.repetitions + currentValue.repetitions) / 2;
                        given = true;
                    }
                });
                if (!given) {
                    previousValue.push(currentValue);
                }
                return previousValue;
            }, [])
            .reduce(function(previousValue, currentValue, i, cont) {
                if (currentValue == undefined)
                    return previousValue;
                var index = currentValue.index;
                if (previousValue[index] == undefined || previousValue[index] == null)
                    previousValue[index] = [];

                previousValue[index][currentValue.day] = currentValue.repetitions;

                return previousValue;
            }, {});
        
        $scope.$storage.chart.series = [];
        
        for (var index in data) {
            if (data.hasOwnProperty(index)) {
                $scope.$storage.chart.series.push({name: index, data: data[index]});
            }
        }
        
        $scope.$storage.chart.lineData.series = $scope.$storage.chart.series;
        
        console.log(data);
        console.log($scope.$storage.chart.series);
    };
    
    var $chart = $('.ct-chart');

    var $toolTip = $chart
    .append('<div class="tooltip2"></div>')
    .find('.tooltip2')
    .hide();

    $chart.on('mouseenter', '.ct-point', function(a) {
        var $point = $(this),
            value = $point.attr('ct:value');
        //console.log($point);
        var position = $point.position();
        var seriesName = $point.parent().attr('ct:series-name');
        console.log(seriesName);
        $toolTip.css("position","absolute");
        $toolTip.css("floating","true");
        $toolTip.css("left", position.left+"px");
        $toolTip.css("top", position.top);
        $toolTip.html(seriesName + '<br>' + value).show();
    });

    $chart.on('mouseleave', '.ct-point', function() {
        $toolTip.hide();
    });

    $chart.on('mousemove', function(event) {
        $toolTip.css({
            left: (event.offsetX || event.originalEvent.layerX) - $toolTip.width() / 2 - 10,
            top: (event.offsetY || event.originalEvent.layerY) - $toolTip.height() - 40
        });
    });
});