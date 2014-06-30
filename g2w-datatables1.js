(function( $, _ ) {
 $.fn.g2wDatatables = {
	

	 	 
     loadMessages : function (locale) {
    jQuery.i18n.properties({
        name: '-g2w-ui',
        path: '/messages/messages',
        mode: 'both',
        language: locale
    });
},
     
    callme : function(calledFrom){
       alert(calledFrom);   
    },

//UNCOMMENT THIS
//format the time in millis as per timezone and data format
//formatDateTime : function (millis, timeZone, dateFormat) {
  //  try {
    //    return moment(millis).tz(timeZone).format(dateFormat);
    // } catch(error) {
     //   return moment(millis).tz("GMT".format(dateFormat);
   // }
//},


customTableCell : function () {
    $(".dataTable tbody td").css({
                "border": "0",
                "border-top": "1px solid #D7D9D9",
                "padding": "10px 18px"
            });
},

customSortArrows : function () {
    $("table.dataTable thead .sorting_desc").css("background","url('styles/images/sort_desc.png') no-repeat scroll 80px 15px");
    $("table.dataTable thead .sorting").css("background","url('styles/images/sort_both.png') no-repeat scroll 80px 12px");
    $("table.dataTable thead .sorting_asc").css("background","url('styles/images/sort_asc.png') no-repeat scroll 80px 15px");
},

//customize datatables default searchbar
customSearchBar : function (titleText) {
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
},

customTableHeader : function () {
    //for table header    
    $(".dataTable thead th").css("border-bottom", "0");
},

customTableFooter : function () {
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
    
},

//customize datatables css
customizeDataTables : function (titleText) {
    customSearchBar(titleText);
    customTableHeader();
    customTableCell();
    customTableFooter();
    customSortArrows();
},

handleAjaxError : function ( xhr, textStatus, error ) {
    if(xhr.status == 0) {
        location.reload();  
    } else {
        handleError();
    }
},


//define default options for datatables
getDatatablesConf : function(ajaxUrl, pageSize, timeout, language, buildColumnDefs, buildColumns, buildRequest) {
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
            $.fn.g2wDatatables.customTableCell();
           $.fn.g2wDatatables.customTableFooter();
            $.fn.g2wDatatables.customSortArrows();
        },
        "oLanguage": {
            "sSearch": "",
            "sProcessing": "<img src='https://global.gotowebinar.com/images/spinner.gif'> ",
            "sInfo": "<strong>"+language.info+"</strong>",
            "sInfoEmpty":"<strong>"+ language.emptyInfo+"</strong>",
            "sEmptyTable":language.emptyTable,
            "sZeroRecords":language.zeroRecords,
            "oPaginate": {
                "sNext": '<img src="https://global.gotowebinar.com/images/page-next.png">',
                "sPrevious": '<img src="https://global.gotowebinar.com/images/page-prev.png">'
            }
        },
        "iDisplayLength": pageSize,
        "deferRender": true
    }
}


	};
})(jQuery);

