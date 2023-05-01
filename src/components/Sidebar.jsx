import React, { Component } from 'react';
import './Sidebar.css';
import { UilSignOutAlt } from '@iconscout/react-unicons';
import { SidebarData } from '../Data/Data';
import { UilBars } from '@iconscout/react-unicons';
import { motion } from 'framer-motion';
import { NavLink } from 'react-router-dom';

class Sidebar extends Component {
	constructor(props) {
		super(props);
		this.state = {
			selected: 0,
			expanded: true
		};
		this.handleExpandSidebar = this.handleExpandSidebar.bind(this);
		this.logout = this.logout.bind(this);
	}

	logout() {
		console.log('called logout');
		localStorage.clear();

		window.location.replace('/');
	}

	handleExpandSidebar() {
		this.setState({ expanded: !this.state.expanded });
	}	

	render() {
		const { selected, expanded } = this.state;

		const sidebarVariants = {
			true: {
				left: '0',
			},
			false: {
				left: '-60%',
			},
		};

		return (
			<>
				<div
					className="bars"
					style={expanded ? { left: '60%' } : { left: '5%' }}
					onClick={this.handleExpandSidebar}
				>
					<UilBars />
				</div>
				<motion.div
					className="sidebar"
					variants={sidebarVariants}
					animate={window.innerWidth <= 768 ? `${expanded}` : ''}
				>
					{/* logo */}
					<div className="logo">
						{/* <img src={Logo} alt="logo" /> */}
						<span>
							Pool<span>N</span>Ride
						</span>
					</div>

					<div className="menu">
						{SidebarData.map((item, index) => {
							return (
								<NavLink
									className='menuItem'
										// selected === index ? 'menuItem active' : 'menuItem'
									
									key={index}
									onClick={() => this.setState({selected: index})}
									to={item.navigateTo} 
								>
									<item.icon />
									{item.heading}
									{/* <NavLink to={item.navigateTo}>{item.heading}</NavLink> */}
									{/* <Link to={item.navigateTo} 
										onClick={() => this.setState({selected: index})}>
										<span>{item.heading}</span>
									</Link> */}
								</NavLink>
							);
						})}
						{/* signoutIcon */}
						<div className="menuItem" onClick={this.logout}>
							<UilSignOutAlt />
							Signout
						</div>
					</div>
				</motion.div>
			</>
		);
	}
}

export default Sidebar;
