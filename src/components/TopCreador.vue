<template>
	<div class="top-creador">
		<div class="marco">
			<img :src="foto" alt="Foto usuario" class="foto-usuario" />
		</div>
		<p class="font-bold text-white text-center m-0 descripcion-top">TOP {{ top }}</p>
		<div class="nombre-usuario font-bold">
			<p class="m-0">{{ nombre }}</p>
		</div>
	</div>
</template>
<script>
export default {
	name: "TopCreador",
	props: {
		top: {
			type: Number,
			required: true,
			default: 1,
		},
		nombre: {
			type: String,
			required: true,
			default: "",
		},
		foto: {
			type: String,
			required: true,
			default: "/assets/img/perfil1.jpg",
		},
	},
	data: () => ({}),
};
</script>
<style scoped>
.top-creador {
	position: absolute;
	top: 72px;
	left: calc(50% - 118px);
	height: 250px;
	width: 250px;
	z-index: 99;
}

.top-creador > .marco {
	background-image: url("/assets/img/top/marco-top.png");
	background-position: center;
	background-size: cover;
	background-repeat: no-repeat;
	padding: 24px 29px 34px 30px;
	height: 100%;
	width: 100%;
}

.top-creador > .marco > img.foto-usuario {
	clip-path: polygon(25% 6.7%, 75% 6.7%, 100% 50%, 75% 93.3%, 25% 93.3%, 0% 50%);
	width: 100%;
	height: 100%;
}

.top-creador > .descripcion-top {
	position: absolute;
	z-index: 99999999;
	width: 100%;
	padding-left: 5px;
	bottom: 46px;
}

.top-creador > .nombre-usuario {
	background-image: url("/assets/img/top/nombre-top.png");
	background-position: center;
	background-size: cover;
	background-repeat: no-repeat;
	height: 140px;
	width: 100%;
	position: absolute;
	bottom: -29px;
	text-align: center;
	display: flex;
	flex-direction: column;
	justify-content: center;
	align-items: center;
	padding-top: 14px;
}
</style>