<template>
    <Panel class="perfil">
        <div
            class="container-perfil flex gap-2 w-full sm:flex-wrap xs:flex-wrap xs:justify-content-center md:flex-wrap sm:justify-content-center">
            <div class="flex align-items-center mt-4 flex-column gap-2" style="width: 490px;">
                <div class="flex flex-column text-center items-center gap-2 flex-end w-full justify-content-between">
                    <h1 class="m-0 font-gamers uppercase text-6xl">MI PERFIL</h1>
                    <div class="editar-perfil font-gamers uppercase m-auto" @click="mostrarEditar = true">
                        <span>EDITAR PERFIL</span>
                    </div>
                </div>
                <img src="/assets/img/perfil/divisor.png" alt="Divisor" height="5px" width="100%">
                <div class="w-full flex justify-content-center gap-3">
                    <h2 class="m-0 font-gamers text-6xl">Grupo</h2>
                    <img :src="`/assets/img/grupos/${store.getUsuario().grupo}.png`" width="60px" height="60px" :alt="`Grupo ${store.getUsuario().grupo}`">
                </div>
                <div v-if="isTop" class="topPerfil mb-6">
                    <!-- <Avatar :image="`/assets/img/cinta_${cinta}.png`" class="w-full cinta" />
                    <p class="text-center w-full m-0 info-grupo"><strong>Grupo {{ store.getUsuario().grupo }}</strong></p>
                     -->
                    <Clasificacion class="clasificacion" :nombre="store.getUsuario().usuario" :top="infoTop.top"
                        :tipo="infoTop.tipo" :foto="store.getUsuario().foto" />
                </div>
                <div v-else-if="store.getFoto().length > 0" style="width: max-content;">
                    <div class="imagen-usuario">
                        <img :src="store.getFoto()" alt="Foto perfil" />
                    </div>
                    <div class="marco-nombre-usuario font-gamers ml-4 flex justify-content-center align-items-center word-break">
                        <p class="text-center m-0 font-bold word-break">{{ store.getUsuario().usuario }}</p>
                    </div>
                    <!--<Avatar :image="store.getFoto()" style="width: 100px; height: 100px;" size="xlarge" shape="circle" />-->
                </div>
                <div v-else style="width: max-content;">
                    <div class="imagen-usuario">
                        <Avatar icon="pi pi-user" size="xlarge" style="background-color: transparent !important;" shape="circle" />

                    </div>

                    <div class="marco-nombre-usuario font-gamers ml-4 flex justify-content-center align-items-center word-break">
                        <p class="text-center m-0 font-bold word-break">{{ store.getUsuario().usuario }}</p>
                    </div>
                </div>
                <img src="/assets/img/perfil/divisor.png" alt="Divisor" height="5px" width="100%">
                <h3 class="m-0 font-gamers" style="width: max-content !important;">Insignias Obtenidas</h3>
                <div
                    :class="`misInsignias flex w-full gap-1 ${store.getUsuario().insignias.length > 4 ? 'flex-wrap justify-content-start' : 'justify-content-center'}`">
                    <Avatar v-for="(insignia, index) in store.getUsuario().insignias" :key="index" size="large"
                        shape="circle" v-tooltip.top="insignia.descripcion">
                        <img :src="insignia.secure_url" :alt="`Insignia ${index + 1}`">
                    </Avatar>

                </div>
            </div>
            <div class="w-full">
                <h2 class="mb-0 sm:text-center xs:text-center font-gamers">Actualización {{ fechaAct }}</h2>
                <img src="/assets/img/eventos/divisor-titulo.png" class="w-full" alt="Divisor">

                <div class="flex gap-8 xs:gap-3 sm:gap-3 sm:flex-wrap md:flex-wrap md:gap-3 xs:flex-wrap xs:justify-content-center md:justify-content-center lg:justify-content-center">
                    <div class="flex flex-column gap-4">
                        <div class="seguidores flex align-items-center decorador gap-2 p-2">
                            <div class="icono">
                                <img src="/assets/img/perfil/iconos/seguidores.png" alt="Seguidores">
                            </div>
                            <div class="informacion flex flex-column font-gamers uppercase text-white text-left line-height-2">
                                <span class="w-full word-break text-xl color-blue">Seguidores</span>
                                <span class="font-bold text-2xl">
                                    {{ parseInt(store.getUsuario().seguidores).toLocaleString() }}
                                </span>
                            </div>
                        </div>
                        <div class="diamante-actual flex align-items-center decorador gap-2 p-2">
                            <div class="icono">
                                <img src="/assets/img/perfil/iconos/diamantes.png" alt="Diamantes">
                            </div>
                            <div class="informacion flex flex-column font-gamers uppercase text-white text-left line-height-2">
                                <span class="w-full word-break text-xl color-blue">Diamantes en {{ meses[iActual] }}</span>
                                <span class="font-bold text-2xl">
                                    {{ parseInt(store.getUsuario().diamantes_mes_actual).toLocaleString() }}
                                    <span :class="'ml-2 text-2xl ' + porcentaje(store.getUsuario().porcentaje_achieved)">
                                        {{ store.getUsuario().porcentaje_achieved }}
                                        <img :src="subioBajo(store.getUsuario().diamantes_mes_actual, store.getUsuario().diamantes_mes_anterior)"
                                            class="svg" />
                                    </span>
                                </span>
                            </div>
                        </div>
                        <div class="live flex align-items-center decorador gap-2 p-2">
                            <div class="icono">
                                <img src="/assets/img/perfil/iconos/live.png" alt="Live">
                            </div>
                            <div class="informacion flex flex-column font-gamers uppercase text-white text-left line-height-2">
                                <span class="w-full font-bold word-break text-xl color-blue">Duración LIVE en {{ meses[iActual] }}</span>
                                <span class="font-bold text-2xl">{{
                                    formatHoras(store.getUsuario().last_live_duration_mes_actual) }}</span>

                                <span class="text-sm font-bold">En {{ meses[iAnterior] }}: <span class="font-bold color-rojo text-2xl"> {{
                                    formatHoras(store.getUsuario().last_live_duration_mes_anterior) }}</span>
                                    <span :class="'ml-2 text-sm font-bold text-2xl ' + porcentaje(store.getUsuario().porcentaje_achieved_2)">
                                        {{ store.getUsuario().porcentaje_achieved_2 }}
                                        <img :src="mayorTiempo(store.getUsuario().last_live_duration_mes_actual, store.getUsuario().last_live_duration_mes_anterior)" class="svg" />
                                    </span>
                                </span>
                            </div>
                        </div>
                        <div class="dias_habiles_actual flex align-items-center decorador gap-2 p-2">
                            <div class="icono">
                                <img src="/assets/img/perfil/iconos/dias_habiles_actual.png" alt="Días hábiles actual">
                            </div>
                            <div class="informacion flex flex-column font-gamers uppercase text-white text-left line-height-2">
                                <span class="w-full word-break text-xl color-blue">Días hábiles en {{ meses[iActual] }}</span>
                                <span class="font-bold text-2xl">
                                    {{ store.getUsuario().dias_validos_mes_actual }} {{ parseInt(store.getUsuario().dias_validos_mes_actual) == 1 ? 'día' : 'días' }}
                                    <span :class="'ml-2 text-2xl ' + porcentaje(store.getUsuario().porcentaje_achieved_3)">
                                        {{ store.getUsuario().porcentaje_achieved_3 }}
                                        <img :src="subioBajo(store.getUsuario().dias_validos_mes_actual, store.getUsuario().dias_validos_mes_anterior)"
                                            class="svg" />
                                    </span>
                                </span>
                            </div>
                        </div>
                        <div class="incorporacion flex align-items-center decorador gap-2 p-2">
                            <div class="icono">
                                <img src="/assets/img/perfil/iconos/incorporacion.png" alt="Días incorporación">
                            </div>
                            <div class="informacion flex flex-column font-gamers uppercase text-white text-left line-height-2">
                                <span class="w-full word-break text-xl color-blue">Días de incorporación</span>
                                <span class="font-bold text-2xl">
                                    {{ store.getUsuario().dias_since_joining_agency.slice(0,
                                        (store.getUsuario().dias_since_joining_agency.length) - 1) +
                                        (parseInt(store.getUsuario().dias_since_joining_agency.slice(0,
                                            (store.getUsuario().dias_since_joining_agency.length) - 1)) == 1 ? ' día' : ' días')
                                    }}
                                </span>
                            </div>
                        </div>
                    </div>
                    <div class="flex flex-column gap-4">
                        <div class="fans flex align-items-center decorador gap-2 p-2">
                            <div class="icono">
                                <img src="/assets/img/perfil/iconos/fans.png" alt="Fans">
                            </div>
                            <div class="informacion flex flex-column font-gamers uppercase text-white text-left line-height-2">
                                <span class="w-full font-bold word-break text-xl color-blue">Fans nuevos {{ meses[iActual] }}</span>
                                <span class="font-bold text-2xl">{{
                                    parseInt(store.getUsuario().new_fans_mes_actual).toLocaleString() }}</span>
                                <span class="text-sm">En {{ meses[iAnterior] }}: <span :class="'ml-2 font-bold text-2xl ' + (parseInt(store.getUsuario().new_fans_mes_actual) > parseInt(store.getUsuario().new_fans_mes_anterior) ? 'text-shadow-green' : 'text-shadow-red')">{{
                                    parseInt(store.getUsuario().new_fans_mes_anterior).toLocaleString() }}</span>
                                    <img :src="subioBajo(store.getUsuario().new_fans_mes_actual, store.getUsuario().new_fans_mes_anterior)"
                                        class="svg" />
                                </span>
                            </div>
                        </div>
                        <div class="diamante-anterior flex align-items-center decorador gap-2 p-2">
                            <div class="icono">
                                <img src="/assets/img/perfil/iconos/diamantes.png" alt="Diamantes">
                            </div>
                            <div class="informacion flex flex-column font-gamers uppercase text-white text-left line-height-2">
                                <span class="w-full word-break text-xl color-blue">Diamantes en {{ meses[iAnterior] }}</span>
                                <span class="font-bold text-2xl">
                                    {{ parseInt(store.getUsuario().diamantes_mes_anterior).toLocaleString() }}
                                </span>
                            </div>
                        </div>
                        <div class="last_live flex align-items-center decorador gap-2 p-2">
                            <div class="icono">
                                <img src="/assets/img/perfil/iconos/live.png" alt="Last Live">
                            </div>
                            <div class="informacion flex flex-column font-gamers uppercase text-white text-left line-height-2">
                                <span class="w-full word-break text-xl color-blue">Último LIVE</span>
                                <span class="font-bold text-2xl">
                                    {{ store.getUsuario().last_live.slice(0, 19) }}
                                </span>
                            </div>
                        </div>
                        <div class="dias_habiles_anterior flex align-items-center decorador gap-2 p-2">
                            <div class="icono">
                                <img src="/assets/img/perfil/iconos/dias_habiles_anterior.png" alt="Días hábiles anterior">
                            </div>
                            <div class="informacion flex flex-column font-gamers uppercase text-white text-left line-height-2">
                                <span class="w-full word-break text-xl color-blue">Días hábiles en {{ meses[iAnterior] }}</span>
                                <span class="font-bold text-2xl">
                                    {{ store.getUsuario().dias_validos_mes_anterior }} {{ parseInt(store.getUsuario().dias_validos_mes_anterior) == 1 ? 'día' : 'días' }}
                                </span>
                            </div>
                        </div>
                        <div class="fecha_incorporacion flex align-items-center decorador gap-2 p-2">
                            <div class="icono">
                                <img src="/assets/img/perfil/iconos/fecha_incorporacion.png" alt="Fecha incorporación">
                            </div>
                            <div class="informacion flex flex-column font-gamers uppercase text-white text-left line-height-2">
                                <span class="w-full word-break text-xl color-blue">Fecha de incorporación</span>
                                <span class="font-bold text-2xl">
                                    {{ store.getUsuario().joined_time.slice(0, 10) }}
                                </span>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
        <dialogEditarPerfil :mostrarEditar="mostrarEditar" @dialogEditarOculto="mostrarEditar = false"
            @perfilActualizado="getNewDatos" />
    </Panel>
</template>

<script>
import axios from 'axios';
import { useStoreEvento } from '../store'
import dialogEditarPerfil from './EditarPerfil.vue';
export default {
    name: 'PerfilUsuario',
    components: {
        dialogEditarPerfil,
    },
    data: () => ({
        store: null,
        API: import.meta.env.VITE_APP_API,
        mostrarEditar: false,
        isTop: false,
        infoTop: {
            top: null,
            tipo: 'Cobre'
        },
        cinta: 'cobre',
        fechaAct: null,
        meses: ['Enero', 'Febrero', 'Marzo', 'Abril', 'Mayo', 'Junio', 'Julio', 'Agosto', 'Septiembre', 'Octubre', 'Noviembre', 'Diciembre'],
        iActual: 0,
        iAnterior: 11
    }),
    methods: {
        async getTop() {
            axios.get(`${this.API}/usuario/top`).then(response => {
                response.data.forEach((top, index) => {
                    const i = top.usuarios.findIndex(usuario => usuario._id == this.store.getId());
                    if (i != -1) {
                        top.usuarios.sort((us1, us2) => us2.diamantes_mes_actual - us1.diamantes_mes_actual);
                        //Top 1 - Oro

                        if (top.usuarios[0]._id == this.store.getId()) {
                            this.infoTop.tipo = 'Oro';
                            this.infoTop.top = '1';
                            this.cinta = 'oro';
                        } else if (top.usuarios[1]._id == this.store.getId()) {
                            //Top 2 - Platino
                            this.infoTop.tipo = 'Platino';
                            this.infoTop.top = '2';
                            this.cinta = 'platino';
                        } else {
                            //Top 3 - Cobre
                            this.infoTop.tipo = 'Cobre';
                            this.infoTop.top = '3';
                            this.cinta = 'cobre';
                        }
                        this.isTop = true;
                        return;
                    }
                });

            });
        },
        porcentaje(porc) {
            const c = porc.slice(0, porc.length - 1);
            const nFloat = parseFloat(c);
            return nFloat > 100 ? 'text-shadow-green' : 'text-shadow-red';
        },
        formatHoras(tiempo) {
            const regex = /(\d+)h(\d+)m(\d+)s/;

            const format = tiempo.replace(regex, (match, horas, minutos, segundos) => {
                horas = horas === '0' ? '' : horas + 'h';
                minutos = minutos === '0' ? '' : minutos + 'min';
                segundos = segundos === '0' ? '' : segundos + 's';

                return `${horas} ${minutos} ${segundos}`;
            });

            return format;
        },
        getSegundos(tiempo) {
            const regex = /(\d+)h(\d+)m(\d+)s/;
            const segundos = tiempo.replace(regex, (match, horas, minutos, segundos) => {
                return `${(parseInt(horas) * 60 * 60) + (parseInt(minutos) * 60) + (parseInt(segundos))}`;
            });
            return segundos;
        },
        mayorTiempo(actual, anterior) {
            console.log(actual, anterior);

            return this.subioBajo(this.getSegundos(actual), this.getSegundos(anterior));
        },
        subioBajo(actual, anterior) {
            return parseInt(actual) > parseInt(anterior) ? '/assets/img/perfil/arriba.png' : '/assets/img/perfil/abajo.png';
        },
        async getNewDatos() {
            await axios.get(`${this.API}/usuario/${this.store.getId()}`, {
                headers: {
                    Authorization: `Bearer ${this.store.getToken()}`,
                }
            }).then(response => {
                this.store.newDatos(response.data);
            });
        },
    },
    created() {
        this.store = useStoreEvento();
        const f = new Date(this.store.getUsuario().fecha_actualizacion);
        this.fechaAct = `${(f.getDate() < 10 ? '0' : '') + f.getDate()} ${this.meses[f.getMonth()]} ${this.store.getUsuario().fecha_actualizacion.slice(11, 16)}`;

        this.iActual = new Date().getMonth();
        this.iAnterior = this.iActual == 0 ? 11 : (this.iActual - 1);
        this.getTop();
    }
}
</script>
<style>
.perfil>.p-panel-header,
.perfil>.p-toggleable-content>.p-panel-content {
    background: transparent !important;
    border: none !important;
}

@media (min-width:1280px) {
    .container-perfil {
        flex-wrap: nowrap !important;
    }
}

@media (max-width:1279px) {
    .editar-perfil {
        padding: 0 !important;
        padding-top: 14px !important;
        background-size: cover !important;
    }
}

.imagen-usuario {
    background-image: url('/assets/img/perfil/marco_usuario.png');
    background-repeat: no-repeat;
    background-size: cover;
    width: 300px;
    height: 300px;
    display: flex;
    justify-content: center;
    align-items: center;
}

.imagen-usuario>img,
.imagen-usuario>.icon-usuario {
    border-radius: 50%;
    margin: 3px 0 0 20px;
    width: 241px;
    height: 240px;
}

.marco-nombre-usuario {
    background-image: url('/assets/img/perfil/marco_usuario_nombre.png');
    background-repeat: no-repeat;
    background-size: contain;
    height: 70px;
}
</style>

<style scoped>
.editar-perfil {
    background-image: url('/assets/img/perfil/editar.png') !important;
    background-repeat: no-repeat;
    background-size: contain;
    height: 82px;
    text-align: center;
    width: 60%;
    padding: 9px 50px 10px 35px;
    cursor: pointer;
}

.decorador {
    background-image: url('/assets/img/perfil/decorador.png') !important;
    background-repeat: no-repeat;
    background-size: 100% 100%;
    text-align: center;
    padding-bottom: 20px !important;
}

.icono>img {
    width: 60px !important;
    height: 60px !important;
}

.cinta {
    height: 100px !important;
}

.info-grupo {
    transform: translateY(-80px);
}

.svg {
    width: 18px !important;
    height: 18px !important;
}

.bajo {
    color: red !important;
}
</style>

<style>
@media screen and (min-width:576px) and (max-width: 768px) {

    .clasificacion,
    .top {
        height: 270px !important;
    }
}

@media screen and (min-width: 768px) {

    .clasificacion,
    .top {
        height: 270px !important;
    }
}

@media screen and (max-width: 575px) {

    .clasificacion,
    .top {
        height: 270px !important;
    }
}
</style>