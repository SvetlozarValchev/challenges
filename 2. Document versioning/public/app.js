var docName;
var docCreate;
var docsSelect;
var docContent;
var selectedDoc;

function updateDocumentsList(callback) {
  $.ajax({
    type: "GET",
    url: '/getAllDocuments',
    success: function(res) {
      $.each(res, function(key, value) {
        docsSelect.append('<option value=' + value.id + '>' + value.name + '</option>');
      });

      if (callback) {
        callback(res);
      }
    }
  });
}

(function() {
  docName = $('#doc_name');
  docCreate = $('#doc_create');
  docsSelect = $('#docs_select');
  docContent = $('#doc_content');

  updateDocumentsList();

  docCreate.click(function() {
    $.ajax({
      type: "POST",
      url: '/createDocument',
      data: {
        name: docName.val()
      },
      success: function(res) {
        console.log(res.id);
        updateDocumentsList(function() {
          docsSelect.val(res.id);
        });
      }
    });
  });

  docsSelect.change(function() {
    const docId = docsSelect.val();

    if (!docId) {
      docContent.text('');
      return;
    }

    $.ajax({
      type: "GET",
      url: '/getDocument/' + docId,
      success: function(res) {
        selectedDoc = res;

        docContent.text(selectedDoc.content);
      }
    });
  });
})();