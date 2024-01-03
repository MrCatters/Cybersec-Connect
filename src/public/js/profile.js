document.addEventListener('DOMContentLoaded', function() {
    const editButtons = document.querySelectorAll("#edit-button");
    const deleteButtons = document.querySelectorAll("#delete-button");
    const buttonSpans = document.querySelectorAll("#button-col");
    const connectionIds = Array.from(buttonSpans).map(buttonSpans => buttonSpans.getAttribute("connection-id"));

    for (let i = 0; i < connectionIds.length; i++) {
        editButtons[i].addEventListener('click', async function() {
            window.location.href = "/connections/connection/" + connectionIds[i] + "/edit";
            fetch(window.location.href, {
                method: 'POST'
            });
        });
        
        deleteButtons[i].addEventListener('click', async function() {
            window.location.href = '/auth/profile';
            const deleteURL = "/connections/connection/" + connectionIds[i] + "/delete";
            fetch(deleteURL,  {
                method: 'DELETE'
            });
        });
    }
});