import { render, screen } from "@testing-library/react";
import { mocked } from "ts-jest/utils";
import { getPrimiscClient } from "../../services/prismic";

import Posts, { getStaticProps } from "../../pages/posts";

jest.mock("../../services/prismic");

const posts = [
	{
		slug: "my-new-post",
		title: "My new post",
		excerpt: "Post excerpt",
		updatedAt: "28 de dezembro de 2021",
	},
];

describe("Posts page", () => {
	it("should render correctly", () => {
		render(<Posts posts={posts} />);

		expect(screen.getByText("My new post")).toBeInTheDocument();
		expect(screen.getByText("Post excerpt")).toBeInTheDocument();
		expect(screen.getByText("28 de dezembro de 2021")).toBeInTheDocument();
	});

	it("should load initial data", async () => {
		const getPrismicClientMocked = mocked(getPrimiscClient);

		getPrismicClientMocked.mockReturnValueOnce({
			query: jest.fn().mockResolvedValueOnce({
				results: [
					{
						uid: "my-new-post",
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
					},
				],
			}),
		} as any);

		const response = await getStaticProps({});

		expect(response).toEqual(
			expect.objectContaining({
				props: {
					posts: [
						{
							slug: "my-new-post",
							title: "My new post",
							excerpt: "Post excerpt",
							updatedAt: "28 de dezembro de 2021",
						},
					],
				},
			})
		);
	});
});
