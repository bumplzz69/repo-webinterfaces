

var coverTpl = new Ext.XTemplate(
	'<tpl for=".">',
    '<div class="thumb-wrap" id="{title}">',
	'<div class="thumb"><img src="{thumb}"></div>',
	'<span class="x-editable">{title}</span></div>',
    '</tpl>'
);

var fanartTpl = new Ext.XTemplate(
	'<tpl for=".">',
    '<div class="thumb-wrap" id="{title}">',
	'<div class="fanart"><img src="{thumb}"></div>',
	'<span class="x-editable">{title}</span></div>',
    '</tpl>'
);


	window.loadingMask = new Ext.LoadMask(Ext.getBody(), {msg:"Downloading file, please wait..."});

	 

function ChangeImages(record) {

	var CoverUrlList = record.data.MovieCoverUrl;
	var FanartUrlList = record.data.MovieFanartUrl;
	
	var storeCovers =  new Ext.data.ArrayStore({
			data: CoverUrlList,
			autoLoad: true,
			fields: ['thumb','url', 'title', 'currentCover']
	});
	
	var storeFanarts =  new Ext.data.ArrayStore({
		data: FanartUrlList,
		autoLoad: true,
		fields: ['thumb','url', 'title', 'currentFanart']
	});
	
	function changeXBMCCover() {
		loadingMask.show();
		var selNode = viewCovers.getSelectedRecords();
		var currentMovie = Ext.getCmp('Moviegrid').getSelectionModel().getSelected();
		// selNode contains only one item
		downloadXBMCFile(selNode[0].data.url, currentMovie.data.cover );
		//update main Movie form
		Ext.getCmp('cover').refreshMe();
		loadingMask.hide();
		
	}
	
	function changeXBMCFanart() {
		loadingMask.show();
		var selNode = viewFanarts.getSelectedRecords();
		var currentMovie = Ext.getCmp('Moviegrid').getSelectionModel().getSelected();
		// selNode contains only one item
		downloadXBMCFile(selNode[0].data.url, currentMovie.data.fanart);
		//console.log(currentMovie.data);
		//update main Movie form
		Ext.getCmp('fanart').refreshMe();
		loadingMask.hide();
		
	}
	
	var viewFanarts = new Ext.DataView({
		tpl: fanartTpl,
		autoHeight:true,
		id: 'tabfanarts',
		multiSelect: true,
		overClass:'x-view-over',
		itemSelector:'div.thumb-wrap',
		emptyText: 'No images to display',
		store: storeFanarts,
		title: 'Fanarts',
		listeners: {
			 'selectionchange': function () {
				var selNode = viewFanarts.getSelectedRecords();
				if (selNode[0].data.title != "Current") {
					Ext.getCmp('choosebutton').enable();
				}
				else { Ext.getCmp('choosebutton').disable()}
				
			}
		 }
	})

	var viewCovers = new Ext.DataView({
		tpl: coverTpl,
		autoHeight:true,
		id: 'tabcovers',
		singleSelect: true,
		//width:435,
		frame:true,
		overClass:'x-view-over',
		itemSelector:'div.thumb-wrap',
		emptyText: 'No images to display',
		store: storeCovers,
		title: 'Covers',
		listeners: {
			 'selectionchange': function () {
				var selNode = viewCovers.getSelectedRecords();
				if (selNode[0].data.title != "Current") {
					Ext.getCmp('choosebutton').enable();
				}
				else { Ext.getCmp('choosebutton').disable()}
				
			}
		 }
	})

	var imagePanel = new Ext.TabPanel({
			id:'images-view',
			bodyStyle: 'background-color:#777777',
			layoutOnTabChange: true,
			//width:435,
			activeTab:0,
			autoHeight:true,
			title:'Simple DataView',
			items: [viewCovers, viewFanarts]
	})

	var winImages = new Ext.Window({
		layout:'fit',
		margins: '5 5 5 0',
		width:600,
		height:400,
		title: 'Change cover and Fanart',
		closeAction:'hide',
		//plain: true,
		items: imagePanel,
		autoScroll: true,
		buttons: [{
			text: 'Choose',
			disabled: true,
			id: 'choosebutton',
			handler: function(){
				if (imagePanel.getActiveTab().id == 'tabcovers'){changeXBMCCover()};
				if (imagePanel.getActiveTab().id == 'tabfanarts'){changeXBMCFanart()};
				
			}
		},{
			text: 'Done',
			handler: function(){
				winImages.hide();
			}
		}]
	});
	winImages.show()
	
}



