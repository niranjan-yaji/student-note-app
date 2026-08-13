// Cloudflare Worker API URL
const API_URL =
    "https://student-note-app.niranjan-yaji1.workers.dev";


// Get HTML elements

const noteForm = document.getElementById("noteForm");

const notesContainer =
    document.getElementById("notesContainer");

const searchInput =
    document.getElementById("search");


// Load notes when page opens

loadNotes();


// ======================================
// ADD NOTE
// ======================================

noteForm.addEventListener("submit", async function(event) {

    event.preventDefault();


    const title =
        document.getElementById("title").value.trim();

    const subject =
        document.getElementById("subject").value.trim();

    const tags =
        document.getElementById("tags").value.trim();

    const content =
        document.getElementById("content").value.trim();


    try {

        const response = await fetch(
            `${API_URL}/api/notes`,
            {
                method: "POST",

                headers: {
                    "Content-Type": "application/json"
                },

                body: JSON.stringify({
                    title: title,
                    subject: subject,
                    content: content,
                    tags: tags
                })
            }
        );


        const data = await response.json();


        if (!response.ok) {

            alert(
                data.error ||
                "Failed to save note"
            );

            return;
        }


        alert("Note saved successfully!");


        // Clear form

        noteForm.reset();


        // Reload notes

        loadNotes();

    }

    catch (error) {

        console.error(error);

        alert(
            "Unable to connect to the server."
        );
    }

});


// ======================================
// GET NOTES
// ======================================

async function loadNotes() {

    try {

        const response =
            await fetch(`${API_URL}/api/notes`);


        const notes =
            await response.json();


        displayNotes(notes);

    }

    catch (error) {

        console.error(error);

        notesContainer.innerHTML = `
            <p>
                Unable to load notes.
            </p>
        `;
    }
}


// ======================================
// DISPLAY NOTES
// ======================================

function displayNotes(notes) {

    notesContainer.innerHTML = "";


    if (notes.length === 0) {

        notesContainer.innerHTML = `
            <p>
                No notes available.
            </p>
        `;

        return;
    }


    notes.forEach(function(note) {

        const card =
            document.createElement("div");


        card.className =
            "note-card";


        card.innerHTML = `

            <h3>
                ${escapeHTML(note.title)}
            </h3>

            <div class="note-subject">
                Subject:
                ${escapeHTML(note.subject)}
            </div>

            <div class="note-content">
                ${escapeHTML(note.content)}
            </div>

            <div class="note-tags">
                Tags:
                ${escapeHTML(note.tags || "None")}
            </div>

            <div class="note-date">
                Created:
                ${escapeHTML(note.created_at)}
            </div>

            <button
                class="edit-btn"
                onclick="editNote(${note.id})"
            >
                Edit
            </button>

            <button
                class="delete-btn"
                onclick="deleteNote(${note.id})"
            >
                Delete
            </button>

        `;


        notesContainer.appendChild(card);

    });
}


// ======================================
// SEARCH
// ======================================

searchInput.addEventListener(
    "input",
    async function() {

        const searchText =
            searchInput.value.trim();


        try {

            const response =
                await fetch(
                    `${API_URL}/api/notes`
                );


            const notes =
                await response.json();


            if (!searchText) {

                displayNotes(notes);

                return;
            }


            const filteredNotes =
                notes.filter(function(note) {

                    const text =
                        (
                            note.title +
                            " " +
                            note.subject +
                            " " +
                            note.content +
                            " " +
                            note.tags
                        ).toLowerCase();


                    return text.includes(
                        searchText.toLowerCase()
                    );

                });


            displayNotes(filteredNotes);

        }

        catch (error) {

            console.error(error);
        }

    }
);


// ======================================
// DELETE NOTE
// ======================================

async function deleteNote(id) {

    const confirmation =
        confirm(
            "Are you sure you want to delete this note?"
        );


    if (!confirmation) {
        return;
    }


    try {

        const response =
            await fetch(
                `${API_URL}/api/notes/${id}`,
                {
                    method: "DELETE"
                }
            );


        const data =
            await response.json();


        if (!response.ok) {

            alert(
                data.error ||
                "Unable to delete note"
            );

            return;
        }


        alert(
            "Note deleted successfully!"
        );


        loadNotes();

    }

    catch (error) {

        console.error(error);

        alert(
            "Unable to connect to server."
        );
    }
}


// ======================================
// EDIT NOTE
// ======================================

async function editNote(id) {

    try {

        // Get note

        const response =
            await fetch(
                `${API_URL}/api/notes/${id}`
            );


        const note =
            await response.json();


        if (!response.ok) {

            alert(
                note.error ||
                "Note not found"
            );

            return;
        }


        // Ask for new values

        const title =
            prompt(
                "Enter note title:",
                note.title
            );


        if (title === null) {
            return;
        }


        const subject =
            prompt(
                "Enter subject:",
                note.subject
            );


        if (subject === null) {
            return;
        }


        const content =
            prompt(
                "Enter note content:",
                note.content
            );


        if (content === null) {
            return;
        }


        const tags =
            prompt(
                "Enter tags:",
                note.tags || ""
            );


        // Update note

        const updateResponse =
            await fetch(
                `${API_URL}/api/notes/${id}`,
                {
                    method: "PUT",

                    headers: {
                        "Content-Type":
                            "application/json"
                    },

                    body: JSON.stringify({

                        title: title,

                        subject: subject,

                        content: content,

                        tags: tags || ""

                    })
                }
            );


        const data =
            await updateResponse.json();


        if (!updateResponse.ok) {

            alert(
                data.error ||
                "Unable to update note"
            );

            return;
        }


        alert(
            "Note updated successfully!"
        );


        loadNotes();

    }

    catch (error) {

        console.error(error);

        alert(
            "Unable to connect to server."
        );
    }
}


// ======================================
// SECURITY
// ======================================

function escapeHTML(value) {

    const div =
        document.createElement("div");


    div.textContent =
        value || "";


    return div.innerHTML;
}