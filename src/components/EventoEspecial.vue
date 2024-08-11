<template>
    <div>

        <Panel v-if="admin == true" class="EventoEspecial">
            <Toast />
            <template #header>
                <div class="flex items-center gap-2 flex-end w-full justify-content-between flex-wrap">
                    <h1 class="m-0">Eventos Especiales</h1>
                    <Button label="Evento" icon="pi pi-plus" @click="modalEvento = true" />
                </div>
            </template>

            <DataTable :value="Evento" :sortOrder="-1" paginator :rows="5" :rowsPerPageOptions="[5, 10, 20, 50]"
                tableStyle="min-width: 100%">
                <Column header="Categoria" field="categoria" sortable>
                </Column>
                <Column header="Titulo" field="titulo">
                </Column>
                <Column header="Descripcion" field="descripcion">
                </Column>
                <Column header="Reglas" field="reglas">
                </Column>
                <Column header="Fecha Inicio" field="fecha_inicio" sortable>
                    <template #body="slotProps">
                        {{ slotProps.data.fecha_inicio != null ? slotProps.data.fecha_inicio.slice(0, 10) : '' }}

                    </template>
                </Column>
                <Column header="Fecha Final" field="fecha_fin" sortable>
                    <template #body="slotProps">
                        {{ slotProps.data.fecha_fin != null ? slotProps.data.fecha_fin.slice(0, 10) : '' }}

                    </template>
                </Column>
                <Column header="Top 1" field="premios.top1.descripcion">
                </Column>

                <Column header="Top 2" field="premios.top2.descripcion">
                </Column>

                <Column header="Top 3" field="premios.top3.descripcion">
                </Column>
                <Column header="Estado" field="estado" sortable>
                    <template #body="slotProps">
                        <Tag :severity="ponerEstado(slotProps.data.estado)" :value="slotProps.data.estado" />

                    </template>
                </Column>
                <Column header="Acciones" field="_id">
                    <template #body="slotProps">
                        <div>
                            <Button class="m-1" icon="pi pi-trash" outlined rounded severity="danger"
                                @click="verificacion(slotProps.data._id,)"></Button>
                        </div>

                    </template>
                </Column>
            </DataTable>

            <Dialog v-model:visible="modalEvento" header="Nuevo evento especial" :style="{ width: '40rem' }"
                :breakpoints="{ '1199px': '75vw', '575px': '90vw' }" position="top" :modal="true" :draggable="false">
                <form ref="formEvento" class="formEvento">
                    <label class="font-bold block">Categoria de participantes</label>
                    <div class="card flex justify-content-center m-3">
                        <SelectButton v-model="paquete.categoria" :options="Rangos" aria-labelledby="basic" />
                    </div>
                    <div class="flex gap-1">
                        <div class="titulo sm:w-full md:w-6">
                            <label for="titulo" class="font-bold block">Título</label>
                            <InputText type="text" id="titulo" v-model="paquete.titulo" />
                        </div>
                        <div class="descripcion sm:w-full md:w-6">
                            <label for="descripcion" class="font-bold block">Descripción</label>
                            <Textarea id="descripcion" v-model="paquete.descripcion" rows="1" cols="25" />
                        </div>
                    </div>

                    <div class="flex gap-1">
                        <div class="reglas sm:w-6">
                            <label for="reglas" class="font-bold block">Reglas</label>
                            <Textarea id="reglas" v-model="paquete.reglas" rows="1" cols="20" />
                        </div>
                        <div class="disponibilidad sm:w-6">
                            <label for="fecha_inicio" class="font-bold block">Disponibilidad</label>
                            <Calendar id="fecha_inicio" selectionMode="range" :numberOfMonths="2"
                                v-model="paquete.fecha_fin" :minDate="new Date()" :manualInput="false"
                                dateFormat="yy-mm-dd" />
                        </div>
                    </div>
                    <Divider class="m-1" />
                    <h4 class="m-0">Premios</h4>
                    <div class="flex flex-column gap-1">
                        <h5 class="m-0">Top 1</h5>
                        <div class="top1 flex gap-1">
                            <div class="flex flex-column sm:w-6">
                                <label for="descripcion_top1">Descripción</label>
                                <InputText type="text" id="descripcion_top1"
                                    v-model="paquete.premios.top1.descripcion" />
                            </div>
                            <div class="flex flex-column sm:w-6">
                                <label for="imagen_top1">Imagen</label>
                                <InputText type="file" id="imagen_top1" accept="image/*"
                                    @change="asignarImagen($event, 'top1')" />
                            </div>
                        </div>
                    </div>
                    <div class="flex flex-column gap-1">
                        <h5 class="m-0">Top 2</h5>
                        <div class="top2 flex gap-1">
                            <div class="flex flex-column sm:w-6">
                                <label for="descripcion_top2">Descripción</label>
                                <InputText type="text" id="descripcion_top2"
                                    v-model="paquete.premios.top2.descripcion" />
                            </div>
                            <div class="flex flex-column sm:w-6">
                                <label for="imagen_top2">Imagen</label>
                                <InputText type="file" id="imagen_top2" accept="image/*"
                                    @change="asignarImagen($event, 'top2')" />
                            </div>
                        </div>
                    </div>
                    <div class="flex flex-column gap-1">
                        <h5 class="m-0">Top 3</h5>
                        <div class="top3 flex gap-1">
                            <div class="flex flex-column sm:w-6">
                                <label for="descripcion_top3">Descripción</label>
                                <InputText type="text" id="descripcion_top3"
                                    v-model="paquete.premios.top3.descripcion" />
                            </div>
                            <div class="flex flex-column sm:w-6">
                                <label for="imagen_top3">Imagen</label>
                                <InputText type="file" id="imagen_top1" accept="image/*"
                                    @change="asignarImagen($event, 'top3')" />
                            </div>
                        </div>
                    </div>
                </form>
                <template #footer>
                    <Button label="Cancelar" @click="modalEvento = false" text severity="danger" autofocus />
                    <Button label="Crear" @click="crearEvento" :disabled="btnEvento" severity="success" />
                </template>
            </Dialog>

            <Dialog v-model:visible="modalEliminar" :style="{ width: '47rem' }"
                :breakpoints="{ '1199px': '75vw', '575px': '90vw' }" position="top" :modal="true" :draggable="false">
                <template #header>
                </template>
                <div class="card flex justify-content-center">
                    <h2>¿Esta seguro de eliminar el evento?</h2>
                </div>

                <template #footer>
                    <Button label="No,cancelar" @click="modalEliminar = false" text severity="danger" />
                    <Button label="Si,Eliminar" @click="Eliminar()" severity="success" autofocus />
                </template>
            </Dialog>

            <Dialog v-model:visible="modalAplicar" :style="{ width: '47rem' }"
                :breakpoints="{ '1199px': '75vw', '575px': '90vw' }" position="top" :modal="true" :draggable="false">
                <template #header>
                </template>
                <div class="card flex justify-content-center">
                    <h2>¿Quieres participar en este evento?</h2>
                </div>

                <template #footer>
                    <Button label="No quiero" @click="(modalAplicar = false),
                        (verificacionEliminar = null)" text severity="danger" />
                    <Button label="Sí quiero" @click="agregarParticipante()" severity="success" autofocus />
                </template>
            </Dialog>
        </Panel>
    </div>
</template>
<script>
import axios from "axios";
import { useStoreEvento } from "../store";


export default {
    data: () => ({
        API: import.meta.env.VITE_APP_API,
        admin: false,
        modalEvento: false,
        Rangos: ['Rookie', 'Veteran', 'Pro', 'Pro+'],
        btnEvento:false,
        fecha_rango: null,
        verificacionEliminar: null,
        verificacionAplicar: null,
        categoriaEvento: null,
        modalEliminar: false,
        modalAplicar: false,
        paqueteParticipante: {
            participante: null,
            evento: null,
            categoria: null,
            categoriaParticipante: null,
        },
        paquete: {
            categoria: null,
            estado: "En preparacion",
            titulo: null,
            descripcion: null,
            reglas: null,
            fecha_inicio: new Date(),
            fecha_fin: null,
            premios: {
                top1: {
                    descripcion: null,
                    imagen: ''
                },
                top2: {
                    descripcion: null,
                    imagen: ''
                },
                top3: {
                    descripcion: null,
                    imagen: ''
                }
            },
            imagen_top1: null,
            imagen_top2: null,
            imagen_top3: null
        },
        Evento: [],
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

    }),
    methods: {

        asignarImagen(event, top) {
            switch (top) {
                case 'top1':
                    this.paquete.imagen_top1 = event.target.files[0]
                    break;

                case 'top2':
                    this.paquete.imagen_top2 = event.target.files[0]
                    break;

                case 'top3':
                    this.paquete.imagen_top3 = event.target.files[0]
                    break;
            }
        },
        ponerEstado(estado) {
            if (estado == "Finalizado") {
                return "warning";
            } else if (estado == "En preparacion") {
                return "info";
            } else {
                return "success";
            }
        },

        aplicar(id, categoria) {
            if (!this.store.isActive()) {
                this.store.eventoID(id, categoria);
                this.$router.push('/login');
            } else {
                this.modalAplicar = true;
                this.verificacionAplicar = id;
                this.categoriaEvento = categoria
                console.log(categoria);
            }

        },
        verificacion(id) {
            this.verificacionEliminar = id;
            this.modalEliminar = true;
        },

        async crearEvento() {
            const validF = await this.formValid();
            if (validF) {
                this.btnEvento = true;
                this.paquete.fecha_inicio = this.paquete.fecha_fin[0];
                this.paquete.fecha_fin = this.paquete.fecha_fin[1];
                await axios.post(`${this.API}/sorpresa/eventoEspecial/crear`, this.paquete, {
                    headers: {
                        'Content-Type': 'multipart/form-data',
                        Authorization: `Bearer ${this.store.getToken()}`
                    }
                }).then(response => {
                    if (response.data.creado) {
                        this.getEventos();
                        this.modalEvento = false;
                        this.$refs.formEvento.reset();
                        this.$toast.add({ severity: 'success', summary: 'Nuevo evento', detail: 'Evento especial creado correctamente', life: 1500 });
                    } else {
                        this.$toast.add({ severity: 'error', summary: 'Nuevo evento', detail: 'No se pudo crear el evento especial', life: 1500 });
                    }
                }).catch(error => {
                    switch (error.response.data.statusCode) {
                        case 401:
                            //Se le termino la sesión
                            this.store.clearUser();
                            this.$router.push('/login');
                            break;
                        default:
                            this.$toast.add({ severity: 'error', summary: 'Nuevo evento', detail: 'Sucedió un error, no se pudo crear el evento especial', life: 1500 });
                            console.log('Error: ', error);
                            break;
                    }
                });
                this.btnEvento = false;
            }
        },

        async formValid() {
            const key = Object.keys(this.paquete);
            let valid = false;
            for (const k of key) {
                valid = true;
                if (k == "premio") {
                    if (this.paquete[k].top1.descripcion == null || !/^(?!\s*$).+/.test(this.paquete[k].top1.descripcion) || !/^(?!\s*$).+/.test(this.paquete[k].top2.descripcion) || this.paquete[k].top2.descripcion != null || !/^(?!\s*$).+/.test(this.paquete[k].top3.descripcion) || this.paquete[k].top3.descripcion == null) {
                        valid = false;
                        break;
                    }
                } else if (this.paquete[k] == null) {
                    valid = false;
                    break;
                } else if (!/^(?!\s*$).+/.test(this.paquete[k])) {
                    valid = false;
                    break;
                } else if (this.paquete.categoria == null) {
                    valid = false;
                    break
                }
            }
            if (!valid) {
                this.$toast.add({ severity: 'error', summary: 'Nuevo evento', detail: 'Debes llenar todos los campos', life: 1600 });
            }
            return valid;
        },
        async getEventos() {
            await axios.get(`${this.API}/sorpresa/evento`, {
            }).then(response => {
                this.Evento = response.data;
                console.log(this.Evento);
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

        async Eliminar() {
            await axios.delete(`${this.API}/sorpresa/evento/${this.verificacionEliminar}`, {
                headers: {
                    Authorization: `Bearer ${this.store.getToken()}`
                }
            }).then(response => {
                console.log(response);
                this.modalEliminar = false;
                this.getEventos();
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
        }

    },

    async created() {
        this.store = useStoreEvento();
        if (this.store.isAdmin()) {
            this.admin = true;
        }
        if (this.store.Evento) {
            this.modalAplicar = true;
            this.verificacionAplicar = this.store.evento.evento;
            this.categoriaEvento = this.store.evento.categoria;
            this.store.eventoDelete();
        }
        await this.getEventos();
    }

}
</script>
<style>
.p-inputnumber-input {
    width: 100% !important;
}
</style>