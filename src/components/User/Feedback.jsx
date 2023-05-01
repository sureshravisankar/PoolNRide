import React, { Component } from 'react';
import Sidebar from '../Sidebar';
import './Feedback.css'
const Swal = require('sweetalert2');

class Feedback extends Component {
	constructor(props) {
		super(props);

		this.state = {
			userID: '',
			username: '',
			emailID: '',

			loggedIn: false,
			driverID: JSON.parse(localStorage.getItem('driverID')),

			driverName: '',
			message: '',

			stars: 0, // added rating state variable with default value 0
		};

		this.handleSubmit = this.handleSubmit.bind(this);
		this.handleStarClick = this.handleStarClick.bind(this);
		this.handleChange = this.handleChange.bind(this);

		this.signedInUser();
		this.getDriverName();
	}

	signedInUser() {
		console.log('signedIn user');
		const userID = JSON.parse(localStorage.getItem('userID'));
		console.log('userID in signedIn user in feedback', userID);

		if (userID) {
			console.log('inside if');
			const uri = `http://localhost:4000/user/${userID}`;
			const self = this;

			fetch(uri, {
				method: 'GET',
				headers: {
					'Content-Type': 'application/json',
				},
			})
				.then(function (response) {
					// Check if login worked. If not, then show not logged in.
					if (response.status === 404) {
						self.setState({
							loggedin: false,
						});
					} else {
						self.setState({
							loggedIn: true,
						});
					}
					return response.json();
				})
				.then(function (signinResult) {
					console.log('signinresult', signinResult);
					// If there is a user signed in, populate the fisrt and last name fields.
					if (signinResult) {
						self.setState({
							userID: userID,
							emailID: signinResult.emailID,
							username: signinResult.username,
						});
					}

					console.log('this.state', self.state);
				})
				.catch(function (err) {
					console.log('Request failed', err);
				});
		}
	}

	getDriverName() {
		console.log('getting driver name', this.state.driverID);
		var uri = `http://localhost:4000/user/${this.state.driverID}`;
		const self = this;

		fetch(uri, {
			method: 'GET',
			headers: {
				'Content-Type': 'application/json',
			},
		})
			.then((response) => {
				return response.json();
			})
			.then((data) => {
				self.setState({
					driverName: data.username,
				});

				console.log('driverName', this.state.driverName);
			});
	}

	handleSubmit(event) {
		event.preventDefault();

		console.log('clicked on submit feedback');

		console.log(this.state);

		const uri = `http://localhost:4000/user/addFeedback`;

		const body = JSON.stringify(this.state);

		fetch(uri, {
			method: 'POST',
			body: body,
			headers: {
				'Content-Type': 'application/json',
			},
		})
			.then((response) => {
				if (response.status === 200) {
					this.setState({
						submitted: true,
					});

					console.log('feedback added');

					Swal.fire({
						title: 'Feedback is submitted successfully',
						width: 600,
						padding: '3em',
						color: '#716add',
						background: '#fff url(/images/trees.png)',
						backdrop: `
						  rgba(0,0,123,0.4)
						  url("/images/nyan-cat.gif")
						  left top
						  no-repeat
						`,
					});
					window.location.replace('/homeuser');
				} else {
					console.log('feedback not added', response);
				}
			})
			.catch(function (err) {
				console.log('Request failed: ', err);
			});
	}

	handleChange(event) {
		const target = event.target;
		const value = target.value;
		const name = target.name;

		this.setState({
			[name]: value,
		});
	}

	handleStarClick(star) {
		this.setState({ stars: star });
		console.log('stars: ', this.state.stars);
	}

	render() {
		// const stars = this.state.stars;
		console.log(this.state.emailID);
		console.log(this.state.userID);
		console.log(this.state.username);
		console.log(this.state.driverName);
		return (
			<div className="App">
				<div className="AppGlassNoDiv">
					<Sidebar />
					<div className="FeedbackForm-container">
						<h1 className='NewFormHeading'>Feedback</h1>
						<form className="FeedbackForm" onSubmit={this.handleSubmit}>
							<table className='table'>
								<tbody>
									<tr>
										<td className='NewFormTd'>
											<label className="FeedbackFormLabel">User name</label>
											<input
												className="FeedbackFormInput"
												type="text"
												name="username"
												value={this.state.username}
												readOnly
											/>
										</td>
									</tr>
								
									<tr>
										<td className='NewFormTd'>	
											<label className="FeedbackFormLabel">Email Address</label>
											<input
												className="FeedbackFormInput"
												type="text"
												name="emailID"
												value={this.state.emailID}
												readOnly
											/>
										</td>
									</tr>
								
									<tr>
										<td className='NewFormTd'>
											<label className="FeedbackFormLabel">To driver</label>
											<input
												className="FeedbackFormInput"
												type="text"
												name="driverName"
												value={this.state.driverName}
												readOnly
											/>
										</td>
									</tr>
								
									<tr>
										<td className='NewFormTd'>
											<label className="FeedbackFormLabel">Message</label>
											<input
												className="FeedbackFormInput"
												type="text"
												name="message"
												value={this.state.message}
												onChange={this.handleChange}
											/>
										</td>
									</tr>
									<tr>
										<td className='NewFormTd'>
											<label className="FeedbackFormLabel">Rating</label>
											<div className='ratingStars'>
												{[1, 2, 3, 4, 5].map((star) => (
													<span key={star} onClick={() => this.handleStarClick(star)}>
														{star <= this.state.stars ? '★' : '☆'}
													</span>
												))}
											</div>
										</td>
									</tr>
								</tbody>
							</table>
							
							<button
								className='btn btn-primary submitButton'
								type="submit"
							>
								Submit
							</button>
						</form>
					</div>
				</div>
			</div>
		);
	}
}
export default Feedback;
