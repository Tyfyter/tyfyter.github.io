function trysearch(e){
    if(e.keyCode === 13){
        search();
    }
}
var searchMode;
function search(){
    try{
        var params = {};
        for(var i = 0; i < searchMode.boxes.length; i++){
            eval('params.'+searchMode.boxes[i]+' = "'+document.getElementById(searchMode.boxes[i]).value+'"');
        }
        url = searchMode.searchFormatter(params);
        window.open(url, "_self");
    }catch(e){
        console.error(e);
        window.open("https://stackoverflow.com/search?q=[js]+"+e.message,'_blank');
    }
}
var searchModes = [
    {
        name:'lyrics',
        aliases:['lyric'],
        boxes:['artist', 'lyric'],
        searchFormatter:(params)=>"https://www.google.com/search?q=\""+params.lyric+"\""+" site:www.azlyrics.com/lyrics/"+params.artist.replace(/ /g,"")+"/"
    },
    {
        name:'examplemod',
        aliases:['em'],
        boxes:['search'],
        searchFormatter:(params)=>"https://github.com/search?q=repo%3AtModLoader%2FtModLoader+path%3AExampleMod+"+params.search
    },
    {
        name:'originswiki',
        aliases:['ow', 'origins'],
        boxes:['search'],
        searchFormatter:(params)=>"https://tyfyter.github.io/OriginsWiki/searchPage?"+params.search.replace(' ', '_')
    }
];
function setContent(v){
    var content = document.getElementById("content");
    for(var i = 0; i < searchModes.length; i++){
        if(searchModes[i].name == v || (searchModes[i].aliases && searchModes[i].aliases.includes(v))){
            searchMode = searchModes[i];
            break;
        }
    }
    content.innerHTML = "";
    for(var i = 0; i < searchMode.boxes.length; i++){
        content.innerHTML += 
            '<div class="tooltipped">'+
			    '<input id="'+searchMode.boxes[i]+'" '+(i < searchMode.boxes.length - 1 ? 'type="text"' : 'type="search" onkeypress="trysearch(event)"')+'>'+
			    '<span class="tooltiptext">'+searchMode.boxes[i]+'</span>'+
		    '</div> ';
    }
    content.innerHTML += '<div class="tooltipped">'+
    '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" class="searchSymbol" onclick="search()">'+
    '<path d="M15.5 14h-.79l-.28-.27A6.471 6.471 0 0 0 16 9.5 6.5 6.5 0 1 0 9.5 16c1.61 0 3.09-.59 4.23-1.57l.27.28v.79l5 4.99L20.49 19l-4.99-5zm-6 0C7.01 14 5 11.99 5 9.5S7.01 5 9.5 5 14 7.01 14 9.5 11.99 14 9.5 14z">'+
    '</path>'+
    '</svg>'+
    '<span class="tooltiptext">search</span>'+
    '</div>'
}
let searchQuery = decodeURI(window.location.search).substring(1);
let actuallyRun = true;
if (searchQuery.startsWith('!')) {
    if (searchQuery.startsWith('!~')) {
        searchQuery = searchQuery.substring(2);
    } else {
        window.open(`https://duckduckgo.com/?q=${window.location.search.substring(2)}`, "_self");
        actuallyRun = false;
    }
}
if (actuallyRun) {
    var searchData = searchQuery.split('|');
    var searchName = searchData.shift();
    if(searchName){
        console.log("search mode: "+searchName);
        setContent(searchName);
        if(searchData){
            console.log(`filling in: ${searchData.length}/${searchMode.boxes.length} search boxes`);
            for (let i = 0; i < searchData.length; i++) {
                document.getElementById(searchMode.boxes[i]).value = searchData[i];
                if(i == searchMode.boxes.length - 1){
                    search();
                }
            }
        }
    } else {
        var content = document.getElementById("content");
        content.innerHTML = "";
        for(var i = 0; i < searchModes.length; i++){
            content.innerHTML += '<a href="?'+searchModes[i].name+'">'+searchModes[i].name+'</a><br>';
        }
        content.id = "";
    }
}