<template>
    <div class="premiosAleatorios">
        <Toast />
        <Panel class="premioAleatorio">
            <template #header>
                <div class="flex items-center gap-2 flex-end w-full justify-content-between flex-wrap">
                    <h1 class="m-0">Premios aleatorios</h1>
                    <Button label="Premio" icon="pi pi-plus" @click="modalPremioAleatorio = true" />
                </div>
            </template>
            <DataTable :value="premiosAleatorios" paginator :rows="5" :rowsPerPageOptions="[5, 10, 20, 50]" tableStyle="min-width: 100%" sortField="categoria" :sortOrder="1">
                <Column field="tipo_premio" header="Tipo premio" sortable></Column>
                <Column field="premio" header="Premio" sortable>

                    <template #body="props">
                        <Image v-if="props.data.tipo_premio == 'Objeto'" :src="props.data.premio" alt="Imagen del premio" width="250" preview />
                        <p v-else>{{ props.data.premio }}</p>
                    </template>
                </Column>
                <Column field="descripcion" header="Descripción" />
                <Column field="categoria" header="Categoría" sortable>

                    <template #body="props">
                        <Tag :severity="props.data.categoria == 'Bueno' ? 'success' : props.data.categoria == 'Malo' ? 'danger' : 'warning'" :value="props.data.categoria" rounded />
                    </template>
                </Column>
                <Column style="max-width:5rem" header="Acción">

                    <template #body="slotProps">
                        <Button icon="pi pi-trash" outlined rounded severity="danger"
                            @click="confirmDialog(slotProps.data._id, 'sorpresa')" />
                    </template>
                </Column>
            </DataTable>
        </Panel>
        <Panel class="concursos">

            <template #header>
                <div class="flex items-center gap-2 flex-end w-full justify-content-between flex-wrap">
                    <h1 class="m-0">Concursos</h1>
                    <Button label="Concurso" icon="pi pi-plus" @click="modalConcurso = true" />
                </div>
            </template>

            <DataTable :value="concursos" paginator :rows="5" :rowsPerPageOptions="[5, 10, 20, 50]" tableStyle="min-width: 90rem" sortField="activo" :sortOrder="-1">
                <Column field="tipo_premio" header="Tipo premio" style="width: max-content;" sortable />
                <Column field="creacion_concurso" header="Creación" style="width: max-content;" sortable>

                    <template #body="props">
                        {{ props.data.creacion_concurso.length == 0 ? 'No aplica' : props.data.creacion_concurso.slice(0, 10) + ' ' + props.data.creacion_concurso.slice(11, 16) }}
                    </template>
                </Column>
                <Column field="fecha_sorteo" header="Fin" style="width: max-content;" sortable>

                    <template #body="props">
                        {{ props.data.fecha_sorteo.length == 0 ? 'No aplica' : props.data.fecha_sorteo.slice(0, 10) + ' ' + props.data.fecha_sorteo.slice(11, 16) }}
                    </template>
                </Column>
                <Column field="criterio_ganador" header="Criterio ganador" style="width: 8rem!important;" sortable>

                    <template #body="props">
                        <div class="flex gap-1">
                            <p class="m-0" v-for="(c, index) in props.data.criterio_ganador" :key="index">{{ index < (props.data.criterio_ganador.length - 1) ? `${c}, ` : c }}</p>
                        </div>
                    </template>

                </Column>
                <Column field="activo" header="Estado" style="width: max-content;" sortable>

                    <template #body="slotProps">
                        <Tag :value="slotProps.data.activo ? 'En curso' : 'Finalizado'" :severity="slotProps.data.activo ? 'success' : 'danger'" rounded />
                    </template>
                </Column>
                <Column style="max-width:5rem" header="Acción">

                    <template #body="slotProps">
                        <div class="flex gap-2">
                            <Button icon="pi pi-trash" outlined rounded severity="danger"
                                @click="confirmDialog(slotProps.data._id, 'concurso')" />
                            <Button v-if="slotProps.data.activo == false" icon="pi pi-eye" outlined rounded severity="info" @click="verGanadores(slotProps.data._id)" />
                        </div>
                    </template>
                </Column>
            </DataTable>

        </Panel>
        <!-- Modal agregar concurso -->
        <Dialog v-model:visible="modalConcurso" header="Nuevo concurso" :style="{ width: '47rem' }"
            :breakpoints="{ '1199px': '75vw', '575px': '90vw' }" position="top" :modal="true" :draggable="false">
            <form ref="formPremio" class="formPremio">
                <div class="flex flex-column gap-1">
                    <label class="font-bold block">Tipo premio</label>
                    <div class="flex flex-wrap gap-3">
                        <div class="flex align-items-center">
                            <RadioButton v-model="paquete.tipo_premio" inputId="premio1" name="premio" value="Efectivo" />
                            <label for="premio1" class="ml-2 cursor-pointer">Efectivo</label>
                        </div>
                        <div class="flex align-items-center">
                            <RadioButton v-model="paquete.tipo_premio" inputId="premio2" name="premio" value="SaldoApi" />
                            <label for="premio2" class="ml-2 cursor-pointer">Saldo API</label>
                        </div>
                        <div class="flex align-items-center">
                            <RadioButton v-model="paquete.tipo_premio" inputId="premio3" name="premio" value="Objeto" />
                            <label for="premio3" class="ml-2 cursor-pointer">Objeto</label>
                        </div>
                    </div>
                </div>
                <div class="flex flex-column gap-1 mt-2" v-if="paquete.tipo_premio != 'Objeto'">
                    <label for="premio" class="font-bold block">Premio</label>
                    <InputText id="premio" v-model="paquete.premio" placeholder="Monto" />
                    <small v-if="paquete.tipo_premio == 'Efectivo'">Ingresar monto y tipo de moneda, Ej: 10USD</small>
                    <small v-else>Ingresar monto en USD</small>
                </div>
                <div class="flex flex-column gap-1 mt-2">
                    <label for="cant" class="font-bold block">Cantidad de ganadores</label>
                    <InputText type="number" id="cant" v-model="paquete.cantidad_ganadores" min="1" />
                </div>
                <div class="flex flex-column gap-1 mt-2">
                    <label for="cant" class="font-bold block">Participantes</label>
                    <MultiSelect :maxSelectedLabels="5" v-model="paquete.participantes" :options="creadores" optionLabel="usuario" placeholder="Selecciona participantes" display="chip" class="w-full">

                        <template #option="slotProps">
                            <div class="flex align-items-center">
                                <div>{{ slotProps.option.usuario }}</div>
                            </div>
                        </template>

                        <template #footer>
                            <div class="py-2 px-3">
                                <b>{{ paquete.participantes ? paquete.participantes.length : 0 }}</b> creador{{ ((paquete.participantes ? paquete.participantes.length : 0) > 1 || (paquete.participantes ? paquete.participantes.length : 0) == 0) ? 'es' : '' }} {{ (paquete.participantes ? paquete.participantes.length : 0) == 1 ? 'seleccionado.' : 'seleccionados.' }}
                            </div>
                        </template>
                    </MultiSelect>
                </div>
                <div class="disponibilidad flex flex-column gap-1 mt-1">
                    <label for="fecha_fin" class="font-bold block">Fecha sorteo</label>
                    <Calendar id="fecha_fin" v-model="paquete.fecha_sorteo" :minDate="new Date()" :manualInput="false"
                        dateFormat="yy-mm-dd" />
                    <small>Dejar vacío si es para el día en curso</small>
                </div>
                <div class="flex flex-column gap-1 w-full mt-2">
                    <label for="cant" class="font-bold block">Criterio ganador</label>
                    <MultiSelect :maxSelectedLabels="3" v-model="paquete.criterio_ganador" :options="criterios" optionLabel="criterio" placeholder="Selecciona criterio para decidir los ganadores" display="chip" class="w-full">

                        <template #option="slotProps">
                            <div class="flex align-items-center">
                                <div>{{ slotProps.option.criterio }}</div>
                            </div>
                        </template>

                        <template #footer>
                            <div class="py-2 px-3">
                                <b>{{ paquete.criterio_ganador ? paquete.criterio_ganador.length : 0 }}</b> criterio {{ ((paquete.criterio_ganador ? paquete.criterio_ganador.length : 0) > 1 || (paquete.criterio_ganador ? paquete.criterio_ganador.length : 0) == 0) ? 's' : '' }} {{ (paquete.criterio_ganador ? paquete.criterio_ganador.length : 0) == 1 ? 'seleccionado.' : 'seleccionados.' }}
                            </div>
                        </template>
                    </MultiSelect>
                </div>
            </form>

            <template #footer>
                <Button label="Cancelar" @click="modalConcurso = false" text severity="danger" autofocus />
                <Button label="Crear" @click="crearConcurso" :disabled="btnConcurso" severity="success" />
            </template>
        </Dialog>
        <!-- Modal agregar premio Aleatorio -->
        <Dialog v-model:visible="modalPremioAleatorio" header="Nuevo objeto sorpresa" :style="{ width: '42rem' }"
            :breakpoints="{ '1199px': '75vw', '575px': '90vw' }" position="top" :modal="true" :draggable="false">
            <form ref="formPremioAleatorio" class="formPremioAleatorio" enctype="multipart/form-data">
                <div class="objeto flex flex-column gap-1">
                    <InputText type="file" accept="image/*" @change="paquetePremioAleatorio.imagenPremio = $event.target.files[0]" aria-describedby="objeto-help" />
                    <small id="objeto-help">Cargue la imagen de referencia</small>
                </div>
                <div class="objeto flex flex-column gap-1 mt-2">
                    <Textarea id="descripcion" v-model="paquetePremioAleatorio.descripcion" rows="2" aria-describedby="descripcion-help" />
                    <small id="descripcion-help">Ingresa una descripción de la imagen de referencia</small>
                </div>
                <div class="flex flex-column mt-2 gap-2">
                    <label for="cat" class="font-bold block">Categoría</label>
                    <div class="flex flex-wrap gap-3">
                        <div class="flex align-items-center">
                            <RadioButton v-model="paquetePremioAleatorio.categoria" inputId="cat1" name="cat" value="Bueno" />
                            <label for="cat1" class="ml-2 cursor-pointer">Bueno</label>
                        </div>
                        <div class="flex align-items-center">
                            <RadioButton v-model="paquetePremioAleatorio.categoria" inputId="cat2" name="cat" value="Regular" />
                            <label for="cat2" class="ml-2 cursor-pointer">Regular</label>
                        </div>
                        <div class="flex align-items-center">
                            <RadioButton v-model="paquetePremioAleatorio.categoria" inputId="cat3" name="cat" value="Malo" />
                            <label for="cat3" class="ml-2 cursor-pointer">Malo</label>
                        </div>
                    </div>
                </div>
            </form>

            <template #footer>
                <Button label="Cancelar" @click="modalPremioAleatorio = false" text severity="danger" autofocus />
                <Button label="Crear" @click="crearSorpresa" :disabled="btnConcurso" severity="success" />
            </template>
        </Dialog>
        <!-- Modal ganadores concurso -->
        <Dialog v-model:visible="modalGanadores" header="Ganadores" :style="{ width: '42rem' }"
            :breakpoints="{ '1199px': '75vw', '575px': '90vw' }" position="top" :modal="true" :draggable="false">

            <DataTable :value="ganadoresConcurso" paginator :rows="5" :rowsPerPageOptions="[5, 10, 20, 50]" tableStyle="min-width: 100%" sortField="categoria" :sortOrder="1">
                <template #header>
                    <div class="flex flex-wrap align-items-center justify-content-center gap-2">
                        <span class="text-xl text-900 font-bold">PREMIO: {{ premioConcurso }}</span>
                    </div>
                </template>
                <Column field="usuario" header="Creador" sortable />
                <Column field="ganancia" header="Premio">

                    <template #body="props">
                        <Image v-if="props.data.ganancia.tipo_premio == 'Objeto'" :src="props.data.ganancia.premio" alt="Imagen del premio" width="250" preview>
                            <template #indicatoricon>
                                <div class="flex flex-column justify-content-center align-items-center">
                                    <i class="pi pi-eye" />
                                    <p class="m-0 font-bold text-black uppercase">
                                        {{ props.data.ganancia.descripcion }}
                                    </p>
                                </div>
                            </template>
                        </Image>
                        <p v-else>{{ props.data.ganancia.premio }} {{ props.data.ganancia.descripcion }}</p>
                    </template>
                </Column>
            </DataTable>
            <template #footer>
                <Button label="Cerrar" @click="modalGanadores = false" text severity="danger" autofocus />
            </template>
        </Dialog>
        <!--Confirm para eliminar-->
        <ConfirmDialog group="headless">

            <template #container="{ message, acceptCallback, rejectCallback }">
                <div class="flex flex-column items-center p-5 rounded-md" style="background-color: #171F28;">
                    <div class="rounded-full bg-info-500 dark:bg-primary-400 text-surface-0 dark:text-surface-900 inline-flex justify-content-center items-center h-[6rem] w-[6rem] -mt-[3rem]">
                        <i class="pi pi-question text-4xl"></i>
                    </div>
                    <span class="font-bold text-2xl block mb-2 mt-4">{{ message.header }}</span>
                    <p class="mb-0">{{ message.message }}</p>
                    <div class="flex justify-content-end items-center gap-2 mt-4">
                        <Button label="Sí, eliminar" severity="danger" @click="acceptCallback" class="w-[8rem]" />
                        <Button label="No, cancelar" outlined severity="success" @click="rejectCallback" class="w-[8rem]" />
                    </div>
                </div>
            </template>
        </ConfirmDialog>
    </div>

</template>

<script>
import axios from 'axios'
import { useStoreEvento } from '../store';
export default {
    name: 'PremiosAleatorios',
    data: () => ({
        API: import.meta.env.VITE_APP_API,
        modalGanadores: false,
        premioConcurso: '',
        ganadoresConcurso: [],
        store: null,
        modalConcurso: false,
        modalPremioAleatorio: false,
        btnConcurso: false,
        concursos: [],
        premiosAleatorios: [],
        creadores: [],
        archivoPremio: null,
        criterios: [
            {
                criterio: "Días hábiles mes actual",
                key: "Días"
            }, {
                criterio: "Horas en Live mes actual",
                key: "Horas"
            }, {
                criterio: "Diamantes mes actual",
                key: "Diamantes"

            }
        ],
        paquete: {
            tipo_premio: 'Efectivo',
            premio: null,
            cantidad_ganadores: 1,
            participantes: [],
            fecha_sorteo: null,
            criterio_ganador: []
        },
        paquetePremioAleatorio: {
            tipo_premio: 'Objeto',
            premio: '',
            imagenPremio: null,
            descripcion: null,
            categoria: 'Bueno',
        },
        idEliminar: null,
        fechaEvento: []
    }),
    methods: {
        async crearSorpresa() {
            const valid = await this.formValidAleatorio();
            if (valid) {
                this.btnConcurso = true;
                if (this.paquetePremioAleatorio.tipo_premio != "Objeto") {
                    delete this.paquetePremioAleatorio.imagenPremio;
                }
                await axios.postForm(`${this.API}/sorpresa/crear`, this.paquetePremioAleatorio, {
                    headers: {
                        Authorization: `Bearer ${this.store.getToken()}`
                    }
                }).then(response => {
                    if (response.data.creado) {
                        this.paquetePremioAleatorio = {
                            tipo_premio: 'Objeto',
                            premio: '',
                            imagenPremio: null,
                            descripcion: null,
                            categoria: 'Bueno',
                        }
                        this.$refs.formPremioAleatorio.reset();
                        this.getSorpresas();
                    }
                    this.$toast.add({ severity: response.data.creado ? 'success' : 'error', summary: 'Nueva sorpresa', detail: response.data.message, life: 1600 });

                }).catch(error => {
                    switch (error.response.data.statusCode) {
                        case 401:
                            //Se le termino la sesión
                            this.store.clearUser();
                            this.$router.push('/login');
                            break;
                        default:
                            this.$toast.add({ severity: 'danger', summary: 'Eliminar evento', detail: 'Sucedió un error, no se pudo eliminar el evento', life: 1500 });
                            console.log('Error: ', error);
                            break;
                    }
                });
                this.btnConcurso = false;
            }
        },
        async crearConcurso() {
            const regex = /^\d+[a-zA-Z]+$/; //Números seguido de letras
            if (this.paquete.tipo_premio == 'Objeto') {
                this.paquete.premio = '';
            }
            if (this.paquete.fecha_sorteo == null) {
                this.paquete.fecha_sorteo = '';
            }
            const validF = await this.formValid();
            if (validF) {
                const p = { ...this.paquete };
                p.cantidad_ganadores = parseInt(p.cantidad_ganadores);
                if (this.paquete.tipo_premio == 'Efectivo') {
                    if (!regex.test(this.paquete.premio)) {
                        this.$toast.add({ severity: 'error', summary: 'Nuevo concurso', detail: 'Formato del premio incorrecto', life: 1500 });
                        return;
                    }
                } else if (this.paquete.tipo_premio == 'SaldoApi') {
                    if (isNaN(this.paquete.premio)) {
                        this.$toast.add({ severity: 'error', summary: 'Nuevo concurso', detail: 'El premio solo debe contener números', life: 1500 });
                        return;
                    }
                }
                if (p.cantidad_ganadores == 0) {
                    this.$toast.add({ severity: 'error', summary: 'Nuevo concurso', detail: 'Debe seleccionar al menos un ganador', life: 1500 });
                    return;
                }
                if (this.paquete.participantes.length == 0) {
                    this.$toast.add({ severity: 'error', summary: 'Nuevo concurso', detail: 'Debe seleccionar al menos un participante', life: 1500 });
                    return;
                } else if (this.paquete.participantes.length < p.cantidad_ganadores) {
                    this.$toast.add({ severity: 'error', summary: 'Nuevo concurso', detail: 'Debe seleccionar más participantes', life: 1500 });
                    return;
                }
                if (this.paquete.criterio_ganador.length == 0) {
                    this.$toast.add({ severity: 'error', summary: 'Nuevo concurso', detail: 'Debe seleccionar al menos un criterio de ganador', life: 1500 });
                    return;
                }
                this.btnConcurso = true;
                p.participantes = this.paquete.participantes.map(participante => participante._id);
                p.criterio_ganador = this.paquete.criterio_ganador.map(criterio => criterio.key);

                await axios.post(`${this.API}/sorpresa/concurso/crear`, p, {
                    headers: {
                        Authorization: `Bearer ${this.store.getToken()}`
                    }
                }).then(response => {
                    if (response.data.creado) {
                        this.getConcursos();
                        this.modalConcurso = false;
                    }
                    this.$toast.add({ severity: response.data.creado ? 'success' : 'error', summary: 'Nuevo concurso', detail: response.data.message, life: 1500 });
                }).catch(error => {
                    switch (error.response.data.statusCode) {
                        case 401:
                            //Se le termino la sesión
                            this.store.clearUser();
                            this.$router.push('/login');
                            break;
                        default:
                            this.$toast.add({ severity: 'error', summary: 'Nuevo concurso', detail: error.response.data.message, life: 1500 });
                            console.log('Error: ', error);
                            break;
                    }
                });

                this.btnConcurso = false;
            }
        },
        async formValidAleatorio() {
            const key = Object.keys(this.paquetePremioAleatorio);
            let valid = false;
            for (const k of key) {
                valid = true;
                if (this.paquetePremioAleatorio[k] == null) {
                    console.log('invalid: ', this.paquetePremioAleatorio[k], 'key: ', k);
                    valid = false;
                    break;
                }
            }
            if (!valid) {
                this.$toast.add({ severity: 'error', summary: 'Nueva sorpresa', detail: 'Debes llenar todos los campos', life: 1600 });
            }
            return valid;
        },
        async formValid() {
            const key = Object.keys(this.paquete);
            let valid = false;
            for (const k of key) {
                valid = true;
                if (this.paquete[k] == null) {
                    valid = false;
                    break;
                }
            }
            if (!valid) {
                this.$toast.add({ severity: 'error', summary: 'Nuevo concurso', detail: 'Debes llenar todos los campos', life: 1600 });
            }
            return valid;
        },
        confirmDialog(id, accion) {
            if (id != null) {
                this.idEliminar = id;
                switch (accion) {
                    case 'sorpresa':
                        this.$confirm.require({
                            group: 'headless',
                            header: '¿Seguro de qué quiere eliminar esta sopresa?',
                            message: 'Esta acción no se puede revertir',
                            accept: () => {
                                this.eliminarEvento('sorpresa');
                            },
                            reject: () => {
                            }
                        });
                        break;

                    case 'concurso':
                        this.$confirm.require({
                            group: 'headless',
                            header: '¿Seguro de qué quiere eliminar este concurso?',
                            message: 'Esta acción no se puede revertir',
                            accept: () => {
                                this.eliminarEvento('concurso');
                            },
                            reject: () => {
                            }
                        });
                        break;
                }
            }
        },
        async eliminarEvento(accion) {
            if (this.idEliminar != null) {
                let end = '/';
                if (accion == 'concurso') {
                    end = '/concurso/';
                }
                await axios.delete(`${this.API}/sorpresa${end}${this.idEliminar}`, {
                    headers: {
                        Authorization: `Bearer ${this.store.getToken()}`
                    }
                }).then(response => {
                    if (response.data.delete) {
                        this.idEliminar = null;
                        switch (accion) {
                            case 'sorpresa':
                                this.getSorpresas();
                                break;

                            default:
                                this.getConcursos();
                                break;
                        }
                    }
                    this.$toast.add({ severity: response.data.delete ? 'success' : 'error', summary: `Eliminar ${accion} `, detail: response.data.message, life: 1600 });
                }).catch(error => {
                    switch (error.response.data.statusCode) {
                        case 401:
                            //Se le termino la sesión
                            this.store.clearUser();
                            this.$router.push('/login');
                            break;
                        default:
                            this.$toast.add({ severity: 'danger', summary: `Eliminar ${accion}`, detail: error.response.data.message, life: 1500 });
                            console.log('Error: ', error);
                            break;
                    }
                });
            }
        },
        async getSorpresas() {
            await axios.get(`${this.API}/sorpresa`, {
                headers: {
                    Authorization: `Bearer ${this.store.getToken()}`
                }
            }).then(response => {
                this.premiosAleatorios = response.data;
            }).catch(error => {
                switch (error.response.data.statusCode) {
                    case 401:
                        //Se le termino la sesión
                        this.store.clearUser();
                        this.$router.push('/login');
                        break;
                    default:
                        console.log('Error: ', error);
                        break;
                }
            });
        },
        async getConcursos() {
            await axios.get(`${this.API}/sorpresa/concurso`, {
                headers: {
                    Authorization: `Bearer ${this.store.getToken()}`
                }
            }).then(response => {
                this.concursos = response.data;
            }).catch(error => {
                switch (error.response.data.statusCode) {
                    case 401:
                        //Se le termino la sesión
                        this.store.clearUser();
                        this.$router.push('/login');
                        break;
                    default:
                        console.log('Error: ', error);
                        break;
                }
            });
        },
        async getCreadores() {
            await axios.get(`${this.API}/usuario`, {
                headers: {
                    Authorization: `Bearer ${this.store.getToken()}`
                }
            }).then(response => {
                this.creadores = response.data;
            }).catch(error => {
                switch (error.response.data.statusCode) {
                    case 401:
                        //Se le termino la sesión
                        this.store.clearUser();
                        this.$router.push('/login');
                        break;
                    default:
                        console.log('Error: ', error);
                        break;
                }
            });
        },
        verGanadores(concurso) {
            if (concurso != null) {
                const indexConcurso = this.concursos.findIndex(c => c._id == concurso);
                if (indexConcurso != -1) {
                    const c2 = this.concursos[indexConcurso];
                    this.premioConcurso = c2.tipo_premio != 'Objeto' ? c2.premio : 'Objeto';
                    this.ganadoresConcurso = c2.ganadores;
                    this.modalGanadores = true;
                }
            }
        }
    },
    async created() {
        this.store = useStoreEvento();
        if (!this.store.isActive()) {
            this.$router.push('/login');
        }
        this.getSorpresas();
        this.getConcursos();
        this.getCreadores();
        /* await axios.get(`${this.API}/sorpresa/ganador`).then(response => {
            console.log(response.data);
        }).catch(error => {
            console.log(error.response.data);
        }); */
    }

}
</script>

<style>
.sorpresa {
    border: none;
}

.sorpresa>.p-dialog-header,
.sorpresa>.p-dialog-content {
    background: transparent;
    border: none;
    opacity: 1;
}

.formEvento>div.flex>div>input,
.formEvento>div.flex>div>textarea,
.formEvento>div.flex>div>select,
.formEvento>div.flex>div>span.p-calendar {
    width: 100% !important;
}

input[type=file] {
    height: 46px !important;
}
</style>