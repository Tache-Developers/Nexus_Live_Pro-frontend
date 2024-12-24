<template>
	<section class="seleccionar-creador">
		<div class="flex w-full flex-wrap justify content-center">
			<div class="filtros flex flex-wrap flex-column gap-3 col-3">
				<div v-for="(filtro, index) in filtros" :key="index" class="flex">
					<RadioButton
						v-model="filtroSelect"
						:value="{ min: filtro.min, max: filtro.max }"
						:inputId="`filtro-${index + 1}`"
						name="dynamic-filtro"
						@update:modelValue="
							(creadores_copia = filtrarCreadores(filtroSelect.min, filtroSelect.max)), (creadores_copia_buscar = creadores_copia)
						"
					/>
					<div class="flex flex-column gap-1">
						<label :for="`filtro-${index + 1}`" class="ml-2 font-bold cursor-pointer">{{ filtro.label }}</label>
						<span class="ml-2 text-500 text-sm">Creadores elegibles: {{ filtrarCreadores(filtro.min, filtro.max).length }}</span>
					</div>
				</div>
			</div>
			<div class="vista-previa col-9">
				<DataView
					:value="creadores_copia"
					layout="grid"
					class="overflow-auto py-2 h-full dataview-creadores"
					paginator
					:rows="10"
					:totalRecords="creadores_copia.length"
					:rowsPerPageOptions="[10, 25, 50, 100]"
					paginatorTemplate="
                    PrevPageLink
                    PageLinks
                    NextPageLink
                    RowsPerPageDropdown"
					:alwaysShowPaginator="false"
					ref="dtCreadores"
				>
					<template #empty>
						<p class="w-full text-center font-bold">Sin creadores</p>
					</template>
					<template #header>
						<div class="flex flex-column gap-2">
							<span class="p-input-icon-left">
								<i class="pi pi-search" />
								<InputText v-model="nombreBuscar" placeholder="Buscar por nombre" />
							</span>
							<div class="w-full flex flex-wrap gap-2 justify-content-end">
								<Button label="Seleccionar todos" @click="selectCreadores('agregar')" severity="info" icon="pi pi-check" />
								<Button label="Deseleccionar todos" @click="selectCreadores('quitar')" severity="danger" icon="pi pi-times" />
							</div>
						</div>
					</template>
					<template #grid="props">
						<div class="grid grid-nogutter gap-4 w-full justify-content-center">
							<div
								v-for="(item, index) in props.items"
								:key="index"
								class="relative w-max flex flex-column align-items-center white-space-nowrap overflow-hidden text-overflow-ellipsis item-creador border-round"
								:class="[isSeleccionado(item._id) ? 'seleccionado' : 'no-seleccionado']"
								style="min-width: 72px; max-width: 72px; max-height: max-content; padding: 2px"
							>
								<Image :src="item.foto" class="border-circle" :alt="item.usuario">
									<template #image>
										<img
											:src="item.foto == '' ? '/assets/img/avatar-default.jpg' : item.foto"
											:alt="item.usuario"
											class="border-circle img-creador-seleccionar"
										/>
									</template>
								</Image>
								<span class="text-sm white-space-nowrap overflow-hidden text-overflow-ellipsis w-full">{{ item.usuario }}</span>
								<Checkbox multiple v-model="creadoresSelect" class="absolute top-0 right-0" :value="item._id" />
							</div>
						</div>
					</template>
				</DataView>
			</div>
		</div>
	</section>
</template>
<script>
import axios from "axios";
import { useStoreEvento } from "../store";

export default {
	props: {
		creadores_seleccionados: {
			type: Array,
			default: [],
		},
	},
	data: () => ({
		API: import.meta.env.VITE_APP_API,
		token: {
			headers: {
				Authorization: null,
			},
		},
		store: null,
		filtros: [
			{ label: "Todos", min: null, max: null },
			{ label: "0 - 50K", min: 0, max: 50000 },
			{ label: "50K - 300K", min: 50000, max: 300000 },
			{ label: "300K - 1M", min: 300000, max: 1000000 },
			{ label: "> 1M", min: 1000000, max: null },
		],
		nombreBuscar: null,
		filtroSelect: {
			min: null,
			max: null,
		},
		creadores: [],
		creadores_copia: [],
		creadores_copia_buscar: [],
		creadoresSelect: [],
	}),
	methods: {
		isSeleccionado(id) {
			return this.creadoresSelect.includes(id);
		},
		filtrarCreadores(min = null, max = null) {
			//Si filtroSelect.min y filtroSelect.max son null, es porque quiero mostrar Todos
			if (min == null && max == null) {
				return this.creadores;
			}
			//Si filtroSelect.max es null, es porque solo se filtra por filtroSelect.min
			if (max == null) {
				return this.creadores.filter((creador) => creador.diamantes_mes_anterior >= min);
			}
			//Sino es porque debo filtrar con rango de filtroSelect.min y filtroSelect.max
			return this.creadores.filter((creador) => creador.diamantes_mes_anterior >= min && creador.diamantes_mes_anterior <= max);
		},
		selectCreadores(accion = null) {
			const rowsVisible = this.$refs.dtCreadores.items;
			if (rowsVisible != null && Array.isArray(rowsVisible)) {
				let mod = 0;
				rowsVisible.forEach((row) => {
					if (accion === "agregar") {
						if (!this.isSeleccionado(row._id)) {
							this.creadoresSelect.push(row._id);
							mod++;
						}
					} else if (accion === "quitar") {
						if (this.isSeleccionado(row._id)) {
							const index = this.creadoresSelect.indexOf(row._id);
							this.creadoresSelect.splice(index, 1);
							mod++;
						}
					}
				});
				this.$toast.add({
					severity: "info",
					summary: `${accion == "agregar" ? "Agregar" : "Quitar"} creadores`,
					detail: `Se ${accion === "agregar" ? "agregaron" : "quitaron"} ${mod} creadores`,
					life: 1600,
				});
			}
		},
		async getCreadores() {
			await axios
				.get(`${this.API}/usuario`, this.token)
				.then((resp) => {
					this.creadores = resp.data;
					this.creadores_copia = resp.data;
					this.creadores_copia_buscar = resp.data;
				})
				.catch((error) => {
					switch (error.response.data.statusCode) {
						case 400:
							//Bad Request
							this.$toast.add({
								severity: "error",
								summary: "Obtener creadores",
								detail: "Formato de los datos incorrecto",
								life: 1600,
							});
							break;
						case 401:
							//Se le termino la sesión
							this.store.clearUser();
							this.$router.push("/login");
							break;
						default:
							this.$toast.add({
								severity: "error",
								summary: "Obtener creadores",
								detail: "Sucedió un error, comuníquese con soporte",
								life: 1600,
							});
							console.log("Error: ", error);
							break;
					}
				});
		},
	},
	watch: {
		nombreBuscar(newValue) {
			if (newValue != "" && newValue != null) {
				this.creadores_copia = this.creadores_copia_buscar.filter((creador) =>
					creador.usuario
						.normalize("NFD")
						.replace(/[\u0300-\u036f]/g, "")
						.toLowerCase()
						.includes(
							newValue
								.normalize("NFD")
								.replace(/[\u0300-\u036f]/g, "")
								.toLowerCase()
						)
				);
			} else {
				this.creadores_copia = this.creadores_copia_buscar;
			}
		},
		creadoresSelect(newValue) {
			this.$emit("creadoresSeleccionados", newValue);
		},
	},
	async created() {
		this.creadoresSelect = this.$props.creadores_seleccionados;
		this.store = useStoreEvento();

		this.token.headers.Authorization = `Bearer ${this.store.getToken()}`;
		await this.getCreadores();
	},
};
</script>
<style scoped>
.dataview-creadores::-webkit-scrollbar {
	width: 8px;
}
.dataview-creadores::-webkit-scrollbar-track {
	background: #ffffff;
	border-radius: 10px;
	cursor: pointer;
}
.dataview-creadores::-webkit-scrollbar-thumb {
	background: #5e951c;
	border-radius: 10px;
	cursor: pointer;
}
.dataview-creadores::-webkit-scrollbar-thumb:hover {
	background: #84dc09;
}

.item-creador.seleccionado {
	outline: 2px solid #6ee7b7;
}

.item-creador.no-puede-seleccionar {
	box-shadow: none !important;
	opacity: 0.3;
}
</style>

<style>
.seleccionar-creador > div > .vista-previa {
	max-height: 500px;
}
.vista-previa > .p-dataview > .p-dataview-header,
.vista-previa > .p-dataview > .p-paginator-bottom,
.vista-previa > .p-dataview > .p-paginator-bottom > .p-paginator.p-component {
	border: none;
}
.img-creador-seleccionar {
	width: 48px;
	max-width: 48px;
	min-width: 48px;
	height: 48px;
	max-height: 48px;
	min-height: 48px;
}
@media (max-width: 700px) {
	.seleccionar-creador > div {
		flex-direction: column !important;
	}
	.seleccionar-creador > div > .filtros {
		flex-direction: row !important;
		width: 100% !important;
	}
	.seleccionar-creador > div > .vista-previa {
		width: 100% !important;
	}
}
</style>