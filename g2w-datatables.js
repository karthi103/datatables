(function( $ ) {
	
	$.g2wDatatables = function( method ) {
		
  function loadMessages(locale) {
    jQuery.i18n.properties({
        name: '-g2w-ui',
        path: '/messages/messages',
        mode: 'both',
        language: locale
    });
}

//format the time in millis as per timezone and data format
function formatDateTime(millis, timeZone, dateFormat) {
    try {
        return moment(millis).tz(timeZone).format(dateFormat);
    } catch(error) {
        return moment(millis).tz("GMT").format(dateFormat);
    }
}

//define default options for datatables
function getDatatablesConf(ajaxUrl, pageSize, timeout, language, buildColumnDefs, buildColumns, buildRequest) {
    return {
        "processing": true,
        "serverSide": true,
        "pagingType": "simple",
        "ajax": $.fn.dataTable.ajaxCall({
            "url": ajaxUrl,
            "buildRequest": buildRequest,
            "timeout": timeout
        }),
        "columnDefs": buildColumnDefs(),
        "columns": buildColumns(),
        "drawCallback": function () {
            customTableCell();
            customTableFooter();
            customSortArrows();
        },
        "oLanguage": {
            "sSearch": "",
            "sProcessing": "<img src='https://global.gotowebinar.com/images/spinner.gif'> ",
            "oPaginate": {
                "sNext": '<img src="https://global.gotowebinar.com/images/page-next.png">',
                "sPrevious": '<img src="https://global.gotowebinar.com/images/page-prev.png">'
            }
        },
        "iDisplayLength": pageSize,
        "deferRender": true
    }
}

function customTableCell() {
    $(".dataTable tbody td").css({
                "border": "0",
                "border-top": "1px solid #D7D9D9",
                "padding": "10px 18px"
            });
}

function customSortArrows() {
    $("table.dataTable thead .sorting_desc").css("background","url('styles/images/sort_desc.png') no-repeat scroll 80px 15px");
    $("table.dataTable thead .sorting").css("background","url('styles/images/sort_both.png') no-repeat scroll 80px 12px");
    $("table.dataTable thead .sorting_asc").css("background","url('styles/images/sort_asc.png') no-repeat scroll 80px 15px");
}

//customize datatables default searchbar
function customSearchBar(titleText) {
    //For search bar
    $("#webinar-history-table_length").css("display", "none");
    $("#webinar-history-table_filter").removeClass("dataTables_filter").addClass("search-container").css({
        "margin-bottom": "20px",
        "width": "400px"
    });
    $(".search-container")
        .append("<i class='search-icon'>Search</i>")
        .find('input')
        .addClass('search-field')
        .attr("title", titleText);
    $("input[type='search']")
        .clearField()
        .searchField();
}

function customTableHeader() {
    //for table header    
    $(".dataTable thead th").css("border-bottom", "0");
}

function customTableFooter() {
    //for table footer
    $(".dataTable").removeClass("no-footer");
    $(".dataTables_wrapper .dataTables_paginate .paginate_button").css("padding","12px 0 0 2px").hover(
        function () {
            $(this).css({"background-color":"white", "background":"white", "border":"none"});
        });

    $(".dataTables_wrapper .dataTables_paginate .paginate_button.disabled").css("opacity","0.5");
    $("#webinar-history-table_info").css({
        "padding-top": "18px",
        "text-align": "right",
        "width": "93%"});
    
}

//customize datatables css
function customizeDataTables(titleText) {
    customSearchBar(titleText);
    customTableHeader();
    customTableCell();
    customTableFooter();
    customSortArrows();
}

function handleAjaxError( xhr, textStatus, error ) {
    if(xhr.status == 0) {
        location.reload();  
    } else {
        handleError();
    }
}

//adapt ajax requests and response to suit datatables
$.fn.dataTable.ajaxCall = function (opts) {
    // Configuration options
    var conf = $.extend({
        url: '', // script url
        timeout: 30000,
        data: null, // function or object with parameters to send to the server
        // matching how `ajax.data` works in DataTables
        method: 'GET' // Ajax HTTP method
    }, opts);
    return function (request, drawCallback, settings) {
        paginationRequest = conf.buildRequest(request);
        settings.jqXHR = $.ajax({
            "type": conf.method,
            "url": conf.url,
            "cache":false,
            "timeout": conf.timeout,
            "headers": {
                        "CacheControl":"no-cache",
                        "Pragma":"no-cache",
                        "Expires":"-1"
                        },
            "error": handleAjaxError,
            "data": paginationRequest,
            "dataType": "json",
            "success": function (json) {
                $.extend(true, {}, json);
                json.recordsTotal = json.total;
                json.recordsFiltered = json.total;
                drawCallback(json);
            }
        });
    }
};

	};
}(jQuery));

//sample

jQuery( document ).ready( function() {

	jQuery.g2wDatatables();

} );
