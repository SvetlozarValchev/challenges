var textDiff;
var docName;
var docCreate;
var docsSelect;
var docContent;
var docSave;
var selectedDoc;
var diffContainer;
var docAtRevision;
var docDiff;
var docData;

function updateDocumentsList(callback) {
    $.ajax({
        type: "GET",
        url: '/api/getAllDocuments',
        success: function(res) {
            docsSelect.html('<option></option>');

            $.each(res, function(key, value) {
                docsSelect.append('<option value=' + value.id + '>' + value.name + '</option>');
            });

            if (callback) {
                callback(res);
            }
        }
    });
}

function updateDiffs() {
    diffContainer.html('');

    if (selectedDoc) {
        selectedDoc.history.forEach((item, idx) => {
            var holder = $('<div></div>');
            var link = $('<a></a>');

            link.attr('href', '#');
            link.click(compareRevision.bind(null, idx));
            link.text('Revision ' + (item.revision));

            holder.append(link);
            diffContainer.append(holder);
        });

        updateDocData();
    }
}

function fetchDocument(id) {
    $.ajax({
        type: "GET",
        url: '/api/getDocument/' + id,
        success: function(res) {
            selectedDoc = res;

            docContent.val(selectedDoc.content);
            docContent.attr('readonly', false);
            updateDiffs();
        }
    });
}

function updateDocData() {
    docData.text('');

    var sizeData = $('<p></p>');

    sizeData.text('Revision History Object Size: ' + memorySizeOf(selectedDoc.history));

    docData.append(sizeData);
}

function compareRevision(rev, e) {
    e.preventDefault();

    docAtRevision.text('');
    docDiff.text('');

    var prevDoc = selectedDoc.content;
    var newDoc = '';
    var caret = 0;

    for (var i = 0; i <= rev; i++) {
        newDoc = '';
        caret = 0;

        selectedDoc.history[i].diff.forEach((item) => {
            if (item[0] === 0) { // same
                newDoc += prevDoc.slice(caret, caret + item[1]);
                caret += item[1];
            } else if (item[0] === 1) { // add
                newDoc += item[1];
            } else if (item[0] === -1) { // remove
                caret += item[1];
            }
        });

        prevDoc = newDoc;
    }

    docAtRevision.text(newDoc);

    var finalDiff = textDiff.main(selectedDoc.content, newDoc);

    textDiff.cleanupSemantic(finalDiff);

    docDiff.html(textDiff.prettyHtml(finalDiff));
}

function memorySizeOf(obj) {
    var bytes = 0;

    function sizeOf(obj) {
        if (obj !== null && obj !== undefined) {
            switch (typeof obj) {
                case 'number':
                    bytes += 8;
                    break;
                case 'string':
                    bytes += obj.length * 2;
                    break;
                case 'boolean':
                    bytes += 4;
                    break;
                case 'object':
                    var objClass = Object.prototype.toString.call(obj).slice(8, -1);
                    if (objClass === 'Object' || objClass === 'Array') {
                        for (var key in obj) {
                            if (!obj.hasOwnProperty(key)) {
                                continue;
                            }
                            sizeOf(obj[key]);
                        }
                    } else {
                        bytes += obj.toString().length * 2;
                    }
                    break;
            }
        }
        return bytes;
    }

    function formatByteSize(bytes) {
        if (bytes < 1024) {
            return bytes + " bytes";
        } else if (bytes < 1048576) {
            return (bytes / 1024).toFixed(3) + " KiB";
        } else if (bytes < 1073741824) {
            return (bytes / 1048576).toFixed(3) + " MiB";
        } else {
            return (bytes / 1073741824).toFixed(3) + " GiB";
        }
    }

    return formatByteSize(sizeOf(obj));
}

function clearFields() {
    diffContainer.html('');
    docAtRevision.text('');
    docDiff.text('');
    docData.text('');
    docContent.val('');
    docContent.attr('readonly', true);
}

(function() {
    textDiff = new diff();

    docName = $('#docName');
    docCreate = $('#docCreate');
    docsSelect = $('#docsSelect');
    docContent = $('#docContent');
    docSave = $('#docSave');
    diffContainer = $('#diffContainer');
    docAtRevision = $('#docAtRevision');
    docDiff = $('#docDiff');
    docData = $('#docData');

    updateDocumentsList();

    docCreate.click(function() {
        $.ajax({
            type: "POST",
            url: '/api/createDocument',
            data: {
                name: docName.val()
            },
            success: function(res) {
                clearFields();

                updateDocumentsList(function() {
                    docsSelect.val(res.id);

                    fetchDocument(res.id);
                });
            }
        });

        docName.val('');
    });

    docsSelect.change(function() {
        var docId = docsSelect.val();

        clearFields();

        if (!docId) {
            return;
        }

        fetchDocument(docId);
    });

    docSave.click(function() {
        selectedDoc.content = docContent.val();

        $.ajax({
            type: "POST",
            url: '/api/saveDocument',
            data: {
                id: selectedDoc.id,
                content: selectedDoc.content
            },
            success: function(res) {
                selectedDoc.history.unshift(res);

                updateDiffs();
            }
        });
    });
})();