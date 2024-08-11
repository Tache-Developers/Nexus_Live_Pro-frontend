<template>
	<NavBar></NavBar>
	<div class="terms-container">
		<div class="markdown-content" v-html="terms"></div>
	</div>
	<Footer id="footer" />
</template>

<script>
import MarkdownIt from "markdown-it";

export default {
	data() {
		return {
			terms: "",
		};
	},
	mounted() {
		// Cargar el archivo Markdown mediante una solicitud HTTP
		fetch("terminos.md")
			.then((response) => response.text())
			.then((data) => {
				const md = new MarkdownIt();
				this.terms = md.render(data);
			});
	},
};
</script>

<style>
/* Estilos para el contenedor principal */
.terms-container {
	margin-top: 100px;
	max-width: 800px;
	margin: 50px auto;
	padding: 20px;
}

/* Estilos para el título */
.title {
	font-size: 24px;
	color: #333;
	margin-bottom: 20px;
}

/* Estilos para el contenido Markdown */
.markdown-content {
	line-height: 1.6;
	font-size: 16px;
}

/* Estilos específicos para los elementos Markdown */
.markdown-content h1 {
	font-size: 22px;
	margin-top: 30px;
}

.markdown-content h2 {
	font-size: 20px;
	margin-top: 25px;
}

.markdown-content p {
	margin-bottom: 15px;
}

/* Estilos para los enlaces */
.markdown-content a {
	color: #007bff;
	text-decoration: underline;
}

.markdown-content a:hover {
	color: #0056b3;
}
</style>
