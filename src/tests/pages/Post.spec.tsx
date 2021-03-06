import { render, screen } from "@testing-library/react";
import { mocked } from "ts-jest/utils";
import { getSession } from "next-auth/client";

import { getPrimiscClient } from "../../services/prismic";
import Post, { getServerSideProps } from "../../pages/posts/[slug]";

jest.mock("../../services/prismic");
jest.mock("next-auth/client");

const post = {
	slug: "my-new-post",
	title: "My new post",
	content: "<p>Post excerpt</p>",
	updatedAt: "28 de dezembro de 2021",
};

describe("Post page", () => {
	it("should render correctly", () => {
		render(<Post post={post} />);

		expect(screen.getByText("My new post")).toBeInTheDocument();
		expect(screen.getByText("Post excerpt")).toBeInTheDocument();
		expect(screen.getByText("28 de dezembro de 2021")).toBeInTheDocument();
	});

	it("should redirect user if no subscription is found", async () => {
		const getSessionMocked = mocked(getSession);

		getSessionMocked.mockResolvedValueOnce({
			activeSubscription: null,
		});

		const response = await getServerSideProps({
			req: {
				cookies: {},
			},
			params: {
				slug: "my-new-post",
			},
		} as any);

		expect(response).toEqual(
			expect.objectContaining({
				redirect: {
					destination: "/",
					permanent: false,
				},
			})
		);
	});

	it("should load initial data", async () => {
		const getSessionMocked = mocked(getSession);
		const getPrismicClientMocked = mocked(getPrimiscClient);

		getSessionMocked.mockResolvedValueOnce({
			activeSubscription: "fake-active-subscription",
		});

		getPrismicClientMocked.mockReturnValueOnce({
			getByUID: jest.fn().mockResolvedValueOnce({
				data: {
					title: [
						{
							type: "heading",
							text: "My new post",
						},
					],
					content: [
						{
							type: "paragraph",
							text: "Post excerpt",
						},
					],
				},
				last_publication_date: "2021-12-28T07:31:54+0000",
			}),
		} as any);

		const response = await getServerSideProps({
			params: {
				slug: "my-new-post",
			},
		} as any);

		expect(response).toEqual(
			expect.objectContaining({
				props: {
					post: {
						slug: "my-new-post",
						title: "My new post",
						content: "<p>Post excerpt</p>",
						updatedAt: "28 de dezembro de 2021",
					},
				},
			})
		);
	});
});
