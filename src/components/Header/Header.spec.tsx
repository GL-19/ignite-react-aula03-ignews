import { render, screen } from "@testing-library/react";
import { Header } from ".";

jest.mock("next/router", () => {
	return {
		useRouter: () => {
			return {
				pathname: "/",
			};
		},
	};
});

jest.mock("next-auth/client", () => {
	return {
		useSession: () => {
			return [null, false];
		},
	};
});

describe("Header componenet", () => {
	it("should render correctly", () => {
		render(<Header />);

		expect(screen.getByText("Home")).toBeInTheDocument();
		expect(screen.getByText("Posts")).toBeInTheDocument();
	});
});
