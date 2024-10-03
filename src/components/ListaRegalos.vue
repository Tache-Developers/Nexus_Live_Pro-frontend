<template>
	<div class="lista-regalos">
		<Dialog
			v-model:visible="mostrarDialogRegalos"
			header="Regalos"
			:style="{ width: '60rem' }"
			:breakpoints="{ '1199px': '75vw', '575px': '90vw' }"
			position="center"
			:modal="true"
			:draggable="false"
			class="dialog-regalos"
			maximizable
			@hide="cerrarDialog"
		>
			<template #header>
				<div class="flex justify-content-between align-items-center w-full gap-2 flex-wrap">
					<h1 class="font-bold white-space-nowrap m-0">Regalos</h1>
					<Chip :label="`${miSaldoMonedas}`" image="/assets/img/moneda_tiktok.png" class="w-max" />
				</div>
			</template>

			<div class="flex justify-content-center">
				<form ref="formListaRegalo" class="w-full">
					<div class="form-container">
						<div class="flex align-items-center flex-wrap">
							<div
								v-for="(regalo, index) in posibles_regalos"
								:key="index"
								class="col-auto p-1 shadow-green-900 border-round card-regalo"
								:class="{ seleccionado: inSeleccionados(regalo._id), 'no-puede-seleccionar': !puedeSeleccionar(regalo) }"
							>
								<div class="p-2 border-none surface-none border-round flex flex-column">
									<div class="flex justify-content-center border-round">
										<div class="relative mx-auto w-full h-full">
											<img class="border-round w-full h-full" :src="regalo.imagen" alt="Regalo" style="max-width: 300px" />
											<Checkbox
												v-if="puedeSeleccionar(regalo)"
												@update:modelValue="actualizarMonedas"
												multiple
												v-model="canjear_regalos"
												class="absolute top-0 right-0"
												:value="regalo"
											/>
										</div>
									</div>
									<div class="flex flex-column gap-2 mt-1 w-full">
										<p class="m-0 truncate text-lg font-medium text-900">{{ regalo.descripcion }}</p>
										<Chip :label="`${regalo.precio_monedas}`" image="/assets/img/moneda_tiktok.png" class="w-max" />
									</div>
								</div>
							</div>
						</div>
					</div>
				</form>
			</div>
			<template #footer>
				<Button label="Cancelar" @click="mostrarDialogRegalos = false" autofocus text severity="danger" />
				<Button label="Canjear" :disabled="btnCanjear" @click="canjearRegalos" />
			</template>
		</Dialog>
	</div>
</template>
<script>
import axios from "axios";
import { useStoreEvento } from "../store";

export default {
	props: {
		mostrarLista: {
			type: Boolean,
			default: false,
		},
		/*
		 * Cuando monedasMaximasRegalo es 0 se listan todos los regalos
		 * Sino se listan todos los regalos que se puedan comprar con las monedas
		 */
		monedasMaximasRegalo: {
			type: Number,
			default: 100,
		},
		misMonedas: {
			type: Number,
			default: 0,
		},
	},
	data: () => ({
		API: import.meta.env.VITE_APP_API,
		header: {
			headers: {
				Authorization: null,
			},
		},
		store: null,
		btnCanjear: false,
		canjear_regalos: [],
		posibles_regalos: [],
		mostrarDialogRegalos: false,
	}),
	watch: {
		mostrarLista(newValue) {
			this.mostrarDialogRegalos = newValue;
		},
		monedasMaximasRegalo(newValue) {
			if (newValue > 0) {
				this.getRegalosLimite();
			} else {
				this.getRegalos();
			}
		},
	},
	computed: {
		miSaldoMonedas() {
			const monedas_total = this.canjear_regalos.reduce((suma, reg) => suma + reg.precio_monedas, 0);
			return this.misMonedas - monedas_total;
		},
	},
	methods: {
		cerrarDialog() {
			this.$emit("cerrarDialog");
			this.canjear_regalos = [];
		},
		inSeleccionados(regaloId) {
			return this.canjear_regalos.some((regalo) => regalo._id == regaloId);
		},
		actualizarMonedas(regalos = []) {
			if (Array.isArray(regalos)) {
				const monedas_total = regalos.reduce((suma, reg) => suma + reg.precio_monedas, 0);
				if (monedas_total > this.misMonedas) {
					this.$toast.add({
						severity: "error",
						summary: "Regalos",
						detail: "No tienes suficientes monedas",
						life: 1600,
					});
					regalos.pop();
				}
			}
		},
		canjearRegalos() {
			if (this.canjear_regalos.length > 0) {
				if (this.miSaldoMonedas == 0) {
					this.btnCanjear = true;
					const regalos = this.canjear_regalos.map((reg) => ({
						id_regalo: reg._id,
						imagen: reg.imagen,
						descripcion: reg.descripcion,
						precio_monedas: reg.precio_monedas,
					}));
					this.$emit("regalos", regalos);
					this.btnCanjear = false;
				} else {
					this.$toast.add({
						severity: "error",
						summary: "Regalos",
						detail: "Tienes que gastarte todas las monedas",
						life: 1600,
					});
				}
			} else {
				this.$toast.add({
					severity: "error",
					summary: "Regalos",
					detail: "Debes seleccionar al menos un regalo",
					life: 1600,
				});
			}
		},
		puedeSeleccionar(regalo = null) {
			if (regalo == null) {
				return false;
			}

			if (this.inSeleccionados(regalo._id)) {
				return true;
			}
			return regalo.precio_monedas <= this.miSaldoMonedas;
		},
		async obtenerRegalosLimite() {
			await axios
				.get(`${this.API}/regalo/max-monedas/${this.monedasMaximasRegalo}`, this.header)
				.then((resp) => {
					this.posibles_regalos = resp.data;
				})
				.catch((error) => {
					switch (error.response.data.statusCode) {
						case 401:
							//Se le termino la sesión
							this.store.clearUser();
							this.$router.push("/login");
							break;
						default:
							this.$toast.add({
								severity: "error",
								summary: "Regalos",
								detail: "Sucedió un error, comuníquese con soporte",
								life: 1600,
							});
							console.log("Error: ", error);
							break;
					}
				});
		},
		async getRegalos() {
			await axios
				.get(`${this.API}/regalo`, this.header)
				.then((resp) => {
					this.posibles_regalos = resp.data;
				})
				.catch((error) => {
					switch (error.response.data.statusCode) {
						case 401:
							//Se le termino la sesión
							this.store.clearUser();
							this.$router.push("/login");
							break;
						default:
							this.$toast.add({
								severity: "error",
								summary: "Regalos",
								detail: "Sucedió un error, comuníquese con soporte",
								life: 1600,
							});
							console.log("Error: ", error);
							break;
					}
				});
		},
	},
	created() {
		this.store = useStoreEvento();
		this.header.headers.Authorization = `Bearer ${this.store.getToken()}`;
	},
};
</script>
<style scoped>
.truncate {
	overflow: hidden;
	text-overflow: ellipsis;
	white-space: nowrap;
}
.dialog-regalos {
	border: 0 !important;
}
.dialog-regalos > * {
	background: #2e2e2e !important ;
}

.dialog-regalos > .p-dialog-content > div > form > .form-container > div {
	row-gap: 12px;
	column-gap: 12px;
}
.card-regalo.seleccionado {
	border: 2px solid #6ee7b7;
}

.card-regalo.no-puede-seleccionar {
	box-shadow: none !important;
	opacity: 0.3;
}

.card-regalo {
	background: none;
	box-shadow: 0 4px 8px 0 rgba(0, 0, 0, 0.2), 0 6px 20px 0 rgba(0, 0, 0, 0.19);
	max-height: 225px;
	width: 160px !important;
}

.card-regalo > *,
.card-regalo > div > div:first-child > div,
.card-regalo > div > div:first-child > div > img {
	max-height: 100% !important;
}

.card-regalo > div > div:first-child {
	max-height: 120px !important;
	height: 120px !important;
}
.card-regalo > div > div:last-child {
	max-height: 115px !important;
}

@media (max-width: 269px) {
	.card-regalo {
		width: 100% !important;
		max-height: 402px !important;
		height: 402px !important;
	}

	.card-regalo > div > div:last-child > div:last-child > div:first-child {
		flex-direction: column;
		align-items: start !important;
	}
}

@media (max-width: 235px) {
	.card-regalo {
		max-height: 455px !important;
		height: 455px !important;
	}
}
@media (max-width: 235px) {
	.card-regalo {
		max-height: 465px !important;
		height: 465px !important;
	}
}
</style>