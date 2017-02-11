const protocol = window.location.protocol +'//',
    host = protocol + window.location.hostname,
    path = window.location.pathname.split('/').slice(0, -1).join('/'),
    tile_dir = path +'/assets/tiles/';

let file_ext = '.png',
    active_tile;

let getFiles = (xml) => {

    let parse = new DOMParser(),
        xmlRes = parse.parseFromString(xml.responseText, 'text/html'),
        list = xmlRes.getElementsByTagName('a');

    for (let i = 0; i < list.length; i++) {

        let file = list[i].innerHTML.trim();

        if (file.substr(-4) === '.png') {
            document.getElementById('assets').innerHTML += '<div class="tile_asset '+ file +'"><img src="'+ tile_dir + file +'"></div>'
        }

    }

};

// Load assets
(() => {
    let xhr = new XMLHttpRequest();
        xhr.open('GET', tile_dir, false);
        xhr.onreadystatechange = function() {
            if (xhr.readyState == XMLHttpRequest.DONE && xhr.status == '200') {
                getFiles(xhr);
                console.log('Assets loaded...');
            }
        };
        xhr.send(null);
})();

let removeClass = (el, ev, className) => {
    for (let i = 0; i < el.length; i++) {
        el[i].addEventListener(ev, function(e) {
            e.preventDefault();
            for (let i = 0; i < el.length; i++) {
                el[i].classList.remove(className);
            }
        });
    }
}

let addClass = (el, ev, className) => {
    for (let i = 0; i < el.length; i++) {
        el[i].addEventListener(ev, function(e) {
            e.preventDefault();
            let current = this;
            for (let i = 0; i < el.length; i++) {
                if (current !== el[i]) {
                    current.classList.add(className);
                }
            }
        });
    }
}

const container = document.getElementById('container'),
    tiles_div = document.getElementById('tiles');

let row, col, tile_size = 64;
let map_num_rows = 20,
    map_num_cols = 20;

// Generate Map
(() => {
    for (let i = 0; i < map_num_rows; i++) {
        tiles_div.innerHTML += '<div id="row-'+ i +'" class="row" style="width: '+ tile_size * map_num_cols +'px; height: '+ tile_size +'px;"></div>';
        for (let j = 0; j < map_num_cols; j++) {
            document.getElementById('row-'+ i).innerHTML += '<div id="tile-x'+ j +'y'+ i +'" class="tile" style="display: inline-block; width: '+ tile_size +'px; height: '+ tile_size +'px; z-index: '+ (i + 1) +'" title="X: '+ j +'\nY: '+ i +'\nZ: '+ (i + 1) +'"></div>';
        }
    }
})();

let tiles = document.getElementsByClassName('tile');
for (let i = 0; i < tiles.length; i++) {
    tiles[i].addEventListener('click', function(e) {
        let tile_img = tiles[i].getElementsByTagName('img');
        if (active_tile != undefined && tiles[i].children.length <= 1) {
            tiles[i].innerHTML = '<img src="'+ active_tile +'" width="'+ tile_size +'">';
        }
    });
}

let fillAll = () => {

    if (!active_tile) {
        alert('Select an asset to fill the tiles');
        return;
    }

    console.log('Filling map with '+ active_tile);

    for (let i = 0; i < map_num_rows; i++) {
        for (let j = 0; j < map_num_cols; j++) {
            let tile = document.getElementById('tile-x'+ j +'y'+ i);
                tile.innerHTML = '<img src="'+ active_tile +'" width="'+ tile_size +'">';
        }
    }
}
document.getElementById('fillAll').addEventListener('click', fillAll);

let clickAsset = function() {
    removeClass(document.getElementsByClassName('tile_asset'), 'click', 'active');
    addClass(document.getElementsByClassName('tile_asset'), 'click', 'active');
    active_tile = this.children[0].src;
}

document.addEventListener('DOMContentLoaded', () => {

    console.log('DOM loaded...');

    let tile_assets = document.getElementsByClassName('tile_asset');

    for (let i = 0; i < tile_assets.length; i++) {
        tile_assets[i].setAttribute('id', 'tile_asset-'+ i);
        tile_assets[i].addEventListener('click', clickAsset, false);
    }

});