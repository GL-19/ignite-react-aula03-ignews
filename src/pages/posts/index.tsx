import Head from "next/head";
import styles from "./styles.module.scss";

export default function Posts() {
	return (
		<>
			<Head>
				<title>Posts | Ignews</title>
			</Head>

			<main className={styles.container}>
				<div className={styles.posts}>
					<a href="#">
						<time>22 de Novembro de 2021</time>
						<strong>Paginação com React Router Dom</strong>
						<p>
							paginação em uma página pode até parecer redundante, mas ela é um órgão vital
							para seu website, principalmente quando se trata de listas com enormes
							quantidades de informação.
						</p>
					</a>
					<a href="#">
						<time>22 de Novembro de 2021</time>
						<strong>Paginação com React Router Dom</strong>
						<p>
							paginação em uma página pode até parecer redundante, mas ela é um órgão vital
							para seu website, principalmente quando se trata de listas com enormes
							quantidades de informação.
						</p>
					</a>
					<a href="#">
						<time>22 de Novembro de 2021</time>
						<strong>Paginação com React Router Dom</strong>
						<p>
							paginação em uma página pode até parecer redundante, mas ela é um órgão vital
							para seu website, principalmente quando se trata de listas com enormes
							quantidades de informação.
						</p>
					</a>
				</div>
			</main>
		</>
	);
}
