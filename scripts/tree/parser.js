var bag = {nodes: [], links: []};
var superRoot = new Node('SUPERNODE');

$('.parse-graph').click(function () {
    var string = cleanText($('#input-raw-string').val());
    var words = string.split(' ');
    superRoot.abort();
    uniqueID = 1;
    $.each(words, function (i, word) {
        var node = new Node(word, 'parent');
        superRoot.birth(node);
    });
    resetBag();
    draw(bag);
});

function resetAll() {
    bag = {nodes: [], links: []};
    superRoot.abort();
    uniqueID = 1;
}

function resetBag() {
    bag = {nodes: [], links: []};
    superRoot.childs.sort(function (nodeA, nodeB) {
        var compareValue = nodeA.sortScore() - nodeB.sortScore();
        if (compareValue > 0) {
            var temp = nodeB.ID;
            nodeB.ID = nodeA.ID;
            nodeA.ID = temp;
        }
        return compareValue;
    });
    for (var i = 0; i < superRoot.childs.length; i++) {
        superRoot.childs[i].type = 'parent';
        superRoot.childs[i].stole(bag);
    }
}

(function () {
    resetBag();
    draw(bag);
    $('.input-group-action').hide();
    $('#svg-wrapper').delegate('.node.parent', 'click', function () {
        this.classList.toggle("selected");
        var totalSelected = $('.node.parent.selected').size();
        if (totalSelected) {
            $('.input-group-action').show();
            if (totalSelected > 1) {
                $('.input-type-ungroup').hide();
            } else {
                $('.input-type-ungroup').show();
            }
        }
    });

    $('.apply-parent').click(function () {
        var newParent = new Node($('.parent-node').val(), 'parent');
        $.each($('.node.selected'), function (i, e) {
            var nodeID = parseInt($(e).attr('node-id'));
            var child = superRoot.trace(nodeID);
            child.changeParent(newParent);
        });
        superRoot.birth(newParent);
        resetBag();
        draw(bag);

        $.each($('.node.selected'), function (i, e) {
            e.classList.toggle("selected");
        });
        $('body').append($('<div>').append(logNode(superRoot)));
        $('.parent-node').val('');
        $('.input-group-action').hide();
    });

    $('.show-bracket').click(function () {
        $('.panel-bracket').html(superRoot.toString());
    });

    $('.action-save').click(function () {
        var content = superRoot.childs.join('');
        var blob = new Blob([content], {type: "text/plain;charset=utf-8"});
        var now = new Date();
        var formatDate = now.getFullYear() + "-" + (now.getMonth() + 1) + "-" + now.getDate() + " " + now.getHours() + ":" + now.getMinutes() + ":" + now.getSeconds();
        var fileName = formatDate + '.bracket';
        saveAs(blob, fileName);
    });

    $('input[type="file"]').change(function (e) {
        var file = e.target.files[0];

        if (file) {
            var reader = new FileReader();
            reader.onload = function (e) {
                resetAll();
                var content = e.target.result;
                trace(content, superRoot, {i: 0});
                $('#input-raw-string').val(superRoot.leafString());
                resetBag();
                draw(bag);
            }
            reader.readAsText(file);
        } else {
            alert("Failed to load file");
        }
    })

    /**
     * dummy thing
     * {
     *      var bracket = '(S  (VP  (Saya) (makan) (nasi)) (PP  (di) (rumah) (sakit)))';
     *      trace(bracket, superRoot, {i: 0});
     *      resetBag();
     *      draw(bag);
     *      console.log(superRoot);
     *  }
     */

})();
