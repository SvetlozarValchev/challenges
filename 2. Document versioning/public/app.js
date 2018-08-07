var docName;
var docCreate;
var docsSelect;
var docContent;
var docSave;
var selectedDoc;

function updateDocumentsList(callback) {
    $.ajax({
        type: "GET",
        url: '/api/getAllDocuments',
        success: function (res) {
            $.each(res, function (key, value) {
                docsSelect.append('<option value=' + value.id + '>' + value.name + '</option>');
            });

            if (callback) {
                callback(res);
            }
        }
    });
}

function updateDiffs() {

}

function fetchDocument(id) {

}

(function () {
    docName = $('#doc_name');
    docCreate = $('#doc_create');
    docsSelect = $('#docs_select');
    docContent = $('#doc_content');
    docSave = $('#doc_save');

    updateDocumentsList();

    docCreate.click(function () {
        $.ajax({
            type: "POST",
            url: '/api/createDocument',
            data: {
                name: docName.val()
            },
            success: function (res) {
                updateDocumentsList(function () {
                    docsSelect.val(res.id);
                });
            }
        });
    });

    docsSelect.change(function () {
        const docId = docsSelect.val();

        if (!docId) {
            docContent.text('');
            return;
        }

        $.ajax({
            type: "GET",
            url: '/api/getDocument/' + docId,
            success: function (res) {
                selectedDoc = res;

                docContent.text(selectedDoc.content);
                updateDiffs();
            }
        });
    });

    docSave.click(function () {
        selectedDoc.content = docContent.val();

        $.ajax({
            type: "POST",
            url: '/api/saveDocument',
            data: {
                id: selectedDoc.id,
                content: selectedDoc.content
            },
            success: function (res) {
                updateDiffs();
            }
        });
    });
})();