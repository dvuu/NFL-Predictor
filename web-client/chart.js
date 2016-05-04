// look at game 3987

function buildChartFromData(playsResult, topTenResult, title, lastPlay, homeTeam) {
    var $chart = $('#chart');
    var $playOne = $('.playOne');
    var $playTwo = $('.playTwo');

    var playSeries = {
        x: [ ],
        y: [ ],
        mode: 'lines',
        type: 'scatter',
        text: [ ],
        hoverinfo: 'text',
    };

    // var topTenSeries = {
    //     x: [ ],
    //     y: [ ],
    //     mode: 'markers',
    //     type: 'scatter'
    // }

    _.each(playsResult, function(play) {
        var homeWp = (play.homeWp * 100);
        var string = homeTeam + ' Win Probability: ' + homeWp.toFixed(2) + '%' + '<br>Play: '+ play.type 
                    + '<br>OFF/Score: ' + play.offense + ': ' + play.ptsOffense + '<br>DEF/Score: ' + play.defense 
                    + ': ' + play.ptsDefense + '<br>Down: ' + play.down + '<br>Time left: ' + play.time + ' secs';
        playSeries.text.push(string);
        playSeries.x.push(play.time);
        playSeries.y.push(homeWp.toFixed(2));
    });

    // _.each(topTenResult, function(topPlay) {
    //     var homeWp = (topPlay.homeWp * 100);
    //     topTenSeries.x.push(topPlay.time);
    //     topTenSeries.y.push(homeWp.toFixed(2));
    // });

    var layout = {
        title: title,
        xaxis: {
            title: 'Game time remaining (seconds)',
            range: [3700, (lastPlay + -100)], // add padding so the labels aren't slammed against the axes
            dtick: 900,
            zeroline: false
        },
        yaxis: {
            title: homeTeam + ' Win Probability (%)',
            range: [0, 100]
        },
        showLegend: true,
        range: [-0.1, 1], // add padding so the labels aren't slammed against the axes

        font: {
            family: 'Helvetica',
            size: 18,
            color: '#7f7f7f'
        },

        shapes: [
            {
                type: 'line',
                x0: 3700,
                y0: 50,
                x1: (lastPlay + -100),
                y1: 50,
                line: {
                    dash: 'dash',
                    color: '#7f7f7f'
                }
            }
        ]
    }

    Plotly.newPlot('chart', [playSeries], layout, {displayModeBar: false});

    function playInfoString(playsObj) {
        return ('<p>' + homeTeam + ' Win Probability: ' + (playsObj.homeWp * 100).toFixed(2) + '%' + '<br>Play: '+ playsObj.type 
            + '<br>OFF/Score: ' + playsObj.offense + ': ' + playsObj.ptsOffense + '<br>DEF/Score: ' + playsObj.defense 
            + ': ' + playsObj.ptsDefense + '<br>Down: ' + playsObj.down + '<br>Time left: ' + playsObj.time + ' secs' + '</p>');
    }

    $chart[0].on('plotly_click', function(data) {
        if (data.points.length <= 0)
            return;
        if (data.points.length > 1) {
            console.error("Only expected one point for hover");
            return;
        }
        var point = data.points[0];
        var index = point.pointNumber;
        var playOne = playsResult[index];
        var playTwo = playsResult[index + 1];
        $playOne.html(playInfoString(playOne));
        $playTwo.html(playInfoString(playTwo));
     });

    // $chart[0].on('plotly_unhover', function(data) {
    //     $playOne.html('');
    //     $playTwo.html('');
    // });
}



    
