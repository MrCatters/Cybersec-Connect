document.addEventListener('DOMContentLoaded', function() {
    const editButton = document.querySelector("#edit-button");
    const deleteButton = document.querySelector("#delete-button");
    const yesButton = document.querySelector("#yes-button");
    const noButton = document.querySelector("#no-button");
    const maybeButton = document.querySelector("#maybe-button");

    if (editButton) {
        editButton.addEventListener('click', function() {
            window.location.href = window.location.href + "/edit";
        });
    
        deleteButton.addEventListener('click', function() {
            window.location.href = "/connections";
            fetch(window.location.href + '/delete',  {
                method: 'DELETE'
            })
        });
    }

    if (yesButton) {
        yesButton.addEventListener('click', async function() {
            let url = window.location.href;
            let connectionId = url.substring(url.lastIndexOf('/') + 1);
            
            await fetch('/rsvp/yes',  {
                method: 'POST',
                headers: {
                    'Accept': 'application/json',
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({ connectionId : connectionId })
            })
            
            window.location.href = "/auth/profile";
        });

        noButton.addEventListener('click', async function() {
            let url = window.location.href;
            let connectionId = url.substring(url.lastIndexOf('/') + 1);
            
            await fetch('/rsvp/no',  {
                method: 'POST',
                headers: {
                    'Accept': 'application/json',
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({ connectionId : connectionId })
            })

            window.location.href = "/auth/profile";
        });

        maybeButton.addEventListener('click', async function() {
            let url = window.location.href;
            let connectionId = url.substring(url.lastIndexOf('/') + 1);
            
            await fetch('/rsvp/maybe',  {
                method: 'POST',
                headers: {
                    'Accept': 'application/json',
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({ connectionId : connectionId })
            })

            window.location.href = "/auth/profile";
        });
    
    }
});