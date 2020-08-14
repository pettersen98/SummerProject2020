 google.charts.load("current", { packages: ["corechart"] });
        google.charts.setOnLoadCallback(function () {
            drawPieChart();
        });

        var maxHeight = 14;
        var warningMaxHeight = 13;
        var minHeight = 6.5;
        var warningMinHeight = 7;
        var siloRadius = 3;
        var rho = 640;
        var coneHeight = 7;
        var coneOpeningRadius = 0.125;
        var rate = (2.05 / 16);
        var totalHeight = 15;

        document.addEventListener("DOMContentLoaded", function () {
            setText('labelHeight1', 'labelSpace1', getHeight1());
            setText('labelHeight2', 'labelSpace2', getHeight2());
            setText('labelHeight3', 'labelSpace3', getHeight3());
        });

        function setText(label1, label2, height) {

            document.getElementById(label1).innerHTML = "Height: " + height.toFixed(2).toString() + " [m]";
            var space = totalHeight - height;
            if (space < 0) {
                space = 0;
            }
            document.getElementById(label2).innerHTML = "Space: " + space.toFixed(2).toString() + " [m]";

            if (height > maxHeight || height < minHeight) {
                document.getElementById(label1).style.backgroundColor = '#FF8080';
                document.getElementById(label2).style.backgroundColor = '#FF8080';
            } else if (height > warningMaxHeight || height < warningMinHeight) {
                document.getElementById(label1).style.backgroundColor = '#FFC780';
                document.getElementById(label2).style.backgroundColor = '#FFC780';
            }
        }

        function calculateTonn(height) { //Calculating the mass of the dust based on the height
            var amount = 0;
            if (height < coneHeight) {
                amount = volumeOfCone(height) * (rho / 1000);
            } else if (height > totalHeight) {
                amount = (areaOfSylinder() * sylinderHeight + volumeOfCone(coneHeight)) * (rho / 1000);
            } else {
                amount = ((areaOfSylinder() * (height - coneHeight)) + volumeOfCone(coneHeight)) * (rho / 1000);
            }
            return amount;
        }

        function drawPieChart() { //Creating the pie-charts based on the amount (mass) of dust in each silo

            var amount1 = calculateTonn(getHeight1());
            var amount2 = calculateTonn(getHeight2());
            var amount3 = calculateTonn(getHeight3());

            var data = google.visualization.arrayToDataTable([
                ['Silo', 'Amount'],
                ['Silo 1', amount1],
                ['Silo 2', amount2],
                ['Silo 3', amount3]
            ]);

            var options = {
                pieHole: 0.4,
                colors: ['#88EB85', '#D385EB', '#FF9966'],
                pieSliceText: 'value',
                chartArea: { width: 345, height: 470 }
            };
            document.getElementById('labelTonn').innerHTML = (amount1 + amount2 + amount3).toFixed(2).toString() + " [tonn]";
            var chart = new google.visualization.PieChart(document.getElementById('donutchart'));
            chart.draw(data, options);
        }

        google.charts.load('current', { 'packages': ['corechart'] });
        google.charts.setOnLoadCallback(function () {
            drawAreaChart('areaChart1', 'checkSilo1', getHeight1());
            drawAreaChart('areaChart2', 'checkSilo2', getHeight2());
            drawAreaChart('areaChart3', 'checkSilo3', getHeight3());
        });

        function drawNewCharts() {
            drawAreaChart('areaChart1', 'checkSilo1', getHeight1());
            drawAreaChart('areaChart2', 'checkSilo2', getHeight2());
            drawAreaChart('areaChart3', 'checkSilo3', getHeight3());
        };

        function drawAreaChart(chartID, checkBoxID, height) { //Creating the area-charts based on the height of a silo

            var rateEachSilo = rate + extraFire();
            if (nrSilosInUse() != 0) {
                rateEachSilo = (rate + extraFire()) / nrSilosInUse();
            }
            var checkBox = document.getElementById(checkBoxID);
            if (height > 15) {
                checkBox.disabled = true;
            }
            var chartData = [];
            var space = totalHeight - height;
            var maxValue = Math.ceil(space) + 1;
            if (!checkBox.checked) {
                for (i = 0; i < 48; i++) {
                    chartData.push(space);
                }
            } else {
                while (space > -0.5) {
                    chartData.push(space);
                    space -= rateEachSilo;
                }
            }

            var data = new google.visualization.DataTable();
            data.addColumn('date', 'Time of day');
            data.addColumn('number', '[m]');
            data.addColumn({ 'type': 'string', 'role': 'tooltip', 'p': { 'html': true } });
            var dateData = [];
            var today = new Date();
            for (i = 0; i < chartData.length; i++) {
                var newDate = new Date(today);
                newDate.setHours(today.getHours() + i);
                dateData.push(newDate);
            }

            for (i = 0; i < chartData.length; i++) {
                data.addRow([dateData[i], chartData[i], "At: " + dateData[i].newDateFormat() + "   " + chartData[i].toFixed(2).toString() + " [m]"]);
            }
            var options = {
                vAxis: {
                    minValue: 0,
                    gridlines: { count: 6 },
                    viewWindowMode: 'explicit',
                    viewWindow: { max: maxValue, min: - 0.5 },
                },
                hAxis: { format: 'HH:mm \n dd/M' },
                tooltip: { isHtml: true }
            };
            var chart = new google.visualization.AreaChart(document.getElementById(chartID));
            chart.draw(data, options);

        }

        Date.prototype.newDateFormat = function () {
            var hours = this.getHours();
            var minutes = this.getMinutes();
            return hours.addZero() + ':' + minutes.addZero();
        }

        Number.prototype.addZero = function () {
            if (this > 9) {
                return this.toString();
            }
            return '0' + this.toString();
        }

        function nrSilosInUse() {
            var silos = 0;
            var check1 = document.getElementById('checkSilo1');
            var check2 = document.getElementById('checkSilo2');
            var check3 = document.getElementById('checkSilo3');
            if (check1.checked) {
                silos += 1;
            }
            if (check2.checked) {
                silos += 1;
            }
            if (check3.checked) {
                silos += 1;
            }
            return silos;
        }

        function extraFire() { //Adding 1 meter per 16 hours to the rate if a checkBox is checked
            var furnaceWithExtraFire = 0;
            var check1 = document.getElementById('checkFurnace1');
            var check2 = document.getElementById('checkFurnace2');
            var check3 = document.getElementById('checkFurnace3');
            if (check1.checked) {
                furnaceWithExtraFire += 1;
            }
            if (check2.checked) {
                furnaceWithExtraFire += 1;
            }
            if (check3.checked) {
                furnaceWithExtraFire  += 1;
            }
            return furnaceWithExtraFire / 16;
        }

        function areaOfSylinder() {
            return (Math.PI * siloRadius * siloRadius);
        }

        function volumeOfCone(height) { //Calculating the volume of the cone-part of the silo
            var fullConeVolume = (coneHeight * Math.PI / 3) * (siloRadius * siloRadius + siloRadius * coneOpeningRadius + coneOpeningRadius * coneOpeningRadius);
            if (height >= coneHeight) {
                return fullConeVolume;
            } else {
                var upperRadius = siloRadius * height / coneHeight;
                return (height * Math.PI / 3) * (upperRadius * upperRadius + upperRadius * coneOpeningRadius + coneOpeningRadius * coneOpeningRadius);
            }
        }

        function getHeight1() { //In an improved version the heights are retrieved from a database; here they are hard-coded
            return 14.2125;
        }

        function getHeight2() {
            return 9.1225;
        }

        function getHeight3() {
            return 13.1562;
        }