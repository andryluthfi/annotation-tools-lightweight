var uniqueID = 0;
/**
 * Constructor for Node class
 * @param string name for the node
 * @param string type class type for node
 * @returns {Node}
 */
function Node(name, type) {
    this.name = name;
    this.parent = null;
    this.childs = [];
    this.ID = uniqueID++;
    this.type = type ? type : 'default';
}
/**
 * Go Up or return the parent.
 * @returns {Node.parent}
 */
Node.prototype.up = function () {
    return this.parent !== null ? this.parent : null;
}

Node.prototype.birth = function (node) {
    node.parent = this;
    this.childs.push(node);
}
Node.prototype.abort = function () {
    this.childs = [];
}

Node.prototype.sortScore = function () {
    var thisScore = this.ID;
    if (this.childs.length) {
        for (var i = 0; i < this.childs.length; i++) {
            var child = this.childs[i];
            var childScore = child.sortScore();
            if (childScore < thisScore) {
                thisScore = childScore;
            }
        }
    }
    return thisScore;
}

Node.prototype.changeParent = function (newParent) {
    var isRegisterAsChild = false;
    var parent = this.parent;
    for (var i = 0; i < parent.childs.length; i++) {
        var child = parent.childs[i];
        if (child.ID === this.ID) {
            parent.childs.splice(i, 1);
            isRegisterAsChild = true;
            break;
        }
    }
    if (isRegisterAsChild) {
        newParent.birth(this);
    }
}

Node.prototype.trace = function (nodeID) {
    var found = null;
    if (this.ID === nodeID) {
        found = this;
    } else {
        for (var i = 0; i < this.childs.length; i++) {
            var lookupChild = this.childs[i].trace(nodeID);
            if (lookupChild !== null) {
                found = lookupChild;
                break;
            }
        }
    }
    return found;
}
Node.prototype.toRawTree = function () {
    var bag = {nodes: [], links: []};
    this.stole(bag);
    return bag;
}
Node.prototype.toRawNode = function () {
    return {
        name: this.name,
        ID: this.ID,
        type: this.type
    };
}

Node.prototype.stole = function (bag) {
    var parent = this;
    if (typeof bag.nodes[parent.ID] == 'undefined') {
        bag.nodes[parent.ID] = parent.toRawNode();
    }
    $.each(parent.childs, function (i, child) {
        if (typeof bag.nodes[child.ID] == 'undefined') {
            bag.nodes[child.ID] = child.toRawNode();
        }
        bag.links.push({
            source: bag.nodes[parent.ID],
            target: bag.nodes[child.ID],
            left: false,
            right: true
        });
        child.stole(bag);
    });
}
Node.prototype.leafString = function () {
    var string = '';
    if (this.childs.length) {
        for (var i = 0; i < this.childs.length; i++) {
            string += ' ' + this.childs[i].leafString();
        }
    } else {
        string = this.name;
    }
    return string;
}
Node.prototype.toString = function () {
    var childString = '';
    for (var i = 0; i < this.childs.length; i++) {
        childString += ' ' + this.childs[i].toString();
    }
    return '(' + this.name + ' ' + childString + ')';
}

// (A (B))
function trace(parseChar, node, current) {
    var cursor = parseChar[current.i];
    current.i++;
    if (cursor === '(') {
        child = new Node(naming(parseChar, current));
        node.birth(child);
        trace(parseChar, child, current);
    } else if (cursor === ')') {
        trace(parseChar, node.up(), current);
    } else if (current.i < parseChar.length) {
        trace(parseChar, node, current);
    }
}

function naming(parseChar, current) {
    var i = current.i;
    var name = '';
    while (parseChar[i] !== '(' && parseChar[i] !== ')') {
        name += parseChar[i];
        i++;
    }
    current.i = i;
    return name;
}

function cleanText(string) {
    return string.trim().replace(/[ ][ ]+?/g, '').replace(/\n/g, '').replace(/[ ][ ]+?/g, '');
}

function logNode(node) {
    var list = $('<ul>');
    list.append($('<li>').html('[sort=' + node.sortScore() + ', ID=' + node.ID + ']' + node.name));
    for (var i = 0; i < node.childs.length; i++) {
        var child = node.childs[i];
        list.append(logNode(child));
    }
    return list;
}