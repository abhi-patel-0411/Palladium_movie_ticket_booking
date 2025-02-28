 
        // Function to get URL parameters
        function getURLParameter(name) {
            const urlParams = new URLSearchParams(window.location.search);
            return urlParams.get(name);
        }

        // Get movie information from the URL
        const movieName = getURLParameter('movie');
        const movieImage = getURLParameter('img');
        const movieVideo = getURLParameter('video');
        const movieScreen = getURLParameter('screen');
        const movieTimes = getURLParameter('time');

        // Update the content based on URL parameters
        document.getElementById('moviePoster').src = movieImage;
        document.querySelector('.movie-card h3').textContent = movieName;
        document.getElementById('trailerVideo').src = movieVideo;
        document.getElementById('movieName').textContent = movieName;
        document.getElementById('showscreen').textContent = `ShowScreen: ` + movieScreen;
         const movieTimeDropdown = document.getElementById('movieTime');

        if (movieTimes) {
            const timesArray = movieTimes.split(','); // Convert string to array

            timesArray.forEach(time => {
                const option = document.createElement('option');
                option.value = time.trim();
                option.textContent = time.trim();
                movieTimeDropdown.appendChild(option);
            });
        }



        // Booking system variables
        const movieDate = document.getElementById('movieDate');
        const movieTime = document.getElementById('movieTime');
        const bookTicketBtn = document.getElementById('bookTicketBtn');
        const ticketContainer = document.getElementById('ticketContainer');
        const selectedSeatsElement = document.getElementById('ticketInfo');
        

        // Store booked tickets
        let allBookedTickets = [];

        // Generate seats dynamically (10 rows, 18 seats per row)
        const totalRows = 10;
        const totalSeatsPerRow = 18;
        const alphabet = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';
        let seatsHTML = '';

        for (let row = 0; row < totalRows; row++) {
            for (let seat = 1; seat <= totalSeatsPerRow; seat++) {
                const seatLabel = `${alphabet[row]}${seat}`;
                seatsHTML += `<div class="seat" data-row="${alphabet[row]}" data-seat="${seat}">${seatLabel}</div>`;
            }
        }
        document.getElementById('seats').innerHTML = seatsHTML;

        // Handle seat selection
        const seats = document.querySelectorAll('.seat');
        seats.forEach(seat => {
            seat.addEventListener('click', function () {
                if (!isLoggedIn) {
                    alert('Please sign in before selecting a seat.');
                    signInModal.show();
                    return;
                }
                if (this.classList.contains('booked')) return;
                this.classList.toggle('selected');
                updateTicketInfo();
            });
        });

        // Update ticket info
        function updateTicketInfo() {
            const selectedSeats = document.querySelectorAll('.seat.selected');
            const submitButton = paymentForm.querySelector('button[type="submit"]');
            if (selectedSeats.length > 0) {
                let seatDetails = 'Selected Seats: ';
                selectedSeats.forEach(seat => {
                    const row = seat.getAttribute('data-row');
                    const seatNo = seat.getAttribute('data-seat');
                    seatDetails += `${row}-${seatNo}, `;
                });
                const totalPrice = selectedSeats.length * 450;
                seatDetails = seatDetails.slice(0, -2) + ` | Total: ₹${totalPrice}`; //remove last , and space->return new array not change in orignal
                selectedSeatsElement.textContent = seatDetails;
                
               bookTicketBtn.disabled = false;
                submitButton.innerHTML = `<i class="fas fa-credit-card"></i> Proceed to Pay ₹${totalPrice}`;
                submitButton.disabled = false;
            } else {
                selectedSeatsElement.textContent = 'No tickets selected yet.';
                bookTicketBtn.disabled = true;
                submitButton.innerHTML = `Proceed to Pay`;
                submitButton.disabled = true;
            }
        }

function generateTickets() {
    const selectedSeats = document.querySelectorAll('.seat.selected');
    const selectedDate = movieDate.value;
    const selectedTime = movieTime.value;
    ticketContainer.innerHTML = ''; // Clear previous tickets

    selectedSeats.forEach(seat => {
        const row = seat.getAttribute('data-row');
        const seatNo = seat.getAttribute('data-seat');
        const seatPrice = 450;

        // Generate a unique barcode value
        let barcodeValue = `${row}${seatNo}${seatPrice}${selectedDate.replace(/-/g, '')}`; //g-global flag jetla occarance ave te bdha replace not first 

        const ticketTemplate = document.getElementById('ticket').cloneNode(true);
        ticketTemplate.style.display = 'block';

        ticketTemplate.querySelector('#ticketDate').textContent = selectedDate;
        ticketTemplate.querySelector('#ticketTime').textContent = selectedTime;
        ticketTemplate.querySelector('#movieName').textContent = movieName;
        ticketTemplate.querySelector('#seatDetails').textContent = `${row}-${seatNo}`;
        ticketTemplate.querySelector('#ticketPrice').textContent = `₹${seatPrice}`;
        ticketTemplate.querySelector('.movieimg img').src = movieImage;

        // Select barcode element properly
        const barcodeElement = ticketTemplate.querySelector('.barcode');
        if (barcodeElement) {
            let barcodeId = `barcode-${row}-${seatNo}`;
            barcodeElement.id = barcodeId; // Set unique ID
        } else {
            console.error(`Barcode element not found in the ticket template for seat ${row}-${seatNo}`);
        }

        ticketContainer.appendChild(ticketTemplate); // Append the ticket to the DOM
        
        // Delay JsBarcode execution to ensure the element is available
        setTimeout(() => {
            const barcodeElement = document.getElementById(`barcode-${row}-${seatNo}`);
            if (barcodeElement) {
                JsBarcode(`#barcode-${row}-${seatNo}`, barcodeValue, {
                    format: "CODE128",
                    lineColor: "#000",
                    width: 2,
                    height: 100,
                    displayValue: true
                });
            } else {
                console.error(`JsBarcode error: Barcode element not found for ${row}-${seatNo}`);
            }
        }, 100); // Small delay to ensure the element is in the DOM

        seat.classList.remove('selected');
        seat.classList.add('booked');
    });

    bookTicketBtn.disabled = true;
    alert('Tickets booked successfully!');
}


        const paymentModal = new bootstrap.Modal(document.getElementById('paymentModal'));
            const paymentForm = document.getElementById('creditCardForm');

            // Show Payment Modal when "Book Tickets" is clicked
            bookTicketBtn.addEventListener('click', function () {
                if (!isLoggedIn) {
                    alert('Please sign in to proceed.');
                    signInModal.show();
                    return;
                }

                if (document.querySelectorAll('.seat.selected').length === 0) {
                    alert('Please select at least one seat before booking.');
                    return;
                }

                // Show Payment Modal
                paymentModal.show();
            });

                
            document.addEventListener('DOMContentLoaded', function () {
                const creditCardOption = document.getElementById('credit-card-option');
                
                const creditCardFields = document.getElementById('credit-card-fields');
                
                const paymentForm = document.getElementById('creditCardForm');
                

                creditCardOption.classList.add('selected');

                creditCardOption.addEventListener('click', function () {
                    creditCardFields.style.display = 'block';
                
                    creditCardOption.classList.add('selected');
            
                });

                    

                       
                paymentForm.addEventListener('submit', function (event) {
                    event.preventDefault();
                    
                    // Disable the button to prevent multiple clicks
                    const submitButton = paymentForm.querySelector('button[type="submit"]');
                    submitButton.disabled = true;
                    submitButton.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Processing';

                    setTimeout(() => {
                        alert('Payment Successful! Tickets will now be generated.');
                        paymentModal.hide();
                        generateTickets(); // Display tickets

                        // Reset button after processing
                        submitButton.innerHTML = 'Proceed to Pay';
                        submitButton.disabled = false;
                    }, 1000);
                });

        });



        // Reset seats when movie, date, or time changes
        function resetSeats() {
            // Remove the selected class from all seats
            const selectedSeats = document.querySelectorAll('.seat.selected');
            selectedSeats.forEach(seat => {
                seat.classList.remove('selected');
            });

            // Remove the booked class from all booked seats to allow re-selection
            const bookedSeats = document.querySelectorAll('.seat.booked');
            bookedSeats.forEach(seat => {
                seat.classList.remove('booked');
            });

            // Clear the ticket container
            ticketContainer.innerHTML = '';

            // Update ticket info and disable the book button
            selectedSeatsElement.textContent = 'No tickets selected yet.';
            bookTicketBtn.disabled = true;
        }
        movieDate.addEventListener('change', resetSeats);
        movieTime.addEventListener('change', resetSeats);



        const currentDate = new Date().toISOString().split('T')[0];//T is saprator between date and time
        
        // Set the min attribute of the movieDate input to the current date
        document.getElementById('movieDate').setAttribute('min', currentDate);
            
        document.getElementById('movieDate').value = currentDate;

        
        // video

        let playButton = document.getElementById('playButton');
        let videoContainer = document.getElementById('trailerContainer');
        let playIcon = document.getElementById('play');
        let video = document.getElementById('trailerVideo');
        let bookButton = document.querySelector('.button-container a');
        // Play/Pause functionality
        playButton.addEventListener('click', () => {
            if (video.paused) {
                videoContainer.style.display = 'block';
                video.play();
                playIcon.classList.remove('bi-play-fill');
                playIcon.classList.add('bi-pause');
                playButton.classList.add('transparent');
                bookButton.classList.add('transparent');

            } else {
                video.pause();
                videoContainer.style.display = 'none';
                playIcon.classList.add('bi-play-fill');
                playIcon.classList.remove('bi-pause');
                playButton.classList.remove('transparent');
                bookButton.classList.remove('transparent');
                
            }
        });

      
video.addEventListener('ended', () => {
    videoContainer.classList.remove('show'); // Fade out when video ends

    setTimeout(() => {
        videoContainer.style.display = 'none'; // Hide after fade-out
    }, 500);

    playIcon.classList.add('bi-play-fill');
    playIcon.classList.remove('bi-pause');
});

// Toggle trailer container visibility
document.getElementById('playButton').addEventListener('click', function () {
    var trailerContainer = document.getElementById('trailerContainer');

    if (trailerContainer.classList.contains('show')) {
        trailerContainer.classList.remove('show');
        setTimeout(function () {
            trailerContainer.style.display = "none";
        }, 500); // Wait for fade-out to finish before setting display to none
    } else {
        trailerContainer.style.display = "block"; // Temporarily set to block to allow fade-in
        setTimeout(function () {
            trailerContainer.classList.add('show');
        }, 10); // Small delay to trigger the transition
    }
});
  
let users = [];
let isLoggedIn = false;
let fromSignUp = false;

const userIcon = document.getElementById('userIcon');
const signUpModal = new bootstrap.Modal(document.getElementById('signUpModal'));
const signInModal = new bootstrap.Modal(document.getElementById('signInModal'));
const successModal = new bootstrap.Modal(document.getElementById('successModal'));

const signUpForm = document.getElementById('signUpForm');
const signInForm = document.getElementById('signInForm');
const successMessage = document.getElementById('successMessage');
const emailRegex = /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/;


userIcon.addEventListener('click', () => {
    if (isLoggedIn) {

        isLoggedIn = false;
        userIcon.className = "fas fa-user-circle fa-2x";
        alert('You have logged out successfully!');
    } else {

        fromSignUp = false;
        signInModal.show();
    }
});


signInForm.addEventListener('submit', (event) => {
    event.preventDefault();


    if (!fromSignUp) {
        isLoggedIn = true;
        userIcon.className = "fas fa-sign-out-alt fa-2x";
        const name = document.getElementById('signInName').value;
     
        
        successMessage.textContent = `Welcome back, ${name}!`;
        signInModal.hide();
        successModal.show();
        return;
    }


    const email = document.getElementById('signInEmail').value;
    const password = document.getElementById('signInPassword').value;

    const user = users.find(u => u.email === email && u.password === password);
    if (user) {
        isLoggedIn = true;
        userIcon.className = "fas fa-sign-out-alt fa-2x";
        const name = document.getElementById('signInName').value;

        successMessage.textContent = `Welcome back, ${name}!`;
        signInModal.hide();
        successModal.show();
    } else {
        alert('Invalid credentials. Please try again.');
    }
});


document.getElementById('signUpIcon').addEventListener('click', () => {
    signUpModal.show();
});

signUpForm.addEventListener('submit', (event) => {
    event.preventDefault();
    const email = document.getElementById('signUpEmail').value;
    const password = document.getElementById('signUpPassword').value;
    // const name = document.getElementById('signUpName').value;
    

    users.push({email, password });
    alert('Sign Up Successful! Please sign in.');
    signUpModal.hide();

    fromSignUp = true;
    signInModal.show();
    
});
