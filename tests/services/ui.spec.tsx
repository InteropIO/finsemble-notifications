/* eslint-disable @typescript-eslint/ban-ts-ignore */
import * as React from "react";
import { expect } from "chai";
import { render } from "@testing-library/react";
// import "@testing-library/jest-dom/extend-expect";
// TODO: this component needs to be cleaned up
import NotificationIcon from "../../components/notification-icon/NotificationIcon";

// @ts-ignore
describe("testing the UI", () => {
	// @ts-ignore
	it("loads and displays greeting", () => {
		// @ts-ignore
		// example but needs to be changed from NotificationIcon
		const { container, getByText } = render(<NotificationIcon />);
		// @ts-ignore
		expect(getByText("hello world")).to.be.true();
		// 	expect(container.firstChild).to.be(`
		//   <div></div>
		// `);
	});
});
