import React from "react";
import { NotificationClient } from "../../../../../../src/components/finsemble-notifications/services/notification/notificationClient";
import * as PropTypes from "prop-types";

class RemoveMute extends React.Component {
	constructor(props) {
		super(props);

		const { filter } = props;

		let message = "";

		if (filter.type && filter.source) {
			message = `Mute '${filter.type}' type notifications from '${filter.source}'`;
		} else if (filter.source) {
			message = `Mute notifications from '${filter.source}'`;
		} else if (filter.type) {
			message = `Mute '${filter.type}' type notifications`;
		}

		this.state = {
			message: message,
			filter: filter
		};

		this.notificationClient = new NotificationClient();

		this.unmute = this.unmute.bind(this);
	}

	unmute(event) {
		console.log(event.target);
		const target = event.target;
		const filter = {};

		if (target.dataset.notificationSource) {
			filter.source = target.dataset.notificationSource;
		}

		if (target.dataset.notificationType) {
			filter.type = target.dataset.notificationType;
		}

		this.notificationClient.unmute(filter);
	}

	render() {
		return (
			<div
				className="mute-filter"
				style={{ cursor: "pointer" }}
				onClick={this.unmute}
				data-notification-source={this.state.filter.source ? this.state.filter.source : null}
				data-notification-type={this.state.filter.type ? this.state.filter.type : null}
			>
				<span>{this.state.message}</span> <i className="ff-adp-trash-outline" />
				<br />
			</div>
		);
	}
}

RemoveMute.propTypes = {
	filter: {
		source: PropTypes.string,
		type: PropTypes.string
	}
};

export default class Preferences extends React.Component {
	constructor(props) {
		super(props);
		this.state = {
			muteFilters: []
		};

		this.applyMuteFilterChange = this.applyMuteFilterChange.bind(this);
	}

	applyMuteFilterChange(err, config) {
		// configClient.getValue() and configClient.addListener return different formats
		if (config.value) {
			config = config.value;
		}
		this.setState({ muteFilters: config });
	}

	componentDidMount() {
		FSBL.Clients.ConfigClient.getValue({ field: "finsemble.notifications.mute" }, this.applyMuteFilterChange);
		FSBL.Clients.ConfigClient.addListener({ field: "finsemble.notifications.mute" }, this.applyMuteFilterChange);
	}

	componentWillUnmount() {
		FSBL.Clients.ConfigClient.removeListener({ field: "finsemble.notifications.mute" }, this.applyMuteFilterChange);
	}

	render() {
		return (
			<div className="preferences-mute-container complex-menu-content-row">
				<h3>Remove Mute Filters</h3>
				{this.state.muteFilters.map((filter, key) => {
					return <RemoveMute key={filter.source + filter.type} filter={filter} />;
				})}
			</div>
		);
	}
}
