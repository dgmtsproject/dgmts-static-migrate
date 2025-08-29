
		<!-- Newsletter Popup Modal -->
		<div id="newsletterModal" class="newsletter-modal" style="display: none;">
			<div class="newsletter-modal-overlay" onclick="closeNewsletterModal()"></div>
			<div class="newsletter-modal-content">
				<button class="newsletter-modal-close" onclick="closeNewsletterModal()">&times;</button>
				<div class="newsletter-modal-body">
					<div class="newsletter-modal-header">
						<img src="https://dgmtsphp.byethost24.com/dgmts/dgweb/assets/img/cropped-logo.png" alt="DGMTS Logo" style="height: 60px; margin-bottom: 15px;">
						<h3 style="color: #003366; margin-bottom: 10px;">Stay Updated with DGMTS</h3>
						<p style="color: #666; margin-bottom: 20px;">Get the latest news, blog posts, and updates from Dulles Geotechnical and Material Testing Services delivered to your inbox.</p>
					</div>
					
					<form id="modalNewsletterForm" action="<?php echo BASE_URL; ?>newsletter-subscribe.php" method="post">
						<input type="hidden" name="form_subscribe" value="1">
						<div class="newsletter-modal-form">
							<input type="email" 
								   name="subscriber_email" 
								   placeholder="Enter your email address" 
								   style="width: 100%; 
										  padding: 12px 15px; 
										  border: 2px solid #ddd; 
										  border-radius: 25px; 
										  font-size: 14px; 
										  margin-bottom: 15px;
										  box-sizing: border-box;
										  outline: none;
										  transition: border-color 0.3s ease;" 							   
								   required>
							<button type="submit" 
									name="form_subscribe" 
									style="width: 100%;
										   background: linear-gradient(45deg, #007bff, #0056b3); 
										   color: white; 
										   border: none; 
										   padding: 12px 20px; 
										   border-radius: 25px; 
										   cursor: pointer; 
										   font-size: 15px; 
										   font-weight: 600;
										   transition: all 0.3s ease;">
								<i class="fa fa-envelope" style="margin-right: 8px;"></i>Subscribe to Newsletter
							</button>
						</div>
					</form>
					
					<div class="newsletter-modal-footer">
						<p style="font-size: 12px; color: #999; margin: 15px 0 5px 0; text-align: center;">
							<i class="fa fa-lock" style="margin-right: 5px;"></i>Your email is safe with us. Unsubscribe anytime.
						</p>
						<p style="font-size: 11px; color: #ccc; margin: 0; text-align: center;">
							<a href="#" onclick="closeNewsletterModal(); return false;" style="color: #007bff; text-decoration: none;">No thanks, maybe later</a>
						</p>
					</div>
				</div>
			</div>
		</div>

		<!-- Newsletter Modal Styles -->
		<style>
		.newsletter-modal {
			position: fixed;
			top: 0;
			left: 0;
			width: 100%;
			height: 100%;
			background: rgba(0, 0, 0, 0.6);
			z-index: 10000;
			display: flex;
			align-content: center;
			justify-content: center;
			opacity: 0;
			visibility: hidden;
			transition: all 0.3s ease;
		}

		.newsletter-modal.show {
			opacity: 1;
			visibility: visible;
		}

		.newsletter-modal-overlay {
			position: fixed;
			top: 0;
			left: 0;
			width: 100%;
			height: 100%;
			z-index: 1;
		}

		.newsletter-modal-content {
			background: white;
			border-radius: 15px;
			max-width: 500px;
			width: 90%;
			max-height: 90vh;
			overflow-y: auto;
			position: relative;
			z-index: 2;
			transform: scale(0.7);
			transition: transform 0.3s ease;
			box-shadow: 0 20px 60px rgba(0, 0, 0, 0.3);
			margin: auto;
		}

		.newsletter-modal.show .newsletter-modal-content {
			transform: scale(1);
		}

		.newsletter-modal-close {
			position: absolute;
			top: 15px;
			right: 20px;
			background: none;
			border: none;
			font-size: 24px;
			color: #999;
			cursor: pointer;
			z-index: 3;
			transition: color 0.3s ease;
		}

		.newsletter-modal-close:hover {
			color: #333;
		}

		.newsletter-modal-body {
			padding: 40px 30px 30px;
			text-align: center;
		}

		.newsletter-modal-form input:focus {
			border-color: #007bff;
			box-shadow: 0 0 10px rgba(0, 123, 255, 0.2);
		}

		.newsletter-modal-form button:hover {
			background: linear-gradient(45deg, #0056b3, #004085);
			transform: translateY(-2px);
			box-shadow: 0 6px 20px rgba(0, 123, 255, 0.3);
		}

		@media (max-width: 576px) {
			.newsletter-modal-content {
				width: 95%;
				margin: 20px auto;
			}
			
			.newsletter-modal-body {
				padding: 30px 20px 20px;
			}
		}
		</style>

		<!-- Newsletter Modal JavaScript -->
		<script>
		// Check if user has already seen the modal
		function shouldShowNewsletterModal() {
			// Check if modal was already shown today
			const lastShown = localStorage.getItem('newsletterModalShown');
			const today = new Date().toDateString();
			
			// Show modal if never shown or if it was shown more than 7 days ago
			if (!lastShown || (new Date(lastShown).getTime() < Date.now() - 7 * 24 * 60 * 60 * 1000)) {
				return true;
			}
			return false;
		}

		// Show newsletter modal
		function showNewsletterModal() {
			const modal = document.getElementById('newsletterModal');
			modal.style.display = 'flex';
			setTimeout(() => {
				modal.classList.add('show');
			}, 10);
			
			// Mark as shown
			localStorage.setItem('newsletterModalShown', new Date().toISOString());
		}

		// Close newsletter modal
		function closeNewsletterModal() {
			const modal = document.getElementById('newsletterModal');
			modal.classList.remove('show');
			setTimeout(() => {
				modal.style.display = 'none';
			}, 300);
		}

		// Handle form submission
		document.addEventListener('DOMContentLoaded', function() {
			// Show modal after page loads if conditions are met
			if (shouldShowNewsletterModal()) {
				setTimeout(showNewsletterModal, 7000); // Show after 2 seconds
			}

			// Handle form submission via AJAX
			const form = document.getElementById('modalNewsletterForm');
			if (form) {
				form.addEventListener('submit', function(e) {
					e.preventDefault();
					
					const formData = new FormData(form);
					const email = formData.get('subscriber_email');
					
					// Basic email validation
					if (!email || !email.includes('@')) {
						alert('Please enter a valid email address.');
						return;
					}

					// Disable button during submission
					const submitButton = form.querySelector('button[type="submit"]');
					const originalText = submitButton.innerHTML;
					submitButton.innerHTML = '<i class="fa fa-spinner fa-spin" style="margin-right: 8px;"></i>Subscribing...';
					submitButton.disabled = true;

					// Submit form data with AJAX headers
					fetch('<?php echo BASE_URL; ?>newsletter-subscribe.php', {
						method: 'POST',
						body: formData,
						headers: {
							'X-Requested-With': 'XMLHttpRequest'
						}
					})
					.then(response => {
						if (!response.ok) {
							throw new Error('Network response was not ok');
						}
						return response.json();
					})
					.then(data => {
						// Re-enable button
						submitButton.innerHTML = originalText;
						submitButton.disabled = false;
						
						// Handle response
						if (data.status === 'success') {
							alert(data.message);
							closeNewsletterModal();
						} else if (data.status === 'error') {
							alert(data.message);
						} else {
							alert('Thank you for your interest! Your subscription has been processed.');
							closeNewsletterModal();
						}
					})
					.catch(error => {
						// Re-enable button
						submitButton.innerHTML = originalText;
						submitButton.disabled = false;
						
						console.error('Error:', error);
						alert('There was an error processing your subscription. Please try again.');
					});
				});
			}

			// Close modal when clicking outside
			document.addEventListener('click', function(e) {
				const modal = document.getElementById('newsletterModal');
				if (e.target.classList.contains('newsletter-modal-overlay')) {
					closeNewsletterModal();
				}
			});

			// Close modal with Escape key
			document.addEventListener('keydown', function(e) {
				if (e.key === 'Escape') {
					const modal = document.getElementById('newsletterModal');
					if (modal.classList.contains('show')) {
						closeNewsletterModal();
					}
				}
			});
		});
		</script>