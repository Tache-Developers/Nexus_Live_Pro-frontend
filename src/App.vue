<template>
	<router-view />
</template>
<style>
@font-face {
	font-family: "planet-gamers";
	src: url("/assets/fonts/Planet-Gamers/Planet-Gamers.otf");
	src: url("/assets/fonts/Planet-Gamers/Planet-Gamers.woff");
}

.primera-mayus::first-letter {
	text-transform: uppercase;
}

.font-gamers {
	font-family: "planet-gamers" !important;
}

.color-blue {
	color: #69c9d0 !important;
}

.cursor-auto {
	cursor: auto !important;
}

.color-rojo {
	color: #ee1d52 !important;
}

.color-verde {
	color: #25e007 !important;
}

.text-shadow-green {
	color: #25e007 !important;
	text-shadow: -1px 2px 9px #25e007;
}

.text-shadow-red {
	color: #ee1d52 !important;
	text-shadow: -1px 2px 9px #ee1d52;
}

html,
body,
* {
	scroll-behavior: smooth;
}

.evento .text-inline-evento .p-inline-message-text {
	font-size: 3rem;
}

.app {
	background-color: #000000 !important;
}

.p-inputtext {
	width: 100% !important;
}

@media (max-width: 575px) {
	.xs\:flex-column {
		flex-direction: column !important;
	}

	.xs\:w-full {
		width: 100% !important;
	}

	.xs\:flex-wrap {
		flex-wrap: wrap !important;
	}

	.xs\:text-center {
		text-align: center !important;
	}

	.xs\:justify-content-center {
		justify-content: center !important;
	}

	.xs\:justify-content-start {
		justify-content: flex-start !important;
	}

	.xs\:gap-3 {
		gap: 3rem !important;
	}

	.xs\:col-1 {
		flex: 0 0 auto;
		padding: 0.5rem;
		width: 8.3333%;
	}

	.xs\:col-2 {
		flex: 0 0 auto;
		padding: 0.5rem;
		width: 16.6667%;
	}

	.xs\:col-3 {
		flex: 0 0 auto;
		padding: 0.5rem;
		width: 25%;
	}

	.xs\:col-4 {
		flex: 0 0 auto;
		padding: 0.5rem;
		width: 33.3333%;
	}

	.xs\:col-5 {
		flex: 0 0 auto;
		padding: 0.5rem;
		width: 41.6667%;
	}

	.xs\:col-6 {
		flex: 0 0 auto;
		padding: 0.5rem;
		width: 50%;
	}

	.xs\:col-7 {
		flex: 0 0 auto;
		padding: 0.5rem;
		width: 58.3333%;
	}

	.xs\:col-8 {
		flex: 0 0 auto;
		padding: 0.5rem;
		width: 66.6667%;
	}

	.xs\:col-9 {
		flex: 0 0 auto;
		padding: 0.5rem;
		width: 75%;
	}

	.xs\:col-10 {
		flex: 0 0 auto;
		padding: 0.5rem;
		width: 83.3333%;
	}

	.xs\:col-11 {
		flex: 0 0 auto;
		padding: 0.5rem;
		width: 91.6667%;
	}

	.xs\:col-12 {
		flex: 0 0 auto;
		padding: 0.5rem;
		width: 100%;
	}
}
</style>
