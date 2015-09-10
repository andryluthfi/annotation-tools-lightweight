
function Node(name){
    this.name = name;
    this.parent = null;
    this.childs = [];

}
// Node methods
Node.prototype.up = function(){
    return this.parent !== null ? this.parent : null;
}
Node.prototype.birth = function(node){
    node.parent = this;
    this.childs.push(node);
}
Node.prototype.toRawTree = function(){
    var bag = {nodes:[], links:[], dict:{nodeIndex:{}, lastLinkIndex:0, lastNodeIndex:0}};
    this.stole(bag);
    return bag;
}

Node.prototype.stole = function(bag){
    var parent = this;
    if (typeof bag.dict.nodeIndex[parent.name] == 'undefined') {
        bag.dict.nodeIndex[parent.name] = bag.dict.lastNodeIndex;
        bag.nodes[bag.dict.lastNodeIndex] = {
            id: parent.name, 
            reflexive: false,
            index: bag.dict.lastNodeIndex
        };
        bag.dict.lastNodeIndex++;
    }

    $.each(parent.childs, function(i, child) {
        if (typeof bag.dict.nodeIndex[child.name] == 'undefined') {
            bag.dict.nodeIndex[child.name] = bag.dict.lastNodeIndex;
            bag.nodes[bag.dict.lastNodeIndex] = {
                id: child.name,
                reflexive: false,
                index: bag.dict.lastNodeIndex
            };
            bag.dict.lastNodeIndex++;
        }

        bag.links[bag.dict.lastLinkIndex++] = {
            source: bag.nodes[bag.dict.nodeIndex[parent.name]], 
            target: bag.nodes[bag.dict.nodeIndex[child.name]], 
            left: false, 
            right: true
        };
        child.stole(bag);
    });
}


// (A (B))
function trace(parseChar, node, current) {
    var cursor = parseChar[current.i];
    current.i++;
    if(cursor === '(') {
        child = new Node(naming(parseChar,current));
        node.birth(child);
        trace(parseChar, child, current);
    } else if(cursor === ')') {
        trace(parseChar, node.up(), current);
    }
}

function naming(parseChar, current) {
    var i = current.i;
    var name = '';
    while(parseChar[i] !== '(' && parseChar[i] !== ')') {
        name += parseChar[i];
        i++;
    }
    current.i = i;
    return name;
}

function cleanText(string) {
    return string.trim().replace(/[ ][ ]+?/g, '').replace(/\n/g,'').replace(/[ ][ ]+?/g, '');
}

function logNode(node) {
    var list = $('<ul>');
    list.append($('<li>').html(node.name));
    $.each(node.childs, function(i, child){
        list.append(logNode(child));
    });
    return list;
}