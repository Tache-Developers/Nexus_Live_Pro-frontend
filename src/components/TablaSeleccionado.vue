<template>
	<Panel class="tabla_seleccionado">
		<template #header>
			<div class="flex align-items-center gap-2 flex-end flex-wrap w-full justify-content-between">
				<h1 class="m-0">Tabla seleccionados</h1>
				<div class="botones flex flex-wrap gap-2">
					<Button icon="pi pi-plus" label="Crear" @click="modalCrearTabla = true" />
				</div>
			</div>
		</template>
		<TabView :scrollable="true" class="tabBonusSeleccionado" v-model:activeIndex="activeTabla">
			<TabPanel v-for="(tabla, index) in tablas" :key="index" :headerClass="index == 0 ? 'tab-primero' : 'tab-sig'">
				<template #header>
					<div class="flex align-items-center gap-2">
						<span class="font-bold white-space-nowrap">{{ tabla.nombre }}</span>
					</div>
				</template>
				<div class="botones flex flex-wrap w-full gap-2 justify-content-end p-3">
					<Button
						:icon="`pi ${tabla.estado ? 'pi-unlock' : 'pi-lock-open'}`"
						:label="tabla.estado ? 'Desactivar' : 'Activar'"
						:severity="tabla.estado ? 'success' : 'danger'"
						v-tooltip.top="`${tabla.estado ? 'Desactivar' : 'Activar'} tabla`"
						@click="cambiarEstadoTabla(tabla._id, !tabla.estado)"
					/>
					<Button icon="pi pi-plus" label="Bonus" severity="warning" @click="mostrarModalCrearBonus(tabla._id)" />
					<Button icon="pi pi-plus" label="Creadores" @click="mostrarModalCreadores(tabla)" />
					<Button
						icon="pi pi-eye"
						v-tooltip.top="'Ver creadores seleccionados'"
						label="Ver creadores"
						severity="info"
						@click="verCreadores(tabla._id)"
					/>
					<Button
						v-tooltip.top="'Eliminar tabla'"
						icon="pi pi-trash"
						label="Eliminar"
						severity="danger"
						@click="confirmEliminarTabla(tabla._id)"
					/>
				</div>
				<DataTable :value="tabla.bonus" tableStyle="min-width: 100%" sortField="nivel" :sortOrder="1">
					<Column field="nivel" header="Nivel 👑" />

					<Column v-for="(col, colIndex) in getHeadersColumn(tabla._id)" :key="colIndex" :field="col.field" :header="col.header">
						<template #body="props">
							<Image
								v-if="props.data.regalo && col.field == 'referencia'"
								:src="props.data.referencia"
								alt="Referencia"
								width="120"
								height="100"
								imageClass="border-round"
								preview
							/>
							<span v-else-if="props.data.regalo && col.field == 'bonificacion'" v-html="props.data.bonificacion" />

							<span v-else>{{ props.data[col.field] }}</span>
						</template>
					</Column>
					<Column header="Acciones">
						<template #body="props">
							<div class="flex flex-wrap gap-2">
								<Button
									icon="pi pi-pencil"
									outlined
									rounded
									severity="warning"
									@click="mostrarModalCrearBonus(tabla._id, props.data.nivel)"
								/>
								<Button
									icon="pi pi-eye"
									v-tooltip.top="'¿Quién cumple el bonus?'"
									outlined
									rounded
									severity="info"
									@click="verQuienCumple(tabla._id, props.data.nivel)"
								/>
								<Button icon="pi pi-trash" outlined rounded severity="danger" @click="confirmEliminarTabla(tabla._id, props.data.nivel)" />
							</div>
						</template>
					</Column>
				</DataTable>
			</TabPanel>
		</TabView>
		<!-- Dialogo para crear tabla -->
		<Dialog
			v-model:visible="modalCrearTabla"
			header="Crear tabla seleccionados"
			:style="{ width: '35rem' }"
			:breakpoints="{ '1199px': '75vw', '575px': '90vw' }"
			position="center"
			:modal="true"
			:draggable="false"
		>
			<form ref="formCrearTabla">
				<div class="flex flex-column gap-2">
					<div class="flex flex-column gap-1 w-full">
						<label class="font-semibold">Nombre</label>
						<InputText v-model="tabla.nombre" />
					</div>
					<div class="flex flex-column gap-1 w-full">
						<label class="font-semibold">Criterios</label>
						<MultiSelect
							v-model="tabla.criterios"
							display="chip"
							:options="criterios"
							optionLabel="label"
							optionValue="value"
							placeholder="Selecciona los criterios"
							:maxSelectedLabels="3"
						/>
					</div>
				</div>
			</form>
			<template #footer>
				<Button label="Cancelar" @click="modalCrearTabla = false" autofocus text severity="danger" />
				<Button label="Crear" :disabled="btnCrear" @click="crearTabla" />
			</template>
		</Dialog>
		<!-- Dialog para seleccionar creadores -->
		<DialogSeleccionarCreador
			v-bind="dialogCreadores"
			@cerrarDialog="
				() => {
					dialogCreadores.creadores_seleccionados = [];
					dialogCreadores.mostrar_modal = false;
					paquete_creador_tabla.tabla = null;
					paquete_creador_tabla.creadores = [];
				}
			"
			@update:seleccionados="agregarCreadoresTabla"
		/>
		<!-- Dialogo para crear bonus -->
		<Dialog
			v-model:visible="modalCrearBonus"
			:header="`Crear bonus para ${paquete_bonus_tabla.nombre_tabla}`"
			:style="{ width: '40rem' }"
			:breakpoints="{ '1199px': '75vw', '575px': '90vw' }"
			position="center"
			:modal="true"
			:draggable="false"
			@hide="limpiarPaqueteBonus"
		>
			<form ref="formBonus">
				<div class="flex flex-column gap-1 mb-2">
					<label for="nivel" class="font-bold block">Nivel</label>
					<InputText v-model.number="paquete_bonus_tabla.nivel" type="number" id="nivel" />
				</div>

				<div class="flex flex-column gap-1 mb-2" v-for="(criterio, index) in paquete_bonus_tabla.criterios" :key="index">
					<label :for="criterio" class="font-bold block">{{ getHeaderColumn(criterio).label }}</label>
					<InputText v-model.number="paquete_bonus_tabla[criterio]" type="number" :id="criterio" />
				</div>
				<div class="flex flex-column gap-1 mb-2">
					<label for="esRegalo" class="font-bold block">Es un regalo</label>
					<Checkbox v-model="paquete_bonus_tabla.regalo" :binary="true" inputId="esRegalo" />
				</div>
				<div class="flex flex-column gap-1 mb-2" v-if="!paquete_bonus_tabla.regalo">
					<label for="ganancia" class="font-bold block">Ganancia</label>
					<InputText v-model="paquete_bonus_tabla.ganancia" type="text" id="ganancia" />
				</div>
				<div class="flex flex-column gap-1 mb-2">
					<label for="bonificacion" class="font-bold block">{{ paquete_bonus_tabla.regalo ? "Obsequio" : "Bonificación" }}</label>
					<InputText v-model="paquete_bonus_tabla.bonificacion" type="text" id="bonificacion" v-if="!paquete_bonus_tabla.regalo" />
					<Textarea
						autoResize
						v-model="paquete_bonus_tabla.bonificacion"
						placeholder="Describe el obsequio"
						class="w-full"
						rows="5"
						cols="30"
						v-else
					/>
				</div>
				<div class="flex flex-column gap-1 mb-2" v-if="paquete_bonus_tabla.regalo">
					<label for="referencia" class="font-bold block">Link de referencia</label>
					<InputText v-model="paquete_bonus_tabla.referencia" type="url" id="referencia" />
				</div>
			</form>
			<template #footer>
				<Button label="Cancelar" @click="modalCrearBonus = false" text autofocus severity="danger" />
				<Button :label="idEditarBonus == null ? 'Crear' : 'Actualizar'" @click="crearBonusTabla" :disabled="btnCrear" severity="success" />
			</template>
		</Dialog>
		<!--Dialog para ver quién cumplió el bonus -->
		<Dialog
			v-model:visible="modalVerCumplen"
			header="Cumplen Bonus"
			:style="{ width: '54rem' }"
			:breakpoints="{ '1199px': '75vw', '575px': '90vw' }"
			position="top"
			:modal="true"
			:draggable="false"
		>
			<DataTable :value="cumplenBonus" tableStyle="min-width: 100%" sortField="usuario" :sortOrder="1">
				<template #header>
					<div class="flex flex-wrap align-items-center justify-content-center gap-2">
						<span class="text-xl text-900 font-bold">
							{{ cumplenBonus.length }} {{ cumplenBonus.length == 1 ? "creador cumple el bonus" : "creadores cumplen el bonus" }}
						</span>
					</div>
				</template>
				<Column field="usuario" header="Creador" />
				<Column
					v-for="(criterio, index) in criteriosTablaBonus"
					:key="index"
					:field="criterioCumplenBonus[criterio]"
					:header="getHeaderColumn(criterio).label"
				/>
			</DataTable>
			<template #footer>
				<Button label="Cerrar" @click="modalVerCumplen = false" text severity="danger" />
			</template>
		</Dialog>
		<Dialog
			v-model:visible="modalVerCreadores"
			header="Creadores seleccionados"
			:style="{ width: '35rem' }"
			:breakpoints="{ '1199px': '75vw', '575px': '90vw' }"
			position="top"
			:modal="true"
			:draggable="false"
		>
			<DataTable :value="creadoresSeleccionados" tableStyle="min-width: 100%" sortField="usuario" :sortOrder="1">
				<template #header>
					<div class="flex flex-wrap align-items-center justify-content-center gap-2">
						<span class="text-xl text-900 font-bold">
							{{ creadoresSeleccionados.length }}
							{{ creadoresSeleccionados.length == 1 ? "creador seleccionado" : "creadores seleccionados" }}
						</span>
					</div>
				</template>
				<Column field="usuario" header="Creador" />
			</DataTable>
			<template #footer>
				<Button label="Cerrar" @click="modalVerCreadores = false" text severity="danger" />
			</template>
		</Dialog>
		<ConfirmDialog />
	</Panel>
</template>
<script>
import axios from "axios";
import { useStoreEvento } from "../store";

export default {
	data: () => ({
		API: import.meta.env.VITE_APP_API,
		token: {
			headers: {
				Authorization: null,
			},
		},
		store: null,
		tabla: { nombre: null, criterios: [] },
		dialogCreadores: {
			creadores_seleccionados: [],
			mostrar_modal: false,
			guardando_datos: false,
			id_current_tabla: "",
		},
		paquete_creador_tabla: { tabla: null, creadores: [] },
		paquete_bonus_tabla: {
			nombre_tabla: null,
			criterios: [],
			tabla: null,
			nivel: null,
			horas: null,
			diamantes: null,
			dias: null,
			batallas: null,
			diamantes_partida: null,
			ganancia: null,
			bonificacion: null,
			regalo: false,
			referencia: null, //Link del premio
		},
		tablas: [],
		activeTabla: 0,
		criterios: [
			{ label: "Horas", value: "horas" },
			{ label: "Diamantes", value: "diamantes" },
			{ label: "Días", value: "dias" },
			{ label: "Batallas", value: "batallas" },
			{ label: "Diamantes por partida", value: "diamantes_partida" },
		],
		criterioCumplenBonus: {
			horas: "last_live_duration_mes_actual",
			diamantes: "diamantes_mes_actual",
			batallas: "batallas",
			diamantes_partida: "diamantes_partida",
			dias: "dias_validos_mes_actual",
		},
		criteriosTablaBonus: [],
		cumplenBonus: [],
		modalCrearTabla: false,
		modalCrearBonus: false,
		modalVerCumplen: false,
		idEditarBonus: null,
		btnCrear: false,
		modalVerCreadores: false,
		creadoresSeleccionados: [],
		creadores: [],
	}),
	methods: {
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
		async crearTabla() {
			this.btnCrear = true;
			if (this.tabla.nombre != null) {
				if (this.tabla.criterios.length > 0) {
					await axios
						.post(`${this.API}/tabla-seleccionado/crear`, this.tabla, this.token)
						.then((resp) => {
							if (!resp.data.error) {
								this.tabla = { nombre: null, criterios: [] };
								this.modalCrearTabla = false;
								this.getTablas();
							}
							this.$toast.add({
								severity: resp.data.error ? "error" : "success",
								summary: "Crear tabla",
								detail: resp.data.message,
								life: 1600,
							});
						})
						.catch((error) => {
							switch (error.response.data.statusCode) {
								case 400:
									//Bad Request
									this.$toast.add({
										severity: "error",
										summary: "Crear tabla",
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
										summary: "Crear tabla",
										detail: "Sucedió un error, comuníquese con soporte",
										life: 1600,
									});
									console.log("Error: ", error);
									break;
							}
						});
				} else {
					this.$toast.add({
						severity: "error",
						summary: "Crear tabla",
						detail: "Debes seleccionar al menos un criterio",
						life: 1600,
					});
				}
			} else {
				this.$toast.add({
					severity: "error",
					summary: "Crear tabla",
					detail: "Debes ingresar un nombre para la tabla",
					life: 1600,
				});
			}
			this.btnCrear = false;
		},
		async agregarCreadoresTabla(creadores = []) {
			this.dialogCreadores.guardando_datos = true;
			if (this.paquete_creador_tabla.tabla != null) {
				this.paquete_creador_tabla.creadores = creadores;
				const paquete = { ...this.paquete_creador_tabla };
				delete paquete.tabla;
				await axios
					.put(`${this.API}/tabla-seleccionado/${this.paquete_creador_tabla.tabla}/agregar-creadores`, paquete, this.token)
					.then((resp) => {
						if (!resp.data.error) {
							this.dialogCreadores.mostrar_modal = false;
							this.getTablas();
						}
						if (resp.data.timer != undefined && !resp.data.timer) {
							this.$toast.add({
								severity: resp.data.error ? "error" : "success",
								summary: "Agregar creadores",
								detail: resp.data.message,
							});
						} else {
							this.$toast.add({
								severity: resp.data.error ? "error" : "success",
								summary: "Agregar creadores",
								detail: resp.data.message,
								life: 1600,
							});
						}
					})
					.catch((error) => {
						switch (error.response.data.statusCode) {
							case 400:
								//Bad Request
								this.$toast.add({
									severity: "error",
									summary: "Agregar creadores",
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
									summary: "Agregar creadores",
									detail: "Sucedió un error, comuníquese con soporte",
									life: 1600,
								});
								console.log("Error: ", error);
								break;
						}
					});
			}
			this.dialogCreadores.guardando_datos = false;
		},
		async crearBonusTabla() {
			this.btnCrear = true;
			if (this.paquete_bonus_tabla.tabla != null) {
				if (this.paquete_bonus_tabla.nivel != null) {
					let crit_llenos = false;
					for (let c in this.paquete_bonus_tabla.criterios) {
						crit_llenos = this.paquete_bonus_tabla.criterios[c] != null;
						if (!crit_llenos) {
							break;
						}
					}
					if (crit_llenos) {
						if (this.paquete_bonus_tabla.bonificacion != null) {
							const paquete = { ...this.paquete_bonus_tabla };
							delete paquete.nombre_tabla;
							delete paquete.criterios;
							delete paquete.tabla;
							paquete.bonificacion = paquete.regalo ? paquete.bonificacion.replace(/\n/g, "<br>") : paquete.bonificacion;
							paquete.referencia = paquete.regalo ? paquete.referencia : null;

							if (this.idEditarBonus == null) {
								await axios
									.put(`${this.API}/tabla-seleccionado/${this.paquete_bonus_tabla.tabla}/agregar-bonus`, paquete, this.token)
									.then(async (resp) => {
										if (!resp.data.error) {
											await this.getTablas();
											this.modalCrearBonus = false;
										}
										this.$toast.add({
											severity: resp.data.error ? "error" : "success",
											summary: "Agregar bonus",
											detail: resp.data.message,
											life: 1600,
										});
									})
									.catch((error) => {
										switch (error.response.data.statusCode) {
											case 400:
												//Bad Request
												this.$toast.add({
													severity: "error",
													summary: "Agregar bonus",
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
													summary: "Agregar bonus",
													detail: "Sucedió un error, comuníquese con soporte",
													life: 1600,
												});
												console.log("Error: ", error);
												break;
										}
									});
							} else {
								this.editarBonusTabla();
							}
						} else {
							this.$toast.add({
								severity: "warn",
								summary: "Crear bonus",
								detail: "Debes ingresar una bonificación",
								life: 1600,
							});
						}
					} else {
						this.$toast.add({
							severity: "warn",
							summary: "Crear bonus",
							detail: "Debes ingresar valores para todos los criterios",
							life: 1600,
						});
					}
				} else {
					this.$toast.add({
						severity: "warn",
						summary: "Crear bonus",
						detail: "Debes ingresar un nivel",
						life: 1600,
					});
				}
			}
			this.btnCrear = false;
		},
		async editarBonusTabla() {
			this.btnCrear = true;
			const bonus = { ...this.paquete_bonus_tabla };
			delete bonus.tabla;
			delete bonus.criterios;
			delete bonus.nombre_tabla;
			bonus.bonificacion = bonus.regalo ? bonus.bonificacion.replace(/\n/g, "<br>") : bonus.bonificacion;
			bonus.referencia = bonus.regalo ? bonus.referencia : null;
			await axios
				.put(`${this.API}/tabla-seleccionado/${this.paquete_bonus_tabla.tabla}/editar-bonus/${this.idEditarBonus}`, bonus, this.token)
				.then(async (resp) => {
					if (!resp.data.error) {
						await this.getTablas();
						this.modalCrearBonus = false;

						this.idEditarBonus = null;
					}
					this.$toast.add({
						severity: resp.data.error ? "error" : "success",
						summary: "Editar bonus",
						detail: resp.data.message,
						life: 1600,
					});
				})
				.catch((error) => {
					switch (error.response.data.statusCode) {
						case 400:
							//Bad Request
							this.$toast.add({
								severity: "error",
								summary: "Editar bonus",
								detail: "Formato de los datos incorrecto",
								life: 1640,
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
								summary: "Editar bonus",
								detail: "Sucedió un error, comuníquese con soporte",
								life: 1640,
							});
							console.log("Error: ", error);
							break;
					}
				});
			this.btnCrear = false;
		},
		async verQuienCumple(id_tabla = null, nivel = null) {
			const tabla = this.tablas.find((t) => t._id == id_tabla);
			if (tabla != undefined) {
				if (tabla.creadores.length > 0) {
					if (nivel != null) {
						this.criteriosTablaBonus = tabla.criterios;
						await axios
							.get(`${this.API}/tabla-seleccionado/${id_tabla}/creadores-cumplen/${nivel}`, this.token)
							.then((resp) => {
								if (!resp.data.error) {
									this.cumplenBonus = resp.data.data;
									this.modalVerCumplen = true;
								} else {
									this.$toast.add({
										severity: "error",
										summary: "Obtener creadores",
										detail: resp.data.message,
										life: 1600,
									});
								}
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
					}
				} else {
					this.$toast.add({
						severity: "warn",
						summary: "Obtener creadores",
						detail: "Agrega creadores para poder ver quién cumple",
						life: 1640,
					});
				}
			}
		},
		async eliminarTabla(id_tabla = null) {
			if (id_tabla != null) {
				await axios
					.delete(`${this.API}/tabla-seleccionado/${id_tabla}`, this.token)
					.then((resp) => {
						if (!resp.data.error) {
							this.getTablas();
							this.activeTabla = this.activeTabla > 0 ? this.activeTabla - 1 : this.activeTabla;
						}
						this.$toast.add({
							severity: !resp.data.error ? "success" : "error",
							summary: "Eliminar tabla",
							detail: resp.data.message,
							life: 1700,
						});
					})
					.catch((error) => {
						switch (error.response.data.statusCode) {
							case 400:
								//Bad Request
								this.$toast.add({
									severity: "error",
									summary: "Eliminar tabla",
									detail: "Formato de los datos incorrecto",
									life: 1640,
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
									summary: "Eliminar tabla",
									detail: "Sucedió un error, comuníquese con soporte",
									life: 1640,
								});
								console.log("Error: ", error);
								break;
						}
					});
			}
		},
		async eliminarBonus(id_tabla = null, nivel = null) {
			if (id_tabla != null && nivel != null) {
				await axios
					.delete(`${this.API}/tabla-seleccionado/${id_tabla}/eliminar-bonus/${nivel}`, this.token)
					.then((resp) => {
						if (!resp.data.error) {
							this.getTablas();
						}
						this.$toast.add({
							severity: !resp.data.error ? "success" : "error",
							summary: "Eliminar bonus",
							detail: resp.data.message,
							life: 1700,
						});
					})
					.catch((error) => {
						switch (error.response.data.statusCode) {
							case 400:
								//Bad Request
								this.$toast.add({
									severity: "error",
									summary: "Eliminar bonus",
									detail: "Formato de los datos incorrecto",
									life: 1640,
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
									summary: "Eliminar bonus",
									detail: "Sucedió un error, comuníquese con soporte",
									life: 1640,
								});
								console.log("Error: ", error);
								break;
						}
					});
			}
		},
		async cambiarEstadoTabla(id_tabla = null, nuevo_estado = null) {
			if (id_tabla != null && nuevo_estado != null) {
				await axios.put(`${this.API}/tabla-seleccionado/${id_tabla}/nuevo-estado/${nuevo_estado}`, {}, this.token).then((resp) => {
					if (!resp.data.error) {
						this.getTablas();
					}
					this.$toast.add({
						severity: !resp.data.error ? "success" : "error",
						summary: "Cambiar estado",
						detail: resp.data.message,
						life: 1700,
					});
				});
			}
		},
		async getCreadores() {
			await axios
				.get(`${this.API}/usuario`, this.token)
				.then((resp) => {
					this.creadores = resp.data;
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
		getHeaderColumn(criterio = null) {
			return this.criterios.find((c) => c.value == criterio);
		},
		getHeadersColumn(id_tabla = null) {
			let headers = [];
			if (id_tabla != null) {
				const tabla = this.tablas.find((t) => t._id == id_tabla);
				if (tabla != null) {
					headers = tabla.criterios;
					headers = headers.map((h) => {
						return {
							header: this.criterios.find((c) => c.value == h).label,
							field: h,
						};
					});
					const isRegalo = tabla.bonus.some((b) => b.regalo == true);
					const notRegalo = tabla.bonus.some((b) => b.regalo == false);
					if (isRegalo) {
						headers.push(
							{
								header: "Obsequio",
								field: "bonificacion",
							},
							{ header: "Referencia", field: "referencia" }
						);
					}
					if (notRegalo || tabla.bonus.length == 0) {
						headers.push(
							{
								header: "Ganancia",
								field: "ganancia",
							},
							{
								header: "Bonificación",
								field: "bonificacion",
							}
						);
					}
				}
			}

			return headers;
		},
		mostrarModalCreadores(tabla = null) {
			if (tabla != null) {
				this.dialogCreadores.creadores_seleccionados = tabla.creadores; //Se usa en el componente de seleccionar creadores
				//Paquete para guardar creadores
				this.paquete_creador_tabla.tabla = tabla._id;
				this.paquete_creador_tabla.creadores = tabla.creadores;
				this.dialogCreadores.id_current_tabla = tabla._id;
				this.dialogCreadores.mostrar_modal = true;
			}
		},
		mostrarModalCrearBonus(id_tabla = null, nivel_bonus = null) {
			if (id_tabla != null) {
				const tabla = this.tablas.find((t) => t._id == id_tabla);
				if (tabla != undefined) {
					this.paquete_bonus_tabla.tabla = tabla._id;
					this.paquete_bonus_tabla.nombre_tabla = tabla.nombre;
					this.paquete_bonus_tabla.criterios = tabla.criterios;

					if (nivel_bonus != null) {
						this.idEditarBonus = nivel_bonus;
						const b = tabla.bonus.find((t) => t.nivel == nivel_bonus);
						if (b != undefined) {
							this.paquete_bonus_tabla.nivel = b.nivel;
							this.paquete_bonus_tabla.dias = b.dias;
							this.paquete_bonus_tabla.batallas = b.batallas;
							this.paquete_bonus_tabla.horas = b.horas;
							this.paquete_bonus_tabla.diamantes = b.diamantes;
							this.paquete_bonus_tabla.diamantes_partida = b.diamantes_partida;
							this.paquete_bonus_tabla.ganancia = b.ganancia;
							this.paquete_bonus_tabla.bonificacion = b.bonificacion;
							this.paquete_bonus_tabla.referencia = b.referencia;
							this.paquete_bonus_tabla.regalo = b.regalo;
						} else {
							return;
						}
					}
					this.modalCrearBonus = true;
				}
			}
		},
		confirmEliminarTabla(id_tabla, nivel = null) {
			if (nivel == null) {
				this.$confirm.require({
					message: "¿Está seguro de eliminar esta tabla?",
					header: "Eliminar tabla",
					icon: "pi pi-exclamation-triangle",
					rejectClass: "p-button-secondary p-button-outlined",
					rejectLabel: "No, cancelar",
					acceptLabel: "Sí, eliminar",
					acceptClass: "p-button-danger",
					defaultFocus: "reject",
					accept: () => {
						this.eliminarTabla(id_tabla);
					},
					reject: () => {},
				});
			} else {
				this.$confirm.require({
					message: "¿Está seguro de eliminar este bonus?",
					header: "Eliminar bonus",
					icon: "pi pi-exclamation-triangle",
					rejectClass: "p-button-secondary p-button-outlined",
					rejectLabel: "No, cancelar",
					acceptLabel: "Sí, eliminar",
					acceptClass: "p-button-danger",
					defaultFocus: "reject",
					accept: () => {
						this.eliminarBonus(id_tabla, nivel);
					},
					reject: () => {},
				});
			}
		},
		limpiarPaqueteBonus() {
			this.idEditarBonus = null;
			this.paquete_bonus_tabla = {
				nombre_tabla: null,
				criterios: [],
				tabla: null,
				nivel: null,
				horas: null,
				diamantes: null,
				dias: null,
				batallas: null,
				diamantes_partida: null,
				ganancia: null,
				bonificacion: null,
				regalo: false,
				referencia: null,
			};
		},
		verCreadores(tabla = null) {
			if (tabla != null) {
				const t = this.tablas.find((ta) => ta._id == tabla);
				if (t != undefined) {
					this.creadoresSeleccionados = this.creadores.filter((c) => {
						return t.creadores.includes(c._id);
					});
					this.modalVerCreadores = true;
				}
			}
		},
	},
	async created() {
		this.store = useStoreEvento();
		if (!this.store.isAdmin() || !this.store.isActive()) {
			this.$router.push("/login");
			return;
		}
		this.token.headers.Authorization = `Bearer ${this.store.getToken()}`;
		await this.getTablas();
		await this.getCreadores();
	},
};
</script>