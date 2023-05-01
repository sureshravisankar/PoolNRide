import React, { Component } from 'react';
import Sidebar from '../Sidebar';
import './Payment.css'
const Swal = require('sweetalert2');

export default class Payment extends Component {
	constructor(props) {
		super(props);

		this.state = {
			poolDetails: JSON.parse(localStorage.getItem('poolDetails')),
			poolers: [],
		};

		this.handleArchive = this.handleArchive.bind(this);

		this.getAllPoolMembers();
	}

	getAllPoolMembers() {
		const arr = [];

		this.state.poolDetails.poolMembers.forEach((id) => {
			const uri = `http://localhost:4000/user/${id.memberID}`;

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
					arr.push(data);

					// Move this.setState() and console.log() inside the last .then() callback
					if (arr.length === this.state.poolDetails.poolMembers.length) {
						this.setState(
							{
								poolers: arr,
							},
							() => {
								console.log('poolers:', this.state.poolers);
								console.log('arr:', arr);
							}
						);
					}
				})
				.catch((error) => {
					console.error('Error fetching user data:', error);
				});
		});
	}

	handleArchive() {
		console.log('clicked on archive');

		let timerInterval;
		Swal.fire({
			title: 'Auto close alert!',
			html: 'I will close in <b></b> milliseconds.',
			timer: 2000,
			timerProgressBar: true,
			didOpen: () => {
				Swal.showLoading();
				const b = Swal.getHtmlContainer().querySelector('b');
				timerInterval = setInterval(() => {
					b.textContent = Swal.getTimerLeft();
				}, 100);
			},
			willClose: () => {
				clearInterval(timerInterval);
			},
		}).then((result) => {
			/* Read more about handling dismissals below */
			if (result.dismiss === Swal.DismissReason.timer) {
				console.log('I was closed by the timer');
			}
		});

		window.location.replace('/homeuser');
	}

	render() {
		console.log('pool details payment:', this.state.poolDetails.departure);
		return (
			<div className="App">
				<div className="AppGlassNoDiv">
					<Sidebar />
					<div className='paymentTable'>
						{this.state.poolers.length && (
							<table className='table'>
								<thead className='thead-light'>
									<tr>
										<th scope='col'>Serial No.</th>
										<th scope='col'>First Name</th>
										<th scope='col'>Waypoint</th>
										<th scope='col'>Price</th>
									</tr>
								</thead>
								<tbody>
									{this.state.poolers?.map((user, index) => (
										<tr key={user._id}>
											<td>{index + 1}</td>
											<td>{user.firstname}</td>
											<td>
												{this.state.poolDetails.poolMembers[index].waypoint}
											</td>
											<td>
												The price will be intimated at ur drop off location by
												the driver.
											</td>
										</tr>
									))}
								</tbody>
							</table>
						)}
						{!this.state.poolers.length && <h3>No riders for this ride.</h3>}
						<button 
							className='btn btn-secondary'
							onClick={this.handleArchive}
						>
							Archive
						</button>
					</div>
				</div>
			</div>
		);
	}
}
