<template>
    <div class="app">
        <NavBar></NavBar>
        <div class="evento">
            <div class="video-container">
                <video autoplay muted loop>
                    <source src="/assets/video/eventos/fondo-eventos.mp4" type="video/mp4">
                    Tu navegador no soporta esta funcionalidad video
                </video>
            </div>
            <div v-if="spiner" class="flex w-full justify-content-center align-items-center" style="min-height: 100vh;">
                <ProgressSpinner />
            </div>
            <Card v-else class="px-0">
                <template #content>
                    <TabView class="font-gamers">
                        <TabPanel v-for="evento in eventos " :key="evento" :header="evento.titulo">
                            <div class="flex justify-content-between md:justify-content-center sm:justify-content-center flex-wrap gap-4">
                                <div class="descripcion">
                                    <div class="container py-1">
                                        <p class="m-0">{{ evento.descripcion }}</p>
                                    </div>
                                </div>
                                <div class="reglas">
                                    <h2 class="mb-0">REGLAS</h2>
                                    <div class="container">
                                        <div class="flex gap-2">
                                            <div class="item-regla" />
                                            <p class="m-0">{{ evento.reglas }}</p>
                                        </div>
                                    </div>
                                </div>
                                <div class="progreso">
                                    <h2 class="mb-0">PROGRESO</h2>
                                    <div class="container flex flex-column gap-2">
                                        <p class="fechas m-0">{{ evento.fecha_inicio }} | {{ evento.fecha_fin }}</p>
                                        <div :class="'barra-progreso barra-' + calcularPromdioTranscurrido(evento.fecha_inicio, evento.fecha_fin)[0]" :style="`width: ${(calcularPromdioTranscurrido(evento.fecha_inicio, evento.fecha_fin)[1]) > 100 ? 100 : calcularPromdioTranscurrido(evento.fecha_inicio, evento.fecha_fin)[1]}%`">{{ calcularPromdioTranscurrido(evento.fecha_inicio, evento.fecha_fin)[1] }}%</div>
                                    </div>
                                </div>
                            </div>
                            <div class="flex justify-content-around flex-wrap mt-5" style="row-gap: 25px;">
                                <div v-for="(premio, index) in Object.values(evento.premios)" :key="index" :class="`puesto${index + 1}`">
                                    <div class="titulo flex flex-column w-full">
                                        <div class="fondo">
                                            <p class="m-0">Puesto {{ index + 1 }}</p>
                                        </div>
                                    </div>
                                    <div class="imagen">
                                        <img :src="premio.imagen"
                                            :alt="premio.descripcion" class="border-round imgPremio" />
                                    </div>
                                    <div class="descripcion-premio w-full text-center mt-5 p-3">
                                        <p class="m-0">{{ premio.descripcion }}</p>
                                    </div>
                                </div>
                            </div>
                        </TabPanel>

                    </TabView>
                    <DataTable :value="creadores" class="tablaCreadoresEvento" tableStyle="min-width: 8rem" sortField="diamantes_mes_actual"
                        :sortOrder="-1">
                        <template #header>
                            <span class="text-xl text-900 font-bold font-gamers text-center" style="z-index: 1;">CREADORES DE CONTENIDO</span>
                            <img src="/assets/img/eventos/divisor-titulo.png" alt="Divisor" class="w-full mb-3" style="z-index: 1;">
                            <div class="text-center uppercase font-gamers" style="z-index: 1;">
                                <p class="m-0 text-inline-evento text-6xl color-blue" v-if="all != true">GRUPO {{ grupoMostrado }}</p>
                                <p class="m-0 text-inline-evento text-6xl color-blue" v-else>TODOS</p>
                            </div>
                            <div class="grupos mt-3 mb-5 uppercase font-gamers color-blue" style="z-index: 1;" v-if="gruposMezcla == null || gruposMezcla == ''">
                                <span class="todos" @click="changeCreador('Todos')">Todos</span>
                                <span class="A" @click="changeCreador('A')">A</span>
                                <span class="B" @click="changeCreador('B')">B</span>
                                <span class="C" @click="changeCreador('C')">C</span>
                            </div>
                            <div class="grupos grupos3 mt-3 mb-5 uppercase font-gamers color-blue" style="z-index: 1;" v-else>
                                <span class="todos" @click="changeCreador('Todos')">Todos</span>
                                <span v-if="gruposMezcla == 'A-B' || gruposMezcla == 'B-A'" class="A-B" @click="changeCreador('A-B')">A-B</span>
                                <span v-if="gruposMezcla == 'A-B' || gruposMezcla == 'B-A'" class="C" @click="changeCreador('C')">C</span>

                                <span v-if="gruposMezcla == 'A-C' || gruposMezcla == 'C-A'" class="A-C" @click="changeCreador('A-C')">A-C</span>
                                <span v-if="gruposMezcla == 'A-C' || gruposMezcla == 'C-A'" class="B" @click="changeCreador('B')">B</span>

                                <span v-if="gruposMezcla == 'C-B' || gruposMezcla == 'B-C'" class="A" @click="changeCreador('A')">A</span>
                                <span v-if="gruposMezcla == 'C-B' || gruposMezcla == 'B-C'" class="B-C" @click="changeCreador('B-C')">B-C</span>
                            </div>
                            <div class="containerC">
                                <video autoplay muted loop class="tabla-fondo-header">
                                    <source src="/assets/video/eventos/tabla-fondo-header.mp4" type="video/mp4">
                                    Tu navegador no soporta esta funcionalidad video
                                </video>
                                <Clasificacion :nombre="top3[1].usuario" top="2" tipo="Platino" :foto="top3[1].foto" />
                                <Clasificacion top="1" tipo="Oro" :nombre="top3[0].usuario" :foto="top3[0].foto" />
                                <Clasificacion :nombre="top3[2].usuario" top="3" tipo="Cobre" :foto="top3[2].foto" />
                            </div>
                        </template>
                        <Column header="#" class="font-gamers" headerStyle="width:3rem">
                            <template #body="slotProps">
                                {{ slotProps.index + 1 }}
                            </template>
                        </Column>
                        <Column field="usuario" header="Creador" class="font-gamers">
                            <template #body="slotProps">
                                <InlineMessage v-if="slotProps.index == 0" class="font-gamers" icon="pi pi-star" severity="warn">
                                    {{ slotProps.data.usuario }}
                                </InlineMessage>
                                <InlineMessage v-else-if="slotProps.index == 1" class="font-gamers" icon="pi pi-star" severity="error">
                                    {{ slotProps.data.usuario }}
                                </InlineMessage>
                                <InlineMessage v-else-if="slotProps.index == 2" class="font-gamers" icon="pi pi-star" severity="info">
                                    {{ slotProps.data.usuario }}
                                </InlineMessage>
                                <p v-else> {{ slotProps.data.usuario }}</p>
                            </template>
                        </Column>
                        <Column field="diamantes_mes_actual" class="font-gamers" header="Puntos">
                            <template #body="slotProps">
                                {{ slotProps.data.diamantes_mes_actual * multiplicador }}
                            </template>
                        </Column>
                        <Column field="diamantes_mes_anterior" class="font-gamers" header="Puntos Mes Anterior"></Column>
                        <Column field="grupo" class="font-gamers" header="Grupo">
                            <template #body="props">
                                <img :src="`/assets/img/grupos/${props.data.grupo}.png`" :alt="`Grupo ${props.data.grupo}`" class="img-grupo">
                            </template>
                        </Column>
                    </DataTable>
                </template>
            </Card>
        </div>
    </div>
</template>
<script>
import axios from "axios";
import { useStoreMezcla } from "../store";

export default {
    name: 'EventoView',
    data: () => ({
        img: null,
        multiplicador: 1,
        API: import.meta.env.VITE_APP_API,
        gruposMezcla: null,
        storeMezcla: null,
        grupoMostrado: 'A',
        spiner: true,
        eventos: [],
        eventosLabel: [],
        arrayCreadores: [],
        creadores: [],
        premios: [
            {
                name: "Silla Gamer",
                image:
                    "https://i.linio.com/p/c3786e7c22a6664d487c3b0c47ee67a3-product.jpg",
            },
            {
                name: "Aro de luz",
                image: "https://static.foto321.com/2021/09/aro-de-luz-321-sirve.jpg",
            },
            {
                name: "Box Ramdon",
                image:
                    "https://toogeek.co/wp-content/uploads/2021/11/D_NQ_NP_864337-MCO45705901406_042021-O.jpg",
            },
        ],
        responsiveOptions: [
            {
                breakpoint: "1199px",
                numVisible: 3,
                numScroll: 1,
            },
            {
                breakpoint: "1000px",
                numVisible: 2,
                numScroll: 1,
            },
            {
                breakpoint: "750px",
                numVisible: 1,
                numScroll: 1,
            },
        ],
        topInsignias: ['Oro', 'Platino', 'Cobre'],
        arrayTop3: [],
        top3: [{
            usuario: '',
            foto: ''
        }, {
            usuario: '',
            foto: ''
        }, {
            usuario: '',
            foto: ''
        }],
        all: false
    }),
    methods: {
        changeCreador(grupo) {
            if (grupo != 'Todos') {
                if (grupo.length == 1) {
                    for (let i = 0; i < this.arrayCreadores.length; i++) {
                        if (this.arrayCreadores[i]._id === grupo) {
                            this.grupoMostrado = grupo;
                            this.creadores = [];
                            this.creadores = this.arrayCreadores[i].usuarios;
                        }
                    }
                    for (let i = 0; i < this.arrayTop3.length; i++) {
                        if (this.arrayTop3[i].grupo === grupo) {
                            this.top3 = [];
                            this.top3 = this.arrayTop3[i].usuarios;
                        }
                    }
                } else {
                    const mezcla = this.gruposMezcla.split('-');
                    const index1 = this.arrayCreadores.findIndex(creador => creador._id == mezcla[0]);
                    const index2 = this.arrayCreadores.findIndex(creador => creador._id == mezcla[1]);
                    if (index1 != -1 && index2 != -1) {
                        this.grupoMostrado = this.gruposMezcla;
                        this.creadores = [...this.arrayCreadores[index1].usuarios, ...this.arrayCreadores[index2].usuarios];
                    }
                    const index3 = this.arrayTop3.findIndex(top => top.grupo == mezcla[0]);
                    const index4 = this.arrayTop3.findIndex(top => top.grupo == mezcla[1]);
                    if (index3 != -1 && index4 != -1) {
                        const mezclaTops = [...this.arrayTop3[index3].usuarios, ...this.arrayTop3[index4].usuarios];
                        mezclaTops.sort((a, b) => b.diamantes_mes_actual - a.diamantes_mes_actual);
                        this.top3 = mezclaTops.slice(0, 3);
                    }
                }
                this.all = false;
            } else {
                this.creadores = [...this.arrayCreadores[0].usuarios, ...this.arrayCreadores[1].usuarios, ...this.arrayCreadores[2].usuarios];
                this.creadores.sort((a, b) => b.diamantes_mes_actual - a.diamantes_mes_actual);
                this.top3 = this.creadores.slice(0, 3);
                this.all = true;
            }
        },
        calcularPromdioTranscurrido(fechaInicio, fechaFin) {
            let fechaI = new Date(fechaInicio);
            let fechaF = new Date(fechaFin);

            let fechaActual = new Date();

            const tiempoTranscurrido = fechaActual - fechaI;

            const tiempoTotal = fechaF - fechaI;

            let porcentajeTranscurrido = (tiempoTranscurrido / tiempoTotal) * 100;

            porcentajeTranscurrido = Math.ceil(porcentajeTranscurrido);
            console.log(porcentajeTranscurrido);
            return [porcentajeTranscurrido < 70 ? 'roja' : 'verde', porcentajeTranscurrido];
        }
    },
    async created() {
        this.storeMezcla = useStoreMezcla();
        await axios
            .get(
                `${this.API}/bonus/gruposMezclados`
            ).then(response => {
                if (response.data != '' && response.data != null) {
                    this.storeMezcla.saveMezcla(response.data.grupos);
                }
            });
        this.gruposMezcla = this.storeMezcla.getGrupo();
        this.gruposMezcla = this.gruposMezcla == '' ? null : this.gruposMezcla;
        await axios.get(`${this.API}/usuario/agrupados`).then((resp) => {
            this.arrayCreadores = resp.data;
            if (this.gruposMezcla == null) {
                for (let i = 0; i < this.arrayCreadores.length; i++) {
                    if (this.arrayCreadores[i]._id === "A") {
                        this.creadores = [];
                        this.creadores = this.arrayCreadores[i].usuarios;
                    }
                }
            } else {
                const mezcla = this.gruposMezcla.split('-');
                const index1 = this.arrayCreadores.findIndex(creador => creador._id == mezcla[0]);
                const index2 = this.arrayCreadores.findIndex(creador => creador._id == mezcla[1]);
                if (index1 != -1 && index2 != -1) {
                    this.grupoMostrado = this.gruposMezcla;
                    this.creadores = [...this.arrayCreadores[index1].usuarios, ...this.arrayCreadores[index2].usuarios];
                }
            }
        });
        await axios.get(`${this.API}/usuario/top`).then((resp) => {
            this.arrayTop3 = resp.data;
            if (this.gruposMezcla == null) {
                for (let i = 0; i < this.arrayTop3.length; i++) {
                    if (this.arrayTop3[i].grupo === "A") {
                        this.top3 = [];
                        this.top3 = this.arrayTop3[i].usuarios;
                    }
                }
            } else {
                const mezcla = this.gruposMezcla.split('-');
                const index1 = this.arrayTop3.findIndex(top => top.grupo == mezcla[0]);
                const index2 = this.arrayTop3.findIndex(top => top.grupo == mezcla[1]);
                if (index1 != -1 && index2 != -1) {
                    const mezclaTops = [...this.arrayTop3[index1].usuarios, ...this.arrayTop3[index2].usuarios];
                    mezclaTops.sort((a, b) => b.diamantes_mes_actual - a.diamantes_mes_actual);
                    this.top3 = mezclaTops.slice(0, 3);
                }
            }

        });
        await axios.get(`${this.API}/evento/activo`).then((resp) => {
            this.eventos = resp.data;
            resp.data.forEach((evento) => {
                this.eventosLabel.push({
                    label: evento.titulo,
                    icon: "pi pi-calendar-times",
                });
            });
        });
        await axios.get(`${this.API}/bonus/multiplicador`).then((resp) => {
            this.multiplicador = resp.data.multiplicador;
        });
        this.spiner = false;
    },
};
</script>

<style>
.containerC {
    display: flex;
    width: 100%;
    flex-wrap: wrap;
    align-items: end;
    row-gap: 70px;
    justify-content: center;
}

.img-grupo {
    width: 30px !important;
    height: 30px !important;
}

.marco-tabla {
    position: absolute;
    top: 20%;
    width: 100%;
    height: 80%;
    z-index: 4;
    background-size: contain;
}

.clasificacion.pos-Oro {
    width: 400px !important;
    height: 400px !important;
}

.clasificacion.pos-Oro>.imgProfile {
    width: 190px !important;
    top: 6px !important;
    height: 191px !important;
}

.clasificacion.pos-Oro>.labelNombre {
    top: 105px !important;
}

.p-tabview .p-tabview-nav {
    border: 0 !important;
    border-width: 0 !important;
}

.p-tabview .p-tabview-nav li .p-tabview-nav-link {
    background: transparent !important;
}

.p-tabview-nav-content::after {
    content: '';
    display: block;
    height: 3px;
    background-image: url('/assets/img/eventos/linea.png');
    width: 100%;
}

.p-tabview-nav>.p-tabview-header:not(.p-highlight)>.p-tabview-nav-link {
    border: 0 !important;
    border-width: 0 !important;
    background: transparent !important;
}

.p-tabview-nav>.p-tabview-header.p-highlight>.p-tabview-nav-link {
    border: solid #84DC16 !important;
    border-width: 0 0 2px 0 !important;
    border-color: transparent transparent #84DC16 transparent !important;
    color: #84DC16 !important;
}

/*
.p-tabview .p-tabview-nav li .p-tabview-nav-link {
    z-index: 2 !important;
    border: 0 !important;
}

.p-tabview .p-tabview-nav li.p-highlight .p-tabview-nav-link {
    border: solid !important;
    border-width: 0 0 2px 0 !important;
}*/
.p-card {
    position: relative;
    z-index: 2;
}

.p-card .p-card-content,
.p-card .p-card-body {
    padding-bottom: 0 !important;
}

.p-tabview .p-tabview-panels,
.tablaCreadoresEvento>.p-datatable-wrapper>.p-datatable-table>.p-datatable-tbody>tr,
.tablaCreadoresEvento>.p-datatable-wrapper>.p-datatable-table>.p-datatable-thead>tr>th {
    background: transparent !important;
}

.tablaCreadoresEvento>.p-datatable-wrapper {
    /* background-image: url('/assets/img/eventos/marco-tabla.png'); */
    background-repeat: no-repeat;
    background-size: 100% 100%;
    padding-bottom: 100px;
}

.tablaCreadoresEvento {
    mix-blend-mode: screen;
    position: relative;
    z-index: 1;
    background-image: url('/assets/img/eventos/footer-tabla.jpg') !important;
    background-repeat: no-repeat !important;
    background-size: contain !important;
    background-position: bottom !important;
    display: flex;
    justify-content: center !important;
    flex-direction: column;
}

.tablaCreadoresEvento>.p-datatable-header {
    display: flex;
    flex-direction: column;
    align-items: center;
    background-color: #000000 !important;
    border: none !important;
    padding-bottom: 160px !important;
}

.tablaCreadoresEvento>.p-datatable-wrapper>.p-datatable-table>.p-datatable-tbody,
.tablaCreadoresEvento>.p-datatable-wrapper>.p-datatable-table>.p-datatable-thead>tr>th {
    background-color: #000000 !important;
}


.tablaCreadoresEvento>.p-datatable-wrapper>.p-datatable-table>.p-datatable-tbody>tr>td,
.tablaCreadoresEvento>.p-datatable-wrapper>.p-datatable-table>.p-datatable-thead>tr>th {
    border: none !important;
}

.tablaCreadoresEvento>.p-datatable-wrapper>.p-datatable-table>.p-datatable-tbody>tr {
    background-image: url('/assets/img/eventos/divisor-fila.png') !important;
    background-repeat: repeat-x !important;
    background-size: contain !important;
}

.p-progress-spinner {
    z-index: 3 !important;
}

.tablaCreadoresEvento>.p-datatable-wrapper>.p-datatable-table {
    mix-blend-mode: screen !important;
    width: 90%;
    margin: 0 auto;
    /* background-image: url('/assets/img/eventos/marco-tabla.png'); */
    background-repeat: no-repeat;
    background-size: contain;
}

.p-card-body {
    padding-left: 0 !important;
    padding-right: 0 !important;
}

@media (max-width:500px) {

    .descripcion>.container {
        justify-content: start !important;
        padding: 10px 10px 48px 10px !important;
    }
}

@media (max-width: 450px) {
    .clasificacion>.imgFondo {
        width: 95%;
    }

    .descripcion,
    .reglas,
    .progreso {
        background-size: contain !important;
        min-width: 100% !important;
        padding: 10px 10px 48px 10px !important;
    }
}

@media (max-width:300px) {
    .clasificacion>.imgFondo {
        width: 99%;
    }

    .descripcion {
        padding: 6px 10px 48px 10px !important;
    }

    .reglas>h2,
    .progreso>h2 {
        margin-top: 0 !important;
    }
}

@media (max-width:895px) {

    .containerC>.tabla-fondo-header {
        margin-top: 500px !important;
    }

    .containerC>.clasificacion>.imgFondo {
        height: 318px;
    }

    .containerC>.clasificacion.pos-Oro>.imgFondo {
        height: 464px;
    }
}

@media (max-width:450px) {
    .containerC>.clasificacion>.imgFondo {
        width: 250px;
        height: 250px !important;
    }

    .containerC>.clasificacion>.imgProfile {
        width: 100px !important;
        height: 100px !important;
    }

    .containerC>.clasificacion>.labelNombre {
        top: 55px !important;
    }

    .containerC>.clasificacion.pos-Oro {
        position: relative;
        top: -125px;
    }

    .containerC>.clasificacion.pos-Oro>.labelNombre {
        top: 57px !important;
    }

    .containerC>.clasificacion.pos-Cobre {
        position: relative;
        top: -255px;
    }

    .grupos.grupos3>.B {
        left: 1px !important;
    }
}
</style>

<style scoped>
.video-container {
    position: fixed;
    width: 100%;
    height: 100%;
    overflow: hidden;
    z-index: 1;
}

.video-container2 {
    position: absolute;
    width: 100%;
    height: 100%;
    top: 0 !important;
    background-size: cover;
    left: 0 !important;
}

.tabla-fondo-header {
    top: 0 !important;
    left: 0 !important;
    width: max-content !important;
    height: max-content !important;
    transform: none !important;
    z-index: 0;
    background-size: cover;
    margin-top: 100px;
}

video {
    max-width: 100%;
    max-height: 100%;
    width: 800px;
    height: 800px;
    position: absolute;
    top: 50%;
    left: 50vw;
    transform: translate(-50%, -50%);
}

.evento {
    margin-top: 55px;
}

.evento>* {
    background: transparent !important;
    /* font-family: 'planet-gamers'; */
}

.descripcion {
    background-image: url('/assets/img/eventos/descripcion.png');
    background-repeat: no-repeat;
    background-size: cover;
    width: 400px;
    height: 200px;
    padding: 41px 16px 47px 25px;
}

.descripcion>.container {
    font-size: 19px;
    overflow-x: auto;
    height: 100%;
    width: 100%;
    /*  display: flex; */
    justify-content: center;
    flex-direction: column;
    text-align: center;
    text-transform: uppercase;
}

.reglas,
.progreso {
    background-image: url('/assets/img/eventos/reglas.png');
    background-repeat: no-repeat;
    background-size: cover;
    width: 100%;
    height: auto;
    max-width: 400px;
    max-height: 200px;
    min-height: 200px;
    min-width: 400px;
    padding: 12px;
}

.item-regla {
    background-image: url('/assets/img/eventos/punto-lista.png');
    background-repeat: no-repeat;
    background-size: contain;
    width: 60px;
    height: 30px;
}

.barra-progreso {
    text-align: center;
}

.barra-roja {
    background-image: url('/assets/img/eventos/fluido-rojo.png');
    background-repeat: no-repeat;
    background-size: cover;
    border-bottom-left-radius: 12px;
    border-top-left-radius: 12px;
}

.barra-verde {
    background-image: url('/assets/img/eventos/fluido-verde.png');
    background-repeat: no-repeat;
    background-size: cover;
    border-radius: 12px;
}

[class*="puesto"] {
    width: 300px;
    height: 453px;
    background-repeat: no-repeat;
    background-size: contain;
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-items: end;
}

.imagen {
    height: 167px;
}

.puesto1 {
    background-image: url('/assets/img/eventos/premio1-fondo.png');
}

.puesto1>.titulo>.fondo {
    background-image: url('/assets/img/eventos/premio1-titulo.png');
}

.puesto2 {
    background-image: url('/assets/img/eventos/premio2-fondo.png');
}

.puesto2>.titulo>.fondo {
    background-image: url('/assets/img/eventos/premio2-titulo.png')
}

.puesto3 {
    background-image: url('/assets/img/eventos/premio3-fondo.png');
}

.puesto3>.titulo>.fondo {
    background-image: url('/assets/img/eventos/premio3-titulo.png')
}

.titulo {
    justify-items: end;
    align-items: end;
}

[class*="puesto"]>.titulo>.fondo {
    background-size: cover;
    background-repeat: no-repeat;
    width: max-content;
    padding: 19px 44px 12px 44px;
    top: -13px;
    float: right;
    position: relative;
}

.descripcion-premio {
    background-image: url('/assets/img/eventos/descripcion-premio.png');
    background-repeat: no-repeat;
    background-size: contain;
    height: 100%;
    overflow: auto;
}

.grupos {
    background-image: url('/assets/img/eventos/grupos.png');
    background-repeat: no-repeat;
    background-size: contain;
    height: 60px;
    width: 600px;
    display: flex;
    justify-content: space-between;
    align-items: center;
    font-size: 25px;
    padding-right: 35px;
}

.grupos.grupos3 {
    background-image: url('/assets/img/eventos/grupos3.png');
    background-repeat: no-repeat;
    background-size: 100% 100%;
    height: 60px;
    width: 600px;
    display: flex;
    justify-content: space-between;
    align-items: center;
    font-size: 25px;
}

.grupos.grupos3>.todos {
    padding-left: 25px;
}

.grupos>* {
    position: relative;
    cursor: pointer;
}

.grupos>.todos {
    padding-left: 10px;
}

.grupos>.A {
    left: -9px;
}

.grupos.grupos3>.A {
    left: 18px;
}

.grupos>.B-C {
    left: 20px;
}

.grupos>.B {
    left: -2px;
}

.grupos.grupos3>.B {
    left: 5px;
}

.imgPremio {
    height: 167px !important;
    width: 167px !important;
}

@media (max-width: 739px) {

    .imgPremio {
        height: 100%;
    }
}

@media (max-width:988px) {
    .containerC>.clasificacion {
        width: 32% !important;
    }

    .containerC>.tabla-fondo-header {
        margin-top: 180px;
    }
}

@media (max-width:895px) {
    .containerC {
        flex-direction: column;
        align-items: center;
    }
}

@media (max-width:600px) {
    .grupos {
        width: 100%;
        align-items: start !important;
        padding-top: 10px !important;
        font-size: 20px !important;
        padding-left: 2%;
        padding-right: 16px;
        /* gap: 23.3%; */
    }

    .grupos.grupos3 {
        width: 100%;
        align-items: center !important;
        padding-top: 0 !important;
        font-size: 25px !important;
        padding-left: 2.4%;
        padding-right: 26.6px;
    }

    .grupos>.todos {
        padding-left: 5px !important;
        padding-right: 0;
    }

    .grupos>.A {
        left: -6px !important;
    }

    .grupos.grupos3>.A {
        left: 11px !important;
    }

    .grupos>.B-C {
        left: 15px !important;
    }
}

@media (max-width:510px) {
    .grupos>.B-C {
        left: 20px !important;
    }

    .grupos>.A {
        left: -11px !important;
    }
}

@media (max-width:470px) {
    .grupos {
        width: 100%;
        align-items: start !important;
        padding-top: 7px !important;
        font-size: 18px !important;
        padding-left: 2%;
        padding-right: 16px;
        /* gap: 23.3%; */
    }

    .grupos>.todos {
        padding-left: 0 !important;
        padding-right: 0;
    }

    .grupos.grupos3 {
        font-size: 18px !important;
        padding-left: 4%;
        padding-right: 20px;
    }

    .grupos>.B-C {
        left: 11px !important;
    }

    .grupos>.A {
        padding-left: 5px;
        padding-right: 5px;
    }
}

@media (max-width:400px) {
    .grupos {
        width: 100%;
        align-items: start !important;
        padding-top: 6px !important;
        font-size: 16px !important;
        padding-left: 2%;
        padding-right: 13px;
        /* gap: 23.3%; */
    }

    .grupos>* {
        left: 0 !important;
        padding-left: 0 !important;
        padding-right: 0 !important;
    }

    .grupos>.A {
        left: -5px !important;
        padding-left: 5px;
        padding-right: 5px;
    }

    .grupos.grupos3>.A {
        left: 6px !important;
    }
}

@media (max-width:365px) {
    .grupos {
        width: 100%;
        align-items: start !important;
        padding-top: 6px !important;
        font-size: 14px !important;
        padding-left: 2%;
        padding-right: 13px;
        /* gap: 23.3%; */
    }

    .grupos>* {
        left: 0 !important;
        padding-left: 0 !important;
        padding-right: 0 !important;
    }

    .grupos>.B-C {
        left: 14px !important;
    }
}

@media (max-width:325px) {
    .grupos.grupos3>.todos {
        left: -9px !important;
    }

    .grupos>.B-C {
        left: 17px !important;
    }
}

@media (max-width:310px) {
    .grupos {
        width: 100%;
        align-items: start !important;
        padding-top: 3px !important;
        font-size: 14px !important;
        padding-left: 0;
        padding-right: 10px;
        /* gap: 23.3%; */
    }

    .grupos.grupos3 {
        font-size: 15px !important;
        padding-left: 2%;
        background-size: contain !important;
        align-items: start !important;
        padding-right: 11px;
        padding-top: 10px !important;
    }

    .grupos>* {
        left: 0 !important;
        padding-left: 0 !important;
        padding-right: 0 !important;
    }

    .grupos.grupos3>.todos {
        left: 2px !important;
    }

    .grupos>.B-C {
        left: 8px !important;
    }
}


@media (max-width:290px) {
    .grupos {
        width: 100%;
        align-items: start !important;
        padding-top: 3px !important;
        font-size: 14px !important;
        padding-left: 0;
        padding-right: 8px;
    }

    .grupos>* {
        left: 0 !important;
        padding-left: 0 !important;
        padding-right: 0 !important;
    }

    .grupos>.A {
        padding-right: 5px;
    }
}


.evento .p-fieldset-legend-text {
    color: var(--primary-color) !important;
}

.p-fieldset.p-fieldset-toggleable .p-fieldset-legend a .p-fieldset-toggler {
    color: var(--primary-color);
}

.text-900 {
    color: white !important;
}

.p-column-title {
    color: var(--primary-color) !important;
}

.p-datatable .p-column-header-content {
    color: var(--primary-color) !important;
}

.p-fieldset {
    border: 1px solid var(--primary-color);
}

.p-fieldset .p-fieldset-legend {
    border: 1px solid var(--primary-color);
}

.p-tabview-nav-container {
    display: flex;
    justify-content: center;
}
</style>