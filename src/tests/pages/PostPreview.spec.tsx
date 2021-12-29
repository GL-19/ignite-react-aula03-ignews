import { render, screen } from "@testing-library/react";
import { mocked } from "ts-jest/utils";
import { useSession } from "next-auth/client";

import { getPrimiscClient } from "../../services/prismic";
import Post, { getStaticProps } from "../../pages/posts/preview/[slug]";
import { useRouter } from "next/router";

jest.mock("../../services/prismic");
jest.mock("next-auth/client");
jest.mock("next/router");

const post = {
	slug: "my-new-post",
	title: "My new post",
	content: "<p>Post excerpt</p>",
	updatedAt: "28 de dezembro de 2021",
};

describe("Post page preview", () => {
	it("should render correctly", () => {
		const useSessionMocked = mocked(useSession);

		useSessionMocked.mockReturnValueOnce([null, false]);

		render(<Post post={post} />);

		expect(screen.getByText("My new post")).toBeInTheDocument();
		expect(screen.getByText("Post excerpt")).toBeInTheDocument();
		expect(screen.getByText("28 de dezembro de 2021")).toBeInTheDocument();
		expect(screen.getByText("Wanna continue reading?")).toBeInTheDocument();
	});

	it("should redirect to full post if user is subscribed", async () => {
		const useSessionMocked = mocked(useSession);
		const useRouterMocked = mocked(useRouter);

		const pushMock = jest.fn();

		useSessionMocked.mockReturnValueOnce([
			{
				activeSubscription: "fake-active-subscription",
			},
			false,
		]);

		useRouterMocked.mockReturnValueOnce({
			push: pushMock,
		} as any);

		render(<Post post={post} />);

		expect(pushMock).toHaveBeenCalled();
		expect(pushMock).toHaveBeenCalledWith("/posts/my-new-post");
	});

	it("should load initial data", async () => {
		const getPrismicClientMocked = mocked(getPrimiscClient);

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

		const response = await getStaticProps({
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
