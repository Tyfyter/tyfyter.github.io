function trysearch(e){
    if(e.keyCode === 13){
        search();
    }
}
let searchMode;
function search(){
    try{
        var params = {};
        for(var i = 0; i < searchMode.boxes.length; i++){
            params[searchMode.boxes[i]] = document.getElementById(searchMode.boxes[i]).value;
        }
        url = searchMode.searchFormatter(params);
        window.location.replace(url);
    }catch(e){
        console.error(e);
        window.open("https://stackoverflow.com/search?q=[js]+"+e.message,'_blank');
    }
}
String.prototype.format = String.prototype.f = function() {
    var s = this,
        i = arguments.length;

    while (i--) {
        s = s.replace(new RegExp('\\{' + i + '\\}', 'gm'), arguments[i]);
    }
    return s;
};
String.prototype.formatWith = String.prototype.f = function() {
    var s = this,
        o = arguments[0],
        i = arguments.length;

    console.log(o);
    while ((i--) - 1) {
        console.log(arguments[i]);
        s = s.replace(new RegExp('\\{' + arguments[i] + '\\}', 'gm'), o[arguments[i]]);
    }
    return s;
};
let extraSearchModes;
try {
    extraSearchModes = JSON.parse(localStorage.getItem('customModes'));
} catch (e) {}
if (!Array.isArray(extraSearchModes)) extraSearchModes = [];
var searchModes = [
    {
        name:'lyrics',
        aliases:['lyric'],
        boxes:['artist', 'lyric'],
        searchFormatter:(params)=>"https://www.google.com/search?q=\""+params.lyric+"\""+" site:www.azlyrics.com/lyrics/"+params.artist.replace(' ', '')+"/"
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
    },
    {
        name:'add',
        aliases:[],
        boxes:['name', 'boxes', 'formatString', 'aliases'],
        searchFormatter:(params) => {
            if (!params.name) throw 'parameter "name" must be declared';
            if (!params.boxes) throw 'parameter "boxes" must be declared';
            if (!params.formatString) throw 'parameter "formatString" must be declared';
            extraSearchModes.push({
                name:params.name,
                aliases:(params.aliases || "").split(','),
                boxes:params.boxes.split(','),
                formatString:params.formatString
            });
            localStorage.setItem('customModes', JSON.stringify(extraSearchModes));
            return "https://tyfyter.github.io/search?"+params.name;
        }
    }
];
for (let i = 0; i < extraSearchModes.length; i++) {
    const element = extraSearchModes[i];
    searchModes.push({
        name:element.name,
        aliases:element.aliases,
        boxes:element.boxes,
        searchFormatter:(params)=>element.formatString.formatWith(params, element.boxes),
        isCustomSearch:true
    });
}
function removeSearch(v){
    if (!window.confirm(`do you really want to remove search "${v}"?`)) return;
    for(var i = 0; i < extraSearchModes.length; i++){
        if(extraSearchModes[i].name == v){
            extraSearchModes.splice(i);
            break;
        }
    }
    localStorage.setItem('customModes', JSON.stringify(extraSearchModes));
    location.reload();
}
function setContent(v){
    var content = document.getElementById("content");
    console.log(v);
    for(var i = 0; i < searchModes.length; i++){
        console.log(searchModes[i]);
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
        content.innerHTML += '<a href="?'+searchModes[i].name+'">'+searchModes[i].name+'</a>';
        if (searchModes[i].isCustomSearch) {
            content.innerHTML += ` <a href="javascript:void(0)" onclick="removeSearch('${searchModes[i].name}')" style="color: red;">X</a>`;
        }
        content.innerHTML += '<br>'
    }
    content.id = "";
}