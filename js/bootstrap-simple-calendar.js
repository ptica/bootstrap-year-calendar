/* =========================================================
 * bootstrap-simple-calender.js
 * Repo: https://github.com/Paul-DS/bootstrap-simple-calendar
 * =========================================================
 * Created by Paul David-Sivelle
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 * http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 * ========================================================= */
 
 (function($) {
	var Calendar = function(element, options) {
		this.element = element;
		this.options = options;
			
		this.element.addClass('calendar');
		this._render();
	};
 
	Calendar.prototype = {
		constructor: Calendar,
		_render: function() {
			console.time("myCode"); // 'myCode' is the namespace
			this.element.empty();
			
			
			this._renderHeader();
			this._renderBody();
			this._renderDataSource();
			
			this._applyEvents();
			console.timeEnd("myCode");
			this.element.find('.months-container').fadeIn(500);
		},
		_renderHeader: function() {
			var header = $(document.createElement('div'));
			header.addClass('calendar-header panel panel-default');
			
			var headerTable = $(document.createElement('table'));
			
			var prevDiv = $(document.createElement('th'));
			prevDiv.addClass('prev');
			
			var prevIcon = $(document.createElement('span'));
			prevIcon.addClass('glyphicon glyphicon-chevron-left');
			
			prevDiv.append(prevIcon);
			
			headerTable.append(prevDiv);
			
			var prev2YearDiv = $(document.createElement('th'));
			prev2YearDiv.addClass('year-title year-neighbor2 hidden-sm hidden-xs');
			prev2YearDiv.text(this.options.startYear - 2);
			
			headerTable.append(prev2YearDiv);
			
			var prevYearDiv = $(document.createElement('th'));
			prevYearDiv.addClass('year-title year-neighbor hidden-xs');
			prevYearDiv.text(this.options.startYear - 1);
			
			headerTable.append(prevYearDiv);
			
			var yearDiv = $(document.createElement('th'));
			yearDiv.addClass('year-title');
			yearDiv.text(this.options.startYear);
			
			headerTable.append(yearDiv);
			
			var nextYearDiv = $(document.createElement('th'));
			nextYearDiv.addClass('year-title year-neighbor hidden-xs');
			nextYearDiv.text(this.options.startYear + 1);
			
			headerTable.append(nextYearDiv);
			
			var next2YearDiv = $(document.createElement('th'));
			next2YearDiv.addClass('year-title year-neighbor2 hidden-sm hidden-xs');
			next2YearDiv.text(this.options.startYear + 2);
			
			headerTable.append(next2YearDiv);
			
			var nextDiv = $(document.createElement('th'));
			nextDiv.addClass('next');
			
			var nextIcon = $(document.createElement('span'));
			nextIcon.addClass('glyphicon glyphicon-chevron-right');
			
			nextDiv.append(nextIcon);
			
			headerTable.append(nextDiv);
			
			header.append(headerTable);
			
			this.element.append(header);
		},
		_renderBody: function() {
			var monthsDiv = $(document.createElement('div'));
			monthsDiv.addClass('months-container');
			
			for(var m = 0; m < 12; m++) {
				/* Container */
				var monthDiv = $(document.createElement('div'));
				monthDiv.addClass('month-container col-lg-2 col-md-3 col-sm-3 col-xs-4')
				monthDiv.data('month-id', m);
				
				var firstDate = new Date(this.options.startYear, m, 1);
				
				var table = $(document.createElement('table'));
				table.addClass('month');
				
				/* Month header */
				var thead = $(document.createElement('thead'));
				
				var titleRow = $(document.createElement('tr'));
				
				var titleCell = $(document.createElement('th'));
				titleCell.addClass('month-title');
				titleCell.attr('colspan', 7);
				titleCell.text(dates[this.options.language].months[m]);
				
				titleRow.append(titleCell);
				thead.append(titleRow);
				
				var headerRow = $(document.createElement('tr'));
				
				var d = dates[this.options.language].weekStart;
				do
				{
					var headerCell = $(document.createElement('th'));
					headerCell.text(dates[this.options.language].daysMin[d]);
					
					headerRow.append(headerCell);
					
					d++;
					if(d >= 7)
						d = 0;
				}
				while(d != dates[this.options.language].weekStart)
				
				thead.append(headerRow);
				table.append(thead);
				
				/* Days */
				var currentDate = new Date(firstDate.getTime());
				var lastDate = new Date(this.options.startYear, m + 1, 0);
				
				var weekStart = dates[this.options.language].weekStart
				
				while(currentDate.getDay() != weekStart)
				{
					currentDate.setDate(currentDate.getDate() - 1);
				}
				
				while(currentDate < lastDate)
				{
					var row = $(document.createElement('tr'));
				
					do
					{
						var cell = $(document.createElement('td'));
						cell.addClass('day');
						
						if(currentDate < firstDate) {
							cell.addClass('old');
						}
						else if(currentDate > lastDate) {
							cell.addClass('new');
						}
						else {
							var cellContent = $(document.createElement('div'));
							cellContent.addClass('day-content');
							cellContent[0].innerText = currentDate.getDate();
							cell.append(cellContent);
						}
						
						row.append(cell);
						
						currentDate.setDate(currentDate.getDate() + 1);
					}
					while(currentDate.getDay() != weekStart)
					
					table.append(row);
				}
				
				monthDiv.append(table);
				
				monthsDiv.append(monthDiv);
			}
			
			this.element.append(monthsDiv);
		},
		_renderDataSource: function() {
			var _this = this;
			if(this.options.dataSource != null && this.options.dataSource.length > 0) {
				this.element.find('.month-container').each(function() {
					var month = $(this).data('month-id');
					
					var monthData = [];
					
					var firstDate = new Date(_this.options.startYear, month, 1);
					var lastDate = new Date(_this.options.startYear, month + 1, 0);
					
					for(var i in _this.options.dataSource) {
						if(!(_this.options.dataSource[i].startDate > lastDate) || (_this.options.dataSource[i].endDate < firstDate)) {
							monthData.push(_this.options.dataSource[i]);
						}
					}
					
					if(monthData.length > 0) {
						$(this).find('.day-content').each(function() {
							var currentDate = new Date(_this.options.startYear, month, $(this).text());
							
							var dayData = [];
						
							for(var i in monthData) {
								if(monthData[i].startDate <= currentDate && monthData[i].endDate >= currentDate) {
									dayData.push(monthData[i]);
								}
							}
							
							if(dayData.length > 0)
							{
								var weight = 0;
								
								if(dayData.length == 1) {
									weight = 4;
								}
								else if(dayData.length <= 3) {
									weight = 2;
								}
								else {
									$(this).parent().css('box-shadow', 'inset 0 -4px 0 0 black');
								}
								
								if(weight > 0)
								{
									var boxShadow = '';
								
									for(var i in dayData)
									{
										if(boxShadow != '') {
											boxShadow += ",";
										}
										
										boxShadow += 'inset 0 -' + (parseInt(i) + 1) * weight + 'px 0 0 ' + dayData[i].color;
									}
									
									$(this).parent().css('box-shadow', boxShadow);
								}
							}
						});
					}
				});
			}
		},
		_applyEvents: function () {
			var _this = this;
			
			/* Header buttons */
			this.element.find('.year-neighbor, .year-neighbor2').click(function() {
				_this.setYear(parseInt($(this).text()));
			});
			
			this.element.find('.calendar-header .prev').click(function() {
				_this.element.find('.months-container').animate({'margin-left':'100%'},100, function() {
					_this.element.find('.months-container').hide();
					_this.element.find('.months-container').css('margin-left', '0');
					setTimeout(function() { _this.setYear(_this.options.startYear - 1) }, 50);
				});
				
			});
			
			this.element.find('.calendar-header .next').click(function() {
				_this.element.find('.months-container').animate({'margin-left':'-100%'},100, function() {
					_this.element.find('.months-container').hide();
					_this.element.find('.months-container').css('margin-left', '0');
					setTimeout(function() { _this.setYear(_this.options.startYear + 1) }, 50);
				});
			});
			
			var cells = this.element.find('.day:not(.old, .new)');
			
			/* Day rendering */
			if(this.options.renderDay) {
				this.element.find('.month-container').each(function() {
					var month = $(this).data('month-id');
					$(this).find('.day-content').each(function() {
						_this.options.renderDay({
							element: $(this),
							date: new Date(_this.options.startYear, month, $(this).text())
						});
					});
				});
			}
			
			/* Click on date */
			if(this.options.clickDate) {
				cells.click(function(e) {
					if(e.which == 1) {
						e.stopPropagation();
						var date = _this._getDate($(this));
						_this.options.clickDate({
							date: date,
							events: _this.getEvents(date)
						});
					}
				});
			}
			
			/* Range selection */
			if(this.options.selectRange) {
				cells.mousedown(function (e) {
					if(e.which == 1) {
						_this._mouseDown = true;
						_this._rangeStart = _this._rangeEnd = _this._getDate($(this));
						_this._refreshRange();
					}
				});

				cells.mouseenter(function (e) {
					if (_this._mouseDown) {
						var oldValue = _this._rangeEnd;
						_this._rangeEnd = _this._getDate($(this));

						if (oldValue.getTime() != _this._rangeEnd.getTime()) {
							_this._refreshRange();
						}
					}
				});

				$(window).mouseup(function (e) {
					if (_this._mouseDown) {
						_this._mouseDown = false;
						_this._refreshRange();

						var minDate = _this._rangeStart < _this._rangeEnd ? _this._rangeStart : _this._rangeEnd;
						var maxDate = _this._rangeEnd > _this._rangeStart ? _this._rangeEnd : _this._rangeStart;

						_this.options.selectRange({ startDate: minDate, endDate: maxDate });
					}
				});
			}
		
			/* Hover date */
			if(this.options.mouseOnDate) {
				cells.mouseenter(function(e) {
					var date = _this._getDate($(this));
					_this.options.mouseOnDate({
						date: date,
						events: _this.getEvents(date)
					});
				});
			}
			
			if(this.options.mouseOutDate) {
				cells.mouseleave(function(e) {
					var date = _this.mouseOutDate($(this));
					_this.options.mouseOnDate({
						date: date,
						events: _this.getEvents(date)
					});
				});
			}
		},
		_refreshRange: function () {
			var _this = this;
		
            this.element.find('td.day.range').removeClass('range')
            this.element.find('td.day.range-start').removeClass('range-start');
            this.element.find('td.day.range-end').removeClass('range-end');

            if (this._mouseDown) {
                var beforeRange = true;
                var afterRange = false;
                var minDate = _this._rangeStart < _this._rangeEnd ? _this._rangeStart : _this._rangeEnd;
                var maxDate = _this._rangeEnd > _this._rangeStart ? _this._rangeEnd : _this._rangeStart;

                this.element.find('.month-container').each(function () {
					var monthId = $(this).data('month-id');
                    if (minDate.getMonth() <= monthId && maxDate.getMonth() >= monthId) {
                        $(this).find('td.day:not(.old, .new)').each(function () {
                            var date = _this._getDate($(this));
                            if (date >= minDate && date <= maxDate) {
                                $(this).addClass('range');

                                if (date.getTime() == minDate.getTime()) {
                                    $(this).addClass('range-start');
                                }

                                if (date.getTime() == maxDate.getTime()) {
                                    $(this).addClass('range-end');
                                }
                            }
                        });
                    }
                });
            }
        },
		_getDate: function(elt) {
			var day = elt.children('.day-content').text();
			var month = elt.closest('.month-container').data('month-id');
			var year = this.options.startYear;

			return new Date(year, month, day);
		},
		getEvents: function(date) {
			var events = [];
			
			if(this.options.dataSource && date) {
				for(var i in this.options.dataSource) {
					if(this.options.dataSource[i].startDate <= date && this.options.dataSource[i].endDate >= date) {
						events.push(this.options.dataSource[i]);
					}
				}
			}
			
			return events;
		},
		setYear: function(year) {
			this.options.startYear = year;
			this._render();
		}
	}
 
	$.fn.calendar = function (options) {
		var calendar = new Calendar($(this) ,options);
		$(this).data('calendar', calendar);
	}
	
	var dates = $.fn.calendar.dates = {
		en: {
			days: ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday", "Sunday"],
			daysShort: ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"],
			daysMin: ["Su", "Mo", "Tu", "We", "Th", "Fr", "Sa", "Su"],
			months: ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"],
			monthsShort: ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"]
		}
	};
 }(window.jQuery));