var NFL = window.NFL = (window.NFL || { });

$(document).ready(function() {
	buildSeasonsFilter();
	buildWeeksFilter();
	renderFromQueryString();
});

function setSelectedSeasonText(season) {
	$('.seasonsDropdown .selection').text(season);
}

function setSelectedWeekText(week) {
	$('.weeksDropdown .selection').text(week);
}

function setSelectedGameText(title) {
	$('.gamesDropdown .selection').text(title);
}

function gameTitle(gameObj) {
	return (gameObj.visitor + ' @ ' + gameObj.home); 
}

function parseQueryString() {
	var searchQuery = document.location.search.replace('?', '');
	var searchQueryArr = searchQuery.split('=');
	var obj = { };
	var key = searchQueryArr[0];
	var value = searchQueryArr[1];
	obj[key] = value;
	return obj;
}

function renderFromQueryString() {
	var params = parseQueryString();
	$.ajax({ url: '/api/games', success: function(result) {
		setSelectedSeasonText(result[params.gid].season);
		setSelectedWeekText(result[params.gid].week);
		setSelectedGameText(gameTitle(result[params.gid]));
		buildGamesFilter(result[params.gid].season, result[params.gid].week);
		renderGame(result[params.gid]);
		console.log('Requested gameId: ' + result[params.gid].gameId);
	}});
}	

function renderGame(game) {
	var playUrl = '/api/plays/' + game.gameId;
	var topTenUrl = '/api/topTen/' + game.gameId;
	$('.topPlays').empty();
	$.ajax({ url: playUrl, success: function(playsResult) {
		$.ajax({ url: topTenUrl, success: function(topTenResult) {
			// Build chart
			var element = $('#chart')[0];
			var chart = new NFL.Chart(playsResult, topTenResult, game);
			chart.layout.font.size = 16;
        	chart.setPlays(playsResult);
        	chart.render(element);
        	// Display top ten plays
			var topTen = new NFL.TopTen(topTenResult, playsResult);
			topTen.render();
		}});
	}});
	$('.homeLogo, .awayLogo').removeClass(function(idx, css) {
		var match = css.match(/team\-\w*/);
		return (match ? match.join(' ') : null);
	});
	$('.homeLogo').addClass('team-' + game.home.toLowerCase());
	$('.awayLogo').addClass('team-' + game.visitor.toLowerCase());
}

function buildSeasonsFilter() {
	$('.seasonsDropdown .filterDropdown-content').empty();
	var years = [ ];
	for (var i = 2000; i <= 2015; ++i)
		years.push(i);
	_.each(years, function(season) {
		var $listItem = $('<a class="dropdownLink"></a>');
		var $div = $('<div><span>' + season + '</span></div>');
		$listItem.append($div);
		$listItem.click(function (e) {
			$('.seasonsDropdown .dropdownLink div').removeClass('activeFilterItem');
            $(e.currentTarget).children('div').addClass('activeFilterItem');
			setSelectedSeasonText(season);
			setSelectedWeekText(' -- ');
			setSelectedGameText(' -- ');
			buildWeeksFilter(season);
		});
		$('.seasonsDropdown .filterDropdown-content').append($listItem);
	});
}

function buildWeeksFilter(season) {
	$('.weeksDropdown .filterDropdown-content').empty();
	var results = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 
		11, 12, 13, 14, 15, 16, 17, 18, 19, 20, 21];
	_.each(results, function(week) {
		var $listItem = $('<a class="dropdownLink"></a>');
		var $div = $('<div><span>' + week + '</span></div>');
		$listItem.append($div);
		$listItem.click(function (e) {
			$('.weeksDropdown .dropdownLink div').removeClass('activeFilterItem');
            $(e.currentTarget).children('div').addClass('activeFilterItem');
			setSelectedWeekText(week);
			setSelectedGameText(' -- ');
			buildGamesFilter(season, week);
		});
		$('.weeksDropdown .filterDropdown-content').append($listItem);
	});
}

function buildGamesFilter(season, week) {
	$('.gamesDropdown .filterDropdown-content').empty();
	$.ajax({ url: '/api/games/' + season + '/' + week, success: function(result) {
		_.each(result, function(game) {
			var $listItem = $('<a class="dropdownLink"></a>');
			var $div = $('<div><span>' + gameTitle(game) + '</span></div>');
			$listItem.append($div);
			$listItem.click(function (e) {
				onGameClick(e, game);
			});
			$('.gamesDropdown .filterDropdown-content').append($listItem);
		});
	}, error: function() {
		console.log('error');
	}});
}

function onGameClick(e, game) {
	$('.gamesDropdown .dropdownLink div').removeClass('activeFilterItem');
    $(e.currentTarget).children('div').addClass('activeFilterItem');
	setSelectedGameText(gameTitle(game));
	history.pushState(null, null, '/?gid=' + game.gameId);
	renderGame(game);
	console.log('Requested gameId: ' + game.gameId);
};