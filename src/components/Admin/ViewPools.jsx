import React, { Component } from 'react';
import Sidebar from '../Sidebar';
import './Viewpools.css';
const Swal = require('sweetalert2');

/**
 * The about page.
 */
export default class ViewPools extends Component {
	constructor(props) {
		super(props);

		this.state = {
			Rides: [],
			Users: [],
		};

		this.getEveryRide = this.getEveryRide.bind(this);
		this.getAllUsers = this.getAllUsers.bind(this);
		this.handleDelete = this.handleDelete.bind(this);

		this.getEveryRide();
		this.getAllUsers();
	}

	getAllUsers() {
		const uri = `http://localhost:4000/user/allusers`;

		// Get user id and send it in with the post request.

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
				const arr = [];
				data.forEach((user) => {
					if (user.emailID !== 'admin@gmail.com') arr.push(user);
				});
				self.setState({
					Users: arr,
				});
				console.log('data', data);
			});
	}

	getEveryRide() {
		const uri = `http://localhost:4000/ride/rides`;

		// Get user id and send it in with the post request.

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
				const arr = [];
				data.forEach((ride) => {
					arr.push(ride);
				});
				self.setState({
					Rides: arr,
				});
				console.log('data', data);
				console.log('rides in getting', this.state.Rides);
			});
	}

	handleDelete(id) {
		console.log('ride to be deleted:', id);

		const uri = `http://localhost:4000/ride/${id}`;

		const self = this;

		fetch(uri, {
			method: 'DELETE',
			headers: {
				'Content-Type': 'application/json',
			},
		})
			.then((response) => {
				if (response.status === 200) {
					Swal.fire({
						position: 'top-end',
						icon: 'success',
						title: 'Pool is deleted',
						showConfirmButton: false,
						timer: 1500,
					});
					window.location.reload();
				}
			})
			.catch((err) => {
				console.log('Request failed', err);
			});
	}
	
	render() {
		console.log('users', this.state.Users);
		console.log('pools', this.state.Rides);
		// Loop through the Rides array and add the corresponding driver to each ride
		const ridesWithDriver = this.state?.Rides?.map((ride) => {
			const driver = this.state?.Users?.find(
				(user) => user._id === ride.driverID
			);
			console.log('driver', driver);
			return { ...ride, driver };
		});
		return (
			<div className="App">
				<div className="AppGlassNoDiv">
					<Sidebar />
					<div className='viewpools'>
						<h1>Pools</h1>
						<table className='table'>
							<thead className='thead-light'>
								<tr>
									<th className='temp' scope='col'>Serial No.</th>
									<th className='temp' scope='col'>Driver</th>
									<th className='temp' scope='col'>Departure</th>
									<th className='temp' scope='col'>Destination</th>
									<th className='temp' scope='col'>Category</th>
									<th className='temp' scope='col'>Price</th>
									<th className='temp' scope='col'>Status</th>
									<th className='temp' scope='col'>Pool Members and Waypoints</th>
									
									<th>Delete</th>
								</tr>
							</thead>
							<tbody>
								{ridesWithDriver.map((ride, index) => (
									<tr key={ride._id}>
										<td>{index + 1}</td>
										<td>{ride.driver ? ride.driver.firstname : ''}</td>
										<td>{ride.departure}</td>
										<td>{ride.destination}</td>
										<td>{ride.category}</td>
										<td>Rs.{ride.price}</td>
										<td>{ride.completed ? "completed" : "pooling"}</td>

										<td>
											{ride.poolMembers.map((member, idx) => {
												const user = this.state.Users.find(
													(u) => u._id === member.memberID
												);
												return (
													<div key={idx}>
														<p>
															{idx + 1}. Member: {user ? user.firstname : ''}
														</p>
														<p>Waypoint: {member.waypoint}</p>
													</div>
												);
											})}
										</td>
										
										<td>
											<button
												className='btn btn-danger' 
												onClick={() => this.handleDelete(ride._id)}
												>
												Delete
											</button>
										</td>
									</tr>
								))}
							</tbody>
						</table>
					</div>
				</div>
			</div>
		);
	}
}
