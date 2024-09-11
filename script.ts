document.getElementById('resume-form')?.addEventListener('submit', function (event: Event) {
    event.preventDefault();

    // Selecting elements with proper TypeScript casting
    const profilePictureInput = document.getElementById('profilePicture') as HTMLInputElement;
    const nameElement = document.getElementById('name') as HTMLInputElement | null;
    const emailElement = document.getElementById('email') as HTMLInputElement | null;
    const contactElement = document.getElementById('contact') as HTMLInputElement | null;
    const portfolioElement = document.getElementById('portfolio') as HTMLInputElement | null;
    const summaryElement = document.getElementById('summary') as HTMLTextAreaElement | null;
    const educationElement = document.getElementById('education') as HTMLTextAreaElement | null;
    const skillsElement = document.getElementById('skills') as HTMLTextAreaElement | null;
    const experienceElement = document.getElementById('experience') as HTMLTextAreaElement | null;
    const usernameElement = document.getElementById('username') as HTMLInputElement;

    // Handle gender radio button group
    const genderElements = document.getElementsByName('gender') as NodeListOf<HTMLInputElement>;
    let gender = '';
    for (let i = 0; i < genderElements.length; i++) {
        if (genderElements[i].checked) {
            gender = genderElements[i].value;
            break;
        }
    }

    // Ensure all required elements are not null
    if (profilePictureInput && nameElement && emailElement && contactElement && portfolioElement && summaryElement
        && educationElement && skillsElement && experienceElement && usernameElement) {

        const name = nameElement.value;
        const email = emailElement.value;
        const contact = contactElement.value;
        const portfolio = portfolioElement.value;
        const summary = summaryElement.value;
        const education = educationElement.value;
        const skills = skillsElement.value;
        const experience = experienceElement.value;
        const username = usernameElement.value;
        const uniquePath = `resumes/${username.replace(/\s+/g, '_')}_cv.html`;

        // Handle profile picture
        const profilePictureFile = profilePictureInput.files?.[0];
        const profilePictureURL = profilePictureFile ? URL.createObjectURL(profilePictureFile) : '';

        // Create resume output
        const resumeOutput = `
            <h2>Resume</h2>
            ${profilePictureURL ? `<img src="${profilePictureURL}" alt="Profile Picture" class="profilePicture">` : ""}
            <p><strong>Name:</strong> ${name}</p>
            <p><strong>Email:</strong> ${email}</p>
            <p><strong>Contact:</strong> ${contact}</p>
            <p><strong>Gender:</strong> ${gender}</p>
            <p><strong>Portfolio:</strong> <a href="${portfolio}" target="_blank">${portfolio}</a></p>
            <p><strong>Summary:</strong> ${summary}</p>
            <h3>Education</h3>
            <p>${education}</p>
            <h3>Skills</h3>
            <p>${skills}</p>
            <h3>Experience</h3>
            <p>${experience}</p>
        `;

        // Create a download link for the resume
        const downloadLink = document.createElement('a');
        downloadLink.href = 'data:text/html;charset=utf-8,' + encodeURIComponent(resumeOutput);
        downloadLink.download = uniquePath;
        downloadLink.textContent = 'Download Your Resume';

        // Output the resume and the download link
        const resumeOutputElement = document.getElementById('resumeOutput');
        if (resumeOutputElement) {
            resumeOutputElement.innerHTML = resumeOutput;
            resumeOutputElement.classList.remove("hidden");
            resumeOutputElement.appendChild(downloadLink);
            makeEditable();
            resumeOutputElement.style.display = 'block';

            //create container for buttons
        const buttonsContainer = document.createElement("div");
        buttonsContainer.id = "buttonsContainer";
        resumeOutputElement.appendChild(buttonsContainer);

        //Add download Pdf button
        const downloadButton = document.createElement("button");
        downloadButton.textContent = "Download as PDF";
        downloadButton.addEventListener("click", () => {
            window.print();
        });
        buttonsContainer.appendChild(downloadButton);

        //Add shareable links
        const shareLinkButton = document.createElement("button");
        shareLinkButton.textContent = "Copy Link";
        shareLinkButton.addEventListener("click", async() =>{
            try{
                //create a unique shareble links
                const shareableLink = `https://yourdomain.com/resumes/${name.replace(
                    /\s+/g, "_"
                )}_cv.html`;

                //use clipboard API to copy shareable link
                await navigator.clipboard.writeText(shareableLink);
                alert("Shareable Link Copy To Clipboard!");
            } catch(err){
                console.error("Failed To Copy Link:", err);
                alert("Failed To Copy Link To Cliboard. Please Try Again.");
            }
        });
        buttonsContainer.appendChild(shareLinkButton);
        } else {
            console.error("Resume output container not found.");
        }
    } else {
        console.error('Some required fields are missing.');
    }
});

function makeEditable() {
    const editableElements = document.querySelectorAll('.editable');
    editableElements.forEach((element) => {
        element.addEventListener('click', function () {
            const currentElement = element as HTMLElement;
            const currentValue = currentElement.textContent || '';

            // Replace content with input field
            if (currentElement.tagName === 'P' || currentElement.tagName === 'SPAN') {
                const input = document.createElement('input');
                input.type = 'text';
                input.value = currentValue;
                input.classList.add('editing-input');

                // When focus is lost, update the content
                input.addEventListener('blur', function () {
                    currentElement.textContent = input.value;
                    currentElement.style.display = 'inline';
                    input.remove();
                });

                currentElement.style.display = 'none';
                currentElement.parentNode?.insertBefore(input, currentElement);
                input.focus();
            }
        });
    });
}
