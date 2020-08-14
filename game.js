
var timePassed = 0;
var highScore = 0;
var timeWithTooHighMW = 0;
var pos1 = 100; pos2 = 100; pos3 = 100;
var ka1now = 10; ka2now = 10; ka3now = 10;
var interval = null; timePassedInterval = null; isolatedIntervall = null;
var rate = (4 / 15);
var trinn = 1; var MW = 0;
var isolated1 = false; isolated2 = false; isolated3 = false;
var kvartsAmount = 2000; kullAmount = 2000; ironAmount = 2000;
var gameOverMessage = "";

function clickUp(key) { //method which moves the chosen electrode after pressing the electrode's up-button
    var offs = $('#el' + key).offset(); //retrieves the potition of the chosen electrode
    offs.top -= 5; //removing 5 pixels to the offset (pixels are counted from the top downwards)
    $('#el' + key).offset(offs); //giving the electrode the new position (5 pixels upwards)
    var holderLabel = $('#holder' + key); //gets the meter-label that belongs to the chosen electrode
    var kaLabel = $('#ka' + key); //gets the kA-label that belongs to the chosen electrode
    switch (key) { //depending on which electrode (1, 2 or 3) is chosen
        case '1':
            pos1 += 5; //adding 5 to the position variable 
            if (!isolated1) { //if the electrode i isolated it won't take more or less kA when it is moved
                ka1now -= 5;
            }
            holderLabel.text(pos1 + " m"); //setting the new position on the label (which displays a more human-friendly representation of the electrode's position, with default at 100 m above ground)
            kaLabel.text(ka1now + " kA");  //setting the new kA on the label
            break;
        case '2':
            pos2 += 5;
            if (!isolated2) {
                ka2now -= 5;
            }
            holderLabel.text(pos2 + " m");
            kaLabel.text(ka2now + " kA");
            break;
        case '3':
            pos3 += 5;
            if (!isolated3) {
                ka3now -= 5;
            }
            holderLabel.text(pos3 + " m");
            kaLabel.text(ka3now + " kA");
            break;
    }
}

function changeKA() { //method for changing the kA (is called every second after play-button has been pressed)
    if (!isolated1) { //if the electrode isn't isolated the kA-variable changes with a random number between 0 and 3
        ka1now += Math.round(Math.random() * 6 - 3); 
    }
    if (!isolated2) {
        ka2now += Math.round(Math.random() * 6 - 3);
    }
    if (!isolated3) {
        ka3now += Math.round(Math.random() * 6 - 3);
    }
    $('#ka1').text(ka1now + " kA"); //displaying the newly changed kA-value on the label
    $('#ka2').text(ka2now + " kA");
    $('#ka3').text(ka3now + " kA");
}

function clickDown(key) { //same as clickUp except it moves the electrod down and adds kA
    var offs = $('#el' + key).offset();
    offs.top += 5;
    $('#el' + key).offset(offs);
    var holderLabel = $('#holder' + key);
    var kaLabel = $('#ka' + key);
    switch (key) {
        case '1':
            pos1 -= 5;
            if (!isolated1) {
                ka1now += 5;
            }
            holderLabel.text(pos1 + " m");
            kaLabel.text(ka1now + " kA");
            break;
        case '2':
            pos2 -= 5;
            if (!isolated2) {
                ka2now += 5;
            }
            holderLabel.text(pos2 + " m");
            kaLabel.text(ka2now + " kA");
            break;
        case '3':
            pos3 -= 5;
            if (!isolated3) {
                ka3now += 5;
            }
            holderLabel.text(pos3 + " m");
            kaLabel.text(ka3now + " kA");
            break;
    }
}

function losingAction() { //method for checking if the state qualifies for game over
    var maxDiff = 25;
    if (MW > 20 && MW < 40) { //If MW higher than 20 than the maximum difference in kA on electrodes decreases to 20
        maxDiff = 20;
    } 
    if (MW >= 40) {
        maxDiff = 15;
    }
    if (Math.abs(ka1now - ka2now) > maxDiff || Math.abs(ka2now - ka3now) > maxDiff || Math.abs(ka1now - ka3now) > maxDiff) { //If the difference in kA between either of the kA electrodes is more than maxDiff
        gameOver(); //the owen turns automatically off and the gameOver()-method is called
        gameOverMessage = "The difference in kA between the electrodes was above " + maxDiff.toString() + "..";
    }
    if (pos1 > 140 || pos2 > 140 || pos3 > 140) {
        gameOver();
        gameOverMessage = "One of the electrodes positions was too high (above 135m)..";
    }
    
    if( pos1 < 20 || pos2 < 20 || pos3 < 20) { //If the position of the electrodes are more than 150m or less than 10m
        gameOver();
        gameOverMessage = "One of the electrodes positions was too low (below 20m)..";
    }

    if (ka1now > 200 || ka2now > 200 || ka3now > 200) {
        gameOver();
        gameOverMessage = "One of the electrodes kiloampere was too high (above 200)..";
    }

    if (ka1now < 0 || ka2now < 0 || ka3now < 0) { //if the kA on either of the electrodes is greater than 200kA 
        gameOver();
        gameOverMessage = "One of the electrodes kiloampere was too low (less than 0)..";
    }

    if (timeWithTooHighMW > 30) {
        gameOver();
        gameOverMessage = "The furnace was running too high (above 43MW) for too long..";
    }
}

function displayMessage(string) {
    $('#message').text(string); 
}

function clickCoal(key) { //method that is called when the user presses one of the three coal-buttons
    var value = 0;
    if (kullAmount > 0) { //if there is more coal left
        switch (key) {
            case '1':
                if (!isolated1) { //if electrode isn't isolated
                    ka1now += 10; //adding 10kA to the electrode
                }
                value = ka1now;
                break;
            case '2':
                if (!isolated2) {
                    ka2now += 10;
                }
                value = ka2now;
                break;
            case '3':
                if (!isolated3) {
                    ka3now += 10;
                }
                value = ka3now;
                break;
        }
        kullAmount -= 200; //removing 200kg from the coalAmount
        $('#kullAmount').text("Coal: " + kullAmount + " kg"); //displaying the new amount of coal to the label
        $('#ka' + key).text(value + " kA"); //displaying the new kA to the electrode's kA-label
    }
}

function play() { //method which is called when the user presses the play-button
    interval = setInterval(changeKA, 2000); //every 2000 milliseconds (= 2 seconds) the changeKA()-method is called
    timePassedInterval = setInterval(function () { //every second the methods inside {} is called. 
        timePassed += 1; //the timePassed-attribute holds the count of seconds that has passed while the game is on
        checkAchievedMW(); 
        calculateScore(); //The highScore-variable gets updated
        losingAction(); //Checks for a losing action/state 
        $('#labelTime').text("Time: " + timePassed + " seconds"); //The updated timePassed-attribute is displayed on the label each second
    }, 1000);
    isolatedIntervall = setInterval(function () {
        var nr = Math.ceil(Math.random() * 3); //every minute (60000 milliseconds) one of the electrodes (chosen randomly) gets isolated
        isolated(nr);
    }, 60000);
    $('.kull').each(function () { //Defines which method that will be called when a button with class="kull" is clicked
        this.onclick = function () {
            var key = this.dataset['index']; //Gets the data-index for which of the 3 coal-buttons that was pressed
            clickCoal(key); 
        };
    });
    $('.kvarts').each(function () {
        this.onclick = function () {
            var key = this.dataset['index'];
            clickQuartz(key);
        };
    });
    $('.up').each(function () {
        this.onclick = function () {
            var key = this.dataset['index'];
            clickUp(key);
        };
    });
    $('.down').each(function () {
        this.onclick = function () {
            var key = this.dataset['index'];
            clickDown(key);
        };
    });
    $('.iron').each(function () {
        this.onclick = function () {
            var key = this.dataset['index'];
            clickIron(key);
        };
    });
    $('.trinnUp').click(function () { //When the trinnUp-button is clicked
            if (trinn < 10) { //Maximum trinn is 10
                trinn += 1; 
                ka1now += 15; //kA increases with 15 on all electrodes
                ka2now += 15;
                ka3now += 15;
            }
            $('#labelTrinn').text("Step: " + trinn);
    });

    $('.trinnDown').click(function () { //When the trinnDown-button is clicked
            if (trinn > 1) {
                trinn -= 1;
                ka1now -= 15; //kA decreases with 15 on all electrodes
                ka2now -= 15;
                ka3now -= 15;
            }
            $('#labelTrinn').text("Step: " + trinn);
    });
}

function clickIron(key) { //method that is called when one of the iron-buttons is clicked
    if (ironAmount > 0) {
        ironAmount -= 200; //decreasing the amount of available iron with 100kg
        switch (key) {
            case '1':
                isolated1 = false; //sets the electrode where the iron was added back to normal / not isolated
                break;
            case '2':
                isolated2 = false;
                break;
            case '3':
                isolated3 = false;
                break;
        }
    }
    $('#ironAmount').text("Iron: " + ironAmount + " kg"); //updates the ironAmount-label
}

function isolated(nr) { //Method that is called every minute that sets on of the electrodes as isolated
    switch (nr) {
        case 1:
            isolated1 = true;
            break;
        case 2:
            isolated2 = true;
            break;
        case 3:
            isolated3 = true;
            break;
    }
}

function checkAchievedMW() { //Method that checks the MW
    MW = ((ka1now + ka2now + ka3now) / 3 * rate).toFixed(2);  //MW is calculated by the average kA on the eletrode times a given rate rounded to 2 decimals
    if (MW >= 40 && trinn > 1) { //Each second the achieved MW is bigger or as big as the goal the score increases by 20
        highScore += 20;
    }
    if (MW >= 20 && trinn > 1) { //Each second the achieved MW is above 20MW the score increases by 10
        highScore += 10;
    }
    if (MW >= 43 && trinn > 1) {
        timeWithTooHighMW += 1;
    }
    $('#achievedMW').text("Achieved: " + MW + " MW"); 
}

function calculateScore() { //updates the score every second
    if (trinn > 1) {
        highScore += 1;
    }
    $('#score').text("Your score:  " + highScore);
}

function pause() { //Method that is called when pause-button is clicked
    window.clearInterval(interval); //clear all time-intervals
    window.clearInterval(timePassedInterval);
    $('.imageButtons').each(function () { //disables all buttons except the play-button so that the state doesn't change if the user clicks on them during a pause
        this.onclick = null;
    });
}

function gameOver() { //Method that is called when an action or a state makes the game end
    window.clearInterval(interval); //time-intervals are cleared
    window.clearInterval(timePassedInterval);
    $('.imageButtons').each(function () { //all buttons are disabled
        this.onclick = null;
    });
    $('.pausePlayButton').each(function () {
        this.onclick = null;
    });
    $('#gameOver').text("Game Over!"); //A previously hidden label is given a "Game Over"-text
    $('.saveScore').click(function () { //The saveScore-button is enabled and will call the saveScore()-method when clicked
            saveScore();
    });
    document.getElementById("againButton").style.display = "block";
    $('.againButton').click(function () {
        document.location.reload();
        //confirm(gameOverMessage);
    });
}

function saveScore() { //Method that is called when the user clicks on the "save score"-button
    var initialText = "Nickname here (max. 10 letters)";
    var name = window.prompt("Enter your name to save your score!", initialText); //A prompt apears on the screen with an input-field for the user to write his/her nickname
    if (name != initialText && name.length > 1) { //Nickname must containt more than 1 character and not be the default text
        if (name.length > 10) { //shortens the length of the nickname if it is longer than 10 characters
            name = name.substring(0, 10);
        }
        var record = {
            rec_name: name,
            rec_score: highScore,
            rec_time: timePassed
        };
        $.post("saveScore.php", record, seeTopList);
        
    } else { //If the nickname isn't valid an alert-box apears with a message 
        alert("You need to give a name with at least 2 letters to save!");
        saveScore(); //the method calls itself again until user input is valid or the user clicks cancel
    }
}

function seeTopList() { //Method that is called on the initial uploading of the site as well as after a new score is added.
    var stamp = (new Date()).getTime();
    $.get('loadScoreTable.php?stamp=' + stamp, function (data) {
        $("#panelTopList").html(data);
    });
}

function showGameDescription() {
    var modal = document.getElementById("myModal");
    modal.style.display = "block";
    var span = document.getElementsByClassName("close")[0];
    span.onclick = function () {
        modal.style.display = "none";
    }
}

function clickQuartz(key) { //same as clickCoal except the kA decreases by 10

    var value = 0;
    if (kvartsAmount > 0) {
        switch (key) {
            case '1':
                if (!isolated1) {
                    ka1now -= 10;
                }
                value = ka1now;
                break;
            case '2':
                if (!isolated2) {
                    ka2now -= 10;
                }
                value = ka2now;
                break;
            case '3':
                if (!isolated3) {
                    ka3now -= 10;
                }
                value = ka3now;
                break;
        }
        kvartsAmount -= 200;
        $('#kvartsAmount').text("Quartz: " + kvartsAmount + " kg");
        $('#ka' + key).text(value + " kA");
    }
}

function init() { //Values of the different labels at initialization of the site (before gamestart)
    $('#ka1').text("10 kA");
    $('#ka2').text("10 kA");
    $('#ka3').text("10 kA");
    $('#holder1').text("100 m");
    $('#holder2').text("100 m");
    $('#holder3').text("100 m");
    $('#labelTrinn').text("Step: 1");
    $('#labelTime').text("Time: 0 seconds");
    $('#goalMW').text("Goal: 40 MW");
    $('#achievedMW').text("Achieved: 0 MW");
    $('#kullAmount').text("Coal: 2000 kg");
    $('#kvartsAmount').text("Quartz: 2000 kg");
    $('#ironAmount').text("Iron: 2000 kg");
    $('.questionButton').click(function () {
        showGameDescription();
    });
}
$(document).ready(init);
$(document).ready(seeTopList);