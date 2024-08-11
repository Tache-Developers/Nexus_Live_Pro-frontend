<template>
	<div class="control-reglas-admin">
		<video loop autoplay muted class="fondo">
			<source src="/assets/video/control-reglas/admin-reglas-bg.mp4" type="video/mp4" />
		</video>
		<div class="contenido">
			<div class="btns mb-7 flex-wrap">
				<button @click="cambiarVista(1)" :class="`btn-reglas cursor-pointer ${tabActive == 1 ? 'active' : ''}`">PREGUNTAS Y REGLAS</button>
				<button @click="cambiarVista(2)" :class="`btn-reglas cursor-pointer ${tabActive == 2 ? 'active' : ''}`">ACTUALIZACIONES</button>
			</div>
			<div :class="`forms ${mostrarItems.length == 0 ? 'justify-content-center' : ''}`">
				<div class="info" v-if="mostrarItems.length > 0">
					<Accordion :multiple="true" class="accordion_reglas_act" :activeIndex="[0]">
						<AccordionTab v-for="(item, index) in mostrarItems" :key="index">
							<template #headericon="scope">
								<div class="flex justify-space-between gap-2 align-items-center flex-order-2 font-gamers flex-wrap">
									<Button severity="danger" class="px-4 py-1" @click="confirmarEliminar(item._id, item.tipo)" label="Eliminar" />
									<Button severity="success" class="px-4 py-1" @click="editarCurrent(item)" label="Editar" />
									<span>{{ item.fecha.slice(0, 10) }}</span>
									<Button v-if="scope.isTabActive" style="width: 40px; height: 20px" class="p-0" text rounded aria-label="Cerrar">
										<img src="/assets/img/control-regla/tab_abierto.png" alt="Cerrar" />
									</Button>
									<Button
										v-else
										severity="secondary"
										icon="pi pi-plus"
										style="width: 40px; height: 20px"
										class="p-0"
										text
										rounded
										aria-label="Abrir"
									/>
								</div>
							</template>
							<template #header>
								<div class="flex justify-space-between gap-2 flex-order-1">
									{{ item.titulo }}
								</div>
							</template>
							<p class="m-0 px-4" v-html="item.descripcion" />
						</AccordionTab>
					</Accordion>
				</div>
				<div class="nuevo">
					<form class="form-reglas" ref="form_reglas">
						<h2 class="font-gamers mb-0 mt-6 word-break">{{ formTitle }}</h2>
						<div class="input-group">
							<InputText type="text" class="input font-gamers" v-model="paquete.titulo" name="titulo" placeholder="titulo" />
						</div>
						<div class="input-group textarea">
							<Textarea class="input font-gamers" autoResize v-model="paquete.descripcion" placeholder="descripcion" rows="5" cols="30" />
						</div>
						<div class="flex flex-column gap-2 w-full">
							<label for="fecha" class="font-bold block">Fecha</label>
							<div class="input-group">
								<Calendar name="fecha" dateFormat="yy-mm-dd" v-model="paquete.fecha" />
							</div>
						</div>
						<div class="flex flex-column gap-2 w-full">
							<label class="font-bold block">Estado</label>
							<div class="flex flex-wrap gap-3">
								<div class="flex align-items-center">
									<RadioButton v-model="paquete.estado" inputId="nueva" name="estado" value="Nueva" />
									<label for="nueva" class="ml-2 cursor-pointer">Nueva</label>
								</div>
								<div class="flex align-items-center">
									<RadioButton v-model="paquete.estado" inputId="antigua" name="estado" value="Antigua" />
									<label for="antigua" class="ml-2 cursor-pointer">Antigua</label>
								</div>
							</div>
						</div>
						<div class="flex justify-content-center gap-2 w-full mt-4">
							<button type="button" :disabled="btnGuardar" @click="crearRegla_Act" class="sign">Guardar</button>
						</div>
					</form>
				</div>
			</div>
		</div>
		<ConfirmDialog />
	</div>
</template>
<script>
import axios from "axios";
import { useStoreEvento } from "../store";
export default {
	name: "control-reglas-admin",
	data: () => ({
		API: import.meta.env.VITE_APP_API,
		token: {
			headers: {
				Authorization: null,
			},
		},
		store: null,
		tabActive: 2,
		formTitle: "Crear actualización",
		btnGuardar: false,
		paquete: {
			id: null,
			titulo: null,
			descripcion: null,
			estado: "Nueva",
			fecha: new Date(),
			tipo: "Actualización",
		},
		reglas_act: [],
		mostrarItems: [],
	}),
	methods: {
		confirmarEliminar(id = null, tipo = "") {
			if (id != null) {
				this.$confirm.require({
					message: `¿Está seguro de eliminar esta ${tipo}?`,
					header: `Eliminar ${tipo}`,
					icon: "pi pi-exclamation-triangle",
					rejectClass: "p-button-secondary p-button-outlined",
					rejectLabel: "No, cancelar",
					acceptLabel: "Sí, eliminar",
					acceptClass: "p-button-danger",
					accept: () => {
						this.eliminarRegla_Act(id);
					},
					reject: () => {},
				});
			}
		},
		cambiarVista(vista = 1) {
			//1- Preguntas y reglas, 2 - Actualizaciones
			if (this.tabActive != vista) {
				this.tabActive = vista;
				this.formTitle = this.tabActive == 1 ? "Crear pregunta y regla" : "Crear actualización";
				this.paquete.tipo = this.tabActive == 1 ? "Regla" : "Actualización";
			}
			this.getItems();
		},
		editarCurrent(item = null) {
			if (item != null) {
				this.paquete.id = item._id;
				this.paquete.titulo = item.titulo;
				this.paquete.descripcion = item.descripcion;
				this.paquete.estado = item.estado;
				this.paquete.fecha = new Date(item.fecha);
				this.paquete.tipo = item.tipo;
				this.formTitle = `Editar ${item.tipo}`;
			}
		},
		getItems() {
			let findTipo = this.tabActive == 1 ? "Regla" : "Actualización";
			let coinc = this.reglas_act.find((item) => item._id == findTipo);
			this.mostrarItems = coinc != null ? coinc.items : [];
		},
		formValid() {
			let valid = true;
			const key = Object.keys(this.paquete);
			for (const k of key) {
				if (this.paquete[k] == null) {
					valid = false;
					break;
				}
			}
			if (!valid) {
				this.$toast.add({ severity: "error", summary: this.formTitle, detail: "Debes llenar todos los campos", life: 1600 });
			}

			return valid;
		},
		async crearRegla_Act() {
			if (this.paquete.id == null) {
				delete this.paquete.id;
				//Estamos creando
				const valid = this.formValid();
				if (valid) {
					this.btnGuardar = true;
					const copiaPaquete = {
						...this.paquete,
						descripcion: this.paquete.descripcion.replace(/\n/g, "<br>"),
					};
					await axios
						.post(`${this.API}/regla-actualizacion/crear`, copiaPaquete, this.token)
						.then((resp) => {
							if (!resp.data.error) {
								this.paquete.titulo = null;
								this.paquete.descripcion = null;
								this.getReglas_Act();
							}
							this.$toast.add({
								severity: resp.data.error ? "error" : "success",
								summary: this.formTitle,
								detail: resp.data.message,
								life: 1600,
							});
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
										summary: this.formTitle,
										detail: "Sucedió un error",
										life: 1500,
									});
									console.log("Error: ", error);
									break;
							}
						});
					this.btnGuardar = false;
				}
			} else {
				//Estamos editando
				const valid = this.formValid();
				if (valid) {
					this.btnGuardar = true;
					const id = this.paquete.id;
					delete this.paquete.id;
					await axios
						.put(`${this.API}/regla-actualizacion/${id}`, this.paquete, this.token)
						.then((resp) => {
							if (!resp.data.error) {
								this.paquete.id = null;
								this.formTitle = `Crear ${this.paquete.tipo}`;
								this.paquete.titulo = null;
								this.paquete.descripcion = null;
								this.getReglas_Act();
							}
							this.$toast.add({
								severity: resp.data.error ? "error" : "success",
								summary: this.formTitle,
								detail: resp.data.message,
								life: 1600,
							});
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
										summary: this.formTitle,
										detail: "Sucedió un error",
										life: 1500,
									});
									console.log("Error: ", error);
									break;
							}
						});
					this.btnGuardar = false;
				}
			}
		},
		async getReglas_Act() {
			await axios
				.get(`${this.API}/regla-actualizacion`, this.token)
				.then((resp) => {
					this.reglas_act = resp.data;
					this.getItems();
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
								summary: "Obtener reglas y actualizaciones",
								detail: "Ocurrió un problema",
								life: 1600,
							});
							console.log("Error: ", error);
							break;
					}
				});
		},
		async eliminarRegla_Act(id = null) {
			if (id != null) {
				await axios
					.delete(`${this.API}/regla-actualizacion/${id}`, this.token)
					.then((resp) => {
						if (!resp.data.error) {
							this.getReglas_Act();
						}
						this.$toast.add({
							severity: resp.data.error ? "error" : "success",
							summary: "Eliminar registro",
							detail: resp.data.message,
							life: 1600,
						});
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
									summary: "Eliminar reglas y actualizaciones",
									detail: "Ocurrió un problema",
									life: 1600,
								});
								console.log("Error: ", error);
								break;
						}
					});
			}
		},
	},
	async created() {
		this.store = useStoreEvento();
		if (!this.store.isActive()) {
			this.$router.push("/login");
		}
		this.token = {
			headers: {
				Authorization: `Bearer ${this.store.getToken()}`,
			},
		};
		await this.getReglas_Act();
	},
};
</script>
<style scoped>
.p-accordion .p-accordion-header .p-accordion-header-link {
	padding: 0;
}
.control-reglas-admin {
	width: 100%;
	height: max-content;
}
.control-reglas-admin > .fondo {
	position: fixed;
	top: 0;
	width: 100%;
	height: 100%;
	object-fit: cover;
	z-index: -1;
}

.control-reglas-admin > .contenido {
	display: flex;
	flex-direction: column;
	align-items: center;
	justify-content: center;
	padding: 15px 21px;
}
.control-reglas-admin > .contenido > .btns {
	display: flex;
	justify-content: center;
	gap: 12px;
}
.control-reglas-admin > .contenido > .btns > button {
	background: transparent;
	border: 2px solid #84dc16;
	border-radius: 6px;
	padding: 9px 18px;
	font-weight: bold;
}
.control-reglas-admin > .contenido > .btns > button.active {
	background: #84dc16;
}
.control-reglas-admin > .contenido > .forms {
	display: flex;
	justify-content: space-between;
	gap: 12px;
	width: 100%;
	padding-left: 25px;
	padding-right: 25px;
}
.control-reglas-admin > .contenido > .forms > :first-child {
	width: 60%;
}
.control-reglas-admin > .contenido > .forms > :last-child {
	width: 440px;
	min-width: max-content;
	max-height: 580px;
	min-height: 580px;
	background-image: url("/assets/img/login/fondo.png");
	background-repeat: no-repeat;
	background-size: 100% 100%;
}
.control-reglas-admin > .contenido > .forms > .nuevo > form {
	display: flex;
	flex-direction: column;
	gap: 14px;
	align-items: center;
	height: max-content;
	padding: 17px 18px;
	justify-content: center;
}
.control-reglas-admin > .contenido > .forms > .nuevo > form > h2 {
	text-align: center;
}

.input-group {
	width: 100%;
	border-radius: 0.375rem;
	border: none !important;
	background-color: transparent !important;
	background: transparent !important;
	background-blend-mode: screen;
	outline: 0;
	/* padding: 10px 11px 19px 10px; */
	color: rgba(243, 244, 246, 1);
	background-image: url("/assets/img/control-regla/input.png") !important;
	background-repeat: no-repeat !important;
	background-size: 100% 100% !important;
	height: 35px;
}
.input-group.textarea {
	height: 150px;
	background-image: url("/assets/img/control-regla/textarea.png") !important;
	background-size: 100% 100% !important;
	padding: 9px;
}

.input-group > .p-inputtext,
.input-group > .p-calendar > .p-inputtext {
	background: transparent !important;
	border: none !important;
	padding: 2px 8px !important;
	height: 100% !important;
}

.input-group > .p-inputtext:focus,
.input-group > .p-calendar > .p-inputtext:focus {
	background: transparent !important;
	border: none !important;
	outline: none !important;
	box-shadow: none !important;
}

.input-group > * {
	margin: 0 !important;
	padding: 0 !important;
}
.sign {
	width: 60%;
	height: 37px;
	margin: 0;
	padding: 0;
	text-align: center;
	color: white;
	border: none;
	font-size: 16px;
	background: none;
	background-image: url("/assets/img/login/btn-iniciar.png");
	background-repeat: no-repeat;
	background-size: 100% 100%;
	font-weight: 600;
	cursor: pointer;
}
@media (max-width: 994px) {
	.control-reglas-admin > .contenido > .forms {
		padding: 0;
		flex-wrap: wrap;
		justify-content: center;
		align-items: center;
		flex-direction: column;
	}

	.control-reglas-admin > .contenido > .forms > :first-child {
		width: 100%;
	}
}

@media (max-width: 490px) {
	.control-reglas-admin > .contenido {
		padding-left: 10px;
		padding-right: 10px;
	}
	.control-reglas-admin > .contenido > .forms {
		padding: 0;
	}
	.control-reglas-admin > .contenido > .forms > :first-child {
		width: 100%;
		min-width: 100%;
	}
	.control-reglas-admin > .contenido > .forms > :last-child {
		width: 100%;
		min-width: 100%;
		max-height: calc(100% + 60px);
	}
}
</style>
<style>
.word-break {
	word-break: break-word;
}
.input-group > .p-calendar {
	width: 100%;
	height: 100%;
}
.input-group > .p-calendar > .p-inputtext {
	background: transparent !important;
	border: none !important;
	padding: 2px 8px !important;
	height: 100% !important;
}
.input-group > .p-calendar > .p-inputtext:focus {
	background: transparent !important;
	border: none !important;
	outline: none !important;
	box-shadow: none !important;
}
.accordion_reglas_act > .p-accordion-tab > .p-accordion-header {
	background-image: url("/assets/img/control-regla/tab_header.png");
	background-repeat: no-repeat;
	background-size: 100% 100%;
	padding: 16px 20px;
}
.accordion_reglas_act > .p-accordion-tab > .p-accordion-header > .p-accordion-header-link {
	justify-content: space-between !important;
	flex-wrap: wrap;
	align-items: center;
	background: transparent !important;
	padding: 0;
	width: 100% !important;
	margin-bottom: 0 !important;
}
</style>