var SENSORS = (function() {
    var touchSensor = false;
    var ultrasonicSensor = 0;
    var colorSensor = undefined;
    var lightSensor = 0;
    var timeSensor = 0 ;
    


    function isPressed() {
        return touchSensor;
    }

    function setTouchSensor(value) {
        touchSensor = value;
    }

    function getUltrasonicSensor() {
        return ultrasonicSensor;
    }

    function setUltrasonicSensor(value) {
        ultrasonicSensor = value;
    }

    function setColor(value) {
        colorSensor = value;
    }

    function getColor() {
        return colorSensor;
    }

    function setLight(value) {
        lightSensor = value;
    }

    function getLight() {
        return lightSensor;
    }
    
    function setTime(value) {
    	timeSensor = value;
    }

    function getTime() {
        return timeSensor;
    }
    
  

    return {
        "isPressed" : isPressed,
        "setTouchSensor" : setTouchSensor,
        "getUltrasonicSensor" : getUltrasonicSensor,
        "setUltrasonicSensor" : setUltrasonicSensor,
        "setColor" : setColor,
        "getColor" : getColor,
        "setLight" : setLight,
        "getLight" : getLight,
        "setTime" : setTime, 
        "getTime" : getTime
    };
})();

var ACTORS = (function() {
    var distanceToCover = false;
    var leftMotor = new Motor();
    var rightMotor = new Motor();
    var timer = new Timer() ;
    var isRunningTimer = false ;
    
    function getLeftMotor() {
        return leftMotor;
    }

    function getRightMotor() {
        return rightMotor;
    }

    function setSpeed(speed, direction) {
        if (direction != FOREWARD) {
            speed = -speed;
        }
        leftMotor.setPower(speed);
        rightMotor.setPower(speed);
    }

    function setAngleSpeed(speed, direction) {
        if (direction == LEFT) {
            leftMotor.setPower(-speed);
            rightMotor.setPower(speed);
        } else {
            leftMotor.setPower(speed);
            rightMotor.setPower(-speed);
        }
    }

    function resetTacho(leftMotorValue, rightMotorValue) {
        leftMotor.startRotations = leftMotorValue / 360.;
        rightMotor.startRotations = rightMotorValue / 360.;
        leftMotor.currentRotations = 0;
        rightMotor.currentRotations = 0;
    }

    function Motor() {
        this.power = 0;
        this.stopped = false;
        this.startRotations = 0;
        this.currentRotations = 0;
        this.rotations = 0;
    }
    
    function Timer(){
    	
    	this.stopped = false ;
    	this.startTime = 0 ;
    	this.currentTime = 0 ;
    	this.time =  0 ;
    }
    
    function resetTimer(timeValue){
    	timer.startTime = timeValue ;
    	timer.currentTime = 0 ;
    	
    	
    	
    }
    
    function setTime(goalTime){
    	timer.time = goaltime
    	
    	
    }
    
    function getTimer(){
    	
    	return timer ;
    }

    Motor.prototype.getPower = function() {
        return this.power;
    };

    Motor.prototype.setPower = function(value) {
        this.power = value;
    };

    Motor.prototype.isStopped = function() {
        return this.stopped;
    };

    Motor.prototype.setStopped = function(value) {
        this.stopped = value;
    };

    Motor.prototype.getCurrentRotations = function() {
        return this.currentRotations;
    };

    Motor.prototype.setCurrentRotations = function(value) {
        this.currentRotations = Math.abs(value / 360. - this.startRotations); 
    };

    Motor.prototype.getRotations = function() {
        return this.rotations;
    };

    Motor.prototype.setRotations = function(value) {
        this.rotations = value;
    };
    
    Timer.prototype.setStopped = function(value) {
    	this.stopped = value;
    };
    
    Timer.prototype.isStopped = function() {
    	 return this.stopped;
    };
    
    Timer.prototype.setStartTime= function(value) {
    	this.startTime = value;
    };
    
    Timer.prototype.getStartTime= function() {
    	 this.startTime  ;
    };

    
    Timer.prototype.setCurrentTime= function(value) {
    	this.currentTime = Math.abs(value - this.startTime);
    };
    
    Timer.prototype.getCurrentTime= function() {
    	 this.currentTime  ;
    };

    
    Timer.prototype.setTime= function(value) {
    	this.Time = value;
    };
    
    Timer.prototype.getTime= function() {
    	 this.Time  ;
    };

    
    
    function toString() {
        return JSON.stringify([ distanceToCover, leftMotor, rightMotor ]);
    }

    function calculateCoveredDistance() {
        if (distanceToCover) {
            //console.log("left " + getLeftMotor().getCurrentRotations());
            if (getLeftMotor().getCurrentRotations() > getLeftMotor().getRotations()) {
                getLeftMotor().setPower(0);
            }

            //console.log("right " + getRightMotor().getCurrentRotations());
            if (getRightMotor().getCurrentRotations() > getRightMotor().getRotations()) {
                getRightMotor().setPower(0);
            }

            if (getLeftMotor().getCurrentRotations() > getLeftMotor().getRotations() && getRightMotor().getCurrentRotations() > getRightMotor().getRotations()) {
                distanceToCover = false;
                PROGRAM_SIMULATION.setNextStatement(true);
            }
        }
    }
    
    
    
    function calculateWishedTime(){
    	if(isRunningTimer){
    	
	    	if(getTimer().getCurrentTime() > getTimer().getTime()){
	    		  isRunningTimer = false;
	              PROGRAM_SIMULATION.setNextStatement(true);
	    		
	    	}
    	}
    }

    function clculateAngleToCover(angle) {
        extraRotation = TURN_RATIO * (angle / 720.);

        getLeftMotor().setRotations(extraRotation);
        getRightMotor().setRotations(extraRotation);

        distanceToCover = true;
        PROGRAM_SIMULATION.setNextStatement(false);
    }

    function setDistanceToCover(distance) {
        var rotations = distance / (WHEEL_DIAMETER * 3.14);
        leftMotor.setRotations(rotations);
        rightMotor.setRotations(rotations);
        distanceToCover = true;
        PROGRAM_SIMULATION.setNextStatement(false);
    }

    return {
        "getLeftMotor" : getLeftMotor,
        "getRightMotor" : getRightMotor,
        "setSpeed" : setSpeed,
        "setAngleSpeed" : setAngleSpeed,
        "resetTacho" : resetTacho,
        "calculateCoveredDistance" : calculateCoveredDistance,
        "clculateAngleToCover" : clculateAngleToCover,
        "setDistanceToCover" : setDistanceToCover,
        "toString" : toString,
        "calculateWishedTime" : calculateWishedTime
    };
})();

var MEM = (function() {
    var memory = {};

    function decl(name, init) {
        if (memory[name] != undefined) {
            throw "Variable " + name + " is defined!";
        }
        if (init == undefined) {
            throw "Variable " + name + " not initialized!";
        }
        memory[name] = init;
    }

    function assign(name, value) {
        if (memory[name] == undefined) {
            throw "Variable " + name + " is undefined!";
        }
        if (value == undefined) {
            throw "Variable " + name + " not assigned!";
        }
        memory[name] = value;
    }

    function get(name) {
        if (memory[name] == undefined) {
            throw "Variable " + name + " is undefined!";
        }

        return memory[name];
    }

    function clear() {
        memory = {};
    }

    function toString() {
        return JSON.stringify(memory);
    }

    return {
        "decl" : decl,
        "assign" : assign,
        "get" : get,
        "clear" : clear,
        "toString" : toString
    };
})();

var PROGRAM_SIMULATION = (function() {
    var program = [];
    var nextStatement = true;
    var wait = false;

    function set(newProgram) {
        program = newProgram;
    }

    function isTerminated() {
        return program.length == 0 && PROGRAM_SIMULATION.isNextStatement();
    }

    function get() {
        if (program.length == 0) {
            throw "Program is empty!";
        }
        return program[0];
    }

    function getRemove() {
        if (program.length == 0) {
            throw "Program is empty!";
        }
        var statement = program[0];
        program = program.slice(1, program.length);
        return statement;
    }

    function prepend(programPrefix) {
        if (programPrefix != undefined) {
            program = programPrefix.concat(program);
        }
    }

    function isWait() {
        return wait;
    }

    function setWait(value) {
        wait = value;
    }

    function isNextStatement() {
        return nextStatement;
    }

    function setNextStatement(value) {
        nextStatement = value;
    }

    function toString() {
        return program;
    }

    return {
        "set" : set,
        "isTerminated" : isTerminated,
        "get" : get,
        "getRemove" : getRemove,
        "prepend" : prepend,
        "isWait" : isWait,
        "setWait" : setWait,
        "isNextStatement" : isNextStatement,
        "setNextStatement" : setNextStatement,
        "toString" : toString
    };
})();

var LIGHT = (function() {
    var color = "";
    var mode = OFF;

    function setColor(value) {
        color = value
    }

    function setMode(value) {
        mode = value;
    }

    function getColor() {
        return color;
    }

    function getMode() {
        return mode;
    }

    function toString() {
        return JSON.stringify([ color, mode ]);
    }

    return {
        "setColor" : setColor,
        "setMode" : setMode,
        "getColor" : getColor,
        "getMode" : getMode,
        "toString" : toString
    };
})();