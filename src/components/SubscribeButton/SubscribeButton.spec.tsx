import { render, screen, fireEvent } from "@testing-library/react";
import { signIn, useSession } from "next-auth/client";
import { useRouter } from "next/router";
import { mocked } from "ts-jest/utils";
import { SubscribeButton } from ".";

jest.mock("next-auth/client");

jest.mock("next/router");

describe("SubscribeButton component", () => {
	it("should render correctly ", () => {
		const useSessionMocked = mocked(useSession);

		useSessionMocked.mockReturnValueOnce([null, false]);

		render(<SubscribeButton />);

		expect(screen.getByText("Subscribe now")).toBeInTheDocument();
	});

	it("should redirect user to sign in when not authenticated ", () => {
		const useSessionMocked = mocked(useSession);

		useSessionMocked.mockReturnValueOnce([null, false]);

		const signInMocked = mocked(signIn);

		render(<SubscribeButton />);

		const subscribeButton = screen.getByText("Subscribe now");

		fireEvent.click(subscribeButton);

		expect(signInMocked).toHaveBeenCalled();
	});

	it("should redirect to posts if user already has a subcription", () => {
		const useSessionMocked = mocked(useSession);
		const useRouterMocked = mocked(useRouter);

		useSessionMocked.mockReturnValueOnce([
			{
				user: {
					name: "John Doe",
					email: "john.doe@example.com",
				},
				activeSubscription: "fake-active-subscription",
				expires: "fake-expires",
			},
			false,
		]);

		const pushMock = jest.fn();

		useRouterMocked.mockReturnValueOnce({
			push: pushMock,
		} as any);

		render(<SubscribeButton />);

		const subscribeButton = screen.getByText("Subscribe now");

		fireEvent.click(subscribeButton);

		expect(pushMock).toHaveBeenCalled();
		expect(pushMock).toHaveBeenCalledWith("/posts");
	});
});
