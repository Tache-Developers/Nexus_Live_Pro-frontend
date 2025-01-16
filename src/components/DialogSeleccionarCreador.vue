<template>
	<Dialog
		v-model:visible="modalAddCreadores"
		:header="`Selección de creadores: ${creadoresSelect.length}`"
		:style="{ width: '75rem' }"
		:breakpoints="{ '1199px': '75vw', '575px': '90vw' }"
		position="center"
		:modal="true"
		:draggable="false"
		:maximizable="true"
		class="seleccionar-creador"
		@hide="cerrarDialog"
	>
		<div class="flex w-full flex-wrap flex-column justify content-center gap-4">
			<div class="modo-seleccion w-full flex flex-column gap-1">
				<label class="m-0 font-bold">Seleccionar a creadores</label>
				<div class="flex flex-wrap gap-2">
					<div v-for="(modo, index) in modosAdd" :key="index" class="flex gap-1">
						<RadioButton v-model="modoAdd" :value="modo.value" :inputId="`modo-${index + 1}`" />
						<label :for="`modo-${index + 1}`" class="cursor-pointer text-800 text-sm">{{ modo.label }}</label>
					</div>
				</div>
			</div>
			<div class="seleccion w-full">
				<div class="por_criterio flex flex-wrap" v-if="modoAdd == 'por_criterio'">
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
							:paginator="!loadingData"
							:rows="10"
							:totalRecords="creadores_copia.length"
							:rowsPerPageOptions="[10, 25, 50, 100]"
							paginatorTemplate="PrevPageLink PageLinks NextPageLink RowsPerPageDropdown"
							:alwaysShowPaginator="false"
							ref="dtCreadores"
						>
							<template #empty>
								<div class="flex flex-column gap-1 align-items-center">
									<p class="w-full text-center font-bold" v-if="!loadingData">Sin creadores</p>
									<ProgressSpinner style="width: 80px; height: 80px" v-if="loadingData" />
								</div>
							</template>
							<template #header>
								<div class="flex flex-column gap-2" v-if="!loadingData && creadores_copia.length > 0">
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
										:class="[
											isSeleccionado(item._id) && !loadingData ? 'seleccionado' : 'no-seleccionado',
											isOtraTabla(item._id) && !loadingData ? 'opacity-40' : null,
										]"
										style="min-width: 72px; max-width: 72px; max-height: max-content; padding: 2px"
									>
										<Skeleton v-if="loadingData" shape="circle" size="4rem" class="img-creador-seleccionar" />
										<Skeleton v-if="loadingData" width="5rem" borderRadius="16px" />
										<Image v-if="!loadingData" :src="item.foto" class="border-circle" :alt="item.usuario">
											<template #image>
												<img
													:src="item.foto == '' ? '/assets/img/avatar-default.jpg' : item.foto"
													:alt="item.usuario"
													class="border-circle img-creador-seleccionar"
												/>
											</template>
										</Image>
										<span v-if="!loadingData" class="text-sm white-space-nowrap overflow-hidden text-overflow-ellipsis w-full">
											{{ item.usuario }}
										</span>
										<Checkbox
											multiple
											v-model="creadoresSelect"
											class="absolute top-0 right-0"
											:value="item._id"
											v-if="!isOtraTabla(item._id) && !loadingData"
										/>
										<div
											v-if="isOtraTabla(item._id) && !loadingData"
											class="w-full h-full absolute"
											v-tooltip.top="'No se puede seleccionar porque ya está en otra tabla'"
										/>
									</div>
								</div>
							</template>
						</DataView>
					</div>
				</div>
				<div class="por_nombre_usuario flex flex-column flex-wrap" v-else-if="modoAdd == 'por_nombre_usuario'">
					<codemirror v-model="nombreCreadoresEditor" v-bind="configCodeMirror" />
				</div>
			</div>
		</div>
		<template #footer>
			<Button label="Cancelar" @click="modalAddCreadores = false" autofocus text severity="danger" />
			<Button label="Confirmar" :disabled="guardando_datos" @click="confirmarCambios" />
		</template>
	</Dialog>
</template>
<script>
import axios from "axios";
import { useStoreEvento } from "../store";
import { Codemirror } from "vue-codemirror";
import { oneDark } from "@codemirror/theme-one-dark";
export default {
	props: {
		id_current_tabla: {
			type: String,
			default: "null",
			required: true,
		},
		creadores_seleccionados: {
			type: Array,
			default: [],
		},
		mostrar_modal: {
			type: Boolean,
			default: false,
		},
		guardando_datos: {
			type: Boolean,
			default: false,
		},
	},
	components: {
		Codemirror,
	},
	data: () => ({
		API: import.meta.env.VITE_APP_API,
		token: {
			headers: {
				Authorization: null,
			},
		},
		store: null,
		loadingData: true,
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
		modalAddCreadores: false,
		modosAdd: [
			{ label: "Por criterio", value: "por_criterio" },
			{ label: "Por nombre de usuario", value: "por_nombre_usuario" },
		],
		modoAdd: "por_criterio",
		nombreCreadoresEditor: null,
		configCodeMirror: {
			placeholder: "Introduce los nombres de los creadores, un nombre de usuario por línea.",
			style: {
				height: "400px",
			},
			"indent-with-tab": true,
			extensions: [oneDark],
		},
		tablas: [],
		creadores: [],
		creadores_copia: [],
		creadores_copia_buscar: [],
		creadoresSelect: [],
	}),
	methods: {
		isOtraTabla(usuario = null) {
			if (usuario != null) {
				const otraTabla = this.tablas.findIndex((tabla) => tabla._id != this.$props.id_current_tabla && tabla.creadores.includes(usuario));
				return otraTabla > -1;
			}
			return false;
		},
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
			let mod = 0;
			this.creadores_copia.forEach((row) => {
				if (accion === "agregar") {
					if (!this.isSeleccionado(row._id) && !this.isOtraTabla(row._id)) {
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
		},
		confirmarCambios() {
			if (this.nombreCreadoresEditor != null) {
				const creadoresNombres = this.nombreCreadoresEditor.split("\n");
				if (creadoresNombres.length > 0) {
					creadoresNombres.forEach((creador) => {
						const c = this.creadores.find((cr) => cr.usuario == creador);
						if (c != undefined) {
							if (!this.creadoresSelect.includes(c._id)) {
								this.creadoresSelect.push(c._id);
							}
						}
					});
				}
			}
			this.$emit("update:seleccionados", this.creadoresSelect);
		},
		cerrarDialog() {
			this.modalAddCreadores = false;
			this.nombreCreadoresEditor = null;
			this.creadoresSelect = [];
			this.modoAdd = "por_criterio";
			this.filtroSelect.max = null;
			this.filtroSelect.min = null;
			this.$emit("cerrarDialog");
		},
		async getTablas() {
			await axios
				.get(`${this.API}/tabla-seleccionado`, this.token)
				.then((resp) => {
					this.tablas = resp.data;
				})
				.catch((error) => {
					switch (error.response.data.statusCode) {
						case 400:
							//Bad Request
							this.$toast.add({
								severity: "error",
								summary: "Obtener tablas",
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
								summary: "Obtener tablas",
								detail: "Sucedió un error, comuníquese con soporte",
								life: 1600,
							});
							console.log("Error: ", error);
							break;
					}
				});
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
		async cargarDatos() {
			this.loadingData = true;
			await this.getTablas();
			await this.getCreadores();
			this.loadingData = false;
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
		/* creadoresSelect(newValue) {
			this.$emit("creadoresSeleccionados", newValue);
		}, */
		mostrar_modal(newValue) {
			if (newValue) {
				this.cargarDatos();
			}
			this.modalAddCreadores = newValue;
		},
		creadores_seleccionados(newValue) {
			this.creadoresSelect = newValue;
		},
	},
	async created() {
		this.store = useStoreEvento();

		this.token.headers.Authorization = `Bearer ${this.store.getToken()}`;
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